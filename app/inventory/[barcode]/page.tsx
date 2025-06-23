import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import dynamic from "next/dynamic";

const SalesTrendChart = dynamic(() => import("./SalesTrendChart"), { ssr: false });

// TODO: Replace with real data fetching
async function getProductData(barcode: string) {
  // Placeholder: fetch from API or Google Sheets
  return {
    barcode,
    name: "Product Name Placeholder",
    image: "/placeholder.svg",
    totalSales: 1234,
    salesRank: 3,
    revenue: 56789,
    topCustomers: [
      { name: "Alice Smith", email: "alice@email.com", purchases: 12, lastPurchase: "2024-06-01" },
      { name: "Bob Jones", email: "bob@email.com", purchases: 9, lastPurchase: "2024-05-20" },
      { name: "Carol Lee", email: "carol@email.com", purchases: 7, lastPurchase: "2024-05-15" },
      { name: "Dan Wu", email: "dan@email.com", purchases: 6, lastPurchase: "2024-05-10" },
      { name: "Eve Kim", email: "eve@email.com", purchases: 5, lastPurchase: "2024-05-05" },
    ],
    allCustomers: [
      { name: "Alice Smith", email: "alice@email.com", purchases: 12, lastPurchase: "2024-06-01" },
      { name: "Bob Jones", email: "bob@email.com", purchases: 9, lastPurchase: "2024-05-20" },
      { name: "Carol Lee", email: "carol@email.com", purchases: 7, lastPurchase: "2024-05-15" },
      { name: "Dan Wu", email: "dan@email.com", purchases: 6, lastPurchase: "2024-05-10" },
      { name: "Eve Kim", email: "eve@email.com", purchases: 5, lastPurchase: "2024-05-05" },
      { name: "Frank Green", email: "frank@email.com", purchases: 2, lastPurchase: "2024-04-28" },
    ],
    frequentlyBoughtTogether: [
      { name: "Product A", barcode: "123456", count: 22 },
      { name: "Product B", barcode: "789012", count: 17 },
      { name: "Product C", barcode: "345678", count: 13 },
    ],
    salesTrend: [
      { date: "2024-05-01", sales: 10 },
      { date: "2024-05-08", sales: 15 },
      { date: "2024-05-15", sales: 8 },
      { date: "2024-05-22", sales: 20 },
      { date: "2024-05-29", sales: 12 },
    ],
  }
}

export default async function ProductDetailPage({ params }: { params: { barcode?: string } }) {
  console.log("ProductDetailPage params:", params);
  if (!params || !params.barcode) {
    return <div className="text-red-500 text-center py-10">Error: No barcode provided in URL.</div>;
  }
  const { barcode } = params
  const product = await getProductData(barcode)
  if (!product) {
    return <div className="text-red-500 text-center py-10">Error: Product not found for barcode: {barcode}</div>;
  }

  console.log("ProductDetailPage product:", product);

  // Collect all customer emails for group email
  const allEmails = product.allCustomers.map(c => c.email).join(",")

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      {/* Product Header */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <Avatar src={product.image} alt={product.name} className="h-28 w-28 rounded-xl border border-slate-800 bg-slate-800" />
        <div className="flex-1">
          <div className="text-3xl font-bold text-white mb-1">{product.name}</div>
          <div className="text-cyan-400 text-sm mb-2 font-mono">Barcode: {product.barcode}</div>
          <div className="flex flex-wrap gap-6 items-center mb-2">
            <span className="text-slate-300 text-lg">Total Sales: <b className="text-white">{product.totalSales}</b></span>
            <span className="text-slate-300 text-lg">Revenue: <b className="text-white">${product.revenue.toLocaleString()}</b></span>
            <Badge className="bg-cyan-700 text-cyan-100 text-base px-4 py-2 rounded-lg">Sales Rank #{product.salesRank}</Badge>
          </div>
        </div>
        <Button asChild className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg px-6 py-3 text-lg rounded-xl">
          <a href={`mailto:?bcc=${allEmails}`} title="Email all customers for this product">
            Email All Customers
          </a>
        </Button>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 shadow-xl">
        <SalesTrendChart salesTrend={product.salesTrend} />
      </div>

      {/* Top Customers & Frequently Bought Together */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <div className="text-white text-lg font-semibold mb-4">Top 5 Customers</div>
          {Array.isArray(product.topCustomers) && product.topCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Purchases</TableHead>
                  <TableHead className="text-slate-300">Last Purchase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.topCustomers.map((c, i) => (
                  <TableRow key={i} className="hover:bg-slate-800/60">
                    <TableCell className="text-white font-medium">{c.name}</TableCell>
                    <TableCell className="text-cyan-300 font-mono">{c.email}</TableCell>
                    <TableCell className="text-white">{c.purchases}</TableCell>
                    <TableCell className="text-slate-300 font-mono">{c.lastPurchase}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <span className="text-slate-400">No customer data available.</span>
          )}
        </div>
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <div className="text-white text-lg font-semibold mb-4">Frequently Bought Together</div>
          {Array.isArray(product.frequentlyBoughtTogether) && product.frequentlyBoughtTogether.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-300">Product</TableHead>
                  <TableHead className="text-slate-300">Barcode</TableHead>
                  <TableHead className="text-slate-300">Times Bought Together</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.frequentlyBoughtTogether.map((p, i) => (
                  <TableRow key={i} className="hover:bg-slate-800/60">
                    <TableCell className="text-white font-medium">{p.name}</TableCell>
                    <TableCell className="text-cyan-300 font-mono">{p.barcode}</TableCell>
                    <TableCell className="text-white">{p.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <span className="text-slate-400">No frequently bought together data available.</span>
          )}
        </div>
      </div>

      {/* All Customers Table */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 shadow-xl">
        <div className="text-white text-xl font-semibold mb-4">All Customers Who Purchased This Product</div>
        {Array.isArray(product.allCustomers) && product.allCustomers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Purchases</TableHead>
                <TableHead className="text-slate-300">Last Purchase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.allCustomers.map((c, i) => (
                <TableRow key={i} className="hover:bg-slate-800/60">
                  <TableCell className="text-white font-medium">{c.name}</TableCell>
                  <TableCell className="text-cyan-300 font-mono">{c.email}</TableCell>
                  <TableCell className="text-white">{c.purchases}</TableCell>
                  <TableCell className="text-slate-300 font-mono">{c.lastPurchase}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <span className="text-slate-400">No customer data available.</span>
        )}
      </div>
    </div>
  )
} 