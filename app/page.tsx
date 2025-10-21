import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { BrandSection } from "@/components/BrandSection";
import { Services } from "@/components/Services";
import { Menu } from "@/components/Menu";
import { Schedule } from "@/components/Schedule";
import { Gallery } from "@/components/Gallery";
import { Booking } from "@/components/Booking";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <BrandSection />
      <Services />
      <Menu />
      <Schedule />
      <Gallery />
      <Booking />
      <Contact />
    </>
  );
}
