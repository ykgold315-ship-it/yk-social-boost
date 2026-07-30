"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/browser-client";

export default function OrderForm() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState<any>(null);

  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data || []);
  }

  async function handleCategory(id: string) {
    setSelectedCategory(id);
    setSelectedService(null);

    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("category_id", Number(id))
      .eq("active", true)
      .order("name");

    setServices(data || []);
  }

  function handleService(id: string) {
    const service = services.find((s) => s.id === Number(id));
    setSelectedService(service);
  }

  const charge =
    selectedService && quantity
      ? (
          (Number(quantity) / 1000) *
          Number(selectedService.price)
        ).toFixed(2)
      : "0.00";

  async function placeOrder() {
    if (!selectedService) {
      return alert("Select a service.");
    }

    if (!link) {
      return alert("Enter your link.");
    }

    if (!quantity) {
      return alert("Enter quantity.");
    }

    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: selectedService.id,
        link,
        quantity: Number(quantity),
        charge: Number(charge),
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      return alert(data.error);
    }

   alert("✅ Order placed successfully!");

router.refresh();

router.push("/dashboard/orders");
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">

      <h2 className="text-2xl font-bold mb-6">
        Place New Order
      </h2>

      <div className="space-y-5">

        <select
          value={selectedCategory}
          onChange={(e) => handleCategory(e.target.value)}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3"
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => handleService(e.target.value)}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3"
        >
          <option>Select Service</option>

          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        {selectedService && (
          <div className="rounded-xl bg-slate-800 p-5 space-y-2">
            <p><strong>Price:</strong> ₦{selectedService.price}</p>
            <p><strong>Min:</strong> {selectedService.min_order}</p>
            <p><strong>Max:</strong> {selectedService.max_order}</p>
            <p><strong>Delivery:</strong> {selectedService.delivery_time}</p>
          </div>
        )}

        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Enter Link"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3"
        />

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3"
        />

        <div className="rounded-xl bg-blue-950 border border-blue-700 p-5">
          <p>Estimated Charge</p>
          <h2 className="text-3xl font-bold">
            ₦{charge}
          </h2>
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

      </div>

    </div>
  );
}