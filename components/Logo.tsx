import Image from "next/image";
import loeweHell from "@/public/brand/loewe-hell.png";
import loeweNavy from "@/public/brand/loewe-navy.png";

/** Wortmarke „Frick.“ – Inter Bold, Punkt im Akzent. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      Frick<span className="text-accent">.</span>
    </span>
  );
}

/** Gestochener Löwe, passend zum Farbschema. */
export function Lion({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={loeweNavy}
        alt=""
        priority={priority}
        sizes="64px"
        className={`dark:hidden ${className}`}
      />
      <Image
        src={loeweHell}
        alt=""
        priority={priority}
        sizes="64px"
        className={`hidden dark:block ${className}`}
      />
    </>
  );
}

/** Lockup: Löwe · Haarlinie · Wortmarke (Guidelines S. 04). */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-3">
      <Lion className="h-9 w-auto" />
      <span className="h-7 w-px bg-line" aria-hidden="true" />
      <Wordmark className="text-2xl leading-none" />
    </span>
  );
}
