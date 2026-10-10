import "server-only";

import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { gymTeam } from "@/db/schema";
import { requireAdminSession } from "@/server/auth/session";
import { deleteStoredImage } from "@/server/storage/images";
import { isImageInUse } from "./image-usage";

export type TeamMember = typeof gymTeam.$inferSelect;

export type TeamMemberInput = {
  name: string;
  role: string;
  specialties: string;
  description: string;
  imagePath: string | null;
  visible: boolean;
};

export async function listTeam(): Promise<TeamMember[]> {
  await requireAdminSession();
  return getDb()
    .select()
    .from(gymTeam)
    .orderBy(asc(gymTeam.sortOrder), asc(gymTeam.createdAt));
}

export async function getTeamMember(id: string): Promise<TeamMember | null> {
  await requireAdminSession();
  const rows = await getDb()
    .select()
    .from(gymTeam)
    .where(eq(gymTeam.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createTeamMember(
  input: TeamMemberInput,
): Promise<void> {
  await requireAdminSession();
  const db = getDb();

  const rows = await db
    .select({ value: sql<number>`coalesce(max(${gymTeam.sortOrder}), -1)` })
    .from(gymTeam);
  const nextOrder = (rows[0]?.value ?? -1) + 1;

  await db.insert(gymTeam).values({ ...input, sortOrder: nextOrder });
}

export async function updateTeamMember(
  id: string,
  input: Partial<TeamMemberInput>,
): Promise<void> {
  await requireAdminSession();
  await getDb()
    .update(gymTeam)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(gymTeam.id, id));
}

export async function setTeamVisibility(
  id: string,
  visible: boolean,
): Promise<void> {
  await requireAdminSession();
  await getDb()
    .update(gymTeam)
    .set({ visible, updatedAt: new Date() })
    .where(eq(gymTeam.id, id));
}

export async function moveTeamMember(
  id: string,
  direction: "up" | "down",
): Promise<void> {
  await requireAdminSession();
  const db = getDb();

  const items = await db
    .select()
    .from(gymTeam)
    .orderBy(asc(gymTeam.sortOrder), asc(gymTeam.createdAt));

  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= items.length) return;

  const reordered = [...items];
  [reordered[index], reordered[target]] = [
    reordered[target],
    reordered[index],
  ];

  await Promise.all(
    reordered.map((item, order) =>
      db
        .update(gymTeam)
        .set({ sortOrder: order, updatedAt: new Date() })
        .where(eq(gymTeam.id, item.id)),
    ),
  );
}

export async function deleteTeamMember(
  id: string,
): Promise<{ imageDeleted: boolean }> {
  await requireAdminSession();
  const db = getDb();

  const rows = await db
    .select()
    .from(gymTeam)
    .where(eq(gymTeam.id, id))
    .limit(1);
  const member = rows[0];
  if (!member) return { imageDeleted: false };

  const inUse =
    member.imagePath != null &&
    (await isImageInUse(member.imagePath, { excludeTeamId: id }));
  await db.delete(gymTeam).where(eq(gymTeam.id, id));

  if (member.imagePath && !inUse) {
    await deleteStoredImage(member.imagePath).catch(() => undefined);
    return { imageDeleted: true };
  }
  return { imageDeleted: false };
}
