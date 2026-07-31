"use client";

import { useEffect, useState } from "react";

export default function PricingPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);

    const res = await fetch("/api/admin/services");
    const data = await res.json();

    setServices(data);

    setLoading(false);
  }

  async function savePricing(service: any) {
    const res = await fetch("/api/admin/pricing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceId: service.id,
        profitType: service.profit_type,
        profitValue: Number(service.profit_value),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Pricing Updated");
      loadServices();
    } else {
      alert(data.error);
    }
  }

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Pricing Rules
        </h1>

        <p className="mt-2 text-slate-400">
          Control your profit for every service.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-900">

            <tr>

              <th className="p-4 text-left">
                Service
              </th>

              <th className="p-4 text-left">
                Provider Cost
              </th>

              <th className="p-4 text-left">
                Profit Type
              </th>

              <th className="p-4 text-left">
                Profit
              </th>

              <th className="p-4 text-left">
                Selling Price
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {services.map((service) => (

              <tr
                key={service.id}
                className="border-t border-slate-800"
              >

                <td className="p-4">
                  {service.name}
                </td>

                <td className="p-4">
                  £{Number(service.provider_cost ?? 0).toFixed(4)}
                </td>

                <td className="p-4">

                  <select
                    value={service.profit_type}
                    onChange={(e) => {
                      const updated = [...services];
                      const index = updated.findIndex(
                        (x) => x.id === service.id
                      );

                      updated[index].profit_type =
                        e.target.value;

                      setServices(updated);
                    }}
                    className="rounded-xl bg-slate-900 p-2"
                  >
                    <option value="fixed">
                      Fixed (£)
                    </option>

                    <option value="percent">
                      Percent (%)
                    </option>

                  </select>

                </td>

                <td className="p-4">

                  <input
                    type="number"
                    value={service.profit_value}
                    onChange={(e) => {
                      const updated = [...services];
                      const index = updated.findIndex(
                        (x) => x.id === service.id
                      );

                      updated[index].profit_value =
                        e.target.value;

                      setServices(updated);
                    }}
                    className="w-28 rounded-xl bg-slate-900 p-2"
                  />

                </td>

                <td className="p-4 font-semibold text-green-400">
                  £{Number(service.selling_price ?? 0).toFixed(4)}
                </td>

                <td className="p-4">

                  <button
                    onClick={() => savePricing(service)}
                    className="rounded-xl bg-blue-600 px-4 py-2 hover:bg-blue-700"
                  >
                    Save
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}