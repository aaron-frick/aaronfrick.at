"use client";

import { useActionState } from "react";
import { sendContact } from "@/app/actions";
import { type ContactFields, initialContactState } from "@/lib/contact";

const fieldClass =
  "block w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-fg placeholder:text-muted focus:border-accent aria-invalid:border-accent";

/** Kompaktes Kontaktformular fürs Outro: Name, E-Mail, Nachricht. */
export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initialContactState);

  if (state.status === "success") {
    return (
      <p role="status" className="text-center text-lg font-semibold">
        {state.message}
      </p>
    );
  }

  const err = (f: ContactFields) => state.errors?.[f];
  const firstError = err("name") ?? err("email") ?? err("message");

  return (
    <form action={action} noValidate className="grid gap-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Name"
            defaultValue={state.values?.name}
            aria-invalid={Boolean(err("name"))}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="sr-only">E-Mail</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="E-Mail"
            defaultValue={state.values?.email}
            aria-invalid={Boolean(err("email"))}
            className={fieldClass}
          />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Nachricht</span>
        <textarea
          name="message"
          rows={2}
          required
          placeholder="Worum geht es?"
          defaultValue={state.values?.message}
          aria-invalid={Boolean(err("message"))}
          className={`${fieldClass} resize-none`}
        />
      </label>

      {/* Honeypot gegen Spam – für Menschen unsichtbar */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="website">Website (bitte leer lassen)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p role={state.status === "error" ? "alert" : undefined} className="text-sm text-muted">
          {state.status === "error" ? (firstError ?? state.message) : null}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-3 border-b-2 border-fg pb-1 font-semibold transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
        >
          {pending ? "Wird gesendet …" : "Senden"}
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </button>
      </div>
    </form>
  );
}
