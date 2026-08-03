import { redirect } from "next/navigation";
import { createClient } from "../../lib/server-client";

import DashboardShell from "../components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  let role: "admin" | "customer" | "subseller" = "customer";

  let permissions = {
    can_create_customers: false,
    can_create_subsellers: false,
    can_view_reports: false,
    can_use_api: false,
  };

  if (profile?.role === "admin") {
    role = "admin";
  }

  if (profile?.role === "subseller") {
    role = "subseller";

    const { data: reseller } = await supabase
      .from("subsellers")
      .select(
        `
        can_create_customers,
        can_create_subsellers,
        can_view_reports,
        can_use_api
        `
      )
      .eq("user_id", user.id)
      .single();

    if (reseller) {
      permissions = {
        can_create_customers:
          reseller.can_create_customers ?? false,

        can_create_subsellers:
          reseller.can_create_subsellers ?? false,

        can_view_reports:
          reseller.can_view_reports ?? false,

        can_use_api:
          reseller.can_use_api ?? false,
      };
    }
  }

  return (
    <DashboardShell
      role={role}
      permissions={permissions}
    >
      {children}
    </DashboardShell>
  );
}