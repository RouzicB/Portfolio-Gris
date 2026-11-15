/** Données structurées schema.org (invisibles) ; `<` est échappé pour ne jamais fermer la balise script */
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
