import Link from "next/link";
import { site } from "@/lib/site";
import { Wordmark } from "./Logo";
import { SignatureReveal } from "./Signature";

/** Outro: Navy-Fläche mit Unterschrift und „Frick.“, darunter Ort und Rechtliches. */
export function Footer() {
  return (
    <footer className="dark bg-bg text-fg">
      <div className="mx-auto flex min-h-[calc(100svh-4.25rem)] max-w-page flex-col px-gutter">
        <div className="flex flex-1 items-center justify-center py-24">
          <SignatureReveal>
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
