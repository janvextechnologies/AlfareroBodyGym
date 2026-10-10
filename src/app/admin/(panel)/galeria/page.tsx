import type { Metadata } from "next";
import { listGallery } from "@/server/data/gallery";
import { resolveImageUrl } from "@/server/storage/urls";
import { AdminCard, PageHeader } from "@/components/admin/PageHeader";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const metadata: Metadata = {
  title: "Galería",
  robots: { index: false, follow: false },
};

export default async function GaleriaPage() {
  const items = await listGallery();

  return (
    <div>
      <PageHeader
        title="Galería e instalaciones"
        description="Sube imágenes, edita títulos y descripciones, cambia el orden y controla su visibilidad."
      />
      <AdminCard>
        <GalleryManager
          items={items.map((item) => ({
            id: item.id,
            imageUrl: resolveImageUrl(item.imagePath),
            title: item.title,
            description: item.description,
            span: item.span,
            visible: item.visible,
          }))}
        />
      </AdminCard>
    </div>
  );
}
