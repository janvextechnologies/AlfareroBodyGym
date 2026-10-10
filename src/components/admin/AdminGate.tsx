import { redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";

export async function AdminGate({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin");
  }

  return <AdminShell username={session.username}>{children}</AdminShell>;
}
