"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";

/** Tickt einmal pro Sekunde. Auf dem Server gibt es keine Zeit (null). */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

const timeFormat = new Intl.DateTimeFormat("de-AT", {
  timeZone: site.location.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
const partsFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: site.location.timeZone,
  weekday: "short",
  hour: "numeric",
  hourCycle: "h23",
});
const zoneFormat = new Intl.DateTimeFormat("de-AT", {
  timeZone: site.location.timeZone,
  timeZoneName: "short",
});
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isAvailable(date: Date) {
  const parts = partsFormat.formatToParts(date);
  const day = weekdays.indexOf(parts.find((p) => p.type === "weekday")?.value ?? "");
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  const { days, from, to } = site.hours;
  return (days as readonly number[]).includes(day) && hour >= from && hour < to;
}

/**
 * Lebendiges Detail im Hero: Ortszeit in Feldkirch und ob gerade
 * Bürozeit ist. Rendert serverseitig einen ruhigen Platzhalter.
 */
export function LiveStatus() {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const now = seconds === null ? null : new Date(seconds * 1000);
  const available = now ? isAvailable(now) : null;
  const zone = now
    ? zoneFormat.formatToParts(now).find((p) => p.type === "timeZoneName")?.value
    : "";

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm sm:flex sm:items-baseline sm:gap-x-10">
      <div className="contents sm:flex sm:items-baseline sm:gap-3">
        <dt className="label text-muted">Feldkirch</dt>
        <dd className="font-medium text-fg tabular-nums">
          <time suppressHydrationWarning dateTime={now?.toISOString()}>
            {now ? timeFormat.format(now) : "--:--:--"}
          </time>{" "}
          <span className="text-muted">{zone}</span>
        </dd>
      </div>
      <div className="contents sm:flex sm:items-baseline sm:gap-3">
        <dt className="label text-muted">Status</dt>
        <dd className="flex items-center gap-2 font-medium text-fg" aria-live="polite">
          <span
            aria-hidden="true"
            className={`inline-block size-2 ${
              available ? "animate-pulse-dot bg-accent" : "border border-muted"
            }`}
          />
          {available === null
            ? " "
            : available
              ? "Gerade erreichbar"
              : "Antwort am nächsten Werktag"}
        </dd>
      </div>
    </dl>
  );
}
