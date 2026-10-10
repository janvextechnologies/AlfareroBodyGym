import type { Metadata } from "next";
import { getSettings } from "@/server/data/settings";
import { AdminCard, PageHeader } from "@/components/admin/PageHeader";
import { MissionVisionForm } from "@/components/admin/MissionVisionForm";

export const metadata: Metadata = {
  title: "Misión y visión",
  robots: { index: false, follow: false },
};

export default async function MissionVisionPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader
        title="Misión, visión y valores"
        description="Define el propósito y los valores del gimnasio."
      />
      <AdminCard>
        <MissionVisionForm
          initial={{
            missionTitle: settings.missionTitle,
            missionDescription: settings.missionDescription,
            visionTitle: settings.visionTitle,
            visionDescription: settings.visionDescription,
            values: settings.values.map((value) => ({
              title: value.title,
              description: value.description,
            })),
          }}
        />
      </AdminCard>
    </div>
  );
}
