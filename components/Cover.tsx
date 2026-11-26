import Image from "next/image";
import loeweHell from "@/public/brand/loewe-hell.png";
import { Wordmark } from "./Logo";

/** Vor dem ersten Paint: Header ausblenden, solange das Cover im Bild ist. */
const coverScript = `document.documentElement.dataset.coverActive=""`;

/**
 * Startscreen: Navy-Fläche mit Löwe und „Frick.“. Blendet sanft ein und bleibt
 * stehen. Beim Scrollen gleitet der Inhalt mit leichtem Parallax weg
 * (--p = Scroll-Fortschritt 0–1, gesetzt von components/Motion.tsx).
 */
export function Cover() {
  return (
    <section
      data-cover
      aria-label="Frick. – Aaron Frick, Feldkirch"
      className="dark relative -mt-17 h-svh overflow-hidden bg-bg text-fg"
    >
      <script dangerouslySetInnerHTML={{ __html: coverScript }} />
      <span
        aria-hidden="true"
        className="cover-bar absolute inset-x-0 top-0 block h-1 origin-left bg-accent"
      />
      <div className="cover-inner flex h-full flex-col items-center justify-center">
        <Image
          src={loeweHell}
          alt=""
          priority
          sizes="(min-width: 640px) 208px, 160px"
          className="cover-lion h-48 w-auto sm:h-60"
        />
        <span className="cover-word mt-10 block text-5xl sm:text-6xl">
          <Wordmark />
        </span>
      </div>
      <a
        href="#start"
        className="cover-hint absolute inset-x-0 bottom-8 mx-auto flex w-max flex-col items-center gap-3 text-muted transition-colors hover:text-fg"
      >
        <span className="label">Scrollen</span>
        <span aria-hidden="true" className="relative block h-10 w-px bg-line">
          <span className="absolute inset-0 block bg-fg motion-safe:animate-scroll-hint" />
        </span>
      </a>
    </section>
  );
}
