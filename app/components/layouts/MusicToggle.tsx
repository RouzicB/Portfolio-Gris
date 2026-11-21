"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { TRACKS, TRACK_LENGTH, ambient } from "../../lib/ambient";
import { bakedScene } from "../../lib/decor";

const SERVER_SNAP = { playing: false, index: 0, version: 0, volume: 0.8, muted: false };
const VOLUME_KEY = "portfolio-volume";
const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Icônes du lecteur, pleines (lisibles en petit) */
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden focusable="false">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden focusable="false">
    <rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
    <rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
  </svg>
);
const SkipIcon = ({ back = false }: { back?: boolean }) => (
  <svg viewBox="0 0 24 24" className={`size-4 ${back ? "-scale-x-100" : ""}`} aria-hidden focusable="false">
    <path d="M5 6.2v11.6a.9.9 0 0 0 1.4.75l8.4-5.8a.9.9 0 0 0 0-1.5L6.4 5.45A.9.9 0 0 0 5 6.2Z" fill="currentColor" />
    <rect x="16.5" y="5.5" width="2.6" height="13" rx="1.1" fill="currentColor" />
  </svg>
);
/** Note de musique : la pastille du lecteur replié (téléphone) */
const NoteIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
    <path d="M9 17.5V5.5l10-2v12" />
    <ellipse cx="6.5" cy="17.5" rx="2.5" ry="2" fill="currentColor" stroke="none" />
    <ellipse cx="16.5" cy="15.5" rx="2.5" ry="2" fill="currentColor" stroke="none" />
  </svg>
);
/** Haut-parleur : ondes selon le volume, croix quand le son est coupé */
const SpeakerIcon = ({ level }: { level: number }) => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z" fill="currentColor" stroke="none" />
    {level === 0 ? (
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    ) : (
      <>
        <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" />
        {level > 0.5 && <path d="M18 7a7 7 0 0 1 0 10" />}
      </>
    )}
  </svg>
);

/**
 * Lecteur de la musique d'ambiance : une petite barre toujours visible, sur toutes les pages
 * (la musique continue d'une page à l'autre). Coupée par défaut : on n'impose jamais le son.
 * Pochette (le décor de la zone, avec un égaliseur qui ondule pendant la lecture), titre et tonalité,
 * morceau précédent / lecture / suivant, barre de progression avec ses temps (avancer, reculer), volume (coupure, curseur).
 * Ordinateur : en bas à droite, en tiroir. Téléphone : une pastille en haut à droite (la pochette) qui ouvre le lecteur
 * par-dessus la page ; le curseur de volume y laisse la place aux boutons du téléphone.
 */
export default function MusicToggle() {
  const engine = ambient();
  const { playing, index, volume, muted } = useSyncExternalStore(engine.subscribe, engine.getSnapshot, () => SERVER_SNAP);
  const track = TRACKS[index];
  const [pos, setPos] = useState(0);
  const [dragging, setDragging] = useState<number | null>(null);
  const pointer = useRef(false);

  // Tiroir : déplié à l'arrivée (on découvre le lecteur), puis replié en languette quand on ne s'en sert pas.
  // Souris : le survol le déplie, il se replie peu après la sortie. Clavier : le focus le déplie.
  // Toucher : un appui sur la languette le déplie, il se replie après quelques secondes sans geste ou un appui ailleurs.
  const [open, setOpen] = useState(false);
  const dock = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const hideSoon = (ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const el = dock.current;
      const keyboard = el?.querySelector(":focus-visible");
      if (hovered.current || pointer.current || keyboard) return;
      setOpen(false);
    }, ms);
  };
  const show = (autoHide?: number) => {
    window.clearTimeout(timer.current);
    setOpen(true);
    if (autoHide) hideSoon(autoHide);
  };
  useEffect(() => {
    // Ordinateur : déplié quelques secondes à l'arrivée. Téléphone : reste replié en pastille, on l'ouvre d'un toucher
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const first = window.setTimeout(() => setOpen(true), 0);
    timer.current = window.setTimeout(() => !hovered.current && setOpen(false), 4000);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && !dock.current?.contains(e.target as Node)) {
        window.clearTimeout(timer.current);
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  // Volume retenu d'une visite à l'autre (préférence de ce navigateur seulement)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VOLUME_KEY);
      if (saved !== null) ambient().setVolume(Number(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(VOLUME_KEY, String(muted ? 0 : volume));
    } catch {}
  }, [volume, muted]);

  // Position lue quatre fois par seconde pendant la lecture
  useEffect(() => {
    const read = () => setPos(ambient().position);
    const first = window.setTimeout(read, 0);
    if (!playing) return () => window.clearTimeout(first);
    const id = window.setInterval(read, 250);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(first);
    };
  }, [index, playing]);

  const shown = dragging ?? pos;
  // Glissé à la souris ou au doigt : la position suit le curseur, la musique saute au relâchement.
  // Clavier (flèches, Début, Fin) : chaque pas saute tout de suite.
  const change = (value: number) => {
    if (pointer.current) return setDragging(value);
    ambient().seek(value);
    setPos(value);
  };
  const commit = () => {
    pointer.current = false;
    if (dragging !== null) {
      ambient().seek(dragging);
      setPos(dragging);
    }
    setDragging(null);
    if (!hovered.current) hideSoon(1500);
  };

  const level = muted ? 0 : volume;
  const control = "grid size-9 shrink-0 place-items-center rounded-full text-ink transition hover:bg-ink/10";

  return (
    <div
      ref={dock}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        hovered.current = true;
        show();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        hovered.current = false;
        hideSoon(600);
      }}
      onPointerDown={(e) => {
        // Toucher : un geste dans le lecteur déjà ouvert repousse sa fermeture. Replié, c'est le clic sur la pastille
        // ou la languette qui l'ouvre (au relâchement) : ouvrir dès l'appui ferait apparaître les boutons sous le doigt,
        // et le toucher finirait sur l'un d'eux (morceau suivant)
        if (e.pointerType !== "mouse" && open) show(5000);
      }}
      onFocus={(e) => {
        // Clavier seulement : un clic donne aussi le focus, le survol s'en charge déjà
        if (e.target.matches(":focus-visible")) show();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hideSoon(400);
      }}
      className={`music-dock pointer-events-none fixed right-2 top-2 z-40 w-[min(23rem,calc(100vw-1rem))] sm:right-4 sm:top-4 md:bottom-0 md:right-4 md:top-auto md:w-[24.5rem] md:px-1.5 md:pb-4 md:pt-3 md:[--dock-pb:1rem] ${
        open ? "is-open" : ""
      } ${playing ? "is-on" : ""}`}
    >
      {/* Téléphone : replié, le lecteur est une pastille en haut à droite (une note, un égaliseur pendant la lecture) ; un toucher l'ouvre */}
      <button
        type="button"
        onClick={() => show(6000)}
        aria-label={`Ouvrir le lecteur de musique (${track.title}${playing ? ", en lecture" : ""})`}
        aria-expanded={open}
        data-palette-live
        className="music-mini veil pointer-events-auto absolute right-2 top-2 grid size-10 place-items-center rounded-full text-ink md:hidden"
      >
        {playing ? (
          // En lecture : un égaliseur qui ondule
          <span aria-hidden className="flex h-4 items-end gap-[3px]">
            {[0.5, 0.9, 0.65, 0.8].map((h, i) => (
              <span key={i} className="music-bar block w-[2px] rounded-full bg-current" style={{ "--h": h, animationDelay: `${-i * 0.27}s` } as CSSProperties} />
            ))}
          </span>
        ) : (
          <NoteIcon />
        )}
      </button>
    <section
      data-palette-live
      aria-label="Lecteur de musique d'ambiance"
      className={`music-player veil panel pointer-events-auto rounded-[1rem_0.4rem_1rem_0.4rem] px-5 pb-4 pt-5 text-ink ${playing ? "is-on" : ""}`}
    >
      {/* Languette du tiroir replié : le haut du lecteur, vide, qu’on survole ou touche pour le déplier */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={() => show(5000)}
        className="music-lip absolute inset-x-0 top-0 z-10"
      />

      <div className="music-body">
      <div className="flex items-center gap-3">
        {/* Pochette : le décor de la zone ; l'égaliseur y ondule pendant la lecture */}
        <span className="music-cover relative size-12 shrink-0 overflow-hidden rounded-[0.6rem_0.25rem_0.6rem_0.25rem] bg-wash-far">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bakedScene(track.stage, "portrait")} alt="" loading="lazy" className="size-full object-cover object-[50%_70%]" />
          <span aria-hidden className="music-eq absolute inset-x-0 bottom-0 flex h-4 items-end justify-center gap-[2px] pb-1 text-white">
            {[0.5, 0.9, 0.65, 1].map((h, i) => (
              <span key={i} className="music-bar block w-[2px] rounded-full bg-current" style={{ "--h": h, animationDelay: `${-i * 0.27}s` } as CSSProperties} />
            ))}
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base leading-tight text-ink" aria-live="polite">
            {track.title}
          </p>
          <p className="label-spaced mt-1 truncate text-[0.58rem] text-ink-soft">
            {index + 1}/{TRACKS.length} · {track.sub}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={() => ambient().previous()} aria-label="Morceau précédent" className={control}>
            <SkipIcon back />
          </button>
          <button
            type="button"
            onClick={() => ambient().toggle()}
            aria-label={playing ? "Pause" : "Lancer la musique"}
            className="stone grid size-10 shrink-0 place-items-center rounded-full transition hover:scale-105"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" onClick={() => ambient().next()} aria-label="Morceau suivant" className={control}>
            <SkipIcon />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2.5 text-[0.66rem] tabular-nums text-ink-soft">
        <span className="w-7">{time(shown)}</span>
        <input
          type="range"
          min={0}
          max={TRACK_LENGTH}
          step={5}
          value={Math.round(shown)}
          onChange={(e) => change(Number(e.target.value))}
          onPointerDown={() => (pointer.current = true)}
          onPointerUp={commit}
          onPointerCancel={commit}
          aria-label="Position dans le morceau"
          aria-valuetext={`${time(shown)} sur ${time(TRACK_LENGTH)}`}
          className="music-range min-w-0 flex-1"
          style={{ "--p": `${(shown / TRACK_LENGTH) * 100}%` } as CSSProperties}
        />
        <span className="w-8 text-right">-{time(TRACK_LENGTH - shown)}</span>

        {/* Volume : coupure, et curseur (ordinateur), */}
        <span className="ml-1 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => ambient().toggleMute()}
            aria-pressed={muted}
            aria-label="Couper le son"
            className="grid size-7 place-items-center rounded-full text-ink transition hover:bg-ink/10"
          >
            <SpeakerIcon level={level} />
          </button>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={Math.round(level * 100)}
            onChange={(e) => ambient().setVolume(Number(e.target.value) / 100)}
            aria-label="Volume"
            aria-valuetext={`${Math.round(level * 100)} %`}
            className="music-range hidden w-16 md:block"
            style={{ "--p": `${level * 100}%` } as CSSProperties}
          />
        </span>
      </div>
      </div>
    </section>
    </div>
  );
}
