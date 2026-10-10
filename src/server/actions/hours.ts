"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdminSession } from "@/server/auth/session";
import { PUBLIC_CONTENT_TAG } from "@/server/public/tags";
import { saveHours } from "@/server/data/hours";
import { hoursSchema } from "@/server/validation/schemas";
import { getBoolean, getString, toActionError } from "./helpers";
import type { ActionState } from "./state";

export async function updateHoursAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const rows = Array.from({ length: 7 }, (_, index) => {
    const closed = getBoolean(formData, `closed_${index}`);
    const opens = getString(formData, `opens_${index}`);
    const closes = getString(formData, `closes_${index}`);
    return {
      dayOfWeek: index,
      label: getString(formData, `label_${index}`) || `Día ${index + 1}`,
      opensAt: closed ? null : opens || null,
      closesAt: closed ? null : closes || null,
      closed,
      sortOrder: index,
    };
  });

  const parsed = hoursSchema.safeParse(rows);
  if (!parsed.success) return toActionError(parsed.error);

  await saveHours(parsed.data);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/horarios");
  revalidatePath("/admin/dashboard");
  return { status: "success", message: "Horarios guardados." };
}
