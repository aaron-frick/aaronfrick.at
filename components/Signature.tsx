"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { signature } from "@/lib/signature";

/**
 * Unterschrift + Wortmarke fürs Outro. Sobald der Bereich sichtbar wird,
 * „schreibt“ sich die Unterschrift von links nach rechts, danach steigt
 * die Wortmarke auf. Ablauf per CSS (.outro-*), hier nur der Auslöser.
 */
export function SignatureReveal({ children }: { children: ReactNode }) {
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
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="outro flex flex-col items-center">
      <svg
        viewBox={`0 0 ${signature.width} ${signature.height}`}
        role="img"
        aria-label="Unterschrift Aaron Frick"
        className="outro-signature h-auto w-[min(36rem,80vw)] fill-current text-fg"
      >
        <path d={signature.d} />
      </svg>
      <div className="outro-word mt-10">{children}</div>
    </div>
  );
}
