import { loadEnv } from "../../scripts/load-env";

loadEnv();

import { sql } from "drizzle-orm";
import { gym } from "../data/gym";
import { getDb } from "./index";
import { gymGallery, gymHours, gymSettings, gymTeam } from "./schema";

async function seed() {
  const db = getDb();

  // --- Configuración general (fila única id = 1) -----------------------------
  const settingsCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(gymSettings);

  if ((settingsCount[0]?.count ?? 0) === 0) {
    await db.insert(gymSettings).values({
      id: 1,
      name: gym.name,
      shortName: gym.shortName,
      tagline: gym.tagline,
      description: gym.description,
      history: gym.about.paragraphs.join("\n\n"),
      city: gym.city,
      heroTitle: gym.hero.title,
      heroEyebrow: gym.hero.eyebrow,
      heroTagline: gym.tagline,
      heroDescription: gym.hero.description,
      heroImagePath: gym.hero.image,
      heroImageAlt: gym.hero.imageAlt,
      heroPrimaryLabel: gym.hero.primaryCta.label,
      heroPrimaryHref: gym.hero.primaryCta.href,
      heroSecondaryLabel: gym.hero.secondaryCta.label,
      heroSecondaryHref: gym.hero.secondaryCta.href,
      logoPath: gym.logo,
      missionTitle: gym.missionVision.mission.title,
      missionDescription: gym.missionVision.mission.description,
      visionTitle: gym.missionVision.vision.title,
      visionDescription: gym.missionVision.vision.description,
      values: gym.about.values.map((value) => ({
        title: value.title,
        description: value.description,
      })),
      addressLine: gym.location.addressLines.join(", "),
      mapEmbedUrl: gym.location.mapEmbedUrl,
      directionsUrl: gym.location.directionsUrl,
      directionsLabel: gym.location.directionsLabel,
      contactPhone: gym.contact.phone,
      contactWhatsapp: gym.contact.whatsapp,
      contactEmail: gym.contact.email,
      socials: gym.contact.socials.map((social) => ({
        label: social.label,
        href: social.href,
        icon: social.icon,
      })),
    });
    console.log("✓ gym_settings inicializada");
  } else {
    console.log("• gym_settings ya tiene datos, no se modifica");
  }

  // --- Horarios --------------------------------------------------------------
  for (const [index, day] of gym.schedule.days.entries()) {
    await db
      .insert(gymHours)
      .values({
        dayOfWeek: index,
        label: day.day,
        opensAt: day.open,
        closesAt: day.close,
        closed: day.closed,
        sortOrder: index,
      })
      .onConflictDoNothing({ target: gymHours.dayOfWeek });
  }
  console.log("✓ gym_hours inicializado");

  // --- Galería ---------------------------------------------------------------
  const galleryCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(gymGallery);

  if ((galleryCount[0]?.count ?? 0) === 0) {
    await db.insert(gymGallery).values(
      gym.gallery.images.map((image, index) => ({
        imagePath: image.src,
        title: image.caption ?? "",
        description: image.alt,
        span: image.span ?? "normal",
        sortOrder: index,
        visible: true,
      })),
    );
    console.log("✓ gym_gallery inicializada");
  } else {
    console.log("• gym_gallery ya tiene datos, no se modifica");
  }

  // --- Equipo ----------------------------------------------------------------
  const teamCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(gymTeam);

  if ((teamCount[0]?.count ?? 0) === 0) {
    await db.insert(gymTeam).values(
      gym.team.members.map((member, index) => ({
        name: member.name,
        role: member.role,
        specialties: member.specialty,
        description: member.description,
        imagePath: member.image,
        sortOrder: index,
        visible: true,
      })),
    );
    console.log("✓ gym_team inicializado");
  } else {
    console.log("• gym_team ya tiene datos, no se modifica");
  }

  console.log("\nSeed completado.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error en el seed:", error);
  process.exit(1);
});
