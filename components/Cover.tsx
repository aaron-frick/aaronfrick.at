import Image from "next/image";
import loeweNavy from "@/public/brand/loewe-navy.png";
import { LionParticles } from "./LionParticles";

/** Vor dem ersten Paint: Header ausblenden, solange das Cover im Bild ist. */
const coverScript = `document.documentElement.dataset.coverActive=""`;

/**
 * Startscreen: nur der Löwe, als Punktwolke. Folgt dem Farbschema.
 * Das Cover bleibt stehen (sticky); die Seite schiebt sich beim Scrollen
 * wie ein Vorhang darüber, die Punkte zerstreuen sich dabei.
 * Der gestochene Löwe liegt als schwacher Schatten darunter (Fallback ohne JS).
 */
export function Cover() {
  return (
    <section
      data-cover
      aria-label="Frick. – Aaron Frick, Software aus Vorarlberg"
      className="sticky top-0 -mt-16 h-svh overflow-hidden bg-bg text-fg"
    >
      <script dangerouslySetInnerHTML={{ __html: coverScript }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={loeweNavy}
          alt=""
          priority
          sizes="(min-width: 640px) 480px, 70vw"
          className="cover-ghost h-[66svh] w-auto max-w-[90vw] object-contain dark:invert"
        />
      </div>
      <LionParticles className="absolute inset-0 size-full" />
    </section>
  );
}
