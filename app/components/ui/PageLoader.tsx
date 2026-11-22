"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "../../data/site";
import { BAKED_PORTRAIT_SIZES, WIDE_QUERY, bakedPortraitSet, bakedScene, supportsAvif } from "../../lib/decor";
import { isLite } from "../../lib/perf";
import type { StageId } from "../../types";
import Emblem from "./Emblem";

/** Durée minimale (l'emblème a le temps de se tracer) et maximale (on ne bloque jamais la page) */
const MIN_MS = 450;
const MAX_MS = 9000;

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/** Une image à précharger ; avec `srcset`, le navigateur choisit la même taille que celle que la page affichera */
interface Source {
  src: string;
  srcset?: string;
  sizes?: string;
}

/** Télécharge et décode une image : affichée ensuite, elle sort du cache sans attente */
function preload({ src, srcset, sizes }: Source): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    if (srcset && sizes) {
      img.sizes = sizes;
      img.srcset = srcset;
    }
    img.src = src;
    const done = () => resolve();
    if (typeof img.decode === "function") img.decode().then(done, done);
    else {
      img.onload = done;
      img.onerror = done;
    }
  });
}

/**
 * Prépare une fois chaque section et chaque scène cachées (styles, mise en page, polices) :
 * elles sont rendues un instant, quasi transparentes, sous l'écran de chargement, puis remises en l'état.
 * Leur première apparition n'a plus rien à calculer.
 */
async function warmUp() {
  // Par une classe (globals.css) et non en touchant aux styles des éléments : le voyage (arrivée par une ancre…)
  // peut les modifier pendant ce temps, et rien ne doit être écrasé en les « restaurant »
  const root = document.documentElement;
  if (!document.querySelector("[data-section-index], [data-scene]")) return;
  root.classList.add("warming");
  await frame();
  await frame();
  root.classList.remove("warming");
}

/**
 * Écran de chargement : le monde redevient gris le temps de tout préparer, l'emblème se trace et tourne,
 * puis tout s'efface et la page apparaît avec ses couleurs, prête.
 * Il attend réellement la page : polices, images (portrait, vignettes), décors pré-rendus (écrans tactiles),
 * et une première mise en page de chaque section. Ensuite, les autres pages sont préchargées en arrière-plan.
 * Rendu par app/template.tsx (recréé à chaque navigation : une page déjà en cache passe en un battement).
 * Sans JavaScript, une animation CSS de secours l'efface de toute façon (globals.css).
 */
export default function PageLoader() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();
    // Images des autres sections et décors des autres ambiances : chargés en arrière-plan une fois la page affichée
    const later: Source[] = [];
    const sectionImages: Source[] = [];

    const run = async () => {
      // Images à attendre : seulement celles de l'écran d'arrivée. Celles des autres sections de l'accueil (vignettes
      // des projets, portrait…) se chargent juste après, en arrière-plan : sur un téléphone lent, les attendre toutes
      // gardait l'écran de chargement plusieurs secondes de plus (PageSpeed : affichage principal à 5 s).
      const urls = new Set<string>();
      const scenes: Source[] = [];
      document.querySelectorAll("img").forEach((img) => {
        if (img.closest(".scene-baked")) return;
        const section = img.closest<HTMLElement>("[data-section-index]");
        if (img.loading === "lazy" && !section) return;
        const src = img.currentSrc || img.getAttribute("src");
        if (!src) return;
        if (section && getComputedStyle(section).contentVisibility === "hidden") {
          sectionImages.push({ src, srcset: img.srcset || undefined, sizes: img.sizes || undefined });
          return;
        }
        urls.add(src);
      });
      // Décors pré-rendus, au cadrage et au format que l'écran affichera. On n'attend que la scène visible
      // et ses voisines (déjà dessinées d'avance) : les autres arrivent en arrière-plan, bien avant qu'on y voyage.
      if (isLite()) {
        const format = window.matchMedia(WIDE_QUERY).matches ? "wide" : "portrait";
        const ext = (await supportsAvif()) ? "avif" : "webp";
        document.querySelectorAll<HTMLElement>("[data-scene]").forEach((s) => {
          const id = s.dataset.scene as StageId;
          // Cadrage portrait : la même largeur que celle choisie par la page (srcset), pas l'image pleine taille
          const img: Source =
            format === "portrait"
              ? { src: bakedScene(id, format, ext), srcset: bakedPortraitSet(id, ext), sizes: BAKED_PORTRAIT_SIZES }
              : { src: bakedScene(id, format, ext) };
          if (s.style.visibility === "hidden") later.push(img);
          else scenes.push(img);
        });
      }

      const total = urls.size + scenes.length + 2;
      let count = 0;
      const tick = () => {
        count += 1;
        if (!cancelled) setProgress(Math.min(1, count / total));
      };

      await warmUp();
      tick();
      await Promise.all([
        ...Array.from(urls, (u) => preload({ src: u }).then(tick)),
        ...scenes.map((img) => preload(img).then(tick)),
        (document.fonts?.ready ?? Promise.resolve()).then(tick),
      ]);
    };

    const finish = () => {
      if (cancelled) return;
      setProgress(1);
      setDone(true);
      // Les autres pages (études de cas, crédits…) se préchargent pendant qu'on lit
      const prefetch = () =>
        new Set(
          Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]'), (a) => a.getAttribute("href")!.split("#")[0]),
        ).forEach(
          // Pages seulement (pas les fichiers : CV en PDF…)
          (href) => href && href !== window.location.pathname && !/\.[a-z0-9]+$/i.test(href) && router.prefetch(href),
        );
      // Puis, l'un après l'autre (sans concurrencer ce qui s'affiche), les images des autres sections et les décors des autres ambiances
      const rest = async () => {
        for (const url of [...sectionImages, ...later]) {
          if (cancelled) return;
          await preload(url);
        }
      };
      const idle = (fn: () => void, ms: number) =>
        "requestIdleCallback" in window ? window.requestIdleCallback(fn, { timeout: ms }) : setTimeout(fn, ms / 2);
      idle(prefetch, 3000);
      idle(() => void rest(), 1500);
    };

    const timeout = new Promise<void>((r) => setTimeout(r, MAX_MS));
    Promise.race([run(), timeout]).then(() => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      setTimeout(finish, wait);
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const percent = Math.round(progress * 100);

  return (
    <div
      role="status"
      aria-label="Chargement"
      aria-busy={!done}
      className={`page-loader pointer-events-none fixed inset-0 z-[60] grid place-items-center ${done ? "is-done" : ""}`}
      style={{ background: "linear-gradient(180deg, #eeedeb 0%, #d3d1ce 100%)", color: "#2f2e2d" }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative grid h-56 w-56 place-items-center sm:h-64 sm:w-64" style={{ ["--emblem-bg" as string]: "#e6e4e1" }}>
          <Emblem className="absolute inset-0 h-full w-full" />
          <span className="title-spaced pl-[0.32em] text-sm sm:text-base">{site.logo}</span>
        </div>
        {/* Avancement : un trait fin qui se remplit, et le pourcentage */}
        <div aria-hidden className="flex items-center gap-3">
          <span className="relative h-px w-28 bg-[#2f2e2d]/20">
            <span
              className="absolute inset-y-0 left-0 bg-[#2f2e2d] transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </span>
          <span className="label-spaced w-10 text-right tabular-nums text-[11px]">{percent}%</span>
        </div>
      </div>
    </div>
  );
}
