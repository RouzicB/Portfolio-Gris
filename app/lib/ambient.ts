/**
 * Musique d'ambiance, composée en direct dans le navigateur (Web Audio) : aucun fichier, aucun droit.
 * Sept morceaux, un par zone du voyage, chacun avec ses instruments, son allure et sa forme, dans l'esprit
 * des bandes originales contemplatives : piano seul au départ, désert de vent et de violoncelle, forêt de marimba
 * et de flûte, profondeurs de harpe et de chœur, ascension de célesta et de cordes, éclaircie pleine, berceuse finale.
 *
 * Chaque morceau est écrit d'avance par un tirage au sort « graine » : la mesure n° 5 d'un morceau est toujours
 * la même. Il a donc une vraie durée et une position, et on peut avancer, reculer, passer au suivant comme
 * dans un lecteur. Forme commune : introduction (2 mesures), thème (6), développement plus plein (6), fin (2).
 * Quand on change de zone, la playlist passe au morceau de la zone (comme une bande originale).
 * Un seul moteur pour tout le site : il survit aux changements de page.
 */

import type { StageId } from "../types";

type Inst =
  | "piano"
  | "marimba"
  | "pluck"
  | "harp"
  | "celesta"
  | "musicbox"
  | "flute"
  | "strings"
  | "tremolo"
  | "choirA"
  | "choirO"
  | "cello"
  | "pulse"
  | "wind"
  | "water"
  | "bird"
  | "whale";

/** Une note (ou un accord) de la partition : instant dans la mesure (s), instrument, hauteurs MIDI, force, durée (s) */
interface Note {
  at: number;
  inst: Inst;
  midi: number[];
  vel: number;
  dur: number;
}

type Part = "intro" | "theme" | "develop" | "end";

/** Ce qu'une composition connaît de la mesure qu'elle écrit */
interface Bar {
  bar: number;
  part: Part;
  /** Accord de la mesure, en degrés de la gamme (fondamentale, tierce, quinte) */
  chord: number[];
  /** Hauteur MIDI d'un degré de la gamme, à l'octave voulue */
  deg: (d: number, octave?: number) => number;
  /** Motif propre au morceau (écarts en degrés), repris et varié de mesure en mesure */
  motif: number[];
  rand: () => number;
}

export interface Track {
  stage: StageId;
  title: string;
  /** Sous-titre affiché sous le titre : les instruments */
  sub: string;
  seed: number;
  root: number;
  scale: number[];
  /** Fondamentales des accords (degrés), une par mesure, en boucle */
  prog: number[];
  compose: (b: Bar) => Note[];
}

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 10];
const LYDIAN = [0, 2, 4, 6, 7, 9, 11];
/** Mode oriental (phrygien dominant) : la seconde abaissée et la tierce majeure du désert */
const HIJAZ = [0, 1, 4, 5, 7, 8, 10];

/** Durée d'une mesure, nombre de mesures d'un morceau, durée d'un morceau (s) */
const BAR = 9;
const BARS = 16;
export const TRACK_LENGTH = BAR * BARS;
const VOLUME = 0.85;
/** Tenue des sons continus : un peu plus d'une mesure, pour se fondre dans la suivante */
const HOLD = BAR + 1.6;

const partOf = (bar: number): Part => (bar < 2 ? "intro" : bar < 8 ? "theme" : bar < 14 ? "develop" : "end");
const busy = (p: Part) => p === "theme" || p === "develop";

export const TRACKS: Track[] = [
  {
    // Accueil : un piano seul, lent, qui cherche sa mélodie ; des cordes discrètes s'y glissent ensuite
    stage: "gris",
    title: "Brume",
    sub: "Piano seul",
    seed: 11,
    root: 57,
    scale: MINOR,
    prog: [0, 5, 3, 4],
    compose: ({ bar, part, chord, deg, motif, rand }) => {
      const n: Note[] = [{ at: 0, inst: "piano", midi: [deg(chord[0], -2)], vel: 0.2, dur: 7 }];
      if (bar === BARS - 1) return [...n, { at: 0.05, inst: "piano", midi: chord.map((d) => deg(d, -1)), vel: 0.07, dur: 8 }];
      for (const [at, d] of [
        [1.5, chord[1]],
        [3, chord[2]],
        [6, chord[1]],
      ] as const)
        n.push({ at, inst: "piano", midi: [deg(d, -1)], vel: 0.08, dur: 4.5 });
      if (busy(part)) {
        const times = [0.4, 1.9, 3.3, 4.8, 6.3, 7.5];
        times.forEach((at, i) => {
          if (rand() > (part === "develop" ? 0.9 : 0.72)) return;
          const d = i === 0 ? chord[0] + 7 : chord[0] + 7 + motif[(i + bar) % motif.length];
          const vel = 0.11 + rand() * 0.08;
          n.push({ at, inst: "piano", midi: [deg(d)], vel, dur: 4.5 });
          if (part === "develop" && i % 2 === 0) n.push({ at: at + 0.02, inst: "piano", midi: [deg(d, 1)], vel: vel * 0.35, dur: 3.5 });
        });
      }
      if (part === "develop") n.push({ at: 0, inst: "strings", midi: chord.map((d) => deg(d, -1)), vel: 0.03, dur: HOLD });
      return n;
    },
  },
  {
    // Profil : le désert. Violoncelle en bourdon, vent, une mélodie pincée au mode oriental ;
    // au développement, cordes en trémolo et battements sourds comme un cœur
    stage: "rouge",
    title: "Braise",
    sub: "Violoncelle et vent",
    seed: 23,
    root: 50,
    scale: HIJAZ,
    prog: [0, 3, 0, 6],
    compose: ({ part, chord, deg, motif, rand }) => {
      const n: Note[] = [
        { at: 0, inst: "cello", midi: [deg(0, -2), deg(4, -2)], vel: 0.075, dur: HOLD },
        { at: 0, inst: "wind", midi: [0], vel: part === "develop" ? 0.06 : 0.04, dur: HOLD },
      ];
      if (part === "intro") return [...n, { at: 4.5, inst: "pluck", midi: [deg(0)], vel: 0.1, dur: 1.4 }];
      if (part === "end") return [...n, { at: 0, inst: "pulse", midi: [0], vel: 0.18, dur: 1 }];
      // Mélodie pincée : une grille de 12 temps, avec des ornements rapides
      for (let s = 0; s < 12; s++) {
        if (rand() > (part === "develop" ? 0.62 : 0.45)) continue;
        const d = chord[0] + motif[(s + 3) % motif.length];
        const at = s * 0.75;
        n.push({ at, inst: "pluck", midi: [deg(d)], vel: 0.15 + rand() * 0.07, dur: 1.4 });
        if (rand() < 0.2) n.push({ at: at + 0.12, inst: "pluck", midi: [deg(d + 1)], vel: 0.06, dur: 0.8 });
      }
      if (part === "develop") {
        n.push({ at: 0, inst: "tremolo", midi: chord.map((d) => deg(d, -1)), vel: 0.028, dur: HOLD });
        for (const at of [0, 0.32, 4.5, 4.82]) n.push({ at, inst: "pulse", midi: [0], vel: at % 4.5 ? 0.12 : 0.2, dur: 1 });
      }
      return n;
    },
  },
  {
    // Convictions : la forêt. Marimba en ostinato, basse pincée, une flûte qui chante, des oiseaux
    stage: "vert",
    title: "Sève",
    sub: "Marimba et flûte",
    seed: 37,
    root: 55,
    scale: MAJOR,
    prog: [0, 4, 5, 3],
    compose: ({ bar, part, chord, deg, motif, rand }) => {
      const n: Note[] = [];
      const pattern = [0, 2, 1, 2, 0, 2, 1, 3];
      const step = BAR / 16;
      for (let s = 0; s < 16; s++) {
        if (part === "intro" && s % 2) continue;
        if (part === "end" && (s % 2 || s > 9)) continue;
        if (rand() < 0.12) continue;
        const k = pattern[s % 8];
        const d = k === 3 ? chord[0] + 7 : chord[k];
        n.push({ at: s * step, inst: "marimba", midi: [deg(d)], vel: (s % 4 === 0 ? 0.13 : 0.08) + rand() * 0.03, dur: 1 });
      }
      n.push({ at: 0, inst: "pluck", midi: [deg(chord[0], -2)], vel: 0.16, dur: 1 });
      if (part !== "end") n.push({ at: 4.5, inst: "pluck", midi: [deg(chord[2], -2)], vel: 0.12, dur: 1 });
      if (part === "develop" || (part === "theme" && bar >= 5)) {
        [0, 2.25, 4.5, 6.75].forEach((at, i) => {
          if (i === 3 && rand() < 0.5) return;
          const d = chord[0] + 7 + motif[(i + bar * 2) % motif.length];
          n.push({ at: at + 0.05, inst: "flute", midi: [deg(d)], vel: 0.05, dur: i === 3 ? 2.6 : 2.1 });
        });
      }
      if (part === "develop") n.push({ at: 0, inst: "strings", midi: chord.map((d) => deg(d, -1)), vel: 0.022, dur: HOLD });
      if (busy(part)) for (let k = 0; k < 2; k++) if (rand() < 0.55) n.push({ at: rand() * 8, inst: "bird", midi: [0], vel: 0.025, dur: 0.6 });
      return n;
    },
  },
  {
    // Aptitudes : les profondeurs. Harpe en vagues d'arpèges, chœur lointain, eau, chants de baleine
    stage: "bleu",
    title: "Abysse",
    sub: "Harpe et chœur",
    seed: 41,
    root: 52,
    scale: MINOR,
    prog: [0, 5, 2, 6],
    compose: ({ bar, part, chord, deg, motif, rand }) => {
      const n: Note[] = [{ at: 0, inst: "water", midi: [0], vel: 0.05, dur: HOLD }];
      const tones = [chord[0], chord[1], chord[2], chord[0] + 7, chord[1] + 7, chord[2] + 7];
      const wave = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3];
      const steps = part === "intro" || part === "end" ? 6 : 12;
      for (let s = 0; s < steps; s++)
        n.push({ at: s * 0.75, inst: "harp", midi: [deg(tones[wave[s]], -1)], vel: 0.07 + (s === 0 ? 0.04 : rand() * 0.03), dur: 3 });
      if (part !== "intro") n.push({ at: 0, inst: "choirO", midi: chord.map((d) => deg(d)), vel: 0.035, dur: HOLD });
      if (part === "develop") {
        n.push({ at: 0, inst: "cello", midi: [deg(chord[0], -2)], vel: 0.04, dur: HOLD });
        [1.2, 4.2, 6.9].forEach((at, i) => {
          if (rand() < 0.3) return;
          n.push({ at, inst: "piano", midi: [deg(chord[0] + 7 + motif[(i + bar) % motif.length], 1)], vel: 0.06, dur: 4 });
        });
        if (bar % 3 === 0) n.push({ at: 2, inst: "whale", midi: [0], vel: 0.05, dur: 4.5 });
      }
      return n;
    },
  },
  {
    // Parcours : l'ascension. Cordes chaudes, célesta qui monte par vagues, puis un chœur et une mélodie qui s'élève
    stage: "jaune",
    title: "Ocre",
    sub: "Célesta et cordes",
    seed: 53,
    root: 53,
    scale: LYDIAN,
    prog: [0, 1, 5, 4],
    compose: ({ bar, part, chord, deg, motif, rand }) => {
      const n: Note[] = [
        { at: 0, inst: "strings", midi: chord.map((d) => deg(d, -1)), vel: 0.055, dur: HOLD },
        { at: 0, inst: "piano", midi: [deg(chord[0], -2)], vel: 0.18, dur: 7 },
      ];
      if (part !== "intro") {
        // Une montée de célesta par mesure, d'un point de départ tiré au sort
        const start = Math.floor(rand() * 4);
        const run = part === "end" ? 4 : 7;
        for (let i = 0; i < run; i++) {
          const d = chord[i % 3] + 7 * Math.floor(i / 3);
          n.push({ at: (start + i) * 0.6, inst: "celesta", midi: [deg(d, 1)], vel: 0.05 + i * 0.006, dur: 2.5 });
        }
      }
      if (part === "develop") {
        n.push({ at: 0, inst: "choirA", midi: chord.map((d) => deg(d)), vel: 0.03, dur: HOLD });
        // La mélodie s'élève de mesure en mesure
        const lift = Math.floor((bar - 8) / 2);
        [0.3, 3.3, 6.3].forEach((at, i) =>
          n.push({ at, inst: "flute", midi: [deg(chord[0] + 7 + lift + Math.abs(motif[(i + bar) % motif.length]))], vel: 0.045, dur: 2.8 }),
        );
      }
      return n;
    },
  },
  {
    // Projets : l'éclaircie. Piano en arpèges, cordes, puis chœur, violoncelle, timbale et une mélodie pleine
    stage: "ciel",
    title: "Éclaircie",
    sub: "Piano et orchestre",
    seed: 67,
    root: 48,
    scale: MAJOR,
    prog: [0, 4, 5, 3],
    compose: ({ bar, part, chord, deg, motif, rand }) => {
      const n: Note[] = [];
      const pattern = [chord[0] - 7, chord[2] - 7, chord[0], chord[1], chord[2], chord[1]];
      const steps = part === "end" ? 6 : 12;
      for (let s = 0; s < steps; s++)
        n.push({ at: s * 0.75, inst: "piano", midi: [deg(pattern[s % 6])], vel: s === 0 ? 0.15 : 0.07 + rand() * 0.03, dur: 3 });
      if (part !== "intro" && part !== "end") n.push({ at: 0, inst: "strings", midi: chord.map((d) => deg(d, -1)), vel: 0.04, dur: HOLD });
      if (part === "develop") {
        n.push({ at: 0, inst: "choirA", midi: chord.map((d) => deg(d)), vel: 0.032, dur: HOLD });
        n.push({ at: 0, inst: "cello", midi: [deg(chord[0], -2)], vel: 0.045, dur: HOLD });
        n.push({ at: 0, inst: "pulse", midi: [0], vel: 0.12, dur: 1 });
        [0.2, 2.45, 4.7, 6.2].forEach((at, i) => {
          const d = chord[0] + 7 + motif[(i + bar) % motif.length];
          n.push({ at, inst: "flute", midi: [deg(d)], vel: 0.05, dur: i === 3 ? 2.8 : 2.2 });
        });
      }
      return n;
    },
  },
  {
    // Contact : la nuit. Une berceuse de boîte à musique à trois temps, un chœur à peine là, une basse douce
    stage: "lune",
    title: "Nocturne",
    sub: "Boîte à musique",
    seed: 79,
    root: 45,
    scale: MINOR,
    prog: [0, 3, 5, 4],
    compose: ({ bar, part, chord, deg, motif, rand }) => {
      const n: Note[] = [
        { at: 0, inst: "piano", midi: [deg(chord[0], -1)], vel: 0.1, dur: 5 },
        { at: 4.5, inst: "piano", midi: [deg(chord[2], -1)], vel: 0.07, dur: 5 },
      ];
      if (part !== "intro") n.push({ at: 0, inst: "choirO", midi: chord.map((d) => deg(d)), vel: 0.022, dur: HOLD });
      // Valse : groupes de trois temps (0,75 s), la mélodie sur le premier et le troisième
      const beats = part === "end" ? [0, 3, 6] : [0, 2, 3, 5, 6, 8, 9, 11];
      beats.forEach((s, i) => {
        if (part !== "intro" && rand() < 0.1) return;
        const d = s % 3 === 0 ? chord[i % 3] + 7 : chord[0] + 7 + motif[(i + bar) % motif.length];
        n.push({ at: s * 0.75, inst: "musicbox", midi: [deg(d, 1)], vel: s % 3 === 0 ? 0.1 : 0.07, dur: 2.2 });
      });
      return n;
    },
  },
];

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** Tirage au sort reproductible (mulberry32) */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Motif d'un morceau : une ligne qui avance par petits pas, toujours la même pour un morceau */
function motifOf(seed: number) {
  const r = rng(seed * 7 + 3);
  const m = [0];
  for (let i = 1; i < 8; i++) m.push(Math.max(-3, Math.min(5, m[i - 1] + [-2, -1, -1, 1, 1, 2][Math.floor(r() * 6)])));
  return m;
}

/** Partition d'une mesure : toujours la même pour un morceau et un numéro de mesure donnés */
function score(track: Track, bar: number): Note[] {
  const n = track.scale.length;
  const deg = (d: number, octave = 0) => track.root + track.scale[((d % n) + n) % n] + 12 * (Math.floor(d / n) + octave);
  const root = track.prog[bar % track.prog.length];
  return track.compose({
    bar,
    part: partOf(bar),
    chord: [root, root + 2, root + 4],
    deg,
    motif: motifOf(track.seed),
    rand: rng(track.seed * 1000 + bar),
  });
}

/** Sons tenus : repris en fondu si la lecture commence au milieu */
const SUSTAINED = new Set<Inst>(["strings", "tremolo", "choirA", "choirO", "cello", "wind", "water", "flute", "whale"]);

/** Formants des voyelles du chœur (fréquence, poids) */
const VOWELS = {
  choirA: [
    [800, 1],
    [1150, 0.5],
    [2900, 0.12],
  ],
  choirO: [
    [450, 1],
    [800, 0.35],
    [2830, 0.08],
  ],
} as const;

/**
 * Réverbération : bruit qui s'éteint lentement (une grande salle).
 * La courbe est celle d'une queue de 5,5 s, mais coupée à 3,6 s (avec un court fondu) : au-delà, elle est
 * à plus de 30 dB sous le départ, inaudible sous la musique. La convolution, le calcul le plus lourd du son,
 * coûte d'autant moins : sur un PC modeste, c'est elle qui ne tenait pas le rythme et faisait grésiller.
 */
function impulse(ctx: AudioContext, seconds = 5.5, cut = 3.6) {
  const total = ctx.sampleRate * seconds;
  const len = Math.floor(ctx.sampleRate * cut);
  const fade = Math.floor(ctx.sampleRate * 0.3);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      const tail = i > len - fade ? (len - i) / fade : 1;
      data[i] = (Math.random() * 2 - 1) * (1 - i / total) ** 3 * tail;
    }
  }
  return buf;
}

/** Avance (s) avec laquelle chaque mesure est programmée : le son ne dépend plus d'un fil principal à l'heure */
const LEAD = 1;

class Ambient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  /** Voix de la lecture en cours : on la coupe d'un coup pour avancer, reculer ou changer de morceau */
  private voice: GainNode | null = null;
  private timer = 0;
  private listeners = new Set<() => void>();
  private index = 0;
  private playing = false;
  /** Position (s) au moment `startedAt` (horloge audio) ; position figée quand la lecture est en pause */
  private offset = 0;
  private startedAt = 0;
  private version = 0;
  /** Volume choisi (0 – 1) et coupure du son, indépendants de la lecture */
  private volume = 0.8;
  private muted = false;
  private watching = false;
  /** Instantané stable pour React (useSyncExternalStore) : recréé à chaque changement d'état */
  private snap = { playing: false, index: 0, version: 0, volume: 0.8, muted: false };

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => this.snap;

  private emit() {
    this.snap = { playing: this.playing, index: this.index, version: ++this.version, volume: this.volume, muted: this.muted };
    this.listeners.forEach((fn) => fn());
  }

  get track() {
    return TRACKS[this.index];
  }

  /** Position dans le morceau (s) */
  get position() {
    if (!this.playing || !this.ctx) return this.offset;
    return Math.min(TRACK_LENGTH, this.offset + Math.max(0, this.ctx.currentTime - this.startedAt));
  }

  private setup() {
    // « playback » : une mémoire tampon plus large. La latence ne compte pas pour une musique d'ambiance ; en échange,
    // un processeur occupé (voyage entre sections, PC modeste) ne vide plus le tampon : plus de craquements.
    const ctx = new AudioContext({ latencyHint: "playback" });
    const master = ctx.createGain();
    master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    master.connect(comp).connect(ctx.destination);
    const bus = ctx.createGain();
    const dry = ctx.createGain();
    dry.gain.value = 0.55;
    const verb = ctx.createConvolver();
    verb.buffer = impulse(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.75;
    bus.connect(dry).connect(master);
    bus.connect(verb).connect(wet).connect(master);
    // Bruit blanc (vent, eau), lu en boucle
    const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    this.ctx = ctx;
    this.master = master;
    this.bus = bus;
    this.noise = noise;
    // Téléphone mis en veille, onglet masqué : le son se coupe (une vraie pause, le lecteur affiche « lecture »).
    // Même chose si le système interrompt le son (appel entrant). On relance quand on veut, depuis le lecteur.
    ctx.onstatechange = () => {
      if (this.playing && ctx.state !== "running" && ctx.state !== "closed" && !document.hidden) this.pause();
    };
    if (!this.watching) {
      this.watching = true;
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.pause();
      });
    }
  }

  // ─── Briques de synthèse ───

  /** Oscillateur branché sur `dest`, joué de `when` à `end` */
  private osc(type: OscillatorType, freq: number, dest: AudioNode, when: number, end: number, gain = 1, detune = 0) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    const g = ctx.createGain();
    g.gain.value = gain;
    o.connect(g).connect(dest);
    o.start(when);
    o.stop(end + 0.05);
    return o;
  }

  /** Oscillation lente (vibrato, trémolo, souffle) appliquée à des paramètres */
  private lfo(params: AudioParam[], rate: number, depth: number, when: number, end: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.frequency.value = rate;
    const g = ctx.createGain();
    g.gain.value = depth;
    o.connect(g);
    for (const p of params) g.connect(p);
    o.start(when);
    o.stop(end + 0.05);
  }

  /** Enveloppe percussive : attaque brève, extinction exponentielle */
  private hit(when: number, peak: number, decay: number, attack = 0.005) {
    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(peak, when + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, when + decay);
    g.connect(this.voice!);
    return g;
  }

  /** Enveloppe tenue : montée, palier, descente ; montée courte si le son reprend en cours de route */
  private hold(when: number, peak: number, dur: number, resumed: boolean) {
    const g = this.ctx!.createGain();
    const a = resumed ? 0.4 : Math.min(dur * 0.35, 2.5);
    const r = Math.min(dur * 0.35, 2.5);
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(peak, when + a);
    g.gain.setValueAtTime(peak, Math.max(when + a, when + dur - r));
    g.gain.linearRampToValueAtTime(0, when + dur);
    g.connect(this.voice!);
    return g;
  }

  private noiseSource(when: number, end: number) {
    const s = this.ctx!.createBufferSource();
    s.buffer = this.noise;
    s.loop = true;
    s.loopStart = Math.random();
    s.start(when, Math.random() * 1.5);
    s.stop(end + 0.05);
    return s;
  }

  private lowpass(freq: number, q = 0.5) {
    const f = this.ctx!.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
  }

  // ─── Instruments ───

  private piano(f: number, when: number, vel: number, dur: number) {
    const out = this.ctx!.createGain();
    out.gain.setValueAtTime(0, when);
    out.gain.linearRampToValueAtTime(vel, when + 0.012);
    out.gain.exponentialRampToValueAtTime(vel * 0.35, when + 0.6);
    out.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    out.connect(this.voice!);
    const tone = this.lowpass(Math.min(5200, f * 6));
    tone.frequency.exponentialRampToValueAtTime(Math.max(400, f * 1.5), when + dur * 0.6);
    tone.connect(out);
    this.osc("triangle", f, tone, when, when + dur, 0.6, (Math.random() - 0.5) * 6);
    this.osc("sine", f * 2, tone, when, when + dur, 0.18);
    this.osc("sine", f * 3, tone, when, when + dur, 0.06);
  }

  /** Marimba : lame de bois, fondamentale ronde et un partiel aigu très bref */
  private marimba(f: number, when: number, vel: number) {
    this.osc("sine", f, this.hit(when, vel, 0.9), when, when + 1);
    this.osc("sine", f * 4, this.hit(when, vel * 0.3, 0.12), when, when + 0.2);
  }

  /** Corde pincée (pizzicato, oud, harpe) : filtre qui se referme vite */
  private pluck(f: number, when: number, vel: number, dur: number, bright = 8) {
    const out = this.hit(when, vel, dur, 0.004);
    const tone = this.lowpass(Math.min(7000, f * bright), 1.2);
    tone.frequency.setValueAtTime(Math.min(7000, f * bright), when);
    tone.frequency.exponentialRampToValueAtTime(Math.max(200, f * 1.2), when + Math.min(0.4, dur));
    tone.connect(out);
    this.osc("triangle", f, tone, when, when + dur, 0.8);
    this.osc("sawtooth", f, tone, when, when + dur, 0.25, 4);
  }

  /** Célesta et boîte à musique : timbres de métal, partiels inharmoniques */
  private bell(f: number, when: number, vel: number, dur: number, box: boolean) {
    this.osc("sine", f, this.hit(when, vel, dur, 0.003), when, when + dur);
    this.osc("sine", f * (box ? 3 : 2), this.hit(when, vel * 0.25, dur * 0.4, 0.003), when, when + dur);
    this.osc("sine", f * (box ? 6.1 : 5.4), this.hit(when, vel * 0.12, 0.15, 0.002), when, when + 0.2);
  }

  /** Flûte : sinus doux, vibrato qui arrive après l'attaque */
  private flute(f: number, when: number, vel: number, dur: number, resumed: boolean) {
    const out = this.hold(when, vel, dur, resumed);
    const a = this.osc("sine", f, out, when, when + dur, 0.85);
    const b = this.osc("triangle", f, out, when, when + dur, 0.15);
    this.lfo([a.detune, b.detune], 5, 9, when + 0.35, when + dur);
  }

  /** Cordes (ensemble, violoncelle, trémolo) : dents de scie désaccordées, filtre doux, vibrato */
  private strings(freqs: number[], when: number, vel: number, dur: number, resumed: boolean, kind: "ensemble" | "cello" | "tremolo") {
    let out: AudioNode = this.hold(when, vel, dur, resumed);
    if (kind === "tremolo") {
      const trem = this.ctx!.createGain();
      trem.gain.value = 0.6;
      trem.connect(out);
      this.lfo([trem.gain], 7.5, 0.4, when, when + dur);
      out = trem;
    }
    const tone = this.lowpass(kind === "cello" ? 650 : 1500, 0.6);
    tone.connect(out);
    const detunes: AudioParam[] = [];
    for (const f of freqs)
      for (const d of [-8, 8]) detunes.push(this.osc("sawtooth", f, tone, when, when + dur, 0.12, d).detune);
    this.lfo(detunes, kind === "cello" ? 4.5 : 5.2, 7, when, when + dur);
  }

  /** Chœur : dents de scie filtrées par les formants d'une voyelle */
  private choir(freqs: number[], when: number, vel: number, dur: number, resumed: boolean, vowel: "choirA" | "choirO") {
    const ctx = this.ctx!;
    const out = this.hold(when, vel, dur, resumed);
    const mix = ctx.createGain();
    for (const [freq, w] of VOWELS[vowel]) {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = freq;
      bp.Q.value = 5;
      const g = ctx.createGain();
      g.gain.value = w * 4;
      mix.connect(bp).connect(g).connect(out);
    }
    const detunes: AudioParam[] = [];
    for (const f of freqs) for (const d of [-6, 5]) detunes.push(this.osc("sawtooth", f, mix, when, when + dur, 0.1, d).detune);
    this.lfo(detunes, 4.8, 10, when, when + dur);
  }

  /** Battement sourd (timbale, cœur) : sinus grave qui chute */
  private pulse(when: number, vel: number) {
    const o = this.osc("sine", 110, this.hit(when, vel, 0.9, 0.003), when, when + 1);
    o.frequency.setValueAtTime(110, when);
    o.frequency.exponentialRampToValueAtTime(42, when + 0.35);
  }

  /** Vent : bruit filtré dont la bande dérive lentement */
  private wind(when: number, vel: number, dur: number, resumed: boolean) {
    const ctx = this.ctx!;
    const out = this.hold(when, vel, dur, resumed);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 650;
    bp.Q.value = 2.2;
    const g = ctx.createGain();
    g.gain.value = 2.5;
    this.noiseSource(when, when + dur).connect(bp).connect(g).connect(out);
    this.lfo([bp.frequency], 0.07 + Math.random() * 0.05, 380, when, when + dur);
  }

  /** Eau : bruit sourd qui ondule, et quelques bulles */
  private water(when: number, vel: number, dur: number, resumed: boolean) {
    const ctx = this.ctx!;
    const out = this.hold(when, vel, dur, resumed);
    const swell = ctx.createGain();
    swell.gain.value = 0.7;
    swell.connect(out);
    this.lfo([swell.gain], 0.16, 0.3, when, when + dur);
    this.noiseSource(when, when + dur).connect(this.lowpass(380, 0.7)).connect(swell);
    for (let i = 0; i < 3; i++) {
      const t = when + Math.random() * Math.max(0.5, dur - 1);
      const o = this.osc("sine", 500, this.hit(t, vel * 0.5, 0.12, 0.01), t, t + 0.15);
      o.frequency.setValueAtTime(400 + Math.random() * 300, t);
      o.frequency.exponentialRampToValueAtTime(1100 + Math.random() * 500, t + 0.1);
    }
  }

  /** Oiseau : deux ou trois gazouillis brefs */
  private bird(when: number, vel: number) {
    const count = 2 + Math.floor(Math.random() * 2);
    const base = 2400 + Math.random() * 900;
    for (let i = 0; i < count; i++) {
      const t = when + i * 0.13;
      const o = this.osc("sine", base, this.hit(t, vel, 0.1, 0.01), t, t + 0.12);
      o.frequency.setValueAtTime(base, t);
      o.frequency.exponentialRampToValueAtTime(base * 1.45, t + 0.07);
    }
  }

  /** Chant de baleine : glissement lent et grave */
  private whale(when: number, vel: number, dur: number, resumed: boolean) {
    const out = this.hold(when, vel, dur, resumed);
    const tone = this.lowpass(700, 2);
    tone.connect(out);
    const o = this.osc("triangle", 180, tone, when, when + dur);
    o.frequency.setValueAtTime(170, when);
    o.frequency.exponentialRampToValueAtTime(290, when + dur * 0.4);
    o.frequency.exponentialRampToValueAtTime(140, when + dur);
  }

  /** Joue une note de la partition ; `resumed` : son tenu repris au milieu */
  private sound(note: Note, when: number, dur: number, resumed = false) {
    const freqs = note.midi.map(hz);
    const v = note.vel;
    switch (note.inst) {
      case "piano":
        return freqs.forEach((f) => this.piano(f, when, v, dur));
      case "marimba":
        return freqs.forEach((f) => this.marimba(f, when, v));
      case "pluck":
        return freqs.forEach((f) => this.pluck(f, when, v, dur));
      case "harp":
        return freqs.forEach((f) => this.pluck(f, when, v, dur, 5));
      case "celesta":
        return freqs.forEach((f) => this.bell(f, when, v, dur, false));
      case "musicbox":
        return freqs.forEach((f) => this.bell(f, when, v, dur, true));
      case "flute":
        return freqs.forEach((f) => this.flute(f, when, v, dur, resumed));
      case "strings":
        return this.strings(freqs, when, v, dur, resumed, "ensemble");
      case "tremolo":
        return this.strings(freqs, when, v, dur, resumed, "tremolo");
      case "cello":
        return this.strings(freqs, when, v, dur, resumed, "cello");
      case "choirA":
      case "choirO":
        return this.choir(freqs, when, v, dur, resumed, note.inst);
      case "pulse":
        return this.pulse(when, v);
      case "wind":
        return this.wind(when, v, dur, resumed);
      case "water":
        return this.water(when, v, dur, resumed);
      case "bird":
        return this.bird(when, v);
      case "whale":
        return this.whale(when, v, dur, resumed);
    }
  }

  /**
   * Programme la mesure `bar` à partir de `from` secondes, pour qu'elle sonne à l'instant `start` (horloge audio),
   * puis la suivante, une seconde avant son tour. Les mesures s'enchaînent sur l'horloge audio, pas sur les minuteries :
   * une minuterie en retard (processeur occupé) ne décale ni ne tronque plus rien. Avant, chaque mesure partait 30 ms
   * après sa programmation ; sur un PC lent, ses premières notes démarraient « dans le passé » et claquaient.
   */
  private playBar(bar: number, from: number, start: number) {
    if (!this.playing || !this.ctx) return;
    const ctx = this.ctx;
    if (bar >= BARS) {
      // Fin du morceau : le suivant enchaîne, à la fin exacte de la dernière mesure
      this.timer = window.setTimeout(
        () => this.load((this.index + 1) % TRACKS.length, 0, true),
        Math.max(0, (start - ctx.currentTime) * 1000),
      );
      return;
    }
    // Minuterie très en retard (onglet ralenti) : on recale plutôt que de programmer des notes déjà passées
    const at = Math.max(start, ctx.currentTime + 0.05);
    for (const note of score(this.track, bar)) {
      if (note.at >= from) this.sound(note, at + note.at - from, note.dur);
      else if (SUSTAINED.has(note.inst) && note.at + note.dur > from + 0.6) this.sound(note, at, note.at + note.dur - from, true);
    }
    const next = at + BAR - from;
    this.timer = window.setTimeout(() => this.playBar(bar + 1, 0, next), Math.max(0, (next - LEAD - ctx.currentTime) * 1000));
  }

  /** Coupe la voix en cours (fondu court) et en ouvre une neuve */
  private freshVoice() {
    const ctx = this.ctx!;
    window.clearTimeout(this.timer);
    const old = this.voice;
    if (old) {
      old.gain.cancelScheduledValues(ctx.currentTime);
      old.gain.setValueAtTime(old.gain.value, ctx.currentTime);
      old.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
      window.setTimeout(() => old.disconnect(), 12000);
    }
    const v = ctx.createGain();
    v.connect(this.bus!);
    this.voice = v;
  }

  /** Lance la lecture à `position` dans le morceau courant */
  private run(position: number) {
    const ctx = this.ctx!;
    this.freshVoice();
    this.offset = Math.max(0, Math.min(TRACK_LENGTH - 0.1, position));
    // Départ légèrement différé : le temps de créer les sons de la première mesure sans en manquer l'attaque
    this.startedAt = ctx.currentTime + 0.12;
    const bar = Math.floor(this.offset / BAR);
    this.playBar(bar, this.offset - bar * BAR, this.startedAt);
  }

  /** Charge un morceau (et le joue si la lecture est en cours, ou si `play`) */
  private load(index: number, position = 0, play = this.playing) {
    this.index = (index + TRACKS.length) % TRACKS.length;
    this.offset = position;
    if (play && this.ctx && this.playing) this.run(position);
    else if (play) void this.play();
    this.emit();
  }

  async play() {
    // Contexte fermé par le système (longue veille) : on en recrée un
    if (!this.ctx || this.ctx.state === "closed") {
      this.ctx = null;
      this.voice = null;
      this.setup();
    }
    const ctx = this.ctx!;
    await ctx.resume();
    if (this.playing) return;
    this.playing = true;
    const g = this.master!.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(this.gainTarget, ctx.currentTime + 2);
    this.run(this.offset >= TRACK_LENGTH - 0.5 ? 0 : this.offset);
    this.emit();
  }

  pause() {
    if (!this.playing || !this.ctx) return;
    this.offset = this.position;
    this.playing = false;
    window.clearTimeout(this.timer);
    const ctx = this.ctx;
    const g = this.master!.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    window.setTimeout(() => {
      if (!this.playing) ctx.suspend();
    }, 1000);
    this.emit();
  }

  /** Niveau du son, compte tenu du volume choisi et de la coupure */
  private get gainTarget() {
    return this.muted ? 0 : VOLUME * this.volume ** 2;
  }

  /** Applique le volume en douceur si la musique joue */
  private applyVolume() {
    if (!this.playing || !this.ctx || !this.master) return;
    const g = this.master.gain;
    const t = this.ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(this.gainTarget, t + 0.15);
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    // Remonter le curseur rend le son ; le descendre à zéro revient à couper
    this.muted = this.volume === 0;
    this.applyVolume();
    this.emit();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.muted && this.volume === 0) this.volume = 0.5;
    this.applyVolume();
    this.emit();
  }

  toggle() {
    if (this.playing) this.pause();
    else void this.play();
  }

  /** Aller à une position (s) du morceau courant */
  seek(position: number) {
    if (this.playing && this.ctx) this.run(position);
    else this.offset = Math.max(0, Math.min(TRACK_LENGTH, position));
    this.emit();
  }

  next() {
    this.load(this.index + 1);
  }

  /** Comme un lecteur : au début du morceau, revient au précédent ; plus loin, revient au début */
  previous() {
    if (this.position > 3) this.seek(0);
    else this.load(this.index - 1);
  }

  select(index: number) {
    this.load(index);
  }

  /** Changement de zone : la playlist passe au morceau de la zone, s'il n'est pas déjà en cours */
  setStage(stage: StageId) {
    const i = TRACKS.findIndex((t) => t.stage === stage);
    if (i >= 0 && i !== this.index) this.load(i);
  }
}

/** Moteur unique, créé à la demande */
let engine: Ambient | null = null;
export const ambient = () => (engine ??= new Ambient());
