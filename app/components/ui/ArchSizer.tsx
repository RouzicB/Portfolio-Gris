"use client";

import { useEffect } from "react";

/**
 * Arches (utilitaire `arch`, globals.css) : le haut en plein cintre a pour rayon la demi-largeur de l'élément.
 * Un rayon « infini » (999px) obligerait le navigateur à réduire tous les rayons d'un même facteur pour qu'ils
 * tiennent : sur téléphone, les coins du bas tombaient à 1 ou 2 px. On mesure donc chaque arche et on pose
 * son rayon exact (--arch) ; les arches emboîtées restent concentriques, chacune ayant sa propre mesure.
 */
export default function ArchSizer() {
  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.borderBoxSize?.[0]?.inlineSize ?? (e.target as HTMLElement).offsetWidth;
        (e.target as HTMLElement).style.setProperty("--arch", `${w / 2}px`);
      }
    });
    const seen = new WeakSet<Element>();
    const scan = () =>
      document.querySelectorAll(".arch").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        ro.observe(el);
      });
    scan();
    // Nouvelles arches (changement de page, contenu chargé ensuite) : un passage par image au plus
    let frame = 0;
    const mo = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), scan()));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      ro.disconnect();
    };
  }, []);
  return null;
}
