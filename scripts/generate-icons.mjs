/**
 * Erzeugt alle Icons aus den Brand-Dateien.
 *
 *   node scripts/generate-icons.mjs
 *
 * - app/icon.svg            vereinfachte Löwen-Silhouette auf Navy (für 16/32 px lesbar)
 * - app/favicon.ico         16, 32, 48 px aus der Silhouette
 * - app/apple-icon.png      180 px, gestochener Löwe auf Navy
 * - public/icons/*.png      16, 32, 192, 512 px + maskable 512 px
 *
 * Quellen: public/brand/loewe-navy.png (Linien, transparent) und
 * assets/brand/loewe-icon-1024.png (Löwe auf Navy).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import potrace from "potrace";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = (...s) => path.join(root, ...s);

const NAVY = "#1C2A47";
const PAPIER = "#F2EEE5";

/** Silhouette: Linien dilatieren, Außenraum fluten, Rest = Löwe. */
async function lionSilhouettePng() {
  const work = 600;
  const { data, info } = await sharp(p("public/brand/loewe-navy.png"))
    .resize({ height: work })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const pad = 20;
  const W = w + pad * 2;
  const H = h + pad * 2;
  let mask = new Uint8Array(W * H);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * 4 + 3] > 96) mask[(y + pad) * W + x + pad] = 1;

  const morph = (src, r, grow) => {
    const out = new Uint8Array(W * H);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let hit = !grow;
        outer: for (let dy = -r; dy <= r; dy++)
          for (let dx = -r; dx <= r; dx++) {
            if (dx * dx + dy * dy > r * r) continue;
            const xx = x + dx;
            const yy = y + dy;
            const v = xx >= 0 && yy >= 0 && xx < W && yy < H ? src[yy * W + xx] : 0;
            if (grow && v) {
              hit = true;
              break outer;
            }
            if (!grow && !v) {
              hit = false;
              break outer;
            }
          }
        out[y * W + x] = hit ? 1 : 0;
      }
    return out;
  };

  // Lücken in der Gravur schließen, damit der Innenraum nicht ausläuft.
  mask = morph(mask, 4, true);
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
      if (!outside[j] && !mask[j]) {
        outside[j] = 1;
        stack.push(j);
      }
    }
  }
  let lion = new Uint8Array(W * H);
  for (let i = 0; i < lion.length; i++) lion[i] = outside[i] ? 0 : 1;
  lion = morph(lion, 3, false); // Dilatation teilweise zurücknehmen

  const out = Buffer.alloc(W * H);
  for (let i = 0; i < lion.length; i++) out[i] = lion[i] ? 0 : 255;
  return sharp(out, { raw: { width: W, height: H, channels: 1 } })
    .png()
    .toBuffer();
}

function trace(buf) {
  return new Promise((resolve, reject) =>
    potrace.trace(buf, { turdSize: 40, optTolerance: 0.4, threshold: 128 }, (err, svg) =>
      err ? reject(err) : resolve(svg),
    ),
  );
}

async function main() {
  const silhouette = await lionSilhouettePng();
  const traced = await trace(silhouette);
  const vb = traced.match(/width="(\d+)" height="(\d+)"/);
  const sw = Number(vb[1]);
  const sh = Number(vb[2]);
  const d = traced.match(/ d="([^"]+)"/)[1];

  // Löwe auf quadratischer Navy-Fläche. Kleine Größen bekommen weniger Rand.
  const size = 512;
  const makeSvg = (fill) => {
    const scale = (size * fill) / Math.max(sw, sh);
    const tx = (size - sw * scale) / 2;
    const ty = (size - sh * scale) / 2;
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">` +
      `<rect width="${size}" height="${size}" fill="${NAVY}"/>` +
      `<path transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale.toFixed(4)})" fill="${PAPIER}" fill-rule="evenodd" d="${d}"/>` +
      `</svg>\n`
    );
  };
  const iconSvg = makeSvg(0.86);
  const tinySvg = makeSvg(0.96);
  await writeFile(p("app/icon.svg"), iconSvg);
  await mkdir(p("public/icons"), { recursive: true });

  const fromSvg = (px) =>
    sharp(Buffer.from(px <= 32 ? tinySvg : iconSvg))
      .resize(px, px)
      .png()
      .toBuffer();
  const small = {};
  for (const px of [16, 32, 48]) small[px] = await fromSvg(px);
  await writeFile(p("public/icons/icon-16.png"), small[16]);
  await writeFile(p("public/icons/icon-32.png"), small[32]);
  await writeFile(p("app/favicon.ico"), await pngToIco([small[16], small[32], small[48]]));

  const big = await readFile(p("assets/brand/loewe-icon-1024.png"));
  await sharp(big).resize(180, 180).png().toFile(p("app/apple-icon.png"));
  await sharp(big).resize(192, 192).png().toFile(p("public/icons/icon-192.png"));
  await sharp(big).resize(512, 512).png().toFile(p("public/icons/icon-512.png"));
  // Maskable: Löwe in der 80-%-Safe-Zone.
  const lionOnly = await sharp(big).resize(384, 384).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 3, background: NAVY } })
    .composite([{ input: lionOnly, left: 64, top: 64 }])
    .png()
    .toFile(p("public/icons/icon-maskable-512.png"));

  // Kleine Maske des Löwen für den Glanz über dem Header-Logo
  await sharp(p("public/brand/loewe-navy.png"))
    .resize({ height: 96 })
    .png({ compressionLevel: 9 })
    .toFile(p("public/brand/loewe-maske.png"));

  console.log("Icons erzeugt.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
