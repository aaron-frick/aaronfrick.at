import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  label: string;
  title?: ReactNode;
  children: ReactNode;
  /** "navy": Fläche immer in Navy (setzt die dunklen Tokens für den Bereich). */
  tone?: "default" | "navy";
};

/** Abschnitt mit kleinem Label links und Inhalt rechts (Label-Raster). */
export function Section({ id, label, title, children, tone = "default" }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-label`}
      className={tone === "navy" ? "dark border-y border-line bg-bg text-fg" : undefined}
    >
      <div className="mx-auto grid max-w-page gap-10 px-gutter py-24 sm:py-32 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <h2 id={`${id}-label`} className="label text-accent">
            {label}
          </h2>
        </div>
        <div className="lg:col-span-9">
          {title ? (
            <p className="max-w-[22ch] text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
              {title}
            </p>
          ) : null}
          <div className={title ? "mt-12 sm:mt-16" : undefined}>{children}</div>
        </div>
      </div>
    </section>
  );
}

/** Info als Label · Wert (Guidelines: „Infos als Label Wert“). */
export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-t border-line py-4">
      <dt className="label text-muted">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}
