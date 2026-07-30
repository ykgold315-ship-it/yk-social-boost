import OrderForm from "@/app/components/dashboard/OrderForm";

export default function NewOrderPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-white">
        Place New Order
      </h1>

      <p className="mt-2 text-slate-400">
        Choose a service, enter your link and quantity.
      </p>

      <div className="mt-8">
        <OrderForm />
      </div>
    </div>
  );
}