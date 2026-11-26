import { CoverLion } from "./CoverLion";

/** Vor dem ersten Paint: Header ausblenden, solange das Cover im Bild ist. */
const coverScript = `document.documentElement.dataset.coverActive=""`;

/**
 * Startscreen: nur der gestochene Löwe (Standardlogo), folgt dem Farbschema.
 * Das Cover bleibt stehen (sticky); beim Scrollen hebt sich der Löwe leicht
 * und blendet aus, die Seite schiebt sich weich darüber.
 */
export function Cover() {
  return (
    <section
      data-cover
      aria-label="Frick. – Aaron Frick, Software aus Vorarlberg"
      className="sticky top-0 -mt-16 h-svh overflow-hidden bg-bg text-fg"
    >
      <script dangerouslySetInnerHTML={{ __html: coverScript }} />
      <div className="cover-inner flex h-full items-center justify-center">
        <CoverLion />
      </div>
    </section>
  );
}
