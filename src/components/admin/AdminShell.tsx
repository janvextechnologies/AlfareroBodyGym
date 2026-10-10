"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Clock,
  Image as ImageIcon,
  Images,
  Info,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Share2,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAction } from "@/server/actions/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Portada", href: "/admin/portada", icon: ImageIcon },
  { label: "Información general", href: "/admin/informacion", icon: Info },
  { label: "Misión y visión", href: "/admin/mision-vision", icon: Target },
  { label: "Galería", href: "/admin/galeria", icon: Images },
  { label: "Equipo", href: "/admin/equipo", icon: Users },
  { label: "Horarios", href: "/admin/horarios", icon: Clock },
  { label: "Ubicación", href: "/admin/ubicacion", icon: MapPin },
  { label: "Contacto y redes", href: "/admin/contacto", icon: Share2 },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Secciones del panel" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
              active
                ? "bg-brand text-white"
                : "text-fog hover:bg-white/5 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutForm() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="outline"
        className="w-full justify-start gap-2 border-white/15 bg-white/5 text-foreground hover:bg-white/10"
      >
        <LogOut className="size-4" aria-hidden="true" />
        Cerrar sesión
      </Button>
    </form>
  );
}

export function AdminShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-ink lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-carbon lg:flex lg:flex-col">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <Image
            src="/images/logo.png"
            alt="Alfarero Body Gym"
            width={40}
            height={40}
            className="h-10 w-10 rounded-md object-cover"
          />
          <div className="leading-none">
            <p className="font-display text-xl tracking-wide">ALFARERO</p>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brand">
              Panel admin
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <NavLinks />
        </div>

        <div className="border-t border-white/10 p-4">
          <p className="px-1 text-xs text-fog">
            Sesión: <span className="text-foreground">{username}</span>
          </p>
          <div className="mt-2">
            <LogoutForm />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-carbon px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Alfarero Body Gym"
              width={32}
              height={32}
              className="h-8 w-8 rounded-md object-cover"
            />
            <span className="font-display text-lg tracking-wide">
              PANEL ADMIN
            </span>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Abrir menú del panel"
              className="flex size-9 items-center justify-center rounded-md text-foreground hover:bg-white/5"
            >
              <Menu className="size-6" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-r-white/10 bg-carbon">
              <SheetHeader>
                <SheetTitle className="font-display text-xl tracking-wide">
                  ALFARERO BODY GYM
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-4">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
              <div className="p-4">
                <LogoutForm />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
