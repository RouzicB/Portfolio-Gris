import { TOUCH_QUERY } from "./decor";

/**
 * Mode léger : le même rendu que sur téléphone (décors en images pré-rendues, verre sans flou, décor immobile),
 * pour les ordinateurs peu puissants. Les scènes vivantes (SVG passés dans des filtres aquarelle, nuages qui
 * dérivent, verre dépoli, parallaxe) demandent une vraie carte graphique.
 *
 * Deux façons d'y entrer :
 * - avant le premier affichage, d'après le matériel (PERF_SCRIPT, dans <head>) : peu de cœurs ou de mémoire,
 *   carte graphique logicielle ou absente, économie de données ;
 * - pendant la visite, d'après la fluidité réellement mesurée (watchFrameRate) : si le site tourne trop lentement,
 *   il bascule, et s'en souvient pour les visites suivantes (localStorage).
 * La classe `lite` sur <html> déclenche les règles CSS ; les composants lisent isLite() / subscribeLite().
 */
const KEY = "portfolio-perf";
const EVENT = "portfolio-lite";

/** Script inline, exécuté avant le premier affichage : pose `lite` sur <html> si la machine est modeste */
export const PERF_SCRIPT = `(function(){try{
var d=document.documentElement,s=null;try{s=localStorage.getItem("${KEY}")}catch(e){}
var lite=s==="lite";
if(!lite&&s!=="full"){
var n=navigator,c=n.hardwareConcurrency||8,m=n.deviceMemory||8;
if(c<=4||m<=4||(n.connection&&n.connection.saveData))lite=true;
if(!lite){try{var g=document.createElement("canvas").getContext("webgl");
if(!g)lite=true;else{var x=g.getExtension("WEBGL_debug_renderer_info");
var r=x?String(g.getParameter(x.UNMASKED_RENDERER_WEBGL)):"";
if(/swiftshader|llvmpipe|software|basic render/i.test(r))lite=true;}}catch(e){}}
}
if(lite)d.classList.add("lite");
}catch(e){}})();`;

/** Décor en images pré-rendues : écran tactile ou étroit, ou ordinateur en mode léger */
export function isLite(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("lite") || window.matchMedia(TOUCH_QUERY).matches;
}

/** Abonnement aux changements (rotation, redimensionnement, bascule en mode léger) */
export function subscribeLite(cb: () => void): () => void {
  const mq = window.matchMedia(TOUCH_QUERY);
  mq.addEventListener("change", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    mq.removeEventListener("change", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/** Passe en mode léger (et s'en souvient) */
export function enableLite() {
  const root = document.documentElement;
  if (root.classList.contains("lite")) return;
  root.classList.add("lite");
  try {
    localStorage.setItem(KEY, "lite");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** Cadence trop basse : plus de 28 ms par image en moyenne (< ~35 images/s), ou plus de 20 % d'images très lentes */
const tooSlow = (gaps: number[]) => {
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  return avg > 28 || gaps.filter((g) => g > 50).length / gaps.length > 0.2;
};

/**
 * Surveille la fluidité sur un ordinateur en décor vivant, aux deux moments qui comptent :
 * - au repos, une fois la page posée (nuages en mouvement, verre dépoli) ;
 * - pendant chaque voyage entre sections (attribut data-travel sur <html>), le moment le plus exigeant.
 * Trop lent et le site bascule en mode léger ; après plusieurs voyages fluides, la machine est notée « full »
 * et n'est plus surveillée.
 */
export function watchFrameRate(): () => void {
  if (isLite()) return () => {};
  try {
    if (localStorage.getItem(KEY) === "full") return () => {};
  } catch {}
  const root = document.documentElement;
  let raf = 0;
  let stopped = false;
  let smooth = 0;

  /** Mesure image par image tant que `keep()` est vrai (et au plus `max` ms), puis rend les écarts */
  const measure = (keep: () => boolean, max: number, done: (gaps: number[]) => void) => {
    const gaps: number[] = [];
    let start = 0;
    let last = 0;
    const step = (t: number) => {
      if (stopped) return;
      if (document.hidden) return done([]); // onglet masqué : le navigateur ralentit exprès, mesure sans valeur
      if (!start) start = last = t;
      else {
        gaps.push(t - last);
        last = t;
      }
      if (keep() && t - start < max) raf = requestAnimationFrame(step);
      else done(gaps);
    };
    raf = requestAnimationFrame(step);
  };

  const judge = (gaps: number[], minFrames: number) => {
    if (stopped || gaps.length < minFrames) return;
    if (tooSlow(gaps)) {
      enableLite();
      stop();
    } else if (++smooth >= 4) {
      try {
        localStorage.setItem(KEY, "full");
      } catch {}
      stop();
    }
  };

  // Voyages entre sections
  const observer = new MutationObserver(() => {
    if (stopped || !root.hasAttribute("data-travel")) return;
    measure(() => root.hasAttribute("data-travel"), 3000, (gaps) => judge(gaps, 20));
  });
  observer.observe(root, { attributes: true, attributeFilter: ["data-travel"] });

  // Repos : laisse passer l'écran de chargement et la mise en place du décor avant de mesurer
  const timer = window.setTimeout(() => measure(() => !root.hasAttribute("data-travel"), 3000, (gaps) => judge(gaps, 60)), 3500);

  function stop() {
    stopped = true;
    observer.disconnect();
    window.clearTimeout(timer);
    cancelAnimationFrame(raf);
  }
  return stop;
}
