"use client";

import { useSyncExternalStore } from "react";

/** Année au moment de la génération du site (le HTML statique en porte une, même sans JavaScript) */
const BUILD_YEAR = new Date().getFullYear();
const noop = () => () => {};

/**
 * Année en cours, toujours à jour : le HTML généré porte l'année de la mise en ligne, puis le navigateur
 * la remplace par l'année réelle si elle a changé depuis (sans écart d'hydratation).
 */
export function useYear() {
  return useSyncExternalStore(noop, () => new Date().getFullYear(), () => BUILD_YEAR);
}
