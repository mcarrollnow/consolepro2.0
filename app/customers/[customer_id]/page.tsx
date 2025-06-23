import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getCustomer(customer_id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://www.myconsole.pro";
  const res = await fetch(`${baseUrl}/api/customers/${customer_id}`);
  if (!res.ok) return null;
  return await res.json();
}

async function getOrders() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.myconsole.pro";
  const res = await fetch(`${baseUrl}/api/orders`);
  if (!res.ok) return [];
  return await res.json();
}

export default async function CustomerProfilePage({ params }: { params: { customer_id: string } }) {
  const customer = await getCustomer(params.customer_id);
  if (!customer) return notFound();
  const orders = await getOrders();
  // Filter orders by customer email (since customerId is not in orders)
  const customerOrders = orders.filter((o: any) => o.customerEmail?.toLowerCase() === customer.email?.toLowerCase());

  // Aggregate stats
  const totalOrders = customerOrders.length;
  const totalSpent = customerOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const firstOrderDate = customerOrders.length ? new Date(Math.min(...customerOrders.map((o: any) => new Date(o.orderDate).getTime()))).toLocaleDateString() : "-";
  const lastOrderDate = customerOrders.length ? new Date(Math.max(...customerOrders.map((o: any) => new Date(o.orderDate).getTime()))).toLocaleDateString() : "-";

  // Top 3 most ordered products
  const productCounts: Record<string, number> = {};
  customerOrders.forEach((order: any) => {
    order.items?.split(",").forEach((item: string) => {
      const trimmed = item.trim();
      if (trimmed) productCounts[trimmed] = (productCounts[trimmed] || 0) + 1;
    });
  });
  const topProducts = Object.entries(productCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-900/20 to-purple-900/20 pointer-events-none" />
      <main className="flex-1 p-8 overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header and Back Button */}
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
                      <span className="text-slate-400">x{count}</span>
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
                  <p className="text-slate-400 text-sm">Tags</p>
                  <p className="text-white">{customer.tags}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Preferred Contact</p>
                  <p className="text-white">{customer.preferred_contact}</p>
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
                <p className="text-slate-400">No orders found for this customer.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-300">Order ID</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Total</TableHead>
                      <TableHead className="text-slate-300">Invoice</TableHead>
                      <TableHead className="text-slate-300">Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerOrders.map((order: any) => (
                      <TableRow key={order.orderId}>
                        <TableCell className="text-slate-300 font-mono text-xs">{order.orderId}</TableCell>
                        <TableCell className="text-slate-300">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-slate-300">{order.status}</TableCell>
                        <TableCell className="text-slate-300">${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-slate-300">
                          {order.invoice_link ? (
                            <a href={order.invoice_link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Invoice</a>
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-300">{order.items}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 