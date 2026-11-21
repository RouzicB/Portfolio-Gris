"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
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
 * Ordinateur : en bas à droite. Téléphone : en bas, au-dessus de la navigation sur l'accueil,
 * à côté du lien Crédits sur les autres pages ; le curseur de volume y laisse la place aux boutons du téléphone.
 */
export default function MusicToggle() {
  const pathname = usePathname();
  const engine = ambient();
  const { playing, index, volume, muted } = useSyncExternalStore(engine.subscribe, engine.getSnapshot, () => SERVER_SNAP);
  const track = TRACKS[index];
  const [pos, setPos] = useState(0);
  const [dragging, setDragging] = useState<number | null>(null);
  const pointer = useRef(false);
  const home = pathname === "/";

  // Tiroir : déplié à l'arrivée (on découvre le lecteur), puis replié en languette quand on ne s'en sert pas.
  // Souris : le survol le déplie, il se replie peu après la sortie. Clavier : le focus le déplie.
  // Toucher : un appui sur la languette le déplie, il se replie après quelques secondes sans geste ou un appui ailleurs.
  const [open, setOpen] = useState(true);
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
    timer.current = window.setTimeout(() => !hovered.current && setOpen(false), 4000);
    return () => window.clearTimeout(timer.current);
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
        if (e.pointerType !== "mouse") show(5000);
      }}
      onFocus={(e) => {
        // Clavier seulement : un clic donne aussi le focus, le survol s'en charge déjà
        if (e.target.matches(":focus-visible")) show();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hideSoon(400);
      }}
      className={`music-dock fixed z-40 px-1.5 pt-3 md:inset-x-auto md:bottom-0 md:right-4 md:w-[24.5rem] md:pb-4 md:[--dock-pb:1rem] ${
        open ? "is-open" : ""
      } ${home ? "inset-x-1.5 bottom-[3.85rem] pb-1 [--dock-pb:0.25rem]" : "bottom-0 left-[4.1rem] right-1.5 pb-3 [--dock-pb:0.75rem]"}`}
    >
    <section
      data-palette-live
      aria-label="Lecteur de musique d'ambiance"
      className={`music-player veil panel rounded-[1rem_0.4rem_1rem_0.4rem] px-4 pb-3 pt-4 text-ink ${playing ? "is-on" : ""}`}
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
