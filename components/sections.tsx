import type { CSSProperties } from "react";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { Fact, Section } from "./Section";

export function Projects() {
  return (
    <Section id="projekte" label="Projekte · Auswahl">
      <ul className="border-b border-line">
        {projects.map((p, i) => (
          <li
            key={i}
            data-reveal
            style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
            className="grid gap-3 border-t border-line py-8 sm:grid-cols-12 sm:items-baseline sm:gap-8 sm:py-10"
          >
            <span className="label text-muted tabular-nums sm:col-span-2">{p.year}</span>
            <div className="sm:col-span-5">
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{p.name}</h3>
              <p className="mt-2 text-sm font-medium text-accent">{p.meta}</p>
            </div>
            <p className="text-muted sm:col-span-5">{p.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function About() {
  return (
    <Section id="ueber-mich" label="Über mich" tone="navy">
      <div className="grid gap-12 lg:grid-cols-9 lg:gap-8">
        <div data-reveal className="lg:col-span-5">
          <p className="text-2xl leading-snug font-semibold tracking-tight text-pretty sm:text-3xl">
            Ich bin Aaron Frick. Ich arbeite von Feldkirch aus für Menschen und Betriebe in
            Vorarlberg.
          </p>
          <p className="mt-6 max-w-prose text-muted">
            [TODO: Zwei bis drei Sätze zu Werdegang, Erfahrung und warum Frick. – kurz, in der
            Ich-Form.]
          </p>
        </div>
        <dl data-reveal className="[--reveal-delay:150ms] lg:col-span-4">
          <Fact label="Inhaber">{site.owner}</Fact>
          <Fact label="Sitz">
            {site.location.city} · {site.location.region}
          </Fact>
          <Fact label="Gebiet">[TODO: Einsatzgebiet bestätigen]</Fact>
          <Fact label="Seit">[TODO: Gründungsjahr]</Fact>
        </dl>
      </div>
    </Section>
  );
}
