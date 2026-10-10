"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NativeButtonProps = React.ComponentProps<typeof Button>;

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: NativeButtonProps["variant"];
  size?: NativeButtonProps["size"];
};

export function SubmitButton({
  children,
  className,
  variant,
  size,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={pending}
      className={cn(className)}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Guardando…
        </>
      ) : (
        children
      )}
    </Button>
  );
}
