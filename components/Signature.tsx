"use client";

import { useEffect, useRef } from "react";
import { signature } from "@/lib/signature";
import { Lion, Wordmark } from "./Logo";

/**
 * Outro: Der Abschnitt bleibt stehen, die Unterschrift schreibt sich über die
 * ganze Breite – gekoppelt an das Scrollen. Am Ende erscheinen darunter Löwe
 * und „Frick.“. Bei „Bewegung reduzieren“ oder ohne JS: fertig geschrieben.
 */
/** Einzelne Striche: das Strichmuster beginnt in SVG je Teilpfad neu. */
const strokes = signature.d.split(/(?=M)/).filter(Boolean);

export function SignatureOutro() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    const mark = markRef.current;
    if (!section || !svg || !mark) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Striche nacheinander, gewichtet nach echter Länge
    const paths = [...svg.querySelectorAll<SVGPathElement>(".sig-path")];
    const lengths = paths.map((p) => p.getTotalLength());
    const total = lengths.reduce((a, b) => a + b, 0);
    const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));

    section.dataset.pin = "";
    let frame = 0;
    const update = () => {
      frame = 0;
      const range = section.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range));
      const write = Math.min(1, p / 0.72);
      const show = Math.min(1, Math.max(0, (p - 0.74) / 0.16));
      const done = write * total;
      paths.forEach((p, i) => {
        const local = Math.min(1, Math.max(0, (done - starts[i]) / lengths[i]));
        p.style.strokeDashoffset = (1 - local).toFixed(4);
      });
      mark.style.opacity = show.toFixed(3);
      mark.style.transform = `translate3d(0, ${((1 - show) * 1.25).toFixed(3)}rem, 0)`;
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
      delete section.dataset.pin;
      paths.forEach((p) => (p.style.strokeDashoffset = ""));
      mark.removeAttribute("style");
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="Unterschrift" className="sig-section relative">
      <div className="sig-stage flex flex-col items-center justify-center px-gutter">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${signature.width} ${signature.height}`}
          role="img"
          aria-label="Unterschrift Aaron Frick"
          className="h-auto w-full max-w-[min(94vw,110rem)] text-fg"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth={signature.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {strokes.map((d, i) => (
              <path key={i} d={d} pathLength={1} className="sig-path" />
            ))}
          </g>
        </svg>
        <div ref={markRef} className="sig-mark mt-12 flex items-center gap-4 sm:mt-16">
          <Lion className="h-12 w-auto sm:h-16" />
          <span aria-hidden="true" className="h-10 w-px bg-line sm:h-12" />
          <Wordmark className="text-4xl leading-none sm:text-5xl" />
        </div>
      </div>
    </section>
  );
}
