"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

export default function Providers({ children }: Readonly<{ children: ReactNode }>) {
  // "user" : coupe les animations de mouvement si l'OS demande moins d'animations
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
