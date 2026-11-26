import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "Frick. – Aaron Frick, Feldkirch, Vorarlberg";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#1c2a47";
const WEISS = "#ffffff";
const STAHL_HELL = "#93a9ce";

/** Schriften und Löwe laden – gecacht, damit das Bild beim Build statisch entsteht. */
async function loadAssets() {
  "use cache";
  const [bold, semibold, lion] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/inter-latin-700-normal.woff")),
    readFile(join(process.cwd(), "assets/fonts/inter-latin-600-normal.woff")),
    readFile(join(process.cwd(), "public/brand/loewe-hell.png")),
  ]);
  return {
    bold: bold.toString("base64"),
    semibold: semibold.toString("base64"),
    lion: lion.toString("base64"),
  };
}

export default async function OpengraphImage() {
  const assets = await loadAssets();
  const bold = Buffer.from(assets.bold, "base64");
  const semibold = Buffer.from(assets.semibold, "base64");
  const lionSrc = `data:image/png;base64,${assets.lion}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: NAVY,
        borderTop: `12px solid ${STAHL_HELL}`,
        padding: "64px 72px",
        fontFamily: "Inter",
        color: WEISS,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 4,
            color: STAHL_HELL,
          }}
        >
          FELDKIRCH · VORARLBERG
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 200,
              fontWeight: 700,
              letterSpacing: -8,
              lineHeight: 1,
            }}
          >
            Frick<span style={{ color: STAHL_HELL }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 600, marginTop: 24 }}>
            {site.slogan}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: 20,
            fontSize: 22,
            fontWeight: 600,
            color: STAHL_HELL,
          }}
        >
          {site.domain}
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={lionSrc} width={360} height={421} style={{ alignSelf: "center", marginLeft: 24 }} />
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: bold, weight: 700, style: "normal" },
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
