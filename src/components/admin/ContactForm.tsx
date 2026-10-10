"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateContactAction } from "@/server/actions/settings";
import { initialActionState } from "@/server/actions/state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "./Field";
import { FormFeedback } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";

type SocialItem = {
  label: string;
  href: string;
  icon: string;
};

const ICON_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "youtube", label: "YouTube" },
];

export type ContactInitial = {
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  socials: SocialItem[];
};

export function ContactForm({ initial }: { initial: ContactInitial }) {
  const [state, formAction] = useActionState(
    updateContactAction,
    initialActionState,
  );
  const [socials, setSocials] = useState<SocialItem[]>(
    initial.socials.length > 0 ? initial.socials : [],
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Teléfono"
          htmlFor="contactPhone"
          error={state.fieldErrors?.contactPhone}
        >
          <Input
            id="contactPhone"
            name="contactPhone"
            defaultValue={initial.contactPhone}
            className="h-10"
          />
        </Field>
        <Field
          label="WhatsApp"
          htmlFor="contactWhatsapp"
          error={state.fieldErrors?.contactWhatsapp}
          hint="Solo dígitos, formato internacional. Ej: 50589749236"
        >
          <Input
            id="contactWhatsapp"
            name="contactWhatsapp"
            defaultValue={initial.contactWhatsapp}
            className="h-10"
          />
        </Field>
      </div>

      <Field
        label="Correo electrónico de contacto"
        htmlFor="contactEmail"
        error={state.fieldErrors?.contactEmail}
      >
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          defaultValue={initial.contactEmail}
          className="h-10"
        />
      </Field>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-base font-semibold text-foreground">
            Redes sociales
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/15 bg-white/5 text-foreground hover:bg-white/10"
            onClick={() =>
              setSocials((current) => [
                ...current,
                { label: "", href: "", icon: "facebook" },
              ])
            }
          >
            <Plus className="size-4" aria-hidden="true" />
            Agregar red
          </Button>
        </div>

        <div className="space-y-3">
          {socials.map((social, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl border border-white/10 bg-ink/40 p-4 sm:grid-cols-[auto_1fr_2fr_auto]"
            >
              <select
                name="socialIcon"
                value={social.icon}
                onChange={(event) =>
                  setSocials((current) =>
                    current.map((item, i) =>
                      i === index ? { ...item, icon: event.target.value } : item,
                    ),
                  )
                }
                aria-label="Tipo de red social"
                className="h-10 rounded-lg border border-input bg-ink px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              >
                {ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Input
                name="socialLabel"
                value={social.label}
                onChange={(event) =>
                  setSocials((current) =>
                    current.map((item, i) =>
                      i === index ? { ...item, label: event.target.value } : item,
                    ),
                  )
                }
                placeholder="Etiqueta"
                className="h-10"
              />
              <Input
                name="socialHref"
                value={social.href}
                onChange={(event) =>
                  setSocials((current) =>
                    current.map((item, i) =>
                      i === index ? { ...item, href: event.target.value } : item,
                    ),
                  )
                }
                placeholder="https://..."
                className="h-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Eliminar red social"
                className="text-fog hover:bg-brand/10 hover:text-brand"
                onClick={() =>
                  setSocials((current) =>
                    current.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
          {socials.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay redes sociales. Puedes agregarlas si lo necesitas.
            </p>
          ) : null}
        </div>
      </div>

      <FormFeedback state={state} />
      <SubmitButton className="h-10 px-5">Guardar contacto</SubmitButton>
    </form>
  );
}
