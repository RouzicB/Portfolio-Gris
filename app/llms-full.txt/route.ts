import { portfolioMarkdown } from "../lib/machine-readable";

/** Le portfolio complet en texte : chaque étude de cas en détail (démarche, univers graphique, écrans, résultats) */
export const dynamic = "force-static";

export function GET() {
  return new Response(portfolioMarkdown(true), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
