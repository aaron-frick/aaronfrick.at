"use client";

import { useEffect, useRef } from "react";
import { signature } from "@/lib/signature";
import { Lion } from "./Logo";

type Props = {
  /** Pfade in Schreibreihenfolge (je ein durchgehender Strich) */
  paths?: readonly string[];
  viewBox?: string;
  /** Firmenname unter der Unterschrift (wird in Versalien gesetzt) */
  name?: string;
};

/** Pfad i läuft im globalen Fortschritt [i · STAGGER, i · STAGGER + SPAN]. */
const STAGGER = 0.1;
const SPAN = 0.6;
/** Ab hier erscheinen Logo und Name */
const SHOW_MARK = 0.9;

/**
 * Scrollgesteuerte Unterschrift als Abschluss der Seite.
 *
 * Die Sektion ist ca. 240vh hoch; darin bleibt eine Fläche (sticky, 100vh)
 * in der Bildschirmmitte stehen. Der Scroll-Fortschritt p (0 = Sticky beginnt,
 * 1 = Ende der Sektion) „schreibt“ die Pfade per stroke-dashoffset – rein an
 * die Scrollposition gekoppelt, vollständig umkehrbar, keine Zeitanimation.
 * Bei p > 0.9 erscheinen Logo und Name (CSS-Transition 400 ms).
 *
 * Pfade ersetzen: siehe lib/signature.ts.
 */
export function SignatureOutro({
  paths = signature.paths,
  viewBox = signature.viewBox,
  name = "Frick",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    const els = [...svg.querySelectorAll<SVGPathElement>("path")];
    // Längen einmalig messen – in viewBox-Einheiten, daher unabhängig von Resize.
    const lengths = els.map((el) => el.getTotalLength());
    els.forEach((el, i) => {
      el.style.strokeDasharray = `${lengths[i]}`;
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => (el.style.strokeDashoffset = "0"));
      section.dataset.done = "";
      return;
    }

    section.dataset.ready = "";
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 1;
      els.forEach((el, i) => {
        const local = Math.min(1, Math.max(0, (p - i * STAGGER) / SPAN));
        el.style.strokeDashoffset = `${lengths[i] * (1 - local)}`;
      });
      if (p > SHOW_MARK) section.dataset.done = "";
      else delete section.dataset.done;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [paths]);

  return (
    <section
      ref={sectionRef}
      aria-label="Unterschrift"
      className="signature-outro relative h-[240svh] bg-outro-bg text-outro-ink"
    >
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={viewBox}
          role="img"
          aria-label="Unterschrift Aaron Frick"
          className="h-auto w-[min(580px,80vw)] overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
        <div className="signature-mark mt-7 flex items-center gap-3">
          <Lion className="h-5 w-auto" />
          <span className="text-[0.8125rem] font-semibold tracking-[0.15em] uppercase">{name}</span>
        </div>
      </div>
    </section>
  );
}
