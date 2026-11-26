/**
 * Projekte · Auswahl. Reihenfolge = Anzeige.
 * TODO: Platzhalter durch echte Projekte ersetzen (3–5 Stück reichen).
 */
export type Project = {
  name: string;
  /** z. B. „Projektbegleitung · Feldkirch“ */
  meta: string;
  year: string;
  text: string;
};

export const projects: Project[] = [
  {
    name: "[TODO: Projektname]",
    meta: "[TODO: Leistung · Ort]",
    year: "[TODO: Jahr]",
    text: "[TODO: Ein Satz: Was war die Aufgabe, was ist herausgekommen?]",
  },
  {
    name: "[TODO: Projektname]",
    meta: "[TODO: Leistung · Ort]",
    year: "[TODO: Jahr]",
    text: "[TODO: Ein Satz: Was war die Aufgabe, was ist herausgekommen?]",
  },
  {
    name: "[TODO: Projektname]",
    meta: "[TODO: Leistung · Ort]",
    year: "[TODO: Jahr]",
    text: "[TODO: Ein Satz: Was war die Aufgabe, was ist herausgekommen?]",
  },
];
