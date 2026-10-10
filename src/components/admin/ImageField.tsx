"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

export function ImageField({
  name,
  label,
  currentUrl,
  hint,
}: {
  name: string;
  label: string;
  currentUrl?: string | null;
  hint?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-start gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink">
          {preview || currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={(preview ?? currentUrl) as string}
              alt={label}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-fog">
              <ImageIcon className="size-6" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <Input
            type="file"
            name={name}
            accept={ALLOWED.join(",")}
            className="h-auto cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-sm file:text-foreground"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                setPreview(null);
                setError(null);
                return;
              }
              if (!ALLOWED.includes(file.type)) {
                setError("Formato no permitido. Usa JPG, PNG o WebP.");
                event.target.value = "";
                setPreview(null);
                return;
              }
              if (file.size > MAX_BYTES) {
                setError("La imagen supera el límite de 5 MB.");
                event.target.value = "";
                setPreview(null);
                return;
              }
              setError(null);
              setPreview(URL.createObjectURL(file));
            }}
          />
          <p className="text-xs text-muted-foreground">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              (hint ?? "JPG, PNG o WebP. Máximo 5 MB. Deja vacío para conservar la actual.")
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
