/** Projekte · Auswahl. Reihenfolge = Anzeige. */
export type Project = {
  name: string;
  /** Kurz, was es ist */
  meta: string;
  url: string;
  text: string;
};

export const projects: Project[] = [
  {
    name: "MaturaTickets",
    meta: "Ticketplattform für Maturabälle und Schulfeste",
    url: "https://maturatickets.at",
    text: "Schulen verkaufen ihre Balltickets online – sofort als PDF mit QR-Code, Einlass per Scan.",
  },
  {
    name: "Tickez",
    meta: "Ticketverkauf für Clubs, Partys und Events",
    url: "https://tickez.at",
    text: "Veranstalter verkaufen Tickets selbst: QR-Code sofort per E-Mail, Einlass mit dem Handy.",
  },
  {
    name: "GoNow",
    meta: "Betriebssystem für Taxiunternehmen",
    url: "https://gonow.at",
    text: "App, Telefon und Straße in einem System – die Fahrt bleibt beim Betrieb vor Ort.",
  },
];
