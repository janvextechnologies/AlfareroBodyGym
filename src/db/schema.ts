import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// -----------------------------------------------------------------------------
// Tipos auxiliares almacenados como JSONB
// -----------------------------------------------------------------------------

export type GymValue = {
  title: string;
  description: string;
};

export type SocialLinkData = {
  label: string;
  href: string;
  icon: string;
};

// -----------------------------------------------------------------------------
// gym_settings — fila única (id = 1) con la configuración general
// -----------------------------------------------------------------------------

export const gymSettings = pgTable("gym_settings", {
  id: integer("id").primaryKey().default(1),

  // Identidad / información general
  name: text("name").notNull().default(""),
  shortName: text("short_name").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  history: text("history").notNull().default(""),
  city: text("city").notNull().default(""),

  // Portada (Hero)
  heroTitle: text("hero_title").notNull().default(""),
  heroEyebrow: text("hero_eyebrow").notNull().default(""),
  heroTagline: text("hero_tagline").notNull().default(""),
  heroDescription: text("hero_description").notNull().default(""),
  heroImagePath: text("hero_image_path"),
  heroImageAlt: text("hero_image_alt").notNull().default(""),
  heroPrimaryLabel: text("hero_primary_label").notNull().default(""),
  heroPrimaryHref: text("hero_primary_href").notNull().default(""),
  heroSecondaryLabel: text("hero_secondary_label").notNull().default(""),
  heroSecondaryHref: text("hero_secondary_href").notNull().default(""),
  logoPath: text("logo_path"),

  // Misión, visión y valores
  missionTitle: text("mission_title").notNull().default(""),
  missionDescription: text("mission_description").notNull().default(""),
  visionTitle: text("vision_title").notNull().default(""),
  visionDescription: text("vision_description").notNull().default(""),
  values: jsonb("values").$type<GymValue[]>().notNull().default([]),

  // Ubicación
  addressLine: text("address_line").notNull().default(""),
  mapEmbedUrl: text("map_embed_url"),
  directionsUrl: text("directions_url"),
  directionsLabel: text("directions_label").notNull().default("Cómo llegar"),

  // Contacto y redes
  contactPhone: text("contact_phone").notNull().default(""),
  contactWhatsapp: text("contact_whatsapp").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  socials: jsonb("socials").$type<SocialLinkData[]>().notNull().default([]),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// -----------------------------------------------------------------------------
// gym_hours — un registro por día de la semana
// -----------------------------------------------------------------------------

export const gymHours = pgTable(
  "gym_hours",
  {
    id: serial("id").primaryKey(),
    dayOfWeek: smallint("day_of_week").notNull(), // 0 = Lunes ... 6 = Domingo
    label: text("label").notNull(),
    opensAt: text("opens_at"), // "HH:MM" o null
    closesAt: text("closes_at"), // "HH:MM" o null
    closed: boolean("closed").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [uniqueIndex("gym_hours_day_of_week_idx").on(table.dayOfWeek)],
);

// -----------------------------------------------------------------------------
// gym_gallery — imágenes de la galería
// -----------------------------------------------------------------------------

export const gymGallery = pgTable(
  "gym_gallery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    imagePath: text("image_path").notNull(),
    title: text("title").notNull().default(""),
    description: text("description").notNull().default(""),
    span: text("span").notNull().default("normal"), // normal | wide | tall
    sortOrder: integer("sort_order").notNull().default(0),
    visible: boolean("visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("gym_gallery_sort_order_idx").on(table.sortOrder)],
);

// -----------------------------------------------------------------------------
// gym_team — miembros del equipo
// -----------------------------------------------------------------------------

export const gymTeam = pgTable(
  "gym_team",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    role: text("role").notNull().default(""),
    specialties: text("specialties").notNull().default(""),
    description: text("description").notNull().default(""),
    imagePath: text("image_path"),
    sortOrder: integer("sort_order").notNull().default(0),
    visible: boolean("visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("gym_team_sort_order_idx").on(table.sortOrder)],
);
