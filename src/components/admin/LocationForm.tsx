"use client";

import { useActionState } from "react";
import { updateLocationAction } from "@/server/actions/settings";
import { initialActionState } from "@/server/actions/state";
import { Input } from "@/components/ui/input";
import { Field } from "./Field";
import { FormFeedback } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";

export type LocationInitial = {
  addressLine: string;
  mapEmbedUrl: string;
  directionsUrl: string;
  directionsLabel: string;
};

export function LocationForm({ initial }: { initial: LocationInitial }) {
  const [state, formAction] = useActionState(
    updateLocationAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <Field
        label="Dirección"
        htmlFor="addressLine"
        error={state.fieldErrors?.addressLine}
      >
        <Input
          id="addressLine"
          name="addressLine"
          defaultValue={initial.addressLine}
          className="h-10"
        />
      </Field>

      <Field
        label="URL de inserción de Google Maps"
        htmlFor="mapEmbedUrl"
        error={state.fieldErrors?.mapEmbedUrl}
        hint="Google Maps → Compartir → Insertar un mapa. Si queda vacío, no se muestra mapa."
      >
        <Input
          id="mapEmbedUrl"
          name="mapEmbedUrl"
          defaultValue={initial.mapEmbedUrl}
          placeholder="https://www.google.com/maps/embed?pb=..."
          className="h-10"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="URL para obtener indicaciones"
          htmlFor="directionsUrl"
          error={state.fieldErrors?.directionsUrl}
        >
          <Input
            id="directionsUrl"
            name="directionsUrl"
            defaultValue={initial.directionsUrl}
            placeholder="https://www.google.com/maps/..."
            className="h-10"
          />
        </Field>
        <Field
          label="Texto del botón «Cómo llegar»"
          htmlFor="directionsLabel"
          error={state.fieldErrors?.directionsLabel}
        >
          <Input
            id="directionsLabel"
            name="directionsLabel"
            defaultValue={initial.directionsLabel}
            className="h-10"
          />
        </Field>
      </div>

      <FormFeedback state={state} />
      <SubmitButton className="h-10 px-5">Guardar ubicación</SubmitButton>
    </form>
  );
}
