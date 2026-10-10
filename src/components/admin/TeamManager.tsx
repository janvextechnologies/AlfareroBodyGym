"use client";

import { useActionState } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import {
  createTeamAction,
  deleteTeamAction,
  moveTeamAction,
  updateTeamAction,
} from "@/server/actions/team";
import { initialActionState } from "@/server/actions/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "./Field";
import { FormFeedback } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";
import { ImageField } from "./ImageField";
import { ConfirmButton } from "./ConfirmButton";

export type TeamMemberView = {
  id: string;
  name: string;
  role: string;
  specialties: string;
  description: string;
  imageUrl: string;
  visible: boolean;
};

function CreateTeamForm() {
  const [state, formAction] = useActionState(
    createTeamAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <ImageField
        name="image"
        label="Fotografía"
        hint="Opcional. JPG, PNG o WebP. Máximo 5 MB."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="new-name" error={state.fieldErrors?.name}>
          <Input id="new-name" name="name" className="h-10" />
        </Field>
        <Field label="Cargo" htmlFor="new-role" error={state.fieldErrors?.role}>
          <Input id="new-role" name="role" className="h-10" />
        </Field>
      </div>
      <Field
        label="Especialidades"
        htmlFor="new-specialties"
        error={state.fieldErrors?.specialties}
      >
        <Input id="new-specialties" name="specialties" className="h-10" />
      </Field>
      <Field
        label="Descripción"
        htmlFor="new-description"
        error={state.fieldErrors?.description}
      >
        <Textarea id="new-description" name="description" rows={3} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-fog">
        <input
          type="checkbox"
          name="visible"
          defaultChecked
          className="size-4 accent-brand"
        />
        Visible
      </label>
      <FormFeedback state={state} />
      <SubmitButton className="h-10 px-5">Agregar miembro</SubmitButton>
    </form>
  );
}

function TeamMemberRow({
  member,
  index,
  total,
}: {
  member: TeamMemberView;
  index: number;
  total: number;
}) {
  const [state, formAction] = useActionState(
    updateTeamAction,
    initialActionState,
  );

  return (
    <div className="rounded-xl border border-white/10 bg-ink/40 p-4">
      <div className="grid gap-4 lg:grid-cols-[10rem_1fr]">
        <div className="relative aspect-3/4 overflow-hidden rounded-lg border border-white/10 bg-ink">
          {member.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.imageUrl}
              alt={member.name || "Miembro del equipo"}
              className="size-full object-cover object-top"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-fog">
              Sin foto
            </div>
          )}
        </div>

        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" defaultValue={member.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Nombre"
              htmlFor={`name-${member.id}`}
              error={state.fieldErrors?.name}
            >
              <Input
                id={`name-${member.id}`}
                name="name"
                defaultValue={member.name}
                className="h-10"
              />
            </Field>
            <Field label="Cargo" htmlFor={`role-${member.id}`}>
              <Input
                id={`role-${member.id}`}
                name="role"
                defaultValue={member.role}
                className="h-10"
              />
            </Field>
          </div>
          <Field label="Especialidades" htmlFor={`spec-${member.id}`}>
            <Input
              id={`spec-${member.id}`}
              name="specialties"
              defaultValue={member.specialties}
              className="h-10"
            />
          </Field>
          <Field label="Descripción" htmlFor={`text-${member.id}`}>
            <Textarea
              id={`text-${member.id}`}
              name="description"
              defaultValue={member.description}
              rows={3}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-fog">
            <input
              type="checkbox"
              name="visible"
              defaultChecked={member.visible}
              className="size-4 accent-brand"
            />
            Visible
          </label>
          <ImageField
            name="image"
            label="Reemplazar fotografía (opcional)"
            currentUrl={member.imageUrl}
            hint="Déjalo vacío para conservar la actual."
          />
          <FormFeedback state={state} />
          <SubmitButton className="h-9 px-4">Guardar cambios</SubmitButton>
        </form>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
        <form action={moveTeamAction}>
          <input type="hidden" name="id" defaultValue={member.id} />
          <input type="hidden" name="direction" value="up" />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            disabled={index === 0}
            aria-label="Mover arriba"
            className="border-white/15 bg-white/5 text-foreground hover:bg-white/10"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </Button>
        </form>
        <form action={moveTeamAction}>
          <input type="hidden" name="id" defaultValue={member.id} />
          <input type="hidden" name="direction" value="down" />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            disabled={index === total - 1}
            aria-label="Mover abajo"
            className="border-white/15 bg-white/5 text-foreground hover:bg-white/10"
          >
            <ArrowDown className="size-4" aria-hidden="true" />
          </Button>
        </form>
        <form action={deleteTeamAction}>
          <input type="hidden" name="id" defaultValue={member.id} />
          <ConfirmButton
            message={`¿Eliminar a "${member.name}"? Esta acción no se puede deshacer.`}
            aria-label="Eliminar miembro"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}

export function TeamManager({ members }: { members: TeamMemberView[] }) {
  return (
    <div className="space-y-6">
      <CreateTeamForm />
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Miembros ({members.length})
        </h2>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no hay miembros del equipo.
          </p>
        ) : (
          members.map((member, index) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              index={index}
              total={members.length}
            />
          ))
        )}
      </div>
    </div>
  );
}
