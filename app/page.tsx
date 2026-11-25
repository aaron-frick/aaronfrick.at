import { Hero } from "@/components/Hero";
import { About, Approach, Contact, Services } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Approach />
      <Services />
      <About />
      <Contact />
    </>
  );
}
