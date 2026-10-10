import type { Metadata } from "next";
import { listTeam } from "@/server/data/team";
import { resolveImageUrl } from "@/server/storage/urls";
import { AdminCard, PageHeader } from "@/components/admin/PageHeader";
import { TeamManager } from "@/components/admin/TeamManager";

export const metadata: Metadata = {
  title: "Equipo",
  robots: { index: false, follow: false },
};

export default async function EquipoPage() {
  const members = await listTeam();

  return (
    <div>
      <PageHeader
        title="Nuestro equipo"
        description="Crea y edita los miembros del equipo, sus especialidades, fotografías y orden de presentación."
      />
      <AdminCard>
        <TeamManager
          members={members.map((member) => ({
            id: member.id,
            name: member.name,
            role: member.role,
            specialties: member.specialties,
            description: member.description,
            imageUrl: resolveImageUrl(member.imagePath),
            visible: member.visible,
          }))}
        />
      </AdminCard>
    </div>
  );
}
