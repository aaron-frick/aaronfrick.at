"use client";

import { type ReactNode, useActionState } from "react";
import { sendContact } from "@/app/actions";
import { type ContactFields, contactTopics, initialContactState } from "@/lib/contact";

const fieldClass =
  "block w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-lg text-fg placeholder:text-muted focus:border-accent aria-invalid:border-accent";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initialContactState);

  if (state.status === "success") {
    return (
      <div role="status" className="border-t-2 border-line-strong pt-8">
        <p className="text-3xl font-bold tracking-tight">Danke.</p>
        <p className="mt-3 text-lg text-muted">{state.message}</p>
      </div>
    );
  }

  const err = (f: ContactFields) => state.errors?.[f];
  const describedBy = (f: ContactFields) => (err(f) ? `${f}-error` : undefined);

  return (
    <form action={action} noValidate className="grid gap-12">
      <fieldset aria-describedby={describedBy("topic")}>
        <legend className="label text-muted">Worum geht es?</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {contactTopics.map((topic, i) => (
            <label key={topic} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={topic}
                required
                defaultChecked={state.values?.topic ? state.values.topic === topic : i === 0}
                className="peer sr-only"
              />
              <span className="block border border-line-strong px-4 py-2.5 text-sm font-medium transition-colors peer-checked:border-fg peer-checked:bg-fg peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-accent">
                {topic}
              </span>
            </label>
          ))}
        </div>
        <FieldError name="topic" error={err("topic")} />
      </fieldset>

      <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
        <Field label="Ihr Name" name="name" error={err("name")}>
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
        <Field label="Ihre E-Mail" name="email" error={err("email")}>
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

      <Field label="Ein paar Sätze zum Vorhaben" name="message" error={err("message")}>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Was steht an, bis wann, wer ist beteiligt?"
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

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-3 bg-fg px-7 py-4 font-semibold text-bg transition-colors hover:bg-accent hover:text-on-accent disabled:opacity-60"
        >
          {pending ? "Wird gesendet …" : "Nachricht senden"}
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
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
      <div className="mt-2">{children}</div>
      <FieldError name={name} error={error} />
    </div>
  );
}

function FieldError({ name, error }: { name: ContactFields; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${name}-error`} className="mt-2 text-sm font-medium text-fg">
      <span aria-hidden="true" className="text-accent">
        ✕{" "}
      </span>
      {error}
    </p>
  );
}
