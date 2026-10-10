"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { gym } from "@/data/gym";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const reduceMotion = useReducedMotion();

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, delay, ease: "easeOut" as const },
        };

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-dvh items-center overflow-hidden"
    >
      <Image
        src={gym.hero.image}
        alt={gym.hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/20 to-ink/70"
      />

      <div className="container-page w-full pt-28 pb-24 sm:pt-32">
        <div className="max-w-3xl">
          <motion.p {...fade(0)} className="eyebrow">
            <span className="h-px w-8 bg-brand" aria-hidden="true" />
            {gym.hero.eyebrow}
          </motion.p>

          <motion.h1
            {...fade(0.08)}
            className="mt-5 font-display text-6xl leading-[0.9] tracking-tight text-foreground sm:text-7xl md:text-8xl"
          >
            ALFARERO{" "}
            <span className="text-brand">BODY GYM</span>
          </motion.h1>

          <motion.p
            {...fade(0.16)}
            className="mt-5 font-heading text-lg uppercase tracking-[0.12em] text-foreground/90 sm:text-2xl"
          >
            {gym.tagline}
          </motion.p>

          <motion.p
            {...fade(0.24)}
            className="mt-6 max-w-2xl text-base leading-relaxed text-fog sm:text-lg"
          >
            {gym.hero.description}
          </motion.p>

          <motion.div {...fade(0.32)} className="mt-9 flex flex-wrap gap-3">
            <a
              href={gym.hero.primaryCta.href}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 gap-2 px-6 text-sm font-semibold sm:text-base",
              )}
            >
              {gym.hero.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href={gym.hero.secondaryCta.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 gap-2 border-white/25 bg-white/5 px-6 text-sm font-semibold text-foreground hover:bg-white/10 sm:text-base",
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {gym.hero.secondaryCta.label}
            </a>
          </motion.div>

          <motion.dl
            {...fade(0.4)}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6"
          >
            {gym.hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-3xl text-brand sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-fog">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent"
      />
    </section>
  );
}
