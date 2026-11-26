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
            im DACH-Raum.
          </p>
          <p className="mt-6 max-w-prose text-muted">
            Angefangen habe ich mit eigenen Produkten: MaturaTickets, Tickez und GoNow habe ich
            selbst geplant, gebaut und betreut. Seit 2026 mache ich das mit Frick. auch für andere –
            Software, die so durchdacht ist wie ein eigenes Produkt. Ein Ansprechpartner von der
            ersten Idee bis zum laufenden Betrieb, direkt aus Feldkirch.
          </p>
        </div>
        <dl data-reveal className="[--reveal-delay:150ms] lg:col-span-4">
          <Fact label="Inhaber">{site.owner}</Fact>
          <Fact label="Sitz">
            {site.location.city} · {site.location.region}
          </Fact>
          <Fact label="Gebiet">DACH-Raum</Fact>
          <Fact label="Seit">2026</Fact>
        </dl>
      </div>
    </Section>
  );
}
