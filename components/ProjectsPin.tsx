"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projects";

/**
 * Projekte · Auswahl als gepinnte Sequenz: Der Abschnitt bleibt stehen, ein
 * Projekt nach dem anderen wird beim Scrollen scharf und zieht beim
 * Weiterscrollen unscharf nach oben weg.
 * Ohne JavaScript oder bei „Bewegung reduzieren“: normale Liste.
 */
export function ProjectsPin({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = itemRefs.current.slice();
    const n = projects.length;
    section.dataset.pin = "";
    // ca. 1,2 Bildschirmhöhen Scrollweg pro Projekt + Ein-/Auslauf
    section.style.height = `${n * 120 + 100}svh`;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / range));
      const pos = progress * n; // 0 … n
      let active = 0;
      items.forEach((el, i) => {
        if (!el) return;
        const t = pos - (i + 0.5); // <0: kommt, 0: Mitte, >0: geht
        const d = Math.abs(t);
        // Langes Plateau: das Projekt steht ruhig und scharf in der Mitte.
        // Erst danach ein schneller „Wusch“: unscharf + Versatz nach oben/unten.
        const fade = Math.max(0, d - 0.3) / 0.2; // 0 … 1 zwischen d = 0.3 und 0.5
        const f = Math.min(1, fade);
        const opacity = 1 - f;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = `blur(${(f * 14).toFixed(2)}px)`;
        el.style.transform = `translate3d(0, ${(-Math.sign(t) * f * f * 18).toFixed(2)}vh, 0)`;
        el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
        if (d < 0.5) active = i;
      });
      if (counterRef.current) {
        counterRef.current.textContent = `${String(active + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
      }
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
      section.style.height = "";
      items.forEach((el) => el?.removeAttribute("style"));
    };
  }, [projects.length]);

  return (
    <section
      ref={sectionRef}
      id="projekte"
      aria-labelledby="projekte-label"
      className="pin-section relative"
    >
      <div className="pin-stage mx-auto max-w-page px-gutter">
        <div className="pin-head flex items-baseline justify-between">
          <h2 id="projekte-label" className="label text-accent">
            Projekte · Auswahl
          </h2>
          <span
            ref={counterRef}
            aria-hidden="true"
            className="pin-counter label text-muted tabular-nums"
          />
        </div>
        <ol className="pin-list">
          {projects.map((p, i) => (
            <li
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="pin-item"
            >
              <p className="label text-muted">Projekt</p>
              <h3 className="mt-5 text-5xl font-bold tracking-tight text-balance sm:text-7xl">
                {p.name}
              </h3>
              <p className="mt-4 font-medium text-accent">{p.meta}</p>
              <p className="mx-auto mt-6 max-w-prose text-muted">{p.text}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener"
                className="group mt-8 inline-flex items-center gap-2 border-b border-fg pb-0.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                {p.url.replace("https://", "")}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
