"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useMotionValue } from "framer-motion";
import { sections } from "../../data/sections";
import { palettes } from "../../data/palettes";
import { mixPalette } from "../../lib/color";
import { anchorId, clampIndex, continuousIndex, paletteToVars, segment } from "../../lib/journey";
import { JourneyContext } from "./JourneyContext";
import Landscape from "../background/Landscape";
import TopBar from "./TopBar";
import SectionNav from "./SectionNav";

const STAGES = sections.map((s) => s.stage);
const SUNS = sections.map((s) => s.sun);

/**
 * Moteur du voyage.
 * À chaque frame de scroll, la position continue entre deux sections mélange leurs palettes :
 * le ciel, le texte et les voiles glissent d'une ambiance à l'autre au rythme du doigt ou de la molette,
 * sans palier ni transition déclenchée.
 */
export default function Journey({ children }: Readonly<{ children: ReactNode }>) {
  const [active, setActive] = useState(0);
  const progress = useMotionValue(0);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const els = Array.from(main.querySelectorAll<HTMLElement>("[data-section-index]"));
    const root = document.documentElement;
    let centers: number[] = [];
    let frame = 0;
    let lastVars = "";
    let lastActive = -1;

    const measure = () => {
      centers = els.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });
    };

    const update = () => {
      frame = 0;
      const f = continuousIndex(centers, window.scrollY + window.innerHeight / 2);
      progress.set(f);

      const { from, to, t } = segment(f, sections.length);
      const palette = mixPalette(palettes[sections[from].stage], palettes[sections[to].stage], t);
      const vars = paletteToVars(palette);
      const key = Object.values(vars).join("|");
      if (key !== lastVars) {
        lastVars = key;
        Object.entries(vars).forEach(([name, value]) => root.style.setProperty(name, value));
      }

      const nearest = clampIndex(f, sections.length);
      if (nearest !== lastActive) {
        lastActive = nearest;
        setActive(nearest);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    const ro = new ResizeObserver(remeasure);
    ro.observe(main);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [progress]);

  const goTo = useCallback((index: number) => {
    const section = sections[clampIndex(index, sections.length)];
    document.getElementById(anchorId(section.id))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const value = useMemo(() => ({ active, progress, goTo }), [active, progress, goTo]);

  return (
    <JourneyContext.Provider value={value}>
      <a
        href={`#${anchorId(sections[1].id)}`}
        className="label-spaced sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-veil focus:px-4 focus:py-2"
      >
        Aller au contenu
      </a>
      <Landscape progress={progress} stages={STAGES} suns={SUNS} />
      <TopBar />
      <SectionNav />
      <main ref={mainRef} className="relative">
        {children}
      </main>
    </JourneyContext.Provider>
  );
}
