import Image from "next/image";
import { MapPin, Mail } from "lucide-react";
import { type Gym } from "@/data/gym";
import { SocialIcon } from "@/components/SocialIcon";
import { CurrentYear } from "@/components/CurrentYear";

export function Footer({ content }: { content: Gym }) {

  return (
    <footer className="border-t border-white/10 bg-carbon">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <a
              href="#inicio"
              className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
            >
              <Image
                src={content.logo}
                alt={`Logotipo de ${content.name}`}
                width={56}
                height={56}
                className="h-12 w-12 rounded-md object-cover"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl tracking-wide text-foreground">
                  ALFARERO
                </span>
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-brand">
                  Body Gym
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {content.footer.tagline}
            </p>
            <ul className="mt-5 flex gap-3">
              {content.contact.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-ink text-foreground transition hover:border-brand hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <SocialIcon name={social.icon} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Enlaces del pie de página">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Navegación
            </h2>
            <ul className="mt-4 space-y-2">
              {content.nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Contacto
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                <span>{content.location.addressLines.join(", ")}</span>
              </li>
              <li>
                <a
                  href={`mailto:${content.contact.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-brand"
                >
                  <Mail className="size-4 shrink-0 text-brand" aria-hidden="true" />
                  {content.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-fog">
            © <CurrentYear /> {content.name}. Todos los derechos reservados.
          </p>
          <a
            href="https://www.janvextechnologies.com/es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-fog transition-colors hover:text-brand"
          >
            Desarrollado por Janvex Technologies
          </a>
        </div>
      </div>
    </footer>
  );
}
