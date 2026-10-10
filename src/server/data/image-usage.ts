import "server-only";

import { and, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { gymGallery, gymSettings, gymTeam } from "@/db/schema";

type UsageOptions = {
  excludeGalleryId?: string;
  excludeTeamId?: string;
};

/**
 * Comprueba si una imagen sigue referenciada por otros registros antes de
 * eliminarla de Storage.
 */
export async function isImageInUse(
  path: string,
  options: UsageOptions = {},
): Promise<boolean> {
  if (!path) return false;
  const db = getDb();

  const settings = await db
    .select({
      logoPath: gymSettings.logoPath,
      heroImagePath: gymSettings.heroImagePath,
    })
    .from(gymSettings)
    .where(eq(gymSettings.id, 1))
    .limit(1);

  const current = settings[0];
  if (current && (current.logoPath === path || current.heroImagePath === path)) {
    return true;
  }

  const galleryCondition = options.excludeGalleryId
    ? and(
        eq(gymGallery.imagePath, path),
        ne(gymGallery.id, options.excludeGalleryId),
      )
    : eq(gymGallery.imagePath, path);

  const galleryMatch = await db
    .select({ id: gymGallery.id })
    .from(gymGallery)
    .where(galleryCondition)
    .limit(1);
  if (galleryMatch.length > 0) return true;

  const teamCondition = options.excludeTeamId
    ? and(eq(gymTeam.imagePath, path), ne(gymTeam.id, options.excludeTeamId))
    : eq(gymTeam.imagePath, path);

  const teamMatch = await db
    .select({ id: gymTeam.id })
    .from(gymTeam)
    .where(teamCondition)
    .limit(1);
  if (teamMatch.length > 0) return true;

  return false;
}
