"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";

interface Pointer {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

const PointerContext = createContext<Pointer | null>(null);

/** Suit la souris (de -1 à 1) avec un ressort très amorti : le décor respire, sans à-coup */
export function PointerProvider({ children }: Readonly<{ children: ReactNode }>) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 30, damping: 20, mass: 1.2 });
  const y = useSpring(rawY, { stiffness: 30, damping: 20, mass: 1.2 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  return <PointerContext.Provider value={{ x, y }}>{children}</PointerContext.Provider>;
}

/**
 * Plan de décor : plus `depth` est grand, plus il bouge avec la souris (effet de profondeur).
 * Chaque plan est un calque HTML : le navigateur le déplace sans redessiner l'aquarelle.
 */
export function Layer({ depth = 0, className = "", children }: { depth?: number; className?: string; children: ReactNode }) {
  const pointer = useContext(PointerContext);
  const fallback = useMotionValue(0);
  const px = useTransform(pointer?.x ?? fallback, (v) => v * depth * -24);
  const py = useTransform(pointer?.y ?? fallback, (v) => v * depth * -10);
  return (
    <motion.div className={`absolute inset-[-3%] ${className}`} style={{ x: px, y: py }}>
      {children}
    </motion.div>
  );
}
