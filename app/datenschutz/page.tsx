import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Wie diese Website mit personenbezogenen Daten umgeht.",
  alternates: { canonical: "/datenschutz" },
};

// TODO: Datenschutzerklärung vor Livegang rechtlich prüfen lassen.
export default function DatenschutzPage() {
  const { legal, location, contact } = site;
  return (
    <LegalPage label="Rechtliches" title="Datenschutz">
      <section>
        <p>
          Der Schutz Ihrer Daten ist mir wichtig. Diese Website erhebt so wenig wie möglich: kein
          Tracking, keine Werbe-Cookies, keine eingebundenen Inhalte von Drittanbietern. Schriften
          werden von diesem Server geladen.
        </p>
      </section>

      <section>
        <h2>Verantwortlicher</h2>
        <p>
          {site.owner}, {legal.companyName}
          <br />
          {legal.street}, {legal.postalCode} {location.city}, {location.country}
          <br />
          E-Mail: <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
      </section>

      <section>
        <h2>Hosting</h2>
        <p>
          Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA,
          gehostet. Beim Aufruf verarbeitet Vercel technisch notwendige Daten (z. B. IP-Adresse,
          Zeitpunkt, aufgerufene Seite, Browser) in Server-Logfiles, um die Website auszuliefern und
          abzusichern. Rechtsgrundlage ist mein berechtigtes Interesse an einem sicheren Betrieb
          (Art. 6 Abs. 1 lit. f DSGVO). Die Übermittlung in die USA stützt sich auf das EU-US Data
          Privacy Framework bzw. Standardvertragsklauseln.
        </p>
      </section>

      <section>
        <h2>Kontaktformular und E-Mail</h2>
        <p>
          Wenn Sie mir über das Formular oder per E-Mail schreiben, verarbeite ich Ihren Namen, Ihre
          E-Mail-Adresse und Ihre Nachricht, um Ihre Anfrage zu beantworten (Art. 6 Abs. 1 lit. b
          DSGVO). Formularnachrichten werden über den Dienst Resend (Plus Five Five, Inc., USA) an
          mich zugestellt. Ich speichere Anfragen, solange es für die Bearbeitung nötig ist oder
          gesetzliche Aufbewahrungsfristen es verlangen.
        </p>
      </section>

      <section>
        <h2>Lokale Speicherung</h2>
        <p>
          Wenn Sie zwischen hellem und dunklem Farbschema wechseln, wird Ihre Wahl im lokalen
          Speicher Ihres Browsers abgelegt. Es werden keine Daten an mich übertragen.
        </p>
      </section>

      <section>
        <h2>Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch. Schreiben Sie dazu an{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>. Wenn Sie meinen, dass die
          Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, können Sie sich bei der
          Österreichischen Datenschutzbehörde beschweren (
          <a href="https://www.dsb.gv.at" rel="noopener">
            www.dsb.gv.at
          </a>
          ).
        </p>
      </section>

      <section>
        <p className="text-sm">Stand: November 2026</p>
      </section>
    </LegalPage>
  );
}
