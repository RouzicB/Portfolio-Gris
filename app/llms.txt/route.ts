import { portfolioMarkdown } from "../lib/machine-readable";

/** Le portfolio en texte, pour les assistants et agents IA (convention llms.txt) ; généré au build */
export const dynamic = "force-static";

export function GET() {
  return new Response(portfolioMarkdown(false), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
