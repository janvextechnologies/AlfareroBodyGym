import "server-only";

import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { gymGallery } from "@/db/schema";
import { requireAdminSession } from "@/server/auth/session";
import { deleteStoredImage } from "@/server/storage/images";
import { isImageInUse } from "./image-usage";

export type GalleryItem = typeof gymGallery.$inferSelect;

export type GalleryItemInput = {
  imagePath: string;
  title: string;
  description: string;
  span: string;
  visible: boolean;
};

export async function listGallery(): Promise<GalleryItem[]> {
  await requireAdminSession();
  return getDb()
    .select()
    .from(gymGallery)
    .orderBy(asc(gymGallery.sortOrder), asc(gymGallery.createdAt));
}

export async function getGalleryItem(
  id: string,
): Promise<GalleryItem | null> {
  await requireAdminSession();
  const rows = await getDb()
    .select()
    .from(gymGallery)
    .where(eq(gymGallery.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createGalleryItem(
  input: GalleryItemInput,
): Promise<void> {
  await requireAdminSession();
  const db = getDb();

  const rows = await db
    .select({ value: sql<number>`coalesce(max(${gymGallery.sortOrder}), -1)` })
    .from(gymGallery);
  const nextOrder = (rows[0]?.value ?? -1) + 1;

  await db.insert(gymGallery).values({ ...input, sortOrder: nextOrder });
}

export async function updateGalleryItem(
  id: string,
  input: Partial<GalleryItemInput>,
): Promise<void> {
  await requireAdminSession();
  await getDb()
    .update(gymGallery)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(gymGallery.id, id));
}

export async function setGalleryVisibility(
  id: string,
  visible: boolean,
): Promise<void> {
  await requireAdminSession();
  await getDb()
    .update(gymGallery)
    .set({ visible, updatedAt: new Date() })
    .where(eq(gymGallery.id, id));
}

export async function moveGalleryItem(
  id: string,
  direction: "up" | "down",
): Promise<void> {
  await requireAdminSession();
  const db = getDb();

  const items = await db
    .select()
    .from(gymGallery)
    .orderBy(asc(gymGallery.sortOrder), asc(gymGallery.createdAt));

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
        .update(gymGallery)
        .set({ sortOrder: order, updatedAt: new Date() })
        .where(eq(gymGallery.id, item.id)),
    ),
  );
}

export async function deleteGalleryItem(
  id: string,
): Promise<{ imageDeleted: boolean }> {
  await requireAdminSession();
  const db = getDb();

  const rows = await db
    .select()
    .from(gymGallery)
    .where(eq(gymGallery.id, id))
    .limit(1);
  const item = rows[0];
  if (!item) return { imageDeleted: false };

  const inUse = await isImageInUse(item.imagePath, { excludeGalleryId: id });
  await db.delete(gymGallery).where(eq(gymGallery.id, id));

  if (!inUse) {
    await deleteStoredImage(item.imagePath).catch(() => undefined);
    return { imageDeleted: true };
  }
  return { imageDeleted: false };
}
