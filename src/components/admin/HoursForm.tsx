"use client";

import { useActionState, useState } from "react";
import { updateHoursAction } from "@/server/actions/hours";
import { initialActionState } from "@/server/actions/state";
import { Input } from "@/components/ui/input";
import { FormFeedback } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";

export type HourRow = {
  dayOfWeek: number;
  label: string;
  opensAt: string | null;
  closesAt: string | null;
  closed: boolean;
};

export function HoursForm({ initial }: { initial: HourRow[] }) {
  const [state, formAction] = useActionState(
    updateHoursAction,
    initialActionState,
  );
  const [rows, setRows] = useState<HourRow[]>(initial);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={row.dayOfWeek}
            className="grid items-center gap-3 rounded-xl border border-white/10 bg-ink/40 p-4 sm:grid-cols-[8rem_1fr_1fr_auto]"
          >
            <input type="hidden" name={`label_${index}`} defaultValue={row.label} />
            <span className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              {row.label}
            </span>
            <Input
              type="time"
              name={`opens_${index}`}
              defaultValue={row.opensAt ?? ""}
              disabled={row.closed}
              aria-label={`Apertura ${row.label}`}
              className="h-10"
            />
            <Input
              type="time"
              name={`closes_${index}`}
              defaultValue={row.closesAt ?? ""}
              disabled={row.closed}
              aria-label={`Cierre ${row.label}`}
              className="h-10"
            />
            <label className="flex items-center gap-2 whitespace-nowrap text-sm text-fog">
              <input
                type="checkbox"
                name={`closed_${index}`}
                defaultChecked={row.closed}
                onChange={(event) =>
                  setRows((current) =>
                    current.map((item, i) =>
                      i === index
                        ? { ...item, closed: event.target.checked }
                        : item,
                    ),
                  )
                }
                className="size-4 accent-brand"
              />
              Cerrado
            </label>
          </div>
        ))}
      </div>

      <FormFeedback state={state} />
      <SubmitButton className="h-10 px-5">Guardar horarios</SubmitButton>
    </form>
  );
}
