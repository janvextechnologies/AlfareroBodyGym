"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NativeButtonProps = React.ComponentProps<typeof Button>;

type ConfirmButtonProps = {
  children: React.ReactNode;
  message: string;
  className?: string;
  variant?: NativeButtonProps["variant"];
  size?: NativeButtonProps["size"];
  "aria-label"?: string;
};

export function ConfirmButton({
  children,
  message,
  className,
  variant = "destructive",
  size = "icon",
  ...rest
}: ConfirmButtonProps) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
