import { Cover } from "@/components/Cover";
import { Hero } from "@/components/Hero";
import { About, Projects } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Cover />
      <Hero />
      <Projects />
      <About />
    </>
  );
}
