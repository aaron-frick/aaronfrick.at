import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { About, Approach, Contact, Services } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <Approach />
      <Services />
      <About />
      <Contact />
    </>
  );
}
