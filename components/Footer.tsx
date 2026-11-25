import Link from "next/link";
import { site } from "@/lib/site";
import { Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-page px-gutter pt-20 pb-10">
        <Wordmark className="block text-wordmark" />
        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
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
