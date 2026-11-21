"use client";

import { useEffect, useRef } from "react";
import { ambient } from "../../lib/ambient";

const CHOICE_KEY = "portfolio-sound-choice";

/** Casque : l'invitation à écouter */
const HeadphonesIcon = () => (
  <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden focusable="false">
    <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
    <rect x="3.5" y="14" width="4" height="6.5" rx="1.6" fill="currentColor" stroke="none" />
    <rect x="16.5" y="14" width="4" height="6.5" rx="1.6" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Première visite : une fenêtre propose d'activer la bande originale avant d'entrer dans le voyage.
 * On n'impose jamais le son : « sans son » est un choix aussi visible que l'autre, et Échap revient à le choisir.
 * Le choix est retenu dans ce navigateur ; le lecteur en bas de l'écran permet d'en changer à tout moment.
 * Fenêtre native (<dialog>) : le focus y reste enfermé et le reste de la page devient inerte tant qu'elle est ouverte.
 */
export default function SoundPrompt() {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let seen = true;
    try {
      seen = window.localStorage.getItem(CHOICE_KEY) !== null;
    } catch {}
    if (seen) return;
    const id = window.setTimeout(() => dialog.current?.showModal(), 700);
    return () => window.clearTimeout(id);
  }, []);

  const choose = (sound: boolean) => {
    try {
      window.localStorage.setItem(CHOICE_KEY, sound ? "on" : "off");
    } catch {}
    if (sound) void ambient().play();
    dialog.current?.close();
  };

  return (
    <dialog
      ref={dialog}
      data-palette-live
      aria-labelledby="son-titre"
      aria-describedby="son-texte"
      // Échap : on ferme sans son, et on s'en souvient
      onCancel={() => choose(false)}
      className="sound-prompt veil panel m-auto w-[min(26rem,calc(100vw-2rem))] rounded-3xl px-7 pb-7 pt-9 text-center text-ink"
    >
      <span className="mx-auto grid size-14 place-items-center rounded-full border border-ink/20 text-ink">
        <HeadphonesIcon />
      </span>
      <h2 id="son-titre" className="title-spaced mt-5 text-xl leading-snug text-ink">
        Avec le son ?
      </h2>
      <p id="son-texte" className="mt-3 text-pretty leading-relaxed text-ink">
        Ce portfolio a sa propre musique, composée pour le voyage : un morceau par zone, calme et discret. Elle rend l’expérience plus
        immersive, au casque surtout.
      </p>
      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          autoFocus
          onClick={() => choose(true)}
          className="stone inline-flex h-12 items-center justify-center rounded-full px-6 font-medium transition [text-shadow:none] hover:-translate-y-0.5"
        >
          Activer le son
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          className="inline-flex h-12 items-center justify-center rounded-full border border-ink/25 px-6 font-medium text-ink transition hover:bg-ink/10"
        >
          Continuer sans son
        </button>
      </div>
      <p className="mt-4 text-sm text-ink-soft">Le lecteur, en bas de l’écran, permet de changer d’avis à tout moment.</p>
    </dialog>
  );
}
