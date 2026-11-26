import Link from "next/link";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { Wordmark } from "./Logo";
import { SignatureReveal } from "./Signature";

/**
 * Outro: Unterschrift schreibt sich, danach „Frick.“ und der kompakte Kontakt.
 * Ganz unten Ort und Rechtliches.
 */
export function Footer() {
  return (
    <footer id="kontakt" className="dark bg-bg text-fg">
      <div className="mx-auto flex min-h-svh max-w-page flex-col px-gutter">
        <div className="flex flex-1 items-center justify-center py-24">
          <SignatureReveal
            after={
              <div className="mx-auto mt-16 w-full max-w-xl">
                <h2 className="mb-6 text-center label text-accent">Kontakt</h2>
                <ContactForm />
                <p className="mt-8 text-center text-sm text-muted">
                  <a href={site.contact.phoneHref} className="hover:text-fg">
                    {site.contact.phone}
                  </a>
                  <span aria-hidden="true"> · </span>
                  <a href={`mailto:${site.contact.email}`} className="hover:text-fg">
                    {site.contact.email}
                  </a>
                </p>
              </div>
            }
          >
            <Wordmark className="text-4xl sm:text-5xl" />
          </SignatureReveal>
        </div>
        <div className="flex flex-col gap-4 border-t border-line py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.location.region}, {site.location.country}
          </p>
          <nav aria-label="Rechtliches">
            <ul className="flex gap-8">
              <li>
                <Link href="/impressum" className="transition-colors hover:text-fg">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="transition-colors hover:text-fg">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </nav>
          <p>© {site.owner}</p>
        </div>
      </div>
    </footer>
  );
}
