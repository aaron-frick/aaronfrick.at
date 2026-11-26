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
const H = 560; // Arbeitshöhe in px
const STEP = 5; // Rasterabstand
const JITTER = 1.6;

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
for (let gy = STEP / 2; gy < H; gy += STEP) {
  for (let gx = STEP / 2; gx < W; gx += STEP) {
    const x = gx + (rand() - 0.5) * JITTER * 2;
    const y = gy + (rand() - 0.5) * JITTER * 2;
    const xi = Math.round(Math.min(W - 1, Math.max(0, x)));
    const yi = Math.round(Math.min(H - 1, Math.max(0, y)));
    const inside = !outside[yi * W + xi];
    if (!inside) continue;
    // Nähe zum Rand der Silhouette -> Kontur
    let edge = false;
    for (let dy = -5; dy <= 5 && !edge; dy += 5)
      for (let dx = -5; dx <= 5 && !edge; dx += 5) {
        const xx = xi + dx;
        const yy = yi + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H || outside[yy * W + xx]) edge = true;
      }
    const onLine = alpha(x, y) > 215;
    if (edge) pts.push(xi, yi, Math.round(82 + rand() * 18));
    else if (onLine && rand() < 0.8) pts.push(xi, yi, Math.round(52 + rand() * 22));
    else if (rand() < 0.42) pts.push(xi, yi, Math.round(10 + rand() * 12));
  }
}

await writeFile(
  path.join(root, "public/brand/loewe-punkte.json"),
  JSON.stringify({ w: W, h: H, p: pts }),
);
console.log(`Punkte: ${pts.length / 3} (${W}×${H})`);
