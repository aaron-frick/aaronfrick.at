"use server";

import { Resend } from "resend";
import { type ContactState, contactSchema } from "@/lib/contact";
import { site } from "@/lib/site";

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: Menschen sehen das Feld nicht. Ist es gefüllt, still „erfolgreich“ beenden.
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", message: "Danke. Ich melde mich in Kürze." };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { status: "error", message: "Bitte prüfen Sie die markierten Felder.", errors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return {
      status: "error",
      message: `Das Formular ist noch nicht eingerichtet. Bitte schreiben Sie direkt an ${site.contact.email}.`,
      values,
    };
  }

  const { name, email, message } = parsed.data;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Anfrage über ${site.domain}: ${name}`,
    text: `Name: ${name}\nE-Mail: ${email}\n\n${message}\n`,
  });

  if (error) {
    return {
      status: "error",
      message: `Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später oder schreiben Sie an ${site.contact.email}.`,
      values,
    };
  }

  return { status: "success", message: "Danke. Ich melde mich innerhalb von zwei Werktagen." };
}
