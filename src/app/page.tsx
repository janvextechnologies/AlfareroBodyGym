import { getPublicContent } from "@/server/public/content";
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

export default async function Home() {
  const content = await getPublicContent();

  return (
    <>
      <Navbar content={content} />
      <main>
        <Hero content={content} />
        <About content={content} />
        <MissionVision content={content} />
        <Gallery content={content} />
        <Team content={content} />
        <Schedule content={content} />
        <Location content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </>
  );
}
