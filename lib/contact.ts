import { z } from "zod";

export const contactTopics = [
  "Beratung",
  "Projektbegleitung",
  "Organisation",
  "Etwas anderes",
] as const;

export const contactSchema = z.object({
  topic: z.enum(contactTopics, { error: "Bitte wählen Sie ein Thema." }),
  name: z
    .string()
    .trim()
    .min(2, { error: "Bitte geben Sie Ihren Namen an." })
    .max(120, { error: "Der Name ist zu lang." }),
  email: z.email({ error: "Bitte geben Sie eine gültige E-Mail-Adresse an." }).max(200),
  message: z
    .string()
    .trim()
    .min(10, { error: "Ein, zwei Sätze helfen mir beim Einordnen." })
    .max(4000, { error: "Die Nachricht ist zu lang (max. 4000 Zeichen)." }),
});

export type ContactFields = keyof z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactFields, string>>;
  values?: Partial<Record<ContactFields, string>>;
};

export const initialContactState: ContactState = { status: "idle" };
