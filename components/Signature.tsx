"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { signature } from "@/lib/signature";

/**
 * Outro-Ablauf: Sobald der Bereich sichtbar wird, „schreibt“ sich die
 * Unterschrift von links nach rechts, danach steigt die Wortmarke auf und
 * anschließend der Inhalt aus `after` (Kontakt). Ablauf per CSS (.outro-*).
 */
export function SignatureReveal({ children, after }: { children: ReactNode; after?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.dataset.shown = "";
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="outro flex w-full flex-col items-center">
      <svg
        viewBox={`0 0 ${signature.width} ${signature.height}`}
        role="img"
        aria-label="Unterschrift Aaron Frick"
        className="outro-signature h-auto w-[min(34rem,78vw)] fill-current text-fg"
      >
        <path d={signature.d} />
      </svg>
      <div className="outro-word mt-8">{children}</div>
      {after ? <div className="outro-after w-full">{after}</div> : null}
    </div>
  );
}
