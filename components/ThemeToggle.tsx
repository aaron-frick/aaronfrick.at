"use client";

import { useTheme } from "next-themes";

/**
 * Hell/Dunkel-Umschalter. Die Icons werden per CSS (dark-Variante) gewählt,
 * dadurch gibt es kein Flackern und keinen Hydration-Unterschied.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="-m-2 inline-flex size-10 items-center justify-center text-fg transition-colors hover:text-accent"
      aria-label="Farbschema wechseln"
      title="Hell / Dunkel"
    >
      {/* Mond: im hellen Modus sichtbar */}
      <svg
        viewBox="0 0 24 24"
        className="size-4.5 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
      </svg>
      {/* Sonne: im dunklen Modus sichtbar */}
      <svg
        viewBox="0 0 24 24"
        className="hidden size-4.5 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
