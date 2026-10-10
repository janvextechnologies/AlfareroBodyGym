CREATE TABLE "gym_gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_path" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"span" text DEFAULT 'normal' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"day_of_week" smallint NOT NULL,
	"label" text NOT NULL,
	"opens_at" text,
	"closes_at" text,
	"closed" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"short_name" text DEFAULT '' NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"history" text DEFAULT '' NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"hero_title" text DEFAULT '' NOT NULL,
	"hero_eyebrow" text DEFAULT '' NOT NULL,
	"hero_tagline" text DEFAULT '' NOT NULL,
	"hero_description" text DEFAULT '' NOT NULL,
	"hero_image_path" text,
	"hero_image_alt" text DEFAULT '' NOT NULL,
	"hero_primary_label" text DEFAULT '' NOT NULL,
	"hero_primary_href" text DEFAULT '' NOT NULL,
	"hero_secondary_label" text DEFAULT '' NOT NULL,
	"hero_secondary_href" text DEFAULT '' NOT NULL,
	"logo_path" text,
	"mission_title" text DEFAULT '' NOT NULL,
	"mission_description" text DEFAULT '' NOT NULL,
	"vision_title" text DEFAULT '' NOT NULL,
	"vision_description" text DEFAULT '' NOT NULL,
	"values" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"address_line" text DEFAULT '' NOT NULL,
	"map_embed_url" text,
	"directions_url" text,
	"directions_label" text DEFAULT 'Cómo llegar' NOT NULL,
	"contact_phone" text DEFAULT '' NOT NULL,
	"contact_whatsapp" text DEFAULT '' NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"socials" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT '' NOT NULL,
	"specialties" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image_path" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "gym_gallery_sort_order_idx" ON "gym_gallery" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "gym_hours_day_of_week_idx" ON "gym_hours" USING btree ("day_of_week");--> statement-breakpoint
CREATE INDEX "gym_team_sort_order_idx" ON "gym_team" USING btree ("sort_order");