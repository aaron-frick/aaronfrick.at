import Link from "next/link";

/**
 * Hero. Die Zeilen steigen nacheinander auf, nachdem das Intro abgelaufen ist
 * (Verzögerung über --intro-delay, siehe globals.css).
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto flex min-h-[calc(100svh-4.25rem)] max-w-page flex-col justify-between px-gutter pt-10 pb-10"
    >
      <div className="flex flex-1 flex-col justify-center py-16">
        <h1 id="hero-title" className="max-w-[14ch] text-display font-bold text-balance">
          <span className="block motion-safe:rise-0">Klein aufgestellt,</span>
          <em className="block font-semibold text-accent motion-safe:rise-120">
            aber verbindlich.
          </em>
        </h1>
        <p className="mt-8 max-w-prose text-lg text-pretty text-muted motion-safe:rise-260 sm:text-xl">
          Beratung, Projektbegleitung und Organisation in Vorarlberg. Eine Ansprechperson. Jede
          Zusage mit Datum.
        </p>
        <div className="mt-10 motion-safe:rise-360">
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

      <div className="flex justify-end border-t border-line pt-6 motion-safe:rise-480">
        <a
          href="#ansatz"
          className="flex flex-col items-center gap-3 text-muted transition-colors hover:text-fg"
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
