"use client";

import { useEffect } from "react";

/**
 * Arches (utilitaire `arch`, globals.css) : le haut en plein cintre a pour rayon la demi-largeur de l'élément.
 * Un rayon « infini » (999px) obligerait le navigateur à réduire tous les rayons d'un même facteur pour qu'ils
 * tiennent : sur téléphone, les coins du bas tombaient à 1 ou 2 px. On mesure donc chaque arche et on pose
 * son rayon exact (--arch) ; les arches emboîtées restent concentriques, chacune ayant sa propre mesure.
 *
 * Mesure sans coût pendant les animations : c'est le ResizeObserver qui donne les tailles (le navigateur les calcule
 * de toute façon). Avant, chaque changement du DOM pendant un voyage relisait la largeur de toutes les arches
 * (offsetWidth), ce qui forçait un recalcul complet de la mise en page au milieu de l'animation : sur un PC très
 * lent, c'était la première cause de saccades.
 *
 * Mesure robuste : les sections inactives de l'accueil ne sont pas rendues (content-visibility), leurs arches
 * mesurent 0 et certains navigateurs (Safari) ne signalent pas toujours leur vraie taille à leur réapparition.
 * Une mesure nulle est donc ignorée, et les arches sont revérifiées à la fin de chaque voyage, quand le navigateur
 * est au repos (la mise en page est alors déjà à jour : la lecture ne coûte rien).
 */
// Safari n'a pas requestIdleCallback : une courte minuterie le remplace
const idle = (fn: () => void): number =>
  typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout: 500 }) : window.setTimeout(fn, 120);
const cancelIdle = (id: number) => (typeof window.cancelIdleCallback === "function" ? window.cancelIdleCallback(id) : window.clearTimeout(id));

export default function ArchSizer() {
  useEffect(() => {
    const root = document.documentElement;
    const widths = new WeakMap<Element, number>();
    const apply = (el: HTMLElement, w: number) => {
      if (w < 1 || widths.get(el) === w) return;
      widths.set(el, w);
      el.style.setProperty("--arch", `${w / 2}px`);
    };
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.borderBoxSize?.[0]?.inlineSize;
        if (w !== undefined) apply(e.target as HTMLElement, w);
      }
    });
    const seen = new WeakSet<Element>();
    // Nouvelles arches : observées (le ResizeObserver envoie alors leur taille, sans lecture forcée)
    const observe = () =>
      document.querySelectorAll<HTMLElement>(".arch").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        ro.observe(el);
      });
    // Vérification de secours (Safari) : lecture directe, seulement au repos, et seulement des arches encore jamais mesurées
    const recheck = () =>
      document.querySelectorAll<HTMLElement>(".arch").forEach((el) => {
        if (!widths.has(el)) apply(el, el.offsetWidth);
      });
    observe();

    let pending = 0;
    const schedule = (fn: () => void) => {
      if (pending) return;
      pending = idle(() => {
        pending = 0;
        // Voyage en cours : on attendra la fin
        if (root.hasAttribute("data-traveling")) return;
        fn();
      });
    };
    // Nouvelles arches (changement de page, contenu chargé ensuite)
    const refresh = () => {
      observe();
      recheck();
    };
    const mo = new MutationObserver(() => schedule(refresh));
    mo.observe(document.body, { childList: true, subtree: true });
    // Fin d'un voyage entre sections : la section d'arrivée est rendue, ses arches ont leur vraie taille
    // (et ce qui a changé pendant le voyage est rattrapé)
    const travel = new MutationObserver(() => {
      if (!root.hasAttribute("data-traveling")) schedule(refresh);
    });
    travel.observe(root, { attributes: true, attributeFilter: ["data-traveling"] });
    return () => {
      if (pending) cancelIdle(pending);
      mo.disconnect();
      travel.disconnect();
      ro.disconnect();
    };
  }, []);
  return null;
}
