"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/browser-client";

type Profile = {
  id: string;
  full_name: string;
};

type Service = {
  id: number;
  name: string;
  price: number;
};

export default function NewOrderPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<Profile[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [form, setForm] = useState({
    user_id: "",
    service_id: "",
    link: "",
    quantity: 100,
    charge: 0,
  });

  useEffect(() => {
    async function loadData() {
      const { data: usersData } = await supabase
        .from("profiles")
        .select("id, full_name")
        .order("full_name");

      const { data: servicesData } = await supabase
        .from("services")
        .select("id,name,price")
        .eq("active", true)
        .order("name");

      if (usersData) setUsers(usersData);

      if (servicesData) setServices(servicesData);
    }

    loadData();
  }, []);

  useEffect(() => {
    const service = services.find(
      (s) => s.id === Number(form.service_id)
    );

    if (!service) return;

    const charge =
      (Number(service.price) * Number(form.quantity)) / 1000;

    setForm((prev) => ({
      ...prev,
      charge: Number(charge.toFixed(2)),
    }));
  }, [form.quantity, form.service_id, services]);

  async function createOrder() {
    setLoading(true);

    const selectedService = services.find(
      (s) => s.id === Number(form.service_id)
    );

    if (!selectedService) {
      setLoading(false);
      return alert("Select a valid service.");
    }

    const { data: serviceRecord, error: serviceRecordError } = await supabase
      .from("services")
      .select("provider_service_id, active")
      .eq("id", selectedService.id)
      .single();

    if (serviceRecordError || !serviceRecord) {
      setLoading(false);
      return alert("Service lookup failed.");
    }

    if (!serviceRecord.active) {
      setLoading(false);
      return alert("Service is not active.");
    }

    if (
      serviceRecord.provider_service_id == null ||
      String(serviceRecord.provider_service_id).trim() === "" ||
      String(serviceRecord.provider_service_id).trim() === "0"
    ) {
      setLoading(false);
      return alert("Selected service is not mapped to a provider service.");
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: form.user_id,
        service_id: Number(form.service_id),
        link: form.link,
        quantity: Number(form.quantity),
        charge: Number(form.charge),
        status: "Pending",
        start_count: 0,
        remains: Number(form.quantity),
      })
      .select()
      .single();

    if (orderError || !order) {
      setLoading(false);
      alert(orderError?.message || "Failed to create order.");
      return;
    }

    const { error: jobError } = await supabase.from("automation_jobs").insert({
      order_id: order.id,
      user_id: order.user_id,
      service_id: order.service_id,
      status: "Queued",
      progress: 0,
    });

    setLoading(false);

    if (jobError) {
      alert("Order created but failed to queue automation job.");
      console.error(jobError);
      return;
    }

    alert("Order created successfully.");

    router.push("/admin/orders");
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Create New Order
        </h1>

        <p className="text-slate-400 mt-2">
          Create an order manually for a customer.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6">

        <div>
          <label className="block mb-2">
            Customer
          </label>

          <select
            value={form.user_id}
            onChange={(e) =>
              setForm({
                ...form,
                user_id: e.target.value,
              })
            }
            className="w-full rounded-xl bg-slate-800 p-3"
          >
            <option value="">
              Select Customer
            </option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Service
          </label>

          <select
            value={form.service_id}
            onChange={(e) =>
              setForm({
                ...form,
                service_id: e.target.value,
              })
            }
            className="w-full rounded-xl bg-slate-800 p-3"
          >
            <option value="">
              Select Service
            </option>

            {services.map((service) => (
              <option
                key={service.id}
                value={service.id}
              >
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Link
          </label>

          <input
            value={form.link}
            onChange={(e) =>
              setForm({
                ...form,
                link: e.target.value,
              })
            }
            className="w-full rounded-xl bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="block mb-2">
            Quantity
          </label>

          <input
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: Number(e.target.value),
              })
            }
            className="w-full rounded-xl bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="block mb-2">
            Charge (£)
          </label>

          <input
            value={form.charge}
            readOnly
            className="w-full rounded-xl bg-slate-800 p-3"
          />
        </div>

        <button
          onClick={createOrder}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Order"}
        </button>

      </div>

    </div>
  );
}