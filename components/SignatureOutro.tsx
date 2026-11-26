"use client";

import { useEffect, useRef } from "react";
import { signature } from "@/lib/signature";
import { Lion } from "./Logo";

type Props = {
  /** Mittellinien in Schreibreihenfolge (je ein durchgehender Strich) */
  paths?: readonly string[];
  viewBox?: string;
  /** Firmenname unter der Unterschrift (wird in Versalien gesetzt) */
  name?: string;
};

/**
 * Zeitplan wie beim echten Schreiben: Jeder Strich bekommt einen Anteil am
 * Schreib-Fortschritt w proportional zu seiner Länge (lange Züge dauern
 * länger) und beginnt knapp bevor der vorherige fertig ist (OVERLAP).
 */
const OVERLAP = 0.06;
/**
 * Nachgleiten der Feder: Pro Frame holt der Schreibstand diesen Anteil des
 * Abstands zum Scroll-Ziel auf – ruckelfreies, flüssiges Schreiben.
 */
const GLIDE = 0.09;
/** Bis hier (Scroll-Fortschritt) ist die Unterschrift vollständig geschrieben */
const WRITE_END = 0.75;
/** Ab hier erscheinen Logo und Name */
const SHOW_MARK = 0.78;

/**
 * Stiftdruck wie bei einer schnell geschriebenen Unterschrift (Kugelschreiber
 * / Fineliner): Abstriche etwas kräftiger, Aufstriche etwas feiner, Anfang und
 * Ende jedes Zugs laufen dünn aus. Werte in viewBox-Einheiten (480 ≈ 480 px).
 */
const PEN = {
  hair: 2.1, // Aufstrich
  thick: 3.8, // Abstrich (voller Druck)
  slant: 20, // Schriftlage in Grad
  power: 1, // wie schnell der Druck zunimmt
  smooth: 8, // Glättung des Druckverlaufs (Samples)
  taper: 16, // Länge der auslaufenden Enden
  min: 0.5, // Breite an den Enden
  step: 0.7, // Abtastabstand
  reveal: 7, // Breite des „Schreibkopfs“ (Maske)
};

type Pt = [number, number];

/** Kontur eines Strichs mit druckabhängiger Breite aus seiner Mittellinie. */
function penOutline(el: SVGPathElement): string {
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
  let W = T.map(
    ([tx, ty]) =>
      PEN.hair +
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
  // Auslaufende Enden (Stift setzt auf und hebt ab)
  W = W.map((w, i) => {
    const s = (L * i) / n;
    const f = Math.min(1, s / PEN.taper, (L - s) / PEN.taper);
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
  viewBox = signature.viewBox,
  name = "Frick",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const strokes = paths;

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    const guides = [...svg.querySelectorAll<SVGPathElement>("[data-guide]")];
    const inks = [...svg.querySelectorAll<SVGPathElement>("[data-ink]")];
    guides.forEach((g, i) => inks[i].setAttribute("d", penOutline(g)));
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
    const draw = (w: number) => {
      guides.forEach((el, i) => {
        const local = Math.min(1, Math.max(0, (w - slots[i].start) / slots[i].span));
        el.style.strokeDashoffset = `${lengths[i] * (1 - local)}`;
      });
    };
    const target = () => {
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 1;
      if (p > SHOW_MARK) section.dataset.done = "";
      else delete section.dataset.done;
      return Math.min(1, p / WRITE_END);
    };

    let frame = 0;
    let goal = target();
    let current = goal;
    const tick = () => {
      const diff = goal - current;
      current = Math.abs(diff) < 0.0005 ? goal : current + diff * GLIDE;
      draw(current);
      frame = current === goal ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      goal = target();
      if (!frame) frame = requestAnimationFrame(tick);
    };
    draw(current);
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
        >
          <defs>
            <mask
              id="signature-mask"
              maskUnits="userSpaceOnUse"
              x="-20"
              y="-20"
              width="520"
              height="220"
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
