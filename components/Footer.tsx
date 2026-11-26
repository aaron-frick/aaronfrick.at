import Link from "next/link";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";

/** Footer auf allen Seiten: kompakter Kontakt, darunter Ort und Rechtliches. */
export function Footer() {
  return (
    <footer id="kontakt" className="relative z-10 bg-bg text-fg">
      <div className="mx-auto max-w-page px-gutter">
        <div className="mx-auto w-full max-w-xl pt-16 pb-24">
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
        <div className="flex flex-col gap-4 border-t border-line py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Made in Austria</p>
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
