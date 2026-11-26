import Image from "next/image";
import type { CSSProperties } from "react";
import loeweHell from "@/public/brand/loewe-hell.png";

/** Vor dem ersten Paint: Header ausblenden, solange das Cover im Bild ist. */
const coverScript = `document.documentElement.dataset.coverActive=""`;

const letters = ["F", "r", "i", "c", "k"];

/**
 * Startscreen: Navy-Fläche mit Löwe und „Frick.“. Der Löwe baut sich von unten
 * auf, die Buchstaben steigen nacheinander auf. Das Cover bleibt stehen (sticky);
 * die Seite schiebt sich beim Scrollen wie ein Vorhang darüber.
 */
export function Cover() {
  return (
    <section
      data-cover
      aria-label="Frick. – Aaron Frick, Feldkirch"
      className="dark sticky top-0 -mt-16 h-svh overflow-hidden bg-bg text-fg"
    >
      <script dangerouslySetInnerHTML={{ __html: coverScript }} />
      <div className="cover-inner flex h-full flex-col items-center justify-center">
        <Image
          src={loeweHell}
          alt=""
          priority
          sizes="(min-width: 640px) 208px, 160px"
          className="cover-lion h-48 w-auto sm:h-60"
        />
        <p className="mt-10 flex overflow-hidden pb-1 text-5xl font-bold tracking-tight sm:text-6xl">
          <span className="sr-only">Frick.</span>
          {letters.map((l, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="cover-letter inline-block"
              style={{ "--i": i } as CSSProperties}
            >
              {l}
            </span>
          ))}
          <span
            aria-hidden="true"
            className="cover-letter inline-block text-accent"
            style={{ "--i": letters.length } as CSSProperties}
          >
            .
          </span>
        </p>
      </div>
    </section>
  );
}
