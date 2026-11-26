/**
 * Erzeugt die Punktwolke für den Löwen im Startscreen.
 *
 *   node scripts/generate-particles.mjs
 *
 * Tastet den gestochenen Löwen (public/brand/loewe-navy.png) in einem Raster ab:
 * Punkte auf den Gravurlinien werden hell, Punkte in der Fläche gedämpft.
 * Ausgabe: public/brand/loewe-punkte.json  { w, h, p: [x, y, b, …] }
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const H = 760; // Arbeitshöhe in px
const STEP = 6; // Raster für Fläche und Kontur
const LINE_STEP = 2.6; // feines Raster für die Gravurlinien
const JITTER = 1.2;

// deterministischer Zufall, damit die Datei stabil bleibt
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const { data, info } = await sharp(path.join(root, "public/brand/loewe-navy.png"))
  .resize({ height: H })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const alpha = (x, y) =>
  x < 0 || y < 0 || x >= W || y >= H ? 0 : data[(Math.round(y) * W + Math.round(x)) * 4 + 3];

// Silhouette: Linien dilatieren, Außen fluten, Rest = innen
const line = new Uint8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) line[y * W + x] = alpha(x, y) > 90 ? 1 : 0;
const grown = new Uint8Array(W * H);
const R = 3;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    if (!line[y * W + x]) continue;
    for (let dy = -R; dy <= R; dy++)
      for (let dx = -R; dx <= R; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < W && yy < H) grown[yy * W + xx] = 1;
      }
  }
const outside = new Uint8Array(W * H);
const stack = [0];
outside[0] = 1;
while (stack.length) {
  const i = stack.pop();
  const x = i % W;
  const y = (i - x) / W;
  for (const [nx, ny] of [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ]) {
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const j = ny * W + nx;
    if (!outside[j] && !grown[j]) {
      outside[j] = 1;
      stack.push(j);
    }
  }
}

const pts = [];
const isOutside = (x, y) => {
  const xi = Math.round(x);
  const yi = Math.round(y);
  return xi < 0 || yi < 0 || xi >= W || yi >= H || outside[yi * W + xi] === 1;
};

// 1) Gravurlinien fein abtasten – trägt das Detail (Mähne, Krallen, Schraffur)
for (let gy = 0; gy < H; gy += LINE_STEP) {
  for (let gx = 0; gx < W; gx += LINE_STEP) {
    const x = gx + (rand() - 0.5) * JITTER;
    const y = gy + (rand() - 0.5) * JITTER;
    const a = alpha(x, y);
    if (a < 150 || rand() > 0.72) continue;
    pts.push(
      Math.round(x * 10) / 10,
      Math.round(y * 10) / 10,
      Math.round(62 + (a / 255) * 30 + rand() * 8),
    );
  }
}

// 2) Fläche locker füllen (gedämpft), Konturnähe etwas heller
for (let gy = STEP / 2; gy < H; gy += STEP) {
  for (let gx = STEP / 2; gx < W; gx += STEP) {
    const x = gx + (rand() - 0.5) * JITTER * 2;
    const y = gy + (rand() - 0.5) * JITTER * 2;
    if (isOutside(x, y) || alpha(x, y) > 60) continue;
    let edge = false;
    for (let dy = -4; dy <= 4 && !edge; dy += 4)
      for (let dx = -4; dx <= 4 && !edge; dx += 4) if (isOutside(x + dx, y + dy)) edge = true;
    if (edge) pts.push(Math.round(x), Math.round(y), Math.round(40 + rand() * 20));
    else if (rand() < 0.45) pts.push(Math.round(x), Math.round(y), Math.round(8 + rand() * 10));
  }
}

await writeFile(
  path.join(root, "public/brand/loewe-punkte.json"),
  JSON.stringify({ w: W, h: H, p: pts }),
);
console.log(`Punkte: ${pts.length / 3} (${W}×${H})`);
