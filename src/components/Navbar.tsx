"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, MessageCircle } from "lucide-react";
import { gym, whatsappLink } from "@/data/gym";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappHref = whatsappLink(gym.contact.whatsappMessage);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-ink/90 backdrop-blur-md"
          : "bg-gradient-to-b from-ink/80 to-transparent",
      )}
    >
      <nav
        aria-label="Navegación principal"
        className="container-page flex h-16 items-center justify-between gap-4 sm:h-20"
      >
        <a
          href="#inicio"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
        >
          <Image
            src={gym.logo}
            alt={`Logotipo de ${gym.name}`}
            width={48}
            height={48}
            className="h-11 w-11 rounded-md object-cover sm:h-12 sm:w-12"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-wide text-foreground">
              ALFARERO
            </span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-brand">
              Body Gym
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {gym.nav.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-fog transition-colors hover:text-foreground focus-visible:bg-white/5 focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-10 gap-2 px-4 font-semibold",
            )}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>

        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Abrir menú de navegación"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-10 text-foreground",
              )}
            >
              <Menu className="size-6" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 border-l-white/10 bg-carbon"
            >
              <SheetHeader>
                <SheetTitle className="font-display text-2xl tracking-wide">
                  ALFARERO BODY GYM
                </SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-4">
                {gym.nav.map((link) => (
                  <li key={link.href}>
                    <SheetClose
                      render={
                        <a
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-md px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-white/5 hover:text-foreground focus-visible:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  </li>
                ))}
              </ul>
              <div className="mt-auto p-4">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 w-full gap-2 font-semibold",
                  )}
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Escríbenos por WhatsApp
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
