import { z } from "zod";

export const timeFormat = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Usa el formato HH:MM");

const text = (max = 500) =>
  z.string().trim().max(max, `Máximo ${max} caracteres`);

const optionalUrl = z.url("URL inválida").or(z.literal(""));
const optionalEmail = z.email("Correo inválido").or(z.literal(""));

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Ingresa el usuario").max(120),
  password: z.string().min(1, "Ingresa la contraseña").max(200),
});

export const generalInfoSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  shortName: text(60),
  tagline: text(200),
  description: text(600),
  history: z.string().trim().max(4000),
  city: text(80),
});

export const heroSchema = z.object({
  heroTitle: text(120),
  heroEyebrow: text(120),
  heroTagline: text(200),
  heroDescription: text(600),
  heroImageAlt: text(300),
  heroPrimaryLabel: text(80),
  heroPrimaryHref: text(300),
  heroSecondaryLabel: text(80),
  heroSecondaryHref: text(300),
});

export const valueSchema = z.object({
  title: z.string().trim().min(1, "Título obligatorio").max(120),
  description: z.string().trim().min(1, "Descripción obligatoria").max(400),
});

export const missionVisionSchema = z.object({
  missionTitle: text(120),
  missionDescription: z
    .string()
    .trim()
    .min(1, "Describe la misión")
    .max(800),
  visionTitle: text(120),
  visionDescription: z
    .string()
    .trim()
    .min(1, "Describe la visión")
    .max(800),
  values: z.array(valueSchema).max(12),
});

export const locationSchema = z.object({
  addressLine: z
    .string()
    .trim()
    .min(1, "La dirección es obligatoria")
    .max(300),
  mapEmbedUrl: optionalUrl,
  directionsUrl: optionalUrl,
  directionsLabel: text(80),
});

export const socialSchema = z.object({
  label: z.string().trim().min(1, "Indica el nombre").max(40),
  href: optionalUrl,
  icon: z.enum(["facebook", "instagram", "tiktok", "whatsapp", "youtube"]),
});

export const contactSchema = z.object({
  contactPhone: text(60),
  contactWhatsapp: z
    .string()
    .trim()
    .regex(/^\d{6,20}$/, "Solo dígitos en formato internacional"),
  contactEmail: optionalEmail,
  socials: z.array(socialSchema).max(10),
});

export const hourSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  label: z.string().trim().min(1).max(40),
  opensAt: timeFormat.nullable(),
  closesAt: timeFormat.nullable(),
  closed: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(20).optional(),
});

export const hoursSchema = z.array(hourSchema).min(1).max(14);

export const spanEnum = z.enum(["normal", "wide", "tall"]);

export const galleryMetaSchema = z.object({
  title: text(150),
  description: z.string().trim().max(500),
  span: spanEnum,
  visible: z.boolean(),
});

export const galleryUpdateSchema = galleryMetaSchema.extend({
  id: z.uuid("ID inválido"),
});

export const teamSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  role: text(120),
  specialties: text(400),
  description: z.string().trim().max(1200),
  visible: z.boolean(),
});

export const teamUpdateSchema = teamSchema.extend({
  id: z.uuid("ID inválido"),
});
