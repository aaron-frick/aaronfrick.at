import Image from "next/image";
import loeweHell from "@/public/brand/loewe-hell.png";
import { IntroDone } from "./IntroDone";
import { Wordmark } from "./Logo";

/** Läuft vor dem ersten Paint: Intro nur einmal pro Sitzung zeigen. */
const introScript = `try{var s=sessionStorage;if(s.getItem("frick-intro")){document.documentElement.dataset.intro="skip"}else{s.setItem("frick-intro","1")}}catch(e){}`;

/**
 * Intro auf der Startseite, reines CSS (siehe globals.css):
 * 1. Akzentbalken oben füllt sich (Ladebalken)
 * 2. Der Löwe baut sich von unten nach oben auf
 * 3. „Frick.“ steigt auf
 * 4. Die Navy-Fläche gleitet nach oben weg, der Hero steigt auf
 * Bei wiederholtem Aufruf in derselben Sitzung und bei „Bewegung reduzieren“ entfällt es.
 */
export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <div
        aria-hidden="true"
        className="intro dark fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg text-fg"
      >
        <span className="intro-bar absolute inset-x-0 top-0 block h-1 origin-left bg-accent" />
        <Image
          src={loeweHell}
          alt=""
          priority
          sizes="(min-width: 640px) 192px, 144px"
          className="intro-lion h-44 w-auto sm:h-56"
        />
        <span className="intro-word mt-10 block text-5xl sm:text-6xl">
          <Wordmark />
        </span>
      </div>
      <IntroDone />
    </>
  );
}
