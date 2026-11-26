import { projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { ProjectsPin } from "./ProjectsPin";
import { Fact, Section } from "./Section";

export function Projects() {
  return <ProjectsPin projects={projects} />;
}

export function About() {
  return (
    <Section id="ueber-mich" label="Über mich" tone="navy">
      <div className="grid gap-12 lg:grid-cols-9 lg:gap-8">
        <div data-reveal className="lg:col-span-5">
          <p className="text-2xl leading-snug font-semibold tracking-tight text-pretty sm:text-3xl">
            Ich bin Aaron Frick. Ich baue von Feldkirch aus Software für Betriebe und Veranstalter
            in Vorarlberg.
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
