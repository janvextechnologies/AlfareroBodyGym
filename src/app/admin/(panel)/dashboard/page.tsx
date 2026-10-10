import Link from "next/link";
import type { Metadata } from "next";
import {
  CircleAlert,
  CircleCheck,
  Clock,
  Images,
  Users,
} from "lucide-react";
import { getDashboardStats } from "@/server/data/stats";
import { AdminCard, PageHeader } from "@/components/admin/PageHeader";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  { href: "/admin/portada", label: "Editar portada" },
  { href: "/admin/informacion", label: "Información general" },
  { href: "/admin/galeria", label: "Gestionar galería" },
  { href: "/admin/equipo", label: "Gestionar equipo" },
  { href: "/admin/horarios", label: "Editar horarios" },
  { href: "/admin/ubicacion", label: "Editar ubicación" },
  { href: "/admin/contacto", label: "Contacto y redes" },
];

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Imágenes en la galería",
      value: stats.galleryTotal,
      detail: `${stats.galleryVisible} visibles`,
      icon: Images,
    },
    {
      label: "Miembros del equipo",
      value: stats.teamTotal,
      detail: `${stats.teamVisible} visibles`,
      icon: Users,
    },
    {
      label: "Días con horario",
      value: stats.hoursConfigured,
      detail: "de 7 días",
      icon: Clock,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen del contenido administrable de Alfarero Body Gym."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard key={card.label}>
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-lg bg-brand/12 text-brand">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 font-display text-4xl text-foreground">
                {card.value}
              </p>
              <p className="text-sm font-medium text-foreground">{card.label}</p>
              <p className="text-xs text-fog">{card.detail}</p>
            </AdminCard>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <AdminCard title="Estado de configuración">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              {stats.generalConfigured ? (
                <CircleCheck className="size-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <CircleAlert className="size-4 text-amber-400" aria-hidden="true" />
              )}
              <span className="text-foreground">
                {stats.generalConfigured
                  ? "Información general configurada"
                  : "Información general pendiente"}
              </span>
            </li>
            <li className="flex items-center gap-2">
              {stats.heroConfigured ? (
                <CircleCheck className="size-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <CircleAlert className="size-4 text-amber-400" aria-hidden="true" />
              )}
              <span className="text-foreground">
                {stats.heroConfigured
                  ? "Portada configurada"
                  : "Portada pendiente"}
              </span>
            </li>
            <li className="text-xs text-fog">
              Última actualización:{" "}
              {stats.settingsUpdatedAt
                ? new Date(stats.settingsUpdatedAt).toLocaleString("es-NI")
                : "sin datos"}
            </li>
          </ul>
        </AdminCard>

        <AdminCard title="Accesos rápidos">
          <div className="grid gap-2 sm:grid-cols-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-white/10 bg-ink/40 px-3 py-2.5 text-sm text-fog transition-colors hover:border-brand/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
