import "server-only";

import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { gymHours } from "@/db/schema";
import { requireAdminSession } from "@/server/auth/session";

export type GymHour = typeof gymHours.$inferSelect;
export type GymHourInput = typeof gymHours.$inferInsert;

export async function listHours(): Promise<GymHour[]> {
  await requireAdminSession();
  return getDb().select().from(gymHours).orderBy(asc(gymHours.sortOrder));
}

export async function saveHours(rows: GymHourInput[]): Promise<void> {
  await requireAdminSession();
  const db = getDb();

  for (const row of rows) {
    await db
      .insert(gymHours)
      .values(row)
      .onConflictDoUpdate({
        target: gymHours.dayOfWeek,
        set: {
          label: row.label,
          opensAt: row.opensAt ?? null,
          closesAt: row.closesAt ?? null,
          closed: row.closed ?? false,
          sortOrder: row.sortOrder ?? 0,
        },
      });
  }
}
