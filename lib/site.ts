/**
 * Zentrale Site-Konfiguration. Alle Inhalte, die an mehreren Stellen
 * gebraucht werden (Name, Domain, Kontakt, Rechtliches), stehen hier.
 * Werte mit "[TODO: …]" liefert Aaron nach.
 */
export const site = {
  name: "Frick.",
  owner: "Aaron Frick",
  domain: "aaronfrick.at",
  url: "https://aaronfrick.at",
  locale: "de-AT",
  title: "Frick. · Software aus Vorarlberg",
  slogan: "Software, die wirklich taugt.",
  description:
    "Plattformen, Apps und Websites aus Vorarlberg – Software für Unternehmen, die nach vorne denken.",
  location: {
    city: "Feldkirch",
    region: "Vorarlberg",
    country: "Österreich",
    timeZone: "Europe/Vienna",
  },
  contact: {
    phone: "+43 677 62647244",
    phoneHref: "tel:+4367762647244",
    // TODO: E-Mail-Adresse bestätigen
    email: "kontakt@aaronfrick.at",
  },
  legal: {
    companyName: "[TODO: Firmenwortlaut laut Gewerbeschein]",
    street: "[TODO: Straße und Hausnummer]",
    postalCode: "[TODO: PLZ]",
    uid: "[TODO: UID-Nummer, falls vorhanden]",
    trade: "[TODO: Gewerbe / Unternehmensgegenstand]",
    authority: "[TODO: Gewerbebehörde, z. B. Bezirkshauptmannschaft Feldkirch]",
    chamber: "[TODO: Wirtschaftskammer Vorarlberg, Fachgruppe]",
  },
} as const;

export const nav = [
  { href: "/#projekte", label: "Projekte" },
  { href: "/#ueber-mich", label: "Über mich" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;
