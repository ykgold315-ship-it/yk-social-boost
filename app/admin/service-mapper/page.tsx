"use client";

import { useEffect, useState } from "react";

export default function ServiceMapperPage() {
  const [services, setServices] = useState<any[]>([]);
  const [providerServices, setProviderServices] = useState<any[]>([]);
  const [selectedMappings, setSelectedMappings] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const servicesRes = await fetch("/api/admin/services");
    const providersRes = await fetch("/api/admin/provider-services");

    const servicesData = await servicesRes.json();
    const providerData = await providersRes.json();

    setServices(servicesData);
    setProviderServices(providerData);

    const mappings: Record<number, string> = {};

    servicesData.forEach((service: any) => {
      mappings[service.id] = service.provider_service_id
        ? String(service.provider_service_id)
        : "";
    });

    setSelectedMappings(mappings);

    setLoading(false);
  }

  function changeMapping(serviceId: number, value: string) {
    setSelectedMappings((prev) => ({
      ...prev,
      [serviceId]: value,
    }));
  }

  async function saveMapping(serviceId: number) {
    const providerServiceId = selectedMappings[serviceId];

    const res = await fetch("/api/admin/service-mapper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceId,
        providerServiceId,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Mapping Saved Successfully");
    } else {
      alert(data.error);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Service Mapper
        </h1>

        <p className="mt-2 text-slate-400">
          Connect your services to JAP services.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-900">

            <tr>

              <th className="p-4 text-left">
                Your Service
              </th>

              <th className="p-4 text-left">
                JAP Service
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {services.map((service: any) => (

              <tr
                key={service.id}
                className="border-t border-slate-800"
              >

                <td className="p-4">
                  {service.name}
                </td>

                <td className="p-4">

                  <select
                    className="w-full rounded-xl bg-slate-900 p-3"
                    value={selectedMappings[service.id] || ""}
                    onChange={(e) =>
                      changeMapping(service.id, e.target.value)
                    }
                  >

                    <option value="">
                      Select JAP Service
                    </option>

                    {providerServices.map((provider: any) => (

                      <option
                        key={provider.id}
                        value={provider.provider_service_id}
                      >
                        {provider.provider_service_id} • {provider.service_name}
                      </option>

                    ))}

                  </select>

                </td>

                <td className="p-4">

                  <button
                    onClick={() => saveMapping(service.id)}
                    className="rounded-xl bg-blue-600 px-5 py-2 hover:bg-blue-700"
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