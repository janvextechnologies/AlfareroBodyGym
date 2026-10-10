import type { Metadata } from "next";
import { getSettings } from "@/server/data/settings";
import { resolveImageUrl } from "@/server/storage/urls";
import { AdminCard, PageHeader } from "@/components/admin/PageHeader";
import { HeroForm } from "@/components/admin/HeroForm";

export const metadata: Metadata = {
  title: "Portada",
  robots: { index: false, follow: false },
};

export default async function PortadaPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader
        title="Portada"
        description="Edita el título, eslogan, descripción, botones, imagen principal y logo del gimnasio."
      />
      <AdminCard>
        <HeroForm
          initial={{
            heroTitle: settings.heroTitle,
            heroEyebrow: settings.heroEyebrow,
            heroTagline: settings.heroTagline,
            heroDescription: settings.heroDescription,
            heroImageAlt: settings.heroImageAlt,
            heroPrimaryLabel: settings.heroPrimaryLabel,
            heroPrimaryHref: settings.heroPrimaryHref,
            heroSecondaryLabel: settings.heroSecondaryLabel,
            heroSecondaryHref: settings.heroSecondaryHref,
            heroImageUrl: resolveImageUrl(settings.heroImagePath),
            logoUrl: resolveImageUrl(settings.logoPath),
          }}
        />
      </AdminCard>
    </div>
  );
}
