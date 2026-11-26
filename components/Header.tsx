import Link from "next/link";
import { nav } from "@/lib/site";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-40 border-t-4 border-t-accent bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-gutter">
        <Link href="/" aria-label="Frick. – zur Startseite" className="-m-1 p-1">
          <Logo />
        </Link>
        <nav aria-label="Hauptnavigation" className="flex items-center gap-6 sm:gap-8">
          <ul className="hidden items-center gap-8 sm:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#kontakt"
            className="text-sm font-medium text-muted transition-colors hover:text-fg sm:hidden"
          >
            Kontakt
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
