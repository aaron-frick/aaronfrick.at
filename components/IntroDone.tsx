"use client";

import { useEffect } from "react";

/**
 * Markiert das Intro nach dem Ablauf als erledigt, damit es bei
 * Client-Navigation zurück zur Startseite nicht erneut startet.
 */
export function IntroDone() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      document.documentElement.dataset.intro = "skip";
    }, 2500);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}
