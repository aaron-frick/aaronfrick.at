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

/**
 * Zeitplan wie beim echten Schreiben: Jeder Strich bekommt einen Anteil am
 * Schreib-Fortschritt w proportional zu seiner Länge (lange Züge dauern
 * länger) und beginnt kurz bevor der vorherige fertig ist (OVERLAP).
 */
const OVERLAP = 0.35;
/** Bis hier (Scroll-Fortschritt) ist die Unterschrift vollständig geschrieben */
const WRITE_END = 0.88;
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
    const total = lengths.reduce((a, b) => a + b, 0);
    const slots: { start: number; span: number }[] = [];
    {
      let cursor = 0;
      lengths.forEach((len) => {
        const span = len / total;
        slots.push({ start: cursor, span });
        cursor += span;
      });
      // leicht überlappen, auf [0, 1] normieren
      const last = slots[slots.length - 1];
      const end = last.start + last.span * (1 + OVERLAP);
      slots.forEach((s) => {
        s.start /= end;
        s.span = (s.span * (1 + OVERLAP)) / end;
      });
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 1;
      const w = Math.min(1, p / WRITE_END);
      els.forEach((el, i) => {
        const local = Math.min(1, Math.max(0, (w - slots[i].start) / slots[i].span));
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
          className="h-auto w-[min(480px,76vw)] overflow-visible"
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
        <div className="signature-mark mt-10 flex items-center gap-4 sm:mt-12">
          <Lion className="h-11 w-auto sm:h-14" />
          <span className="text-xl font-semibold tracking-[0.15em] uppercase sm:text-2xl">
            {name}
          </span>
        </div>
      </div>
    </section>
  );
}
