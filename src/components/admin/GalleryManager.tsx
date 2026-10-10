"use client";

import { useActionState } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import {
  createGalleryAction,
  deleteGalleryAction,
  moveGalleryAction,
  updateGalleryAction,
} from "@/server/actions/gallery";
import { initialActionState } from "@/server/actions/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "./Field";
import { FormFeedback } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";
import { ImageField } from "./ImageField";
import { ConfirmButton } from "./ConfirmButton";

export type GalleryItemView = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  span: string;
  visible: boolean;
};

function SpanSelect({
  id,
  defaultValue,
}: {
  id: string;
  defaultValue: string;
}) {
  return (
    <select
      id={id}
      name="span"
      defaultValue={defaultValue}
      className="h-10 w-full rounded-lg border border-input bg-ink px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
    >
      <option value="normal">Normal</option>
      <option value="wide">Ancho (2 columnas)</option>
      <option value="tall">Alto (2 filas)</option>
    </select>
  );
}

function CreateGalleryForm() {
  const [state, formAction] = useActionState(
    createGalleryAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <ImageField name="image" label="Imagen" />
      <Field label="Título" htmlFor="new-title" error={state.fieldErrors?.title}>
        <Input id="new-title" name="title" className="h-10" />
      </Field>
      <Field
        label="Descripción / texto alternativo"
        htmlFor="new-description"
        error={state.fieldErrors?.description}
      >
        <Textarea id="new-description" name="description" rows={2} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tamaño en la galería" htmlFor="new-span">
          <SpanSelect id="new-span" defaultValue="normal" />
        </Field>
        <label className="flex items-end gap-2 pb-2 text-sm text-fog">
          <input
            type="checkbox"
            name="visible"
            defaultChecked
            className="size-4 accent-brand"
          />
          Visible
        </label>
      </div>
      <FormFeedback state={state} />
      <SubmitButton className="h-10 px-5">Agregar a la galería</SubmitButton>
    </form>
  );
}

function GalleryItemRow({
  item,
  index,
  total,
}: {
  item: GalleryItemView;
  index: number;
  total: number;
}) {
  const [state, formAction] = useActionState(
    updateGalleryAction,
    initialActionState,
  );

  return (
    <div className="rounded-xl border border-white/10 bg-ink/40 p-4">
      <div className="grid gap-4 lg:grid-cols-[10rem_1fr]">
        <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-white/10 bg-ink">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title || "Imagen de la galería"}
              className="size-full object-cover"
            />
          ) : null}
        </div>

        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" defaultValue={item.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Título"
              htmlFor={`title-${item.id}`}
              error={state.fieldErrors?.title}
            >
              <Input
                id={`title-${item.id}`}
                name="title"
                defaultValue={item.title}
                className="h-10"
              />
            </Field>
            <Field
              label="Descripción / alt"
              htmlFor={`desc-${item.id}`}
              error={state.fieldErrors?.description}
            >
              <Input
                id={`desc-${item.id}`}
                name="description"
                defaultValue={item.description}
                className="h-10"
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Tamaño" htmlFor={`span-${item.id}`}>
              <SpanSelect id={`span-${item.id}`} defaultValue={item.span} />
            </Field>
            <label className="flex items-end gap-2 pb-2 text-sm text-fog">
              <input
                type="checkbox"
                name="visible"
                defaultChecked={item.visible}
                className="size-4 accent-brand"
              />
              Visible
            </label>
          </div>

          <ImageField
            name="image"
            label="Reemplazar imagen (opcional)"
            currentUrl={item.imageUrl}
            hint="Déjalo vacío para conservar la imagen actual."
          />

          <FormFeedback state={state} />
          <SubmitButton className="h-9 px-4">Guardar cambios</SubmitButton>
        </form>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
        <form action={moveGalleryAction}>
          <input type="hidden" name="id" defaultValue={item.id} />
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
        <form action={moveGalleryAction}>
          <input type="hidden" name="id" defaultValue={item.id} />
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
        <form action={deleteGalleryAction}>
          <input type="hidden" name="id" defaultValue={item.id} />
          <ConfirmButton
            message={`¿Eliminar "${item.title || "esta imagen"}"? Esta acción no se puede deshacer.`}
            aria-label="Eliminar imagen"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}

export function GalleryManager({ items }: { items: GalleryItemView[] }) {
  return (
    <div className="space-y-6">
      <CreateGalleryForm />
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Imágenes ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no hay imágenes en la galería.
          </p>
        ) : (
          items.map((item, index) => (
            <GalleryItemRow
              key={item.id}
              item={item}
              index={index}
              total={items.length}
            />
          ))
        )}
      </div>
    </div>
  );
}
