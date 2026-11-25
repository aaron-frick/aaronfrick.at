import type { ReactNode } from "react";

/** Gemeinsames Gerüst für Impressum und Datenschutz. */
export function LegalPage({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto grid max-w-page gap-10 px-gutter py-20 sm:py-28 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-3">
        <p className="label text-accent">{label}</p>
      </div>
      <div className="lg:col-span-9">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
        <div className="mt-14 max-w-prose space-y-12 text-muted [&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-fg [&_p+p]:mt-4 [&_strong]:font-semibold [&_strong]:text-fg">
          {children}
        </div>
      </div>
    </article>
  );
}
