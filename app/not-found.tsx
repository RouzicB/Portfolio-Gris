import Link from "next/link";

/** 404 — un monde resté gris */
export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-6 text-center" style={{ background: "linear-gradient(var(--sky-top), var(--sky-bottom))" }}>
      <div>
        <p className="label-spaced text-ink-soft">Erreur 404</p>
        <h1 className="title-spaced mt-4 text-3xl text-ink sm:text-5xl">Page égarée</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">Ce chemin ne mène nulle part. Le voyage principal, lui, vous attend.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-5 py-2.5 text-sm text-sky-top">
          Reprendre l&apos;aventure
        </Link>
      </div>
    </main>
  );
}
