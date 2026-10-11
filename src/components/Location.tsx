import { MapPin, Navigation } from "lucide-react";
import { type Gym } from "@/data/gym";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Location({ content }: { content: Gym }) {
  const { location } = content;

  return (
    <section id="ubicacion" className="bg-background py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={location.eyebrow}
            title={location.title}
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/5 bg-carbon p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand/12 text-brand">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold uppercase tracking-wide text-foreground">
                    Dirección
                  </h3>
                  <address className="mt-2 not-italic leading-relaxed text-muted-foreground">
                    {location.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </div>

              <a
                href={location.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-6 h-11 w-full gap-2 px-5 font-semibold sm:w-auto",
                )}
              >
                <Navigation className="size-4" aria-hidden="true" />
                {location.directionsLabel}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full min-h-[320px] overflow-hidden rounded-2xl border border-white/5 bg-carbon">
              {location.mapEmbedUrl ? (
                <iframe
                  title={`Mapa de ubicación de ${content.name}`}
                  src={location.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[320px] w-full border-0 grayscale-[0.2]"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-brand/12 text-brand">
                    <MapPin className="size-7" aria-hidden="true" />
                  </span>
                  <p className="font-heading text-lg font-semibold uppercase tracking-wide text-foreground">
                    Mapa no disponible
                  </p>
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Agrega la URL de inserción de Google Maps en
                    <span className="mx-1 rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-foreground">
                      content.location.mapEmbedUrl
                    </span>
                    para mostrar aquí el mapa real del gimnasio.
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
