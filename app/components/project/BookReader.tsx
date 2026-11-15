"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type TouchEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Book } from "../../types";
import { pad } from "../../lib/journey";
import { ChevronIcon, DownloadIcon } from "../icons/GrisIcons";
import { WASH } from "../journey/motion";

const noSubscribe = () => () => {};

/** La page entre par le côté vers lequel on avance, et sort par l'autre */
const turn = {
  enter: (d: number) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -40 }),
};

/**
 * Liseuse : un document (charte, rapport…) feuilleté page par page sans quitter le site.
 * Chapitres en losanges pour sauter d'une partie à l'autre, page dans un cadre en feuille de verre,
 * flèches, clavier (← → Début Fin), glissé au doigt, bande de miniatures et plein écran.
 * Chaque page porte son texte (repris du document) pour les lecteurs d'écran.
 */
export default function BookReader({ book }: { book: Book }) {
  const total = book.pages.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  // Plein écran disponible ? (lu côté client seulement : rien à afficher au rendu serveur)
  const canFull = useSyncExternalStore(noSubscribe, () => Boolean(document.fullscreenEnabled), () => false);
  const [full, setFull] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLOListElement>(null);
  const touchX = useRef<number | null>(null);
  const page = book.pages[index];
  // Les mots changent selon ce qu'on feuillette : les pages d'un document, les écrans d'une interface ou les slides d'une présentation
  const words =
    book.unit === "écran"
      ? { unit: "Écran", prev: "Écran précédent", next: "Écran suivant", read: "Lire la description de l'écran", all: "Tous les écrans" }
      : book.unit === "slide"
        ? { unit: "Slide", prev: "Slide précédente", next: "Slide suivante", read: "Lire le texte de la slide", all: "Toutes les slides" }
        : book.unit === "double-page"
          ? { unit: "Double page", prev: "Double page précédente", next: "Double page suivante", read: "Lire le texte de la double page", all: "Toutes les doubles pages" }
          : book.unit === "détail"
            ? { unit: "Détail", prev: "Détail précédent", next: "Détail suivant", read: "Lire le texte du détail", all: "Tous les détails" }
            : { unit: "Page", prev: "Page précédente", next: "Page suivante", read: "Lire le texte de la page", all: "Toutes les pages" };

  // Chapitre en cours : le dernier qui commence avant la page affichée (aucun pour la couverture et le sommaire)
  const chapter = book.chapters.reduce((cur, c, k) => (c.page <= index + 1 ? k : cur), -1);

  const go = (n: number) => {
    const next = Math.max(0, Math.min(total - 1, n));
    if (next === index) return;
    setDir(next > index ? 1 : -1);
    setIndex(next);
  };

  // La miniature active reste visible dans la bande, sans faire défiler la page elle-même
  useEffect(() => {
    const s = strip.current;
    const el = s?.children[index] as HTMLElement | undefined;
    if (!s || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.scrollTo?.({ left: el.offsetLeft - s.clientWidth / 2 + el.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
  }, [index]);

  // Les pages voisines se chargent à l'avance : tourner la page est immédiat
  useEffect(() => {
    [index - 1, index + 1, index + 2].forEach((n) => {
      const p = book.pages[n];
      if (p) new Image().src = p.src;
    });
  }, [index, book.pages]);

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === stage.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stage.current?.requestFullscreen();
  };

  const onKey = (e: KeyboardEvent) => {
    const next = e.key === "ArrowRight" ? index + 1 : e.key === "ArrowLeft" ? index - 1 : e.key === "Home" ? 0 : e.key === "End" ? total - 1 : null;
    if (next === null) return;
    e.preventDefault();
    go(next);
  };
  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div>
      {/* Chapitres du document */}
      {book.chapters.length > 0 && (
      <nav aria-label={`Chapitres : ${book.title}`} className="flex justify-center">
        <ol className="veil inline-flex flex-wrap justify-center gap-1 rounded-[1.5rem] p-1.5">
          {book.chapters.map((c, k) => (
            <li key={c.title}>
              <button
                type="button"
                onClick={() => go(c.page - 1)}
                aria-current={chapter === k ? "true" : undefined}
                className={`label-spaced inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition duration-300 ${chapter === k ? "bg-ink text-sky-top" : "text-ink hover:bg-ink/10"}`}
              >
                <span aria-hidden className={`size-1.5 rotate-45 transition duration-300 ${chapter === k ? "bg-sky-top" : "bg-accent"}`} />
                {c.title}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      )}

      {/* La page, dans un cadre en feuille de verre */}
      <div
        ref={stage}
        role="region"
        aria-roledescription="liseuse"
        aria-label={book.title}
        tabIndex={0}
        onKeyDown={onKey}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="veil relative mt-6 rounded-[2.25rem_0.75rem_2.25rem_0.75rem] p-1.5 sm:p-2 [&:fullscreen]:grid [&:fullscreen]:place-items-center [&:fullscreen]:rounded-none [&:fullscreen]:bg-sky-bottom [&:fullscreen]:p-6"
      >
        {/* Clé de voûte */}
        <span aria-hidden className="absolute -top-[5px] left-1/2 z-10 size-2.5 -translate-x-1/2 rotate-45 bg-accent" />
        <div className="relative aspect-video w-full overflow-hidden rounded-[1.9rem_0.5rem_1.9rem_0.5rem] bg-ink/5 [:fullscreen_&]:w-[min(100%,calc((100svh-3rem)*16/9))]">
          <AnimatePresence initial={false} custom={dir}>
            <motion.img
              key={page.src}
              src={page.src}
              alt={`${words.unit} ${index + 1} : ${page.title}`}
              custom={dir}
              variants={turn}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: WASH }}
              draggable={false}
              className="absolute inset-0 size-full select-none object-contain"
            />
          </AnimatePresence>

          {/* Page précédente / suivante */}
          {[
            { d: -1, label: words.prev, side: "left-2 sm:left-3", rot: "rotate-180", off: index === 0 },
            { d: 1, label: words.next, side: "right-2 sm:right-3", rot: "", off: index === total - 1 },
          ].map((b) => (
            <button
              key={b.d}
              type="button"
              onClick={() => go(index + b.d)}
              disabled={b.off}
              aria-label={b.label}
              className={`veil absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-ink shadow-lg shadow-ink/10 transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0 sm:size-12 ${b.side}`}
            >
              <ChevronIcon size={18} className={b.rot} />
            </button>
          ))}

          {/* En plein écran, la légende n'est plus visible : repère et bouton pour sortir, posés sur l'image */}
          {full && (
            <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-3 sm:inset-x-4 sm:top-4">
              <p className="veil rounded-full px-4 py-2 font-display text-sm tabular-nums tracking-[0.12em] text-ink">
                <span className="text-[color-mix(in_srgb,var(--accent)_70%,var(--ink))]">{pad(index + 1)}</span> / {pad(total)}
              </p>
              <button
                type="button"
                onClick={toggleFull}
                className="veil inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-ink shadow-lg shadow-ink/10 transition hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
                Quitter le plein écran
                <kbd className="hidden rounded border border-ink/25 px-1.5 text-[0.65rem] sm:inline">Échap</kbd>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Légende : repère, titre de la page, actions et texte, sur une plaque de verre */}
      <div className="veil mt-4 rounded-[0.75rem_1.75rem_0.75rem_1.75rem] px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="flex items-baseline gap-3 text-ink">
          <span className="font-display text-sm tabular-nums tracking-[0.12em]">
            <span className="text-[color-mix(in_srgb,var(--accent)_70%,var(--ink))]">{pad(index + 1)}</span>
            <span className="text-ink"> / {pad(total)}</span>
          </span>
          <span aria-hidden className="size-1.5 -translate-y-0.5 rotate-45 bg-accent" />
          <span className="title-spaced text-sm sm:text-base">{page.title}</span>
        </p>
        <div className="flex items-center gap-2">
          {canFull && (
            <button
              type="button"
              onClick={toggleFull}
              className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-sm text-ink transition hover:bg-ink/10"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                <path d={full ? "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" : "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"} />
              </svg>
              {full ? "Quitter le plein écran" : "Plein écran"}
            </button>
          )}
          {book.pdf && (
            <a
              href={book.pdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-sm text-ink transition hover:bg-ink/10"
            >
              <DownloadIcon size={16} />
              PDF
              <span className="sr-only">(document complet, nouvel onglet)</span>
            </a>
          )}
        </div>
      </div>
      {page.text && (
        <details className="group mt-3 border-t border-ink/15 pt-3 text-sm text-ink">
          <summary className="label-spaced inline-flex cursor-pointer list-none items-center gap-2 text-ink transition hover:opacity-80 [&::-webkit-details-marker]:hidden">
            <ChevronIcon size={14} className="transition group-open:rotate-90" />
            {words.read}
          </summary>
          <p className="mt-2 max-w-3xl text-pretty leading-relaxed">{page.text}</p>
        </details>
      )}
      </div>
      <p className="sr-only" aria-live="polite">
        {words.unit} {index + 1} sur {total} : {page.title}
      </p>

      {/* Bande de miniatures */}
      <ol ref={strip} aria-label={words.all} className="scrollbar-gris relative mt-5 flex gap-2.5 overflow-x-auto px-1 pb-3 pt-1">
        {book.pages.map((p, k) => (
          <li key={p.src} className="shrink-0">
            <button
              type="button"
              onClick={() => go(k)}
              aria-label={`${words.unit} ${k + 1} : ${p.title}`}
              aria-current={k === index ? "page" : undefined}
              className={`relative block aspect-video w-24 overflow-hidden rounded-md transition sm:w-28 ${
                k === index ? "ring-2 ring-accent ring-offset-2 ring-offset-transparent" : "opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- miniatures déjà exportées en WebP */}
              <img src={p.mini} alt="" loading="lazy" decoding="async" width={320} height={180} className="size-full object-cover" />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
