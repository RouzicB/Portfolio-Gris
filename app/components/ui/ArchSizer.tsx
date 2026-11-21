"use client";

import { useEffect } from "react";

/**
 * Arches (utilitaire `arch`, globals.css) : le haut en plein cintre a pour rayon la demi-largeur de l'élément.
 * Un rayon « infini » (999px) obligerait le navigateur à réduire tous les rayons d'un même facteur pour qu'ils
 * tiennent : sur téléphone, les coins du bas tombaient à 1 ou 2 px. On mesure donc chaque arche et on pose
 * son rayon exact (--arch) ; les arches emboîtées restent concentriques, chacune ayant sa propre mesure.
 *
 * Mesure robuste : les sections inactives de l'accueil ne sont pas rendues (content-visibility), leurs arches
 * mesurent 0 et certains navigateurs (Safari) ne signalent pas toujours leur vraie taille à leur réapparition.
 * Une mesure nulle est donc ignorée, et toutes les arches sont revérifiées une fois par seconde (lecture légère).
 */
export default function ArchSizer() {
  useEffect(() => {
    const widths = new WeakMap<Element, number>();
    const apply = (el: HTMLElement, w: number) => {
      if (w < 1 || widths.get(el) === w) return;
      widths.set(el, w);
      el.style.setProperty("--arch", `${w / 2}px`);
    };
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) apply(e.target as HTMLElement, e.borderBoxSize?.[0]?.inlineSize ?? (e.target as HTMLElement).offsetWidth);
    });
    const seen = new WeakSet<Element>();
    const scan = () =>
      document.querySelectorAll<HTMLElement>(".arch").forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          ro.observe(el);
        }
        apply(el, el.offsetWidth);
      });
    scan();
    // Nouvelles arches (changement de page, contenu chargé ensuite) : un passage par image au plus
    let frame = 0;
    const mo = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), scan()));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    const tick = window.setInterval(scan, 1000);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(tick);
      mo.disconnect();
      ro.disconnect();
    };
  }, []);
  return null;
}
