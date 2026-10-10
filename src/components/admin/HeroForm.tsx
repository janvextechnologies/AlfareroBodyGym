"use client";

import { useActionState } from "react";
import { updateHeroAction } from "@/server/actions/settings";
import { initialActionState } from "@/server/actions/state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "./Field";
import { FormFeedback } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";
import { ImageField } from "./ImageField";

export type HeroInitial = {
  heroTitle: string;
  heroEyebrow: string;
  heroTagline: string;
  heroDescription: string;
  heroImageAlt: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  heroImageUrl: string | null;
  logoUrl: string | null;
};

export function HeroForm({ initial }: { initial: HeroInitial }) {
  const [state, formAction] = useActionState(
    updateHeroAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Título principal"
          htmlFor="heroTitle"
          error={state.fieldErrors?.heroTitle}
        >
          <Input
            id="heroTitle"
            name="heroTitle"
            defaultValue={initial.heroTitle}
            className="h-10"
          />
        </Field>
        <Field
          label="Antetítulo (eyebrow)"
          htmlFor="heroEyebrow"
          error={state.fieldErrors?.heroEyebrow}
        >
          <Input
            id="heroEyebrow"
            name="heroEyebrow"
            defaultValue={initial.heroEyebrow}
            className="h-10"
          />
        </Field>
      </div>

      <Field
        label="Eslogan de portada"
        htmlFor="heroTagline"
        error={state.fieldErrors?.heroTagline}
      >
        <Input
          id="heroTagline"
          name="heroTagline"
          defaultValue={initial.heroTagline}
          className="h-10"
        />
      </Field>

      <Field
        label="Descripción"
        htmlFor="heroDescription"
        error={state.fieldErrors?.heroDescription}
      >
        <Textarea
          id="heroDescription"
          name="heroDescription"
          defaultValue={initial.heroDescription}
          rows={3}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Botón principal — texto"
          htmlFor="heroPrimaryLabel"
          error={state.fieldErrors?.heroPrimaryLabel}
        >
          <Input
            id="heroPrimaryLabel"
            name="heroPrimaryLabel"
            defaultValue={initial.heroPrimaryLabel}
            className="h-10"
          />
        </Field>
        <Field
          label="Botón principal — destino"
          htmlFor="heroPrimaryHref"
          error={state.fieldErrors?.heroPrimaryHref}
          hint="Ej: #instalaciones o una URL."
        >
          <Input
            id="heroPrimaryHref"
            name="heroPrimaryHref"
            defaultValue={initial.heroPrimaryHref}
            className="h-10"
          />
        </Field>
        <Field
          label="Botón secundario — texto"
          htmlFor="heroSecondaryLabel"
          error={state.fieldErrors?.heroSecondaryLabel}
        >
          <Input
            id="heroSecondaryLabel"
            name="heroSecondaryLabel"
            defaultValue={initial.heroSecondaryLabel}
            className="h-10"
          />
        </Field>
        <Field
          label="Botón secundario — destino"
          htmlFor="heroSecondaryHref"
          error={state.fieldErrors?.heroSecondaryHref}
        >
          <Input
            id="heroSecondaryHref"
            name="heroSecondaryHref"
            defaultValue={initial.heroSecondaryHref}
            className="h-10"
          />
        </Field>
      </div>

      <Field
        label="Texto alternativo de la imagen de portada"
        htmlFor="heroImageAlt"
        error={state.fieldErrors?.heroImageAlt}
      >
        <Input
          id="heroImageAlt"
          name="heroImageAlt"
          defaultValue={initial.heroImageAlt}
          className="h-10"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <ImageField
          name="heroImage"
          label="Imagen de portada"
          currentUrl={initial.heroImageUrl}
        />
        <ImageField
          name="logo"
          label="Logo del gimnasio"
          currentUrl={initial.logoUrl}
        />
      </div>

      <FormFeedback state={state} />
      <SubmitButton className="h-10 px-5">Guardar portada</SubmitButton>
    </form>
  );
}
