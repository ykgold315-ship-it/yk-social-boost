import DepositForm from "../../components/dashboard/DepositForm";
import { createClient } from "../../../lib/server-client";

export default async function CreditsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: credits }, { data: deposits }] =
    await Promise.all([
      supabase
        .from("credits")
        .select("credits")
        .eq("user_id", user.id)
        .single(),

      supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  return (
    <>
      <h1 className="text-4xl font-bold">
        Credits
      </h1>

      <p className="mt-2 text-slate-400">
        Purchase credits for placing orders.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="text-xl font-bold mb-2">
          Available Credits
        </h2>

        <p className="text-5xl font-bold text-green-400">
          {Number(credits?.credits ?? 0).toLocaleString()}
        </p>

      </div>

      <div className="mt-8">
        <DepositForm />
      </div>

      <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">Credits</th>
              <th className="px-6 py-4 text-left">Method</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>

            {deposits?.length ? (

              deposits.map((deposit) => (

                <tr
                  key={deposit.id}
                  className="border-t border-slate-800"
                >
                  <td className="px-6 py-5">
                    {deposit.amount}
                  </td>

                  <td className="px-6 py-5">
                    {deposit.payment_method}
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        deposit.status === "Approved"
                          ? "bg-green-600"
                          : deposit.status === "Rejected"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {deposit.status}
                    </span>

                  </td>

                  <td className="px-6 py-5">
                    {new Date(deposit.created_at).toLocaleDateString()}
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={4}
                  className="py-8 text-center text-slate-400"
                >
                  No credit purchases yet.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </>
  );
}