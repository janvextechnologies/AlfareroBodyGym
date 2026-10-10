import { Target, Eye } from "lucide-react";
import { gym } from "@/data/gym";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/card";

export function MissionVision() {
  const { missionVision } = gym;

  const cards = [
    { ...missionVision.mission, Icon: Target, accent: "bg-brand/12 text-brand" },
    {
      ...missionVision.vision,
      Icon: Eye,
      accent: "bg-white/5 text-foreground",
    },
  ];

  return (
    <section className="bg-background py-24">
      <div className="container-page grid gap-6 md:grid-cols-2">
        {cards.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.1}>
            <Card className="relative h-full gap-4 overflow-hidden border border-white/5 bg-carbon p-8 ring-0">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-brand"
              />
              <span
                className={`flex size-12 items-center justify-center rounded-xl ${card.accent}`}
              >
                <card.Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
                {card.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
