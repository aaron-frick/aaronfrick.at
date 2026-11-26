import { Cover } from "@/components/Cover";
import { Hero } from "@/components/Hero";
import { About, Projects } from "@/components/sections";
import { SignatureOutro } from "@/components/Signature";

export default function Home() {
  return (
    <>
      <Cover />
      {/* Schiebt sich beim Scrollen wie ein Vorhang über das stehende Cover */}
      <div className="relative z-10 bg-bg">
        <Hero />
        <Projects />
        <About />
        <SignatureOutro />
      </div>
    </>
  );
}
