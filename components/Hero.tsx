import Link from "next/link";

/** Hero direkt unter dem Cover. Zeilen blenden beim Hineinscrollen nacheinander ein. */
export function Hero() {
  return (
    <section
      id="start"
      aria-labelledby="hero-title"
      className="mx-auto flex min-h-[85svh] max-w-page flex-col justify-center px-gutter py-28"
    >
      <h1 id="hero-title" className="max-w-[14ch] text-display font-bold text-balance">
        <span data-reveal className="block">
          Klein aufgestellt,
        </span>
        <em data-reveal className="block font-semibold text-accent [--reveal-delay:140ms]">
          aber verbindlich.
        </em>
      </h1>
      <p
        data-reveal
        className="mt-8 max-w-prose text-lg text-pretty text-muted [--reveal-delay:280ms] sm:text-xl"
      >
        Beratung, Projektbegleitung und Organisation in Vorarlberg. Eine Ansprechperson. Jede Zusage
        mit Datum.
      </p>
      <div data-reveal className="mt-10 [--reveal-delay:400ms]">
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
    </section>
  );
}
