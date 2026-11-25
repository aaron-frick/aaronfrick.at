import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Offenlegung gemäß § 5 ECG, § 14 UGB und § 25 MedienG.",
  alternates: { canonical: "/impressum" },
};

// TODO: Angaben vor Livegang rechtlich prüfen lassen (z. B. WKO-Impressum-Generator).
export default function ImpressumPage() {
  const { legal, location, contact } = site;
  return (
    <LegalPage label="Rechtliches" title="Impressum">
      <section>
        <h2>Medieninhaber und Diensteanbieter</h2>
        <p>
          <strong>{legal.companyName}</strong>
          <br />
          Inhaber: {site.owner}
          <br />
          {legal.street}
          <br />
          {legal.postalCode} {location.city}, {location.country}
        </p>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          Telefon: <a href={contact.phoneHref}>{contact.phone}</a>
          <br />
          E-Mail: <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
      </section>

      <section>
        <h2>Unternehmensangaben</h2>
        <p>
          Rechtsform: Einzelunternehmen
          <br />
          Unternehmensgegenstand: {legal.trade}
          <br />
          UID-Nummer: {legal.uid}
          <br />
          Gewerbebehörde: {legal.authority}
          <br />
          Mitgliedschaft: {legal.chamber}
          <br />
          Anwendbare Rechtsvorschriften: Gewerbeordnung (GewO), abrufbar unter{" "}
          <a href="https://www.ris.bka.gv.at" rel="noopener">
            www.ris.bka.gv.at
          </a>
        </p>
      </section>

      <section>
        <h2>Grundlegende Richtung</h2>
        <p>Information über die Leistungen von {site.name} und Kontaktmöglichkeit.</p>
      </section>

      <section>
        <h2>Online-Streitbeilegung</h2>
        <p>
          Verbraucher können Beschwerden an die Online-Streitbeilegungsplattform der EU richten:{" "}
          <a href="https://ec.europa.eu/odr" rel="noopener">
            ec.europa.eu/odr
          </a>
          . Sie können Beschwerden auch an die oben angegebene E-Mail-Adresse richten.
        </p>
      </section>
    </LegalPage>
  );
}
