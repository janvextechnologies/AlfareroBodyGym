"use client";

import Image from "next/image";
import { useState } from "react";
import { ZoomIn, X } from "lucide-react";
import { gym } from "@/data/gym";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const spanClasses: Record<NonNullable<(typeof gym.gallery.images)[number]["span"]>, string> = {
  normal: "col-span-1 row-span-1",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
};

export function Gallery() {
  const { gallery } = gym;
  const [index, setIndex] = useState<number | null>(null);
  const active = index === null ? null : gallery.images[index];

  return (
    <section
      id="instalaciones"
      className="border-b border-white/5 bg-ink py-24"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={gallery.eyebrow}
            title={gallery.title}
            description={gallery.description}
          />
        </Reveal>

        <div className="mt-12 grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4">
          {gallery.images.map((image, i) => (
            <Reveal
              key={image.src}
              delay={(i % 4) * 0.05}
              className={cn("min-h-0", spanClasses[image.span ?? "normal"])}
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ampliar imagen: ${image.caption ?? image.alt}`}
                className="group relative size-full overflow-hidden rounded-xl ring-1 ring-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-80 transition group-hover:opacity-95"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 text-left sm:p-4">
                  <span className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground drop-shadow">
                    {image.caption}
                  </span>
                  <ZoomIn
                    className="size-4 shrink-0 text-brand opacity-0 transition group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={index !== null} onOpenChange={(open) => !open && setIndex(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[min(94vw,72rem)] gap-0 overflow-hidden border-white/10 bg-carbon p-0 ring-1"
        >
          {active ? (
            <>
              <DialogTitle className="sr-only">
                {active.caption ?? "Imagen de las instalaciones"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {active.alt}
              </DialogDescription>
              <div className="relative">
                <Image
                  src={active.src}
                  alt={active.alt}
                  width={1600}
                  height={1067}
                  sizes="94vw"
                  className="max-h-[78vh] w-full object-contain"
                />
                <DialogClose
                  aria-label="Cerrar imagen"
                  className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink/80 text-foreground ring-1 ring-white/15 transition hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <X className="size-5" aria-hidden="true" />
                </DialogClose>
                {active.caption ? (
                  <p className="border-t border-white/10 px-4 py-3 text-sm font-medium text-fog">
                    {active.caption}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
