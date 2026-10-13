"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Gym } from "@/data/gym";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type GalleryImage = Gym["gallery"]["images"][number];

const SWIPE_THRESHOLD = 60;

export function GalleryLightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: GalleryImage[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const open = index !== null;
  const active = index === null ? null : images[index];
  const total = images.length;

  const go = useCallback(
    (delta: number) => {
      if (index === null || total === 0) return;
      onIndexChange((index + delta + total) % total);
    },
    [index, total, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, go]);

  const navButton =
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-foreground ring-1 ring-white/15 backdrop-blur transition hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 top-0 left-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-ink/95 p-0 ring-0 sm:max-w-none"
      >
        {active ? (
          <>
            <DialogTitle className="sr-only">
              {active.caption ?? "Imagen de las instalaciones"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {active.alt}
            </DialogDescription>

            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <span
                aria-live="polite"
                className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-fog ring-1 ring-white/10"
              >
                {(index ?? 0) + 1} / {total}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar visor"
                className="flex size-10 items-center justify-center rounded-full bg-white/5 text-foreground ring-1 ring-white/15 transition hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 sm:px-16">
              {total > 1 ? (
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Imagen anterior"
                  className={cn(navButton, "left-2 sm:left-4")}
                >
                  <ChevronLeft className="size-6" aria-hidden="true" />
                </button>
              ) : null}

              <motion.div
                key={index}
                className="flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing"
                drag={total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_THRESHOLD) go(1);
                  else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
                }}
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, x: 24 },
                      animate: { opacity: 1, x: 0 },
                      transition: { duration: 0.25, ease: "easeOut" as const },
                    })}
              >
                <Image
                  src={active.src}
                  alt={active.alt}
                  width={1600}
                  height={1067}
                  sizes="100vw"
                  draggable={false}
                  className="max-h-[62vh] w-auto max-w-full touch-none select-none object-contain sm:max-h-[70vh]"
                />
              </motion.div>

              {total > 1 ? (
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Imagen siguiente"
                  className={cn(navButton, "right-2 sm:right-4")}
                >
                  <ChevronRight className="size-6" aria-hidden="true" />
                </button>
              ) : null}
            </div>

            {active.caption ? (
              <p className="px-4 pt-1 text-center text-sm font-medium text-foreground sm:px-6">
                {active.caption}
              </p>
            ) : null}

            {total > 1 ? (
              <div className="flex gap-2 overflow-x-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:px-6 [&::-webkit-scrollbar]:hidden">
                {images.map((image, i) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => onIndexChange(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    aria-current={i === index}
                    className={cn(
                      "relative size-14 shrink-0 overflow-hidden rounded-md ring-1 transition",
                      i === index
                        ? "ring-2 ring-brand"
                        : "opacity-60 ring-white/15 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
