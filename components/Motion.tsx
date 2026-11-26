"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Bewegung für die ganze Seite:
 * - [data-reveal]-Elemente blenden beim Hineinscrollen ein
 * - Scroll-Fortschritt des Covers (--p) und Header-Sichtbarkeit
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = "";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    document.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));

    // Nur ein sichtbares Cover zählt (versteckte Routen bleiben im DOM).
    const cover = [...document.querySelectorAll<HTMLElement>("[data-cover]")].find(
      (el) => el.offsetHeight > 0,
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!cover) {
        delete root.dataset.coverActive;
        return;
      }
      const p = Math.min(1, Math.max(0, window.scrollY / cover.offsetHeight));
      cover.style.setProperty("--p", p.toFixed(4));
      if (p < 0.85) root.dataset.coverActive = "";
      else delete root.dataset.coverActive;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
