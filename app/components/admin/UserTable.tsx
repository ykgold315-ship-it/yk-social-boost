export default function UserTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Wallet</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Orders</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-t border-slate-800">
            <td className="px-6 py-5">No users yet</td>
            <td className="px-6 py-5">-</td>
            <td className="px-6 py-5">$0.00</td>
            <td className="px-6 py-5">0</td>
            <td className="px-6 py-5">
              <span className="rounded-full bg-slate-700 px-3 py-1 text-sm">
                Empty
              </span>
            </td>
            <td className="px-6 py-5 text-center">
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 transition">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}