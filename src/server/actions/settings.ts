"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdminSession } from "@/server/auth/session";
import { PUBLIC_CONTENT_TAG } from "@/server/public/tags";
import {
  getSettings,
  updateSettings,
  type GymSettingsUpdate,
} from "@/server/data/settings";
import { isImageInUse } from "@/server/data/image-usage";
import { deleteStoredImage, uploadImage, validateImageFile } from "@/server/storage/images";
import {
  contactSchema,
  generalInfoSchema,
  heroSchema,
  locationSchema,
  missionVisionSchema,
} from "@/server/validation/schemas";
import { getFile, getString, toActionError } from "./helpers";
import type { ActionState } from "./state";

export async function updateGeneralInfoAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const parsed = generalInfoSchema.safeParse({
    name: getString(formData, "name"),
    shortName: getString(formData, "shortName"),
    tagline: getString(formData, "tagline"),
    description: getString(formData, "description"),
    history: getString(formData, "history"),
    city: getString(formData, "city"),
  });
  if (!parsed.success) return toActionError(parsed.error);

  await updateSettings(parsed.data);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/informacion");
  revalidatePath("/admin/dashboard");
  return { status: "success", message: "Información general guardada." };
}

export async function updateHeroAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const parsed = heroSchema.safeParse({
    heroTitle: getString(formData, "heroTitle"),
    heroEyebrow: getString(formData, "heroEyebrow"),
    heroTagline: getString(formData, "heroTagline"),
    heroDescription: getString(formData, "heroDescription"),
    heroImageAlt: getString(formData, "heroImageAlt"),
    heroPrimaryLabel: getString(formData, "heroPrimaryLabel"),
    heroPrimaryHref: getString(formData, "heroPrimaryHref"),
    heroSecondaryLabel: getString(formData, "heroSecondaryLabel"),
    heroSecondaryHref: getString(formData, "heroSecondaryHref"),
  });
  if (!parsed.success) return toActionError(parsed.error);

  const update: GymSettingsUpdate = { ...parsed.data };
  const current = await getSettings();

  const heroFile = getFile(formData, "heroImage");
  if (heroFile) {
    const fileError = validateImageFile(heroFile);
    if (fileError) return { status: "error", message: fileError };
    const newPath = await uploadImage(heroFile, "hero");
    update.heroImagePath = newPath;
    if (current.heroImagePath && current.heroImagePath !== newPath) {
      const inUse = await isImageInUse(current.heroImagePath);
      if (!inUse) {
        await deleteStoredImage(current.heroImagePath).catch(() => undefined);
      }
    }
  }

  const logoFile = getFile(formData, "logo");
  if (logoFile) {
    const fileError = validateImageFile(logoFile);
    if (fileError) return { status: "error", message: fileError };
    const newPath = await uploadImage(logoFile, "brand");
    update.logoPath = newPath;
    if (current.logoPath && current.logoPath !== newPath) {
      const inUse = await isImageInUse(current.logoPath);
      if (!inUse) {
        await deleteStoredImage(current.logoPath).catch(() => undefined);
      }
    }
  }

  await updateSettings(update);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/portada");
  return { status: "success", message: "Portada y logo actualizados." };
}

export async function updateMissionVisionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const titles = formData.getAll("valueTitle").map((value) => String(value).trim());
  const descriptions = formData
    .getAll("valueDescription")
    .map((value) => String(value).trim());
  const values = titles
    .map((title, index) => ({ title, description: descriptions[index] ?? "" }))
    .filter((value) => value.title.length > 0 || value.description.length > 0);

  const parsed = missionVisionSchema.safeParse({
    missionTitle: getString(formData, "missionTitle"),
    missionDescription: getString(formData, "missionDescription"),
    visionTitle: getString(formData, "visionTitle"),
    visionDescription: getString(formData, "visionDescription"),
    values,
  });
  if (!parsed.success) return toActionError(parsed.error);

  await updateSettings(parsed.data);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/mision-vision");
  return { status: "success", message: "Misión, visión y valores guardados." };
}

export async function updateLocationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const parsed = locationSchema.safeParse({
    addressLine: getString(formData, "addressLine"),
    mapEmbedUrl: getString(formData, "mapEmbedUrl"),
    directionsUrl: getString(formData, "directionsUrl"),
    directionsLabel: getString(formData, "directionsLabel"),
  });
  if (!parsed.success) return toActionError(parsed.error);

  await updateSettings(parsed.data);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/ubicacion");
  return { status: "success", message: "Ubicación guardada." };
}

export async function updateContactAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const labels = formData.getAll("socialLabel").map((value) => String(value).trim());
  const hrefs = formData.getAll("socialHref").map((value) => String(value).trim());
  const icons = formData.getAll("socialIcon").map((value) => String(value).trim());
  const socials = labels
    .map((label, index) => ({
      label,
      href: hrefs[index] ?? "",
      icon: (icons[index] || "facebook") as
        | "facebook"
        | "instagram"
        | "tiktok"
        | "whatsapp"
        | "youtube",
    }))
    .filter((social) => social.label.length > 0 || social.href.length > 0);

  const parsed = contactSchema.safeParse({
    contactPhone: getString(formData, "contactPhone"),
    contactWhatsapp: getString(formData, "contactWhatsapp"),
    contactEmail: getString(formData, "contactEmail"),
    socials,
  });
  if (!parsed.success) return toActionError(parsed.error);

  await updateSettings(parsed.data);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/contacto");
  return { status: "success", message: "Contacto y redes guardados." };
}
