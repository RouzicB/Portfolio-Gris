import Link from "next/link";
import PageScene from "./components/layouts/PageScene";
import { ArrowRightIcon, ProjetsIcon } from "./components/icons/GrisIcons";
import Emblem from "./components/ui/Emblem";

/**
 * 404 — comme l'ouverture de l'accueil : le monde encore gris, l'emblème qui se trace,
 * mais au centre des anneaux, « 404 » à la place du nom. Deux chemins pour reprendre le voyage.
 */
export default function NotFound() {
  return (
    <PageScene stage="gris" back={{ href: "/", label: "Accueil" }}>
      <main className="relative grid min-h-svh place-items-center px-4 py-24 text-center">
        <div className="flex flex-col items-center">
          <div
            className="relative grid size-[min(18rem,72vw,42svh)] place-items-center sm:size-[min(24rem,46svh)]"
            style={{ ["--emblem-bg" as string]: "var(--sky-top)" }}
          >
            <Emblem className="absolute inset-0 h-full w-full text-ink" />
            <p className="title-spaced relative pl-[0.32em] text-3xl leading-none text-ink sm:text-5xl">404</p>
          </div>

          <p className="label-spaced legible mt-8 flex items-center gap-3 text-ink">
            <span aria-hidden className="h-px w-8 bg-ink/30" />
            <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
            Erreur 404
            <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
            <span aria-hidden className="h-px w-8 bg-ink/30" />
          </p>
          <h1 className="title-spaced legible mt-4 pl-[0.32em] text-2xl text-ink sm:text-4xl">Page égarée</h1>
          <p className="legible mt-4 max-w-md text-balance text-lg text-ink">
            Ce chemin ne mène nulle part : le monde ici est resté gris. Le voyage principal, lui, vous attend.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-sky-top transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Reprendre l&apos;aventure
              <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/#section-projets" className="veil inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-ink transition hover:border-accent">
              <ProjetsIcon size={16} />
              Voir les projets
            </Link>
          </div>
        </div>
      </main>
    </PageScene>
  );
}
