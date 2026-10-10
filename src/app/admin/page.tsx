import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Acceso al panel",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ink px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/images/logo.png"
            alt="Alfarero Body Gym"
            width={72}
            height={72}
            className="h-16 w-16 rounded-lg object-cover"
            priority
          />
          <h1 className="mt-4 font-display text-3xl tracking-wide text-foreground">
            PANEL ADMIN
          </h1>
          <p className="mt-1 text-sm text-fog">
            Acceso restringido al administrador.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-carbon p-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-fog">
          Alfarero Body Gym · Panel privado
        </p>
      </div>
    </main>
  );
}
