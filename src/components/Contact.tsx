"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle, Phone, Send } from "lucide-react";
import { whatsappLink, type Gym } from "@/data/gym";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SocialIcon } from "@/components/SocialIcon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Contact({ content }: { content: Gym }) {
  const { contact } = content;
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");

  const inputClasses =
    "h-11 w-full rounded-lg border border-white/10 bg-ink px-4 text-sm text-foreground placeholder:text-fog/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = [
      `Hola, mi nombre es ${name.trim() || "..."}.`,
      goal.trim() ? `Me interesa: ${goal.trim()}.` : "",
      message.trim(),
    ]
      .filter(Boolean)
      .join(" ");
    window.open(
      whatsappLink(contact.whatsapp, text),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <section id="contacto" className="border-t border-white/5 bg-ink py-24">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <SectionHeading
            eyebrow={contact.eyebrow}
            title={contact.title}
            description={contact.description}
            className="max-w-none"
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappLink(contact.whatsapp, contact.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 gap-2 px-6 font-semibold",
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Escribir por WhatsApp
            </a>
            <a
              href={contact.phoneHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 gap-2 border-white/20 bg-white/5 px-6 font-semibold text-foreground hover:bg-white/10",
              )}
            >
              <Phone className="size-4" aria-hidden="true" />
              {contact.phone}
            </a>
          </div>

          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fog">
              Síguenos
            </p>
            <ul className="mt-4 flex gap-3">
              {contact.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-carbon text-foreground transition hover:border-brand hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <SocialIcon name={social.icon} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/5 bg-carbon p-6 sm:p-8"
          >
            <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-foreground">
              Cuéntanos tu objetivo
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Completa el formulario y te llevaremos a WhatsApp con el mensaje
              listo para enviar.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Tu nombre"
                  className={inputClasses}
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="goal"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  ¿Qué te interesa?
                </label>
                <input
                  id="goal"
                  name="goal"
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  placeholder="Musculación, funcional, fuerza..."
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Cuéntanos en qué podemos ayudarte"
                  rows={4}
                  className={cn(inputClasses, "h-auto resize-none py-3")}
                />
              </div>
            </div>

            <button
              type="submit"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 h-12 w-full gap-2 font-semibold",
              )}
            >
              <Send className="size-4" aria-hidden="true" />
              Enviar por WhatsApp
            </button>
            <p className="mt-3 text-center text-xs leading-relaxed text-fog">
              {contact.formNote}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
