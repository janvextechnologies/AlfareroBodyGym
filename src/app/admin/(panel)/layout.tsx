import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";

function AdminFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink">
      <div className="flex flex-col items-center gap-3 text-fog">
        <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-brand" />
        <p className="text-sm">Cargando panel…</p>
      </div>
    </div>
  );
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
