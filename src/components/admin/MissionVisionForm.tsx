"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateMissionVisionAction } from "@/server/actions/settings";
import { initialActionState } from "@/server/actions/state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field } from "./Field";
import { FormFeedback } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";

type ValueItem = { title: string; description: string };

export function MissionVisionForm({
  initial,
}: {
  initial: {
    missionTitle: string;
    missionDescription: string;
    visionTitle: string;
    visionDescription: string;
    values: ValueItem[];
  };
}) {
  const [state, formAction] = useActionState(
    updateMissionVisionAction,
    initialActionState,
  );
  const [values, setValues] = useState<ValueItem[]>(
    initial.values.length > 0
      ? initial.values
      : [{ title: "", description: "" }],
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-white/10 bg-ink/40 p-4">
          <Field
            label="Título de la misión"
            htmlFor="missionTitle"
            error={state.fieldErrors?.missionTitle}
          >
            <Input
              id="missionTitle"
              name="missionTitle"
              defaultValue={initial.missionTitle}
              className="h-10"
            />
          </Field>
          <Field
            label="Descripción de la misión"
            htmlFor="missionDescription"
            error={state.fieldErrors?.missionDescription}
          >
            <Textarea
              id="missionDescription"
              name="missionDescription"
              defaultValue={initial.missionDescription}
              rows={4}
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-xl border border-white/10 bg-ink/40 p-4">
          <Field
            label="Título de la visión"
            htmlFor="visionTitle"
            error={state.fieldErrors?.visionTitle}
          >
            <Input
              id="visionTitle"
              name="visionTitle"
              defaultValue={initial.visionTitle}
              className="h-10"
            />
          </Field>
          <Field
            label="Descripción de la visión"
            htmlFor="visionDescription"
            error={state.fieldErrors?.visionDescription}
          >
            <Textarea
              id="visionDescription"
              name="visionDescription"
              defaultValue={initial.visionDescription}
              rows={4}
            />
          </Field>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-base font-semibold text-foreground">
            Valores
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/15 bg-white/5 text-foreground hover:bg-white/10"
            onClick={() =>
              setValues((current) => [
                ...current,
                { title: "", description: "" },
              ])
            }
          >
            <Plus className="size-4" aria-hidden="true" />
            Agregar valor
          </Button>
        </div>

        <div className="space-y-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl border border-white/10 bg-ink/40 p-4 sm:grid-cols-[1fr_2fr_auto]"
            >
              <Input
                name="valueTitle"
                value={value.title}
                onChange={(event) =>
                  setValues((current) =>
                    current.map((item, i) =>
                      i === index ? { ...item, title: event.target.value } : item,
                    ),
                  )
                }
                placeholder="Título (ej. Disciplina)"
                className="h-10"
              />
              <Input
                name="valueDescription"
                value={value.description}
                onChange={(event) =>
                  setValues((current) =>
                    current.map((item, i) =>
                      i === index
                        ? { ...item, description: event.target.value }
                        : item,
                    ),
                  )
                }
                placeholder="Descripción breve"
                className="h-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Eliminar valor"
                className="text-fog hover:bg-brand/10 hover:text-brand"
                onClick={() =>
                  setValues((current) =>
                    current.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
          {values.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay valores. Agrega al menos uno.
            </p>
          ) : null}
        </div>
      </div>

      <FormFeedback state={state} />
      <SubmitButton className="h-10 px-5">Guardar misión, visión y valores</SubmitButton>
    </form>
  );
}
