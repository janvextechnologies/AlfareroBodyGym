"use client";

import { useActionState } from "react";
import { loginAction } from "@/server/actions/auth";
import { initialActionState } from "@/server/actions/state";
import { Input } from "@/components/ui/input";
import { FormFeedback } from "./FormFeedback";
import { SubmitButton } from "./SubmitButton";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="username"
          className="text-sm font-medium text-foreground"
        >
          Usuario
        </label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          required
          className="h-11"
          aria-invalid={Boolean(state.fieldErrors?.username)}
        />
        {state.fieldErrors?.username ? (
          <p className="text-xs text-red-400">{state.fieldErrors.username[0]}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Contraseña
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-11"
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        {state.fieldErrors?.password ? (
          <p className="text-xs text-red-400">{state.fieldErrors.password[0]}</p>
        ) : null}
      </div>

      <FormFeedback state={state} />

      <SubmitButton className="h-11 w-full font-semibold">
        Iniciar sesión
      </SubmitButton>
    </form>
  );
}
