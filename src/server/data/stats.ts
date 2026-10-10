import "server-only";

import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { gymGallery, gymHours, gymSettings, gymTeam } from "@/db/schema";
import { requireAdminSession } from "@/server/auth/session";

export type DashboardStats = {
  galleryTotal: number;
  galleryVisible: number;
  teamTotal: number;
  teamVisible: number;
  hoursConfigured: number;
  settingsUpdatedAt: Date | null;
  generalConfigured: boolean;
  heroConfigured: boolean;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdminSession();
  const db = getDb();

  const [galleryTotal] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(gymGallery);
  const [galleryVisible] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(gymGallery)
    .where(eq(gymGallery.visible, true));
  const [teamTotal] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(gymTeam);
  const [teamVisible] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(gymTeam)
    .where(eq(gymTeam.visible, true));
  const [hours] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(gymHours);

  const settingsRows = await db
    .select()
    .from(gymSettings)
    .where(eq(gymSettings.id, 1))
    .limit(1);
  const settings = settingsRows[0];

  return {
    galleryTotal: galleryTotal?.value ?? 0,
    galleryVisible: galleryVisible?.value ?? 0,
    teamTotal: teamTotal?.value ?? 0,
    teamVisible: teamVisible?.value ?? 0,
    hoursConfigured: hours?.value ?? 0,
    settingsUpdatedAt: settings?.updatedAt ?? null,
    generalConfigured: Boolean(settings?.name && settings?.description),
    heroConfigured: Boolean(settings?.heroTitle && settings?.heroImagePath),
  };
}
