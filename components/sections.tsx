import Link from "next/link";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { Fact, Section } from "./Section";

const principles = [
  {
    name: "Direkt",
    text: "Eine Ansprechperson vom ersten Gespräch bis zur Übergabe. Keine Weiterleitungen.",
  },
  {
    name: "Konkret",
    text: "Jede Zusage mit Datum, Zuständigkeit und nächstem Schritt. Schriftlich.",
  },
  {
    name: "Verbindlich",
    text: "Was vereinbart ist, wird erledigt. Der Punkt im Namen verpflichtet.",
  },
] as const;

export function Approach() {
  return (
    <Section
      id="ansatz"
      label="Ansatz"
      title={
        <>
          Ich übernehme, was ich zusage.{" "}
          <span className="text-muted">Und sage, was ich übernehme.</span>
        </>
      }
    >
      <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">
        {principles.map((p, i) => (
          <li key={p.name} className="border-t border-line-strong pt-5">
            <span className="label text-muted tabular-nums">0{i + 1}</span>
            <h3 className="mt-3 text-xl font-bold">{p.name}</h3>
            <p className="mt-2 text-muted">{p.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// TODO: Leistungen bestätigen, schärfen oder ergänzen.
const services = [
  {
    name: "Beratung",
    text: "Vorhaben einschätzen, Optionen klären, Entscheidungen vorbereiten.",
  },
  {
    name: "Projektbegleitung",
    text: "Termine, Beteiligte und Abstimmungen koordinieren – mit Behörden, Planung und Handwerk.",
  },
  {
    name: "Organisation",
    text: "Abläufe ordnen, Unterlagen aufbereiten, Protokolle führen. Damit nichts liegen bleibt.",
  },
] as const;

export function Services() {
  return (
    <Section id="leistungen" label="Leistungen · Auswahl">
      <ul className="border-b border-line">
        {services.map((s, i) => (
          <li
            key={s.name}
            className="grid gap-2 border-t border-line py-8 sm:grid-cols-12 sm:items-baseline sm:gap-8 sm:py-10"
          >
            <span className="label text-muted tabular-nums sm:col-span-1">0{i + 1}</span>
            <h3 className="text-2xl font-bold tracking-tight sm:col-span-5 sm:text-4xl">
              {s.name}
            </h3>
            <p className="text-muted sm:col-span-6">{s.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function About() {
  return (
    <Section id="ueber-mich" label="Über mich" tone="surface">
      <div className="grid gap-12 lg:grid-cols-9 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="text-2xl leading-snug font-semibold tracking-tight text-pretty sm:text-3xl">
            Ich bin Aaron Frick. Ich arbeite von Feldkirch aus für Menschen und Betriebe in
            Vorarlberg.
          </p>
          <p className="mt-6 max-w-prose text-muted">
            [TODO: Zwei bis drei Sätze zu Werdegang, Erfahrung und warum Frick. – kurz, in der
            Ich-Form.]
          </p>
        </div>
        <dl className="lg:col-span-4">
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

export function Contact() {
  return (
    <Section
      id="kontakt"
      label="Kontakt"
      title={
        <>
          Erzählen Sie kurz, worum es geht.{" "}
          <span className="text-muted">Ich melde mich mit einem nächsten Schritt.</span>
        </>
      }
    >
      <div className="grid gap-16 lg:grid-cols-9 lg:gap-8">
        <dl className="lg:col-span-3">
          <Fact label="Telefon">
            <a href={site.contact.phoneHref} className="underline-offset-4 hover:underline">
              {site.contact.phone}
            </a>
          </Fact>
          <Fact label="E-Mail">
            <a
              href={`mailto:${site.contact.email}`}
              className="break-all underline-offset-4 hover:underline"
            >
              {site.contact.email}
            </a>
          </Fact>
          <Fact label="Ort">
            {site.location.city} · {site.location.region}
          </Fact>
        </dl>
        <div className="lg:col-span-6">
          <ContactForm />
          <p className="mt-6 text-sm text-muted">
            Ihre Angaben verwende ich nur, um Ihre Anfrage zu beantworten. Mehr dazu in der{" "}
            <Link href="/datenschutz" className="underline underline-offset-4 hover:text-fg">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
      </div>
    </Section>
  );
}
