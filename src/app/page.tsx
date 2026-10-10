import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { MissionVision } from "@/components/MissionVision";
import { Gallery } from "@/components/Gallery";
import { Team } from "@/components/Team";
import { Schedule } from "@/components/Schedule";
import { Location } from "@/components/Location";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <MissionVision />
        <Gallery />
        <Team />
        <Schedule />
        <Location />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
