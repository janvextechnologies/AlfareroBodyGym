import Image from "next/image";
import {
  ShieldCheck,
  HeartHandshake,
  Users,
  TrendingUp,
  Check,
  type LucideIcon,
} from "lucide-react";
import type { Gym } from "@/data/gym";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Card } from "@/components/ui/card";

const valueIcons: LucideIcon[] = [
  ShieldCheck,
  HeartHandshake,
  Users,
  TrendingUp,
];

export function About({ content }: { content: Gym }) {
  const { about } = content;

  return (
    <section id="nosotros" className="border-b border-white/5 bg-ink py-24">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src={about.image}
                alt={about.imageAlt}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-4/3 w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/90 to-transparent"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <SectionHeading
              eyebrow={about.eyebrow}
              title={about.title}
              className="max-w-none"
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-brand/30 bg-brand/5 p-5">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-brand">
                {about.philosophyTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                {about.philosophy}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-20">
          <Reveal>
            <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
              {about.valuesTitle}
            </h3>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((value, index) => {
              const Icon = valueIcons[index] ?? ShieldCheck;
              return (
                <Reveal key={value.title} delay={index * 0.06}>
                  <Card className="h-full gap-3 border border-white/5 bg-carbon p-5 ring-0">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-brand/12 text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h4 className="font-heading text-lg font-semibold text-foreground">
                      {value.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div className="mt-20 grid gap-8 rounded-2xl border border-white/5 bg-carbon p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal>
            <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
              {about.benefitsTitle}
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {about.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
