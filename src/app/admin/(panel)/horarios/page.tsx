import type { Metadata } from "next";
import { listHours } from "@/server/data/hours";
import { AdminCard, PageHeader } from "@/components/admin/PageHeader";
import { HoursForm, type HourRow } from "@/components/admin/HoursForm";

export const metadata: Metadata = {
  title: "Horarios",
  robots: { index: false, follow: false },
};

const DEFAULT_LABELS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default async function HorariosPage() {
  const stored = await listHours();
  const byDay = new Map(stored.map((row) => [row.dayOfWeek, row]));

  const rows: HourRow[] = DEFAULT_LABELS.map((label, index) => {
    const row = byDay.get(index);
    return {
      dayOfWeek: index,
      label: row?.label ?? label,
      opensAt: row?.opensAt ?? null,
      closesAt: row?.closesAt ?? null,
      closed: row?.closed ?? false,
    };
  });

  return (
    <div>
      <PageHeader
        title="Horarios de atención"
        description="Define la hora de apertura y cierre de cada día, o marca el día como cerrado."
      />
      <AdminCard>
        <HoursForm initial={rows} />
      </AdminCard>
    </div>
  );
}
