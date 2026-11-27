"use client";

import { useLayoutEffect } from "react";

/** Ohne sanftes Scrollen (html { scroll-behavior: smooth }) springen. */
function jump(fn: () => void) {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  fn();
  html.style.scrollBehavior = prev;
}

/**
 * Startseite immer von ganz oben beginnen – beim Neuladen und beim Zurückgehen
 * von Impressum/Datenschutz –, damit Löwen-Intro und Scroll-Animationen von
 * vorne laufen. Sprungziele wie /#kontakt werden angesprungen.
 *
 * Läuft bei jedem Anzeigen der Startseite: Next.js hält besuchte Seiten im
 * Hintergrund vor und hängt sie beim Zurückkehren wieder ein, dabei laufen
 * die Effekte erneut.
 */
export function ScrollToTop() {
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const timers: number[] = [];

    // Löwen-Intro neu starten (bei einer vorgehaltenen Seite ist es schon
    // gelaufen): Klasse kurz entfernen, sobald die Seite wieder sichtbar ist.
    const frame = requestAnimationFrame(() => {
      const lion = document.querySelector<HTMLElement>(".lion-intro");
      if (!lion) return;
      lion.classList.remove("lion-intro");
      void lion.offsetWidth;
      lion.classList.add("lion-intro");
    });

    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
      // Sofort nach oben und noch einmal, nachdem Next.js selbst gescrollt hat
      // (das setzt die Seite sonst knapp unter den oberen Rand).
      const toTop = () => {
        if (window.scrollY < 300) jump(() => window.scrollTo(0, 0));
      };
      toTop();
      timers.push(window.setTimeout(toTop, 0), window.setTimeout(toTop, 120));
    } else {
      // Sprungziel anspringen, sobald das Layout steht (z. B. Höhe der
      // gepinnten Projekte) – und kurz danach noch einmal nachjustieren.
      const toTarget = () =>
        jump(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
      timers.push(window.setTimeout(toTarget, 120), window.setTimeout(toTarget, 700));
    }
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
    };
  }, []);
  return null;
}
