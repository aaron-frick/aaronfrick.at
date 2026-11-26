import Image from "next/image";
import loeweHell from "@/public/brand/loewe-hell.png";
import loeweNavy from "@/public/brand/loewe-navy.png";

/**
 * Der gestochene Löwe im Startscreen.
 *
 * Intro „Gravur“ (nur mit :root[data-intro], siehe globals.css):
 * 1. Ein leuchtender Laserstrich zieht sich von der Mitte aus auf.
 * 2. Er fährt von unten nach oben – darunter erscheint der Löwe, als würde
 *    er eingraviert (aus der Unschärfe, leicht heranzoomend).
 * 3. Oben verglüht der Strich, ein metallischer Glanz läuft über die Linien.
 */
export function CoverLion() {
  return (
    <div className="lion-intro relative">
      <div className="lion-art">
        <Image
          src={loeweNavy}
          alt=""
          priority
          sizes="(min-width: 640px) 520px, 75vw"
          className="h-[62svh] w-auto max-w-[80vw] object-contain dark:hidden"
        />
        {/* Dunkle Variante nur bei Bedarf laden (versteckte Bilder lädt der Browser nicht) */}
        <Image
          src={loeweHell}
          alt=""
          sizes="(min-width: 640px) 520px, 75vw"
          className="hidden h-[62svh] w-auto max-w-[80vw] object-contain dark:block"
        />
      </div>
      <span aria-hidden="true" className="lion-shine" />
      <span aria-hidden="true" className="lion-scan-track">
        <span className="lion-scan" />
      </span>
    </div>
  );
}
