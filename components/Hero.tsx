import Link from "next/link";
import { LiveStatus } from "./LiveStatus";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-page flex-col justify-between px-gutter pt-16 pb-10 sm:pt-24"
    >
      <p className="label text-accent motion-safe:animate-rise">
        Aaron Frick · Feldkirch, Vorarlberg
      </p>

      <div className="py-16">
        <h1 id="hero-title" className="max-w-[14ch] text-display font-bold text-balance">
          Klein aufgestellt, <em className="font-semibold text-accent">aber verbindlich.</em>
        </h1>
        <p className="mt-8 max-w-prose text-lg text-pretty text-muted motion-safe:animate-rise motion-safe:[animation-delay:160ms] sm:text-xl">
          Beratung, Projektbegleitung und Organisation in Vorarlberg. Eine Ansprechperson. Jede
          Zusage mit Datum.
        </p>
        <div className="mt-10 motion-safe:animate-rise motion-safe:[animation-delay:240ms]">
          <Link
            href="/#kontakt"
            className="group inline-flex items-center gap-3 border-b-2 border-fg pb-1 font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            Projekt besprechen
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            >
              →
            </span>
          </Link>
        </div>
      </div>

      <div className="flex items-end justify-between gap-8 border-t border-line pt-6 motion-safe:animate-rise motion-safe:[animation-delay:320ms]">
        <LiveStatus />
        <a
          href="#ansatz"
          className="hidden shrink-0 flex-col items-center gap-3 text-muted transition-colors hover:text-fg sm:flex"
        >
          <span className="label">Scrollen</span>
          <span aria-hidden="true" className="relative block h-10 w-px bg-line">
            <span className="absolute inset-0 block bg-fg motion-safe:animate-scroll-hint" />
          </span>
        </a>
      </div>
    </section>
  );
}
