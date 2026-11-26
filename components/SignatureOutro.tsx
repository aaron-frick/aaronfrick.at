"use client";

import { useEffect, useRef } from "react";
import { signature } from "@/lib/signature";
import { Lion } from "./Logo";

type Props = {
  /** Mittellinien in Schreibreihenfolge (je ein durchgehender Strich) */
  paths?: readonly string[];
  /** Abschließender Unterstrich (wird zuletzt gezogen) */
  swash?: string;
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
const WRITE_END = 0.75;
/** Ab hier erscheinen Logo und Name */
const SHOW_MARK = 0.78;

/**
 * Spitzfeder (Copperplate): Abstriche entlang der Schriftlage werden breit,
 * Aufstriche und Querzüge bleiben haarfein, Strichenden laufen spitz aus.
 * Werte in viewBox-Einheiten (480 breit ≈ 480 px).
 */
const PEN = {
  hair: 1.05, // Haarstrich
  thick: 5.6, // Schattenstrich (voller Druck)
  slant: 14, // Schriftlage in Grad
  power: 1.4, // wie schnell der Druck zunimmt
  smooth: 4, // Glättung des Druckverlaufs (Samples)
  taper: 8, // Länge der spitzen Enden
  min: 0.5, // Breite an den Spitzen
  step: 0.7, // Abtastabstand
  swash: 2.2, // Stärke des Unterstrichs
  reveal: 8, // Breite des „Schreibkopfs“ (Maske)
};

type Pt = [number, number];

/** Kontur eines Strichs mit druckabhängiger Breite aus seiner Mittellinie. */
function penOutline(el: SVGPathElement, isSwash: boolean): string {
  const L = el.getTotalLength();
  const n = Math.max(2, Math.ceil(L / PEN.step));
  const P: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const q = el.getPointAtLength((L * i) / n);
    P.push([q.x, q.y]);
  }
  const a = (PEN.slant * Math.PI) / 180;
  const down: Pt = [-Math.sin(a), Math.cos(a)];
  const T: Pt[] = P.map((_, i) => {
    const p0 = P[Math.max(0, i - 1)];
    const p1 = P[Math.min(n, i + 1)];
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  });
  let W = T.map(([tx, ty]) =>
    isSwash
      ? PEN.swash
      : PEN.hair +
        (PEN.thick - PEN.hair) * Math.pow(Math.max(0, tx * down[0] + ty * down[1]), PEN.power),
  );
  W = W.map((_, i) => {
    let s = 0;
    let c = 0;
    for (let k = -PEN.smooth; k <= PEN.smooth; k++) {
      const j = i + k;
      if (j >= 0 && j <= n) {
        s += W[j];
        c++;
      }
    }
    return s / c;
  });
  // Spitze Enden; der Unterstrich schwillt lang an und läuft lang aus.
  const inLen = isSwash ? L * 0.45 : PEN.taper;
  const outLen = isSwash ? L * 0.2 : PEN.taper;
  W = W.map((w, i) => {
    const s = (L * i) / n;
    const f = Math.min(1, s / inLen, (L - s) / outLen);
    return PEN.min + (w - PEN.min) * f * f * (3 - 2 * f);
  });
  const fmt = (p: Pt) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  const left = P.map((p, i): Pt => [p[0] - (T[i][1] * W[i]) / 2, p[1] + (T[i][0] * W[i]) / 2]);
  const right = P.map((p, i): Pt => [p[0] + (T[i][1] * W[i]) / 2, p[1] - (T[i][0] * W[i]) / 2]);
  return `M${left.map(fmt).join("L")}L${right.reverse().map(fmt).join("L")}Z`;
}

/**
 * Scrollgesteuerte Unterschrift als Abschluss der Seite.
 *
 * Die Sektion ist ca. 240vh hoch; darin bleibt eine Fläche (sticky, 100vh)
 * in der Bildschirmmitte stehen. Der Scroll-Fortschritt p (0 = Sticky beginnt,
 * 1 = Ende der Sektion) „schreibt“ die Unterschrift – rein an die
 * Scrollposition gekoppelt, vollständig umkehrbar, keine Zeitanimation.
 *
 * Technik: Die Spitzfeder-Konturen (Flächen) werden aus den Mittellinien
 * berechnet und durch eine Maske sichtbar, in der die Mittellinien per
 * stroke-dashoffset „geschrieben“ werden.
 * Bei p > SHOW_MARK erscheinen Logo und Name (CSS-Transition 400 ms).
 *
 * Pfade ersetzen: siehe lib/signature.ts.
 */
export function SignatureOutro({
  paths = signature.paths,
  swash = signature.swash,
  viewBox = signature.viewBox,
  name = "Frick",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const strokes = [...paths, swash];

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    const guides = [...svg.querySelectorAll<SVGPathElement>("[data-guide]")];
    const inks = [...svg.querySelectorAll<SVGPathElement>("[data-ink]")];
    guides.forEach((g, i) => inks[i].setAttribute("d", penOutline(g, i === guides.length - 1)));
    // Längen einmalig messen – in viewBox-Einheiten, daher unabhängig von Resize.
    const lengths = guides.map((el) => el.getTotalLength());
    guides.forEach((el, i) => (el.style.strokeDasharray = `${lengths[i]}`));
    section.dataset.inked = "";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      guides.forEach((el) => (el.style.strokeDashoffset = "0"));
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
      guides.forEach((el, i) => {
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
  }, [paths, swash]);

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
        >
          <defs>
            <mask
              id="signature-mask"
              maskUnits="userSpaceOnUse"
              x="-20"
              y="-20"
              width="520"
              height="160"
            >
              <g
                fill="none"
                stroke="#fff"
                strokeWidth={PEN.reveal}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {strokes.map((d, i) => (
                  <path key={i} d={d} data-guide="" />
                ))}
              </g>
            </mask>
          </defs>
          <g fill="currentColor" mask="url(#signature-mask)">
            {strokes.map((_, i) => (
              <path key={i} data-ink="" />
            ))}
          </g>
          {/* Ohne JavaScript: einfache Linienfassung */}
          <g
            className="signature-fallback"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {strokes.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
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
