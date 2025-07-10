import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DashboardLayout } from "@/components/dashboard-layout";
import Link from "next/link";
import { notFound } from "next/navigation";

// Fetch customer data by ID
async function getCustomer(customer_id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.myconsole.pro";
  const res = await fetch(`${baseUrl}/api/customers/${customer_id}`);
  if (!res.ok) return null;
  return await res.json();
}

// Fetch customer orders directly
async function getCustomerOrders(customer_id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.myconsole.pro";
  const res = await fetch(`${baseUrl}/api/customers/${customer_id}/orders`);
  if (!res.ok) {
    console.error("Failed to fetch customer orders:", res.status, res.statusText);
    return [];
  }
  return await res.json();
}

export default async function CustomerNewProfilePage({ params }: { params: { customer_id: string } }) {
  const customer = await getCustomer(params.customer_id);
  if (!customer) return notFound();
  
  const customerOrders = await getCustomerOrders(params.customer_id);

  // Aggregate stats
  const totalOrders = customerOrders.length;
  const totalSpent = customerOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const firstOrderDate = customerOrders.length ? new Date(Math.min(...customerOrders.map((o: any) => new Date(o.orderDate).getTime()))).toLocaleDateString() : "-";
  const lastOrderDate = customerOrders.length ? new Date(Math.max(...customerOrders.map((o: any) => new Date(o.orderDate).getTime()))).toLocaleDateString() : "-";

  // Product stats
  const productCounts: Record<string, number> = {};
  const productTotals: Record<string, number> = {};
  customerOrders.forEach((order: any) => {
    if (order.items && order.items.trim()) {
      const item = order.items.trim();
      productCounts[item] = (productCounts[item] || 0) + 1;
      productTotals[item] = (productTotals[item] || 0) + (order.total || 0);
    }
  });
  
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const CustomerProfileContent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Customer Profile</h2>
        <Link href="/customers" className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded shadow">Back to Customers</Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-white">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm">Total Spent</p>
            <p className="text-2xl font-bold text-green-400">${totalSpent.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm">First Order</p>
            <p className="text-2xl font-bold text-white">{firstOrderDate}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm">Last Order</p>
            <p className="text-2xl font-bold text-white">{lastOrderDate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Products */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white text-lg">Top 3 Most Ordered Products</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-slate-400">No products ordered yet.</p>
          ) : (
            <ol className="list-decimal ml-6 text-white space-y-1">
              {topProducts.map(([product, count]) => (
                <li key={product} className="flex justify-between">
                  <span>{product}</span>
                  <span className="text-slate-400">x{count} (${productTotals[product]?.toFixed(2) || '0.00'})</span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      {/* Contact & Notes */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white text-lg">Contact & Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Customer ID</p>
              <p className="text-white">{customer.customer_id}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Name</p>
              <p className="text-white">{customer.name}</p>
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
              <p className="text-slate-400 text-sm">Status</p>
              <p className="text-white">{customer.customer_status}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Tags</p>
              <p className="text-white">{customer.tags}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Preferred Contact</p>
              <p className="text-white">{customer.preferred_contact}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Wix Contact ID</p>
              <p className="text-white">{customer.wix_contact_id || "Not set"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Square Customer ID</p>
              <p className="text-white">{customer.square_customer_id || "Not set"}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-slate-400 text-sm mb-2">Customer Notes</p>
            <div className="bg-slate-800/50 border-slate-600 text-white p-2 rounded min-h-[60px]">
              {customer.customer_notes || "No notes."}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order History */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white text-lg">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {customerOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-lg">No orders found for this customer.</p>
              <p className="text-slate-500 text-sm mt-2">Customer ID: {customer.customer_id}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-300">Order ID</TableHead>
                  <TableHead className="text-slate-300">Date</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Total</TableHead>
                  <TableHead className="text-slate-300">Items</TableHead>
                  <TableHead className="text-slate-300">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerOrders.map((order: any) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="text-slate-300 font-mono text-xs">{order.orderId}</TableCell>
                    <TableCell className="text-slate-300">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-slate-300">{order.status || "N/A"}</TableCell>
                    <TableCell className="text-slate-300">${order.total?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell className="text-slate-300">{order.items || "N/A"}</TableCell>
                    <TableCell className="text-slate-300">{order.notes || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout>
      <CustomerProfileContent />
    </DashboardLayout>
  );
} 