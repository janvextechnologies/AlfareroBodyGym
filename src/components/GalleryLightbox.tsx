"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
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
const MOVE_TOLERANCE = 8;

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
  const open = index !== null;
  const active = index === null ? null : images[index];
  const total = images.length;

  const zoomRef = useRef<ReactZoomPanPinchContentRef>(null);
  const isZoomedRef = useRef(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const pointers = useRef<Set<number>>(new Set());
  const swipe = useRef<{ x: number; y: number; id: number; multi: boolean } | null>(null);
  const downPos = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);

  const select = useCallback(
    (next: number) => {
      zoomRef.current?.resetTransform(0);
      isZoomedRef.current = false;
      setIsZoomed(false);
      onIndexChange(next);
    },
    [onIndexChange],
  );

  const go = useCallback(
    (delta: number) => {
      if (index === null || total === 0) return;
      select((index + delta + total) % total);
    },
    [index, total, select],
  );

  // Navegación por teclado.
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

  // Swipe con punteros (solo cuando no hay zoom).
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.add(event.pointerId);
    movedRef.current = false;
    if (pointers.current.size === 1) {
      downPos.current = { x: event.clientX, y: event.clientY };
      if (!isZoomedRef.current) {
        swipe.current = {
          x: event.clientX,
          y: event.clientY,
          id: event.pointerId,
          multi: false,
        };
      }
    } else if (swipe.current) {
      swipe.current.multi = true;
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (downPos.current) {
      const moved = Math.hypot(
        event.clientX - downPos.current.x,
        event.clientY - downPos.current.y,
      );
      if (moved > MOVE_TOLERANCE) movedRef.current = true;
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    downPos.current = null;
    const current = swipe.current;
    swipe.current = null;
    if (
      !current ||
      current.multi ||
      current.id !== event.pointerId ||
      isZoomedRef.current
    ) {
      return;
    }
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.4) {
      go(dx < 0 ? 1 : -1);
    }
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (swipe.current?.id === event.pointerId) swipe.current = null;
  };

  // Clic fuera de la imagen → cerrar.
  const handleAreaClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("img") || target.closest("button")) return;
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    onClose();
  };

  const navButton =
    "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-foreground ring-1 ring-white/15 backdrop-blur transition hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:flex";

  const controlButton =
    "flex size-9 items-center justify-center rounded-full bg-white/5 text-foreground ring-1 ring-white/15 transition hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

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

            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <span
                aria-live="polite"
                className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-fog ring-1 ring-white/10"
              >
                {(index ?? 0) + 1} / {total}
              </span>

              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-fog md:inline">
                  Rueda o pellizco para zoom
                </span>
                <button
                  type="button"
                  onClick={() => zoomRef.current?.zoomOut()}
                  disabled={!isZoomed}
                  aria-label="Alejar"
                  className={cn(controlButton, !isZoomed && "opacity-40")}
                >
                  <ZoomOut className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => zoomRef.current?.zoomIn()}
                  aria-label="Acercar"
                  className={controlButton}
                >
                  <ZoomIn className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => zoomRef.current?.resetTransform(200)}
                  disabled={!isZoomed}
                  aria-label="Restablecer zoom"
                  className={cn(controlButton, !isZoomed && "opacity-40")}
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar visor"
                  className={controlButton}
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 sm:px-16"
              onClick={handleAreaClick}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
            >
              <TransformWrapper
                ref={zoomRef}
                initialScale={1}
                minScale={1}
                maxScale={4}
                centerOnInit
                limitToBounds
                doubleClick={{ disabled: true }}
                wheel={{ step: 0.18 }}
                pinch={{ step: 5 }}
                panning={{ disabled: !isZoomed, velocityDisabled: true }}
                onTransform={(_, state) => {
                  const zoomed = state.scale > 1.02;
                  if (zoomed !== isZoomedRef.current) {
                    isZoomedRef.current = zoomed;
                    setIsZoomed(zoomed);
                  }
                }}
              >
                <TransformComponent
                  wrapperClass="!h-full !w-full"
                  contentClass="!h-full !w-full flex items-center justify-center"
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%" }}
                >
                  <Image
                    src={active.src}
                    alt={active.alt}
                    width={1600}
                    height={1067}
                    sizes="100vw"
                    draggable={false}
                    className="max-h-[62vh] w-auto max-w-full select-none object-contain sm:max-h-[72vh]"
                  />
                </TransformComponent>
              </TransformWrapper>

              {total > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Imagen anterior"
                    className={cn(navButton, "left-2 sm:left-4")}
                  >
                    <ChevronLeft className="size-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Imagen siguiente"
                    className={cn(navButton, "right-2 sm:right-4")}
                  >
                    <ChevronRight className="size-6" aria-hidden="true" />
                  </button>
                </>
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
                    onClick={() => select(i)}
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
