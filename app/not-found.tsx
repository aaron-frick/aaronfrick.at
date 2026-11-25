import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-page flex-col justify-center px-gutter py-24">
      <p className="label text-accent">Fehler 404</p>
      <h1 className="mt-8 max-w-[16ch] text-display font-bold text-balance">
        Diese Seite gibt es nicht,{" "}
        <em className="font-semibold text-accent">die Startseite schon.</em>
      </h1>
      <div className="mt-12">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 border-b-2 border-fg pb-1 font-semibold transition-colors hover:border-accent hover:text-accent"
        >
          <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Zur Startseite
        </Link>
      </div>
    </section>
  );
}
