import Image from "next/image";
import { gym } from "@/data/gym";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";

export function Team() {
  const { team } = gym;

  return (
    <section id="equipo" className="bg-background py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={team.eyebrow}
            title={team.title}
            // description={team.note}
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.members.map((member, index) => (
            <Reveal key={`${member.role}-${index}`} delay={index * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-carbon">
                <div className="relative">
                  <Image
                    src={member.image}
                    alt={`${member.role} de ${gym.name} (perfil de ejemplo)`}
                    width={800}
                    height={1000}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-3/4 w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="font-heading text-sm font-semibold uppercase tracking-wider text-brand">
                    {member.role}
                  </p>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium uppercase tracking-wide text-fog">
                    {member.specialty}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {member.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
