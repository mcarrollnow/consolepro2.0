import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard-layout";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Package, Calendar, DollarSign } from "lucide-react";

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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getCustomerStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Regular":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "New":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const CustomerProfileContent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Customer Profile</h2>
          <p className="text-slate-400 mt-1">Customer ID: {customer.customer_id}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/customers">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Back to Customers
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{totalOrders}</p>
              </div>
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Package className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-green-400">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">First Order</p>
                <p className="text-2xl font-bold text-white">{firstOrderDate}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Last Order</p>
                <p className="text-2xl font-bold text-white">{lastOrderDate}</p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
            </div>
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
              <p className="text-white font-mono">{customer.customer_id}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Name</p>
              <p className="text-white">{customer.name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <p className="text-cyan-300 font-mono">{customer.email}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Phone</p>
              <p className="text-cyan-300 font-mono">{customer.phone}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Company</p>
              <p className="text-white">{customer.company}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Status</p>
              <Badge className={getCustomerStatusColor(customer.customer_status)}>
                {customer.customer_status === "VIP" && <Star className="h-3 w-3 mr-1" />}
                {customer.customer_status}
              </Badge>
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
              <p className="text-white font-mono">{customer.wix_contact_id || "Not set"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Square Customer ID</p>
              <p className="text-white font-mono">{customer.square_customer_id || "Not set"}</p>
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
                <TableRow className="border-slate-700">
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
                  <TableRow key={order.orderId} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-cyan-300 font-mono text-xs">{order.orderId}</TableCell>
                    <TableCell className="text-slate-300">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <Package className="h-3 w-3 mr-1" />
                        {order.status || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-400 font-bold">${order.total?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell className="text-slate-300">{order.items || "N/A"}</TableCell>
                    <TableCell className="text-slate-400 text-sm max-w-xs truncate">{order.notes || "N/A"}</TableCell>
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