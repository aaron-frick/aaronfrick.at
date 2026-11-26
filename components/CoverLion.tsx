"use client";

import Image from "next/image";
import { useRef } from "react";
import loeweHell from "@/public/brand/loewe-hell.png";
import loeweNavy from "@/public/brand/loewe-navy.png";

/**
 * Der gestochene Löwe im Startscreen. Beim Darüberfahren folgt ein kleiner
 * Lichtkegel dem Zeiger – er liegt als Maske auf den Linien des Löwen, der
 * Hintergrund bleibt unberührt. Nichts bewegt sich.
 */
export function CoverLion() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} onPointerMove={onMove} className="cover-lion relative">
      <Image
        src={loeweNavy}
        alt=""
        priority
        sizes="(min-width: 640px) 520px, 75vw"
        className="h-[62svh] w-auto max-w-[80vw] object-contain dark:hidden"
      />
      <Image
        src={loeweHell}
        alt=""
        priority
        sizes="(min-width: 640px) 520px, 75vw"
        className="hidden h-[62svh] w-auto max-w-[80vw] object-contain dark:block"
      />
      <span aria-hidden="true" className="cover-lion-glow absolute inset-0" />
    </div>
  );
}
