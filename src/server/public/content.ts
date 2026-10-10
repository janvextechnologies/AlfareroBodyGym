import "server-only";

import { asc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { getDb } from "@/db";
import { gymGallery, gymHours, gymSettings, gymTeam } from "@/db/schema";
import { gym as staticGym, type Gym } from "@/data/gym";
import { resolveImageUrl } from "@/server/storage/urls";
import { PUBLIC_CONTENT_TAG } from "./tags";

type SettingsRow = typeof gymSettings.$inferSelect;
type HourRow = typeof gymHours.$inferSelect;
type GalleryRow = typeof gymGallery.$inferSelect;
type TeamRow = typeof gymTeam.$inferSelect;

function phoneToHref(phone: string | null | undefined): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^+\d]/g, "");
  if (!cleaned) return "";
  return `tel:${cleaned}`;
}

function buildContent(input: {
  settings: SettingsRow | null;
  hours: HourRow[];
  gallery: GalleryRow[];
  team: TeamRow[];
}): Gym {
  const { settings: s, hours, gallery, team } = input;
  const base = staticGym;

  const heroImage = resolveImageUrl(s?.heroImagePath) || base.hero.image;
  const logo = resolveImageUrl(s?.logoPath) || base.logo;

  const paragraphs = (s?.history ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const values =
    s?.values && s.values.length > 0 ? s.values : base.about.values;

  const galleryImages: Gym["gallery"]["images"] = gallery
    .filter((item) => item.visible && resolveImageUrl(item.imagePath))
    .map((item) => ({
      src: resolveImageUrl(item.imagePath),
      alt: item.description || item.title || base.gallery.images[0]?.alt || "",
      caption: item.title || undefined,
      span: item.span as Gym["gallery"]["images"][number]["span"],
    }));

  const teamMembers: Gym["team"]["members"] = team
    .filter((member) => member.visible)
    .map((member) => ({
      name: member.name,
      role: member.role,
      specialty: member.specialties,
      description: member.description,
      image: resolveImageUrl(member.imagePath),
    }));

  const days: Gym["schedule"]["days"] =
    hours.length > 0
      ? hours.map((hour) => ({
          day: hour.label,
          open: hour.opensAt,
          close: hour.closesAt,
          closed: hour.closed,
        }))
      : base.schedule.days;

  const socials: Gym["contact"]["socials"] =
    s?.socials && s.socials.length > 0
      ? s.socials.map((social) => ({
          label: social.label,
          href: social.href,
          icon: social.icon as Gym["contact"]["socials"][number]["icon"],
        }))
      : base.contact.socials;

  return {
    ...base,
    name: s?.name || base.name,
    shortName: s?.shortName || base.shortName,
    tagline: s?.tagline || base.tagline,
    description: s?.description || base.description,
    city: s?.city || base.city,
    logo,
    hero: {
      ...base.hero,
      image: heroImage,
      imageAlt: s?.heroImageAlt || base.hero.imageAlt,
      eyebrow: s?.heroEyebrow || base.hero.eyebrow,
      title: s?.heroTitle || base.hero.title,
      description: s?.heroDescription || base.hero.description,
      primaryCta: {
        label: s?.heroPrimaryLabel || base.hero.primaryCta.label,
        href: s?.heroPrimaryHref || base.hero.primaryCta.href,
      },
      secondaryCta: {
        label: s?.heroSecondaryLabel || base.hero.secondaryCta.label,
        href: s?.heroSecondaryHref || base.hero.secondaryCta.href,
      },
    },
    about: {
      ...base.about,
      paragraphs: paragraphs.length > 0 ? paragraphs : base.about.paragraphs,
      values,
    },
    missionVision: {
      mission: {
        title: s?.missionTitle || base.missionVision.mission.title,
        description:
          s?.missionDescription || base.missionVision.mission.description,
      },
      vision: {
        title: s?.visionTitle || base.missionVision.vision.title,
        description:
          s?.visionDescription || base.missionVision.vision.description,
      },
    },
    gallery: {
      ...base.gallery,
      images: galleryImages.length > 0 ? galleryImages : base.gallery.images,
    },
    team: {
      ...base.team,
      members: teamMembers.length > 0 ? teamMembers : base.team.members,
    },
    schedule: {
      ...base.schedule,
      days,
    },
    location: {
      ...base.location,
      addressLines: s?.addressLine
        ? [s.addressLine]
        : base.location.addressLines,
      mapEmbedUrl: s?.mapEmbedUrl ?? base.location.mapEmbedUrl,
      directionsUrl: s?.directionsUrl ?? base.location.directionsUrl,
      directionsLabel: s?.directionsLabel || base.location.directionsLabel,
    },
    contact: {
      ...base.contact,
      phone: s?.contactPhone || base.contact.phone,
      phoneHref: phoneToHref(s?.contactPhone) || base.contact.phoneHref,
      whatsapp: s?.contactWhatsapp || base.contact.whatsapp,
      email: s?.contactEmail || base.contact.email,
      socials,
    },
  };
}

/**
 * Contenido público del sitio, cacheado y etiquetado con `PUBLIC_CONTENT_TAG`.
 * Se revalida desde el panel con `revalidateTag("gym-content")`.
 * Si la base de datos no está disponible o vacía, cae a los valores de gym.ts.
 */
export async function getPublicContent(): Promise<Gym> {
  "use cache";
  cacheTag(PUBLIC_CONTENT_TAG);

  try {
    const db = getDb();
    const [settingsRows, hours, gallery, team] = await Promise.all([
      db.select().from(gymSettings).where(eq(gymSettings.id, 1)).limit(1),
      db.select().from(gymHours).orderBy(asc(gymHours.sortOrder)),
      db
        .select()
        .from(gymGallery)
        .orderBy(asc(gymGallery.sortOrder), asc(gymGallery.createdAt)),
      db
        .select()
        .from(gymTeam)
        .orderBy(asc(gymTeam.sortOrder), asc(gymTeam.createdAt)),
    ]);

    return buildContent({
      settings: settingsRows[0] ?? null,
      hours,
      gallery,
      team,
    });
  } catch {
    return staticGym;
  }
}
