"use client";

import { useActionState } from "react";
import { updateGeneralInfoAction } from "@/server/actions/settings";
import { initialActionState } from "@/server/actions/state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "./Field";
import { FormFeedback } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";

export type GeneralInfoInitial = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  history: string;
  city: string;
};

export function GeneralInfoForm({
  initial,
}: {
  initial: GeneralInfoInitial;
}) {
  const [state, formAction] = useActionState(
    updateGeneralInfoAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nombre del gimnasio"
          htmlFor="name"
          error={state.fieldErrors?.name}
        >
          <Input id="name" name="name" defaultValue={initial.name} className="h-10" />
        </Field>
        <Field
          label="Nombre corto"
          htmlFor="shortName"
          error={state.fieldErrors?.shortName}
        >
          <Input
            id="shortName"
            name="shortName"
            defaultValue={initial.shortName}
            className="h-10"
          />
        </Field>
      </div>

      <Field label="Eslogan" htmlFor="tagline" error={state.fieldErrors?.tagline}>
        <Input id="tagline" name="tagline" defaultValue={initial.tagline} className="h-10" />
      </Field>

      <Field
        label="Descripción"
        htmlFor="description"
        error={state.fieldErrors?.description}
      >
        <Textarea
          id="description"
          name="description"
          defaultValue={initial.description}
          rows={3}
        />
      </Field>

      <Field
        label="Historia / presentación del negocio"
        htmlFor="history"
        error={state.fieldErrors?.history}
        hint="Texto largo para presentar el gimnasio."
      >
        <Textarea
          id="history"
          name="history"
          defaultValue={initial.history}
          rows={7}
        />
      </Field>

      <Field label="Ciudad" htmlFor="city" error={state.fieldErrors?.city}>
        <Input id="city" name="city" defaultValue={initial.city} className="h-10" />
      </Field>

      <FormFeedback state={state} />
      <SubmitButton className="h-10 px-5">Guardar información</SubmitButton>
    </form>
  );
}
