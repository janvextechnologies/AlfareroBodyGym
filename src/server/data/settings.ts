import "server-only";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { gymSettings } from "@/db/schema";
import { requireAdminSession } from "@/server/auth/session";

export type GymSettings = typeof gymSettings.$inferSelect;
export type GymSettingsUpdate = Partial<
  Omit<typeof gymSettings.$inferInsert, "id">
>;

export async function getSettings(): Promise<GymSettings> {
  await requireAdminSession();
  const db = getDb();

  const rows = await db
    .select()
    .from(gymSettings)
    .where(eq(gymSettings.id, 1))
    .limit(1);
  if (rows[0]) return rows[0];

  const inserted = await db
    .insert(gymSettings)
    .values({ id: 1 })
    .returning();
  return inserted[0]!;
}

export async function updateSettings(data: GymSettingsUpdate): Promise<void> {
  await requireAdminSession();
  const db = getDb();

  const updated = await db
    .update(gymSettings)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(gymSettings.id, 1))
    .returning({ id: gymSettings.id });

  if (updated.length === 0) {
    await db.insert(gymSettings).values({ id: 1, ...data });
  }
}
