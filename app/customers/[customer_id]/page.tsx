import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

async function getCustomer(customer_id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/customers`);
  const customers = await res.json();
  return customers.find((c: any) => c.customer_id === customer_id);
}

export default async function CustomerProfilePage({ params }: { params: { customer_id: string } }) {
  const customer = await getCustomer(params.customer_id);
  if (!customer) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Customer Profile - {customer.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Customer ID</p>
                <p className="text-white">{customer.customer_id}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white">{customer.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Phone</p>
                <p className="text-white">{customer.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Company</p>
                <p className="text-white">{customer.company}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Address</p>
                <p className="text-white">{customer.address}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <p className="text-white">{customer.customer_status}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Orders</p>
                <p className="text-white">{customer.total_orders}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Spent</p>
                <p className="text-white">{customer.total_spent}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">First Order Date</p>
                <p className="text-white">{customer.first_order_date}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Last Order Date</p>
                <p className="text-white">{customer.last_order_date}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Customer Notes</p>
              <div className="bg-slate-800/50 border-slate-600 text-white p-2 rounded min-h-[60px]">
                {customer.customer_notes || "No notes."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 