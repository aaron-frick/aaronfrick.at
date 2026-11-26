# aaronfrick.at

Website von **Frick.**, dem Einzelunternehmen von Aaron Frick in Feldkirch, Vorarlberg.

Next.js 16 (App Router, Cache Components) · TypeScript strict · Tailwind CSS 4 · next-themes · pnpm · Vercel

## Setup

Voraussetzungen: Node.js ≥ 20.9 und pnpm 10 (`corepack enable` oder `npm i -g pnpm@10`).

```bash
pnpm install
cp .env.example .env.local   # Werte eintragen, siehe unten
pnpm dev                     # http://localhost:3000
```

| Befehl           | Zweck                                              |
| ---------------- | -------------------------------------------------- |
| `pnpm dev`       | Entwicklungsserver                                 |
| `pnpm build`     | Produktions-Build                                  |
| `pnpm start`     | Produktions-Build lokal starten                    |
| `pnpm lint`      | ESLint                                             |
| `pnpm typecheck` | TypeScript prüfen                                  |
| `pnpm format`    | Prettier (inkl. Tailwind-Klassen-Sortierung)       |
| `pnpm icons`     | Favicons und App-Icons aus den Brand-Dateien bauen |
| `pnpm particles` | Punktwolke des Löwen (Startscreen) neu erzeugen    |

## Umgebungsvariablen

| Variable             | Pflicht | Beschreibung                                                                              |
| -------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`     | ja      | API-Key von [Resend](https://resend.com) für das Kontaktformular                          |
| `CONTACT_TO_EMAIL`   | ja      | Empfänger der Anfragen                                                                    |
| `CONTACT_FROM_EMAIL` | ja      | Absender auf einer in Resend verifizierten Domain, z. B. `Frick. <kontakt@aaronfrick.at>` |

Fehlen die Werte, zeigt das Formular einen Hinweis mit der E-Mail-Adresse statt zu senden.

## Struktur

```
app/
  layout.tsx            Metadaten, Schrift (Inter, lokal), Theme, Header/Footer
  page.tsx              Startseite: Hero → Ansatz → Leistungen → Über mich → Kontakt
  impressum/ datenschutz/ not-found.tsx
  actions.ts            Server Action fürs Kontaktformular (Zod + Honeypot + Resend)
  globals.css           Design Tokens (CSS Custom Properties + Tailwind @theme)
  icon.svg favicon.ico apple-icon.png manifest.ts opengraph-image.tsx sitemap.ts robots.ts
components/             Header, Hero, LiveStatus, Section, sections, ContactForm, Footer, Logo, ThemeToggle …
lib/site.ts             Name, Domain, Kontakt, Erreichbarkeit, Impressumsdaten
public/brand/           Löwe und Logo-Dateien
public/icons/           PWA-Icons (16, 32, 192, 512, maskable)
assets/                 Quellen für Icons und das OG-Bild (nicht öffentlich)
scripts/generate-icons.mjs
```

## Design System

Alle Werte stammen aus den Frick Brand Guidelines (v1, Nov. 2026) und stehen in `app/globals.css`:

- **Farben**: Navy `#1C2A47`, Stahl `#4E6A99`, Stahl hell `#93A9CE`, Papier `#F2EEE5`, Weiß, Grau `#5E6678`.
  Komponenten nutzen nur die semantischen Rollen `bg`, `surface`, `fg`, `muted`, `accent`, `line`.
  Diese wechseln mit dem Farbschema.
- Die Tailwind-Standardfarben, Radien und Schatten sind abgeschaltet. Die Brand verbietet runde Karten, Schatten und Verläufe.
- **Schrift**: nur Inter (400–800), selbst gehostet über `next/font/local`.
- **Rand**: `px-gutter`, 64 px am Desktop, mobil reduziert.

## Inhalte pflegen

Platzhalter sind mit `[TODO: …]` markiert (`grep -rn "TODO" app components lib`).
Kontakt-, Impressums- und Erreichbarkeitsdaten stehen zentral in `lib/site.ts`.

## Deployment (Vercel)

1. Repository in Vercel importieren. Framework und pnpm werden erkannt (`packageManager` in `package.json`).
2. Die Umgebungsvariablen oben unter _Settings → Environment Variables_ setzen.
3. Domain `aaronfrick.at` verbinden.

Es gibt kein Tracking. Vercel Analytics ist bewusst nicht eingebaut und wird erst nach Freigabe aktiviert.
