import type { Metadata } from "next";
import { getSettings } from "@/server/data/settings";
import { AdminCard, PageHeader } from "@/components/admin/PageHeader";
import { LocationForm } from "@/components/admin/LocationForm";

export const metadata: Metadata = {
  title: "Ubicación",
  robots: { index: false, follow: false },
};

export default async function UbicacionPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader
        title="Ubicación"
        description="Dirección, mapa de Google Maps y botón para llegar al gimnasio."
      />
      <AdminCard>
        <LocationForm
          initial={{
            addressLine: settings.addressLine,
            mapEmbedUrl: settings.mapEmbedUrl ?? "",
            directionsUrl: settings.directionsUrl ?? "",
            directionsLabel: settings.directionsLabel,
          }}
        />
      </AdminCard>
    </div>
  );
}
