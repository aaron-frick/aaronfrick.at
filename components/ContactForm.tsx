"use client";

import { type ReactNode, useActionState } from "react";
import { sendContact } from "@/app/actions";
import { type ContactFields, initialContactState } from "@/lib/contact";

const fieldClass =
  "mt-2 block w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-lg text-fg placeholder:text-muted focus:border-accent aria-invalid:border-accent";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initialContactState);

  if (state.status === "success") {
    return (
      <p role="status" className="border-t border-line-strong pt-6 text-2xl font-semibold">
        {state.message}
      </p>
    );
  }

  const err = (f: ContactFields) => state.errors?.[f];
  const describedBy = (f: ContactFields) => (err(f) ? `${f}-error` : undefined);

  return (
    <form action={action} noValidate className="grid gap-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Name" name="name" error={err("name")}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={state.values?.name}
            aria-invalid={Boolean(err("name"))}
            aria-describedby={describedBy("name")}
            className={fieldClass}
          />
        </Field>
        <Field label="E-Mail" name="email" error={err("email")}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email}
            aria-invalid={Boolean(err("email"))}
            aria-describedby={describedBy("email")}
            className={fieldClass}
          />
        </Field>
      </div>
      <Field label="Worum geht es?" name="message" error={err("message")}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          defaultValue={state.values?.message}
          aria-invalid={Boolean(err("message"))}
          aria-describedby={describedBy("message")}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      {/* Honeypot gegen Spam – für Menschen unsichtbar */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="website">Website (bitte leer lassen)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={pending}
          className="bg-fg px-7 py-4 font-semibold text-bg transition-colors hover:bg-accent hover:text-on-accent disabled:opacity-60"
        >
          {pending ? "Wird gesendet …" : "Nachricht senden"}
        </button>
        <p role={state.status === "error" ? "alert" : undefined} className="text-sm font-medium">
          {state.status === "error" ? state.message : null}
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: ContactFields;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="label text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-sm font-medium text-fg">
          <span aria-hidden="true" className="text-accent">
            ✕{" "}
          </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}
