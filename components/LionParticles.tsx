"use client";

import { useEffect, useRef } from "react";

type Data = { w: number; h: number; p: number[] };

/**
 * Der Löwe als Punktwolke (Canvas). Die Punkte stehen fest und blenden beim
 * Laden nur kurz ein; ein ruhiges Lichtband wandert über den Löwen. Beim
 * Darüberfahren leuchten die Punkte unter dem Zeiger auf (ohne sich zu bewegen).
 * Beim Wegscrollen zerstreuen sich die Punkte.
 * Farbe = aktuelle Textfarbe (Navy im hellen, Weiß im dunklen Modus).
 * Punkte: public/brand/loewe-punkte.json (scripts/generate-particles.mjs).
 */
export function LionParticles({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let alive = true;
    let t0 = 0;
    let rgb = "28,42,71";
    let lastColor = 0;
    // Zeiger für den Glanz (Canvas-Pixel), -1 = nicht über dem Löwen
    let mx = -1e6;
    let my = -1e6;
    let hover = 0; // 0–1, weich ein-/ausgeblendet
    let hoverTarget = 0;

    let n = 0;
    let src: Data | null = null;
    let tx: Float32Array, ty: Float32Array, b: Float32Array;
    let delay: Float32Array, phase: Float32Array;
    let dx: Float32Array, dy: Float32Array;

    const readColor = () => {
      const m = getComputedStyle(canvas).color.match(/\d+(\.\d+)?/g);
      if (m) rgb = `${m[0]},${m[1]},${m[2]}`;
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      if (reduce) draw(performance.now());
    };

    const prepare = (full: Data) => {
      // Kleine Bildschirme: jeder zweite Punkt reicht optisch und spart Rechenzeit.
      const keep = canvas.clientWidth < 700 ? 2 : 1;
      const p: number[] = [];
      for (let i = 0; i < full.p.length; i += 3 * keep)
        p.push(full.p[i], full.p[i + 1], full.p[i + 2]);
      const d = { ...full, p };
      src = d;
      n = d.p.length / 3;
      tx = new Float32Array(n);
      ty = new Float32Array(n);
      b = new Float32Array(n);
      delay = new Float32Array(n);
      phase = new Float32Array(n);
      dx = new Float32Array(n);
      dy = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        tx[i] = d.p[i * 3] / d.h;
        ty[i] = d.p[i * 3 + 1] / d.h;
        b[i] = d.p[i * 3 + 2] / 100;
        delay[i] = Math.random() * 0.4;
        phase[i] = Math.random() * Math.PI * 2;
        const a = Math.random() * Math.PI * 2;
        const s = 0.25 + Math.random() * 0.6;
        dx[i] = Math.cos(a) * s;
        dy[i] = Math.sin(a) * s - 0.35;
      }
    };

    const ease = (k: number) => 1 - Math.pow(1 - k, 4);

    function draw(now: number) {
      if (!src) return;
      const W = canvas!.width;
      const H = canvas!.height;
      const t = reduce ? 100 : (now - t0) / 1000;
      if (now - lastColor > 400) {
        readColor();
        lastColor = now;
      }
      const scroll = Math.min(1, Math.max(0, window.scrollY / host!.offsetHeight));
      // beim Wegscrollen früh und vollständig auflösen (kein harter Rand)
      const fadeOut = Math.max(0, 1 - scroll * 1.9);
      const size = Math.min(W / (src.w / src.h), H * 0.7);
      const ox = (W - (src.w / src.h) * size) / 2;
      const oy = (H - size) / 2 - scroll * H * 0.12;
      const dot = Math.max(1, size / 420);
      // Lichtband entlang der Diagonale (ruhig) + Glanzstreifen beim Hover (schnell)
      const band = reduce ? -9 : ((t * 0.16) % 1.7) - 0.35;
      hover += (hoverTarget - hover) * 0.08;
      const flareR = size * 0.16;

      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = `rgb(${rgb})`;
      for (let i = 0; i < n; i++) {
        // nur kurzes Einblenden an Ort und Stelle
        const k = ease(Math.min(1, Math.max(0, (t - delay[i]) / 0.8)));
        if (k <= 0) continue;
        const px = ox + (tx[i] + dx[i] * scroll) * size;
        const py = oy + (ty[i] + dy[i] * scroll) * size;
        const diag = (tx[i] * (src.h / src.w) + (1 - ty[i])) / 2;
        const glow = Math.exp(-((diag - band) ** 2) / 0.006);
        // Leuchten am Zeiger – Punkte bleiben an ihrem Platz
        let flare = 0;
        if (hover > 0.01) {
          const ddx = px - mx;
          const ddy = py - my;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < flareR * flareR * 4) flare = Math.exp(-d2 / (flareR * flareR)) * hover;
        }
        const twinkle = reduce ? 1 : 0.82 + 0.18 * Math.sin(t * 2.2 + phase[i]);
        const a = Math.min(1, (b[i] * twinkle + glow * 0.45 + flare * 1.1) * k * fadeOut);
        if (a < 0.02) continue;
        ctx!.globalAlpha = a;
        const s = dot * (1 + flare * 0.6);
        ctx!.fillRect(px, py, s, s);
      }
      ctx!.globalAlpha = 1;
    }

    const loop = (now: number) => {
      if (!alive) return;
      draw(now);
      const offscreen = window.scrollY >= host.offsetHeight;
      raf = offscreen || document.hidden ? 0 : requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf && alive && !reduce && src) raf = requestAnimationFrame(loop);
    };

    readColor();
    resize();
    // Erst nach dem Laden der Seite starten – der erste Paint bleibt schnell.
    const start = () =>
      fetch("/brand/loewe-punkte.json")
        .then((r) => r.json() as Promise<Data>)
        .then((d) => {
          if (!alive) return;
          prepare(d);
          host.dataset.particles = "";
          t0 = performance.now();
          if (reduce) draw(t0);
          else raf = requestAnimationFrame(loop);
        })
        .catch(() => {});
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    // Glanz beim Darüberfahren
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const dpr = canvas.width / (r.width || 1);
      mx = (e.clientX - r.left) * dpr;
      my = (e.clientY - r.top) * dpr;
    };
    const onEnter = (e: PointerEvent) => {
      onMove(e);
      hoverTarget = 1;
      wake();
    };
    const onLeave = () => {
      hoverTarget = 0;
    };
    if (!reduce) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointerleave", onLeave);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", wake);
    const mo = new MutationObserver(() => {
      readColor();
      if (reduce) draw(performance.now());
      else wake();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      alive = false;
      window.removeEventListener("load", start);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", wake);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
