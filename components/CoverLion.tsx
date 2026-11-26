import Image from "next/image";
import loeweHell from "@/public/brand/loewe-hell.png";
import loeweNavy from "@/public/brand/loewe-navy.png";

/**
 * Der gestochene Löwe im Startscreen. Beim Aufruf der Seite wird er wie ein
 * Kupferstich von unten nach oben „aufgedruckt“ (siehe .lion-intro).
 */
export function CoverLion() {
  return (
    <div className="lion-intro relative">
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
  );
}
