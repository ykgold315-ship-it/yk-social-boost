import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/server-client";
import UserActions from "@/app/components/admin/UserActions";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: user } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!user) {
    notFound();
  }

  const { count: orders } = await supabase
    .from("orders")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", id);

  const { count: deposits } = await supabase
    .from("deposits")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", id);

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-white">
            {user.full_name}
          </h1>

          <p className="mt-2 text-slate-400">
            Customer Account
          </p>
        </div>

        <Link
          href="/admin/users"
          className="rounded-xl bg-slate-800 px-5 py-3 hover:bg-slate-700"
        >
          Back
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            Wallet
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            £{Number(user.balance).toFixed(2)}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            Orders
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {orders ?? 0}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            Deposits
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {deposits ?? 0}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            Role
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {user.role}
          </h2>
        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="mb-6 text-2xl font-bold">
            User Information
          </h2>

          <div className="space-y-5">

            <div>
              <p className="text-slate-400">
                Full Name
              </p>

              <p>{user.full_name}</p>
            </div>

            <div>
              <p className="text-slate-400">
                Email
              </p>

              <p>{user.email}</p>
            </div>

            <div>
              <p className="text-slate-400">
                Role
              </p>

              <p>{user.role}</p>
            </div>

            <div>
              <p className="text-slate-400">
                Status
              </p>

              <p>{user.status}</p>
            </div>

            <div>
              <p className="text-slate-400">
                Joined
              </p>

              <p>
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Account Actions
          </h2>

          <UserActions userId={user.id} />

        </div>

      </div>

    </div>
  );
}