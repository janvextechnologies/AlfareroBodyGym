import type { Metadata } from "next";
import { getSettings } from "@/server/data/settings";
import { AdminCard, PageHeader } from "@/components/admin/PageHeader";
import { GeneralInfoForm } from "@/components/admin/GeneralInfoForm";

export const metadata: Metadata = {
  title: "Información general",
  robots: { index: false, follow: false },
};

export default async function InformacionPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader
        title="Información general"
        description="Nombre, descripción, historia y presentación del gimnasio."
      />
      <AdminCard>
        <GeneralInfoForm
          initial={{
            name: settings.name,
            shortName: settings.shortName,
            tagline: settings.tagline,
            description: settings.description,
            history: settings.history,
            city: settings.city,
          }}
        />
      </AdminCard>
    </div>
  );
}
