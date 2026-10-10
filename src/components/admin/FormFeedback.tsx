import { CheckCircle2, AlertCircle } from "lucide-react";
import type { ActionState } from "@/server/actions/state";

export function FormFeedback({ state }: { state: ActionState }) {
  if (state.status === "idle") return null;

  const success = state.status === "success";

  return (
    <div
      role={success ? "status" : "alert"}
      aria-live="polite"
      className={
        success
          ? "flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
          : "flex items-start gap-2 rounded-lg border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-red-300"
      }
    >
      {success ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      ) : (
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      )}
      <span>{state.message}</span>
    </div>
  );
}
