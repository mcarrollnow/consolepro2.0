import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

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

export default async function ProductDetailPage({ params }: { params: { barcode: string } }) {
  const { barcode } = params
  const product = await getProductData(barcode)
  if (!product) return notFound()

  // Collect all customer emails for group email
  const allEmails = product.allCustomers.map(c => c.email).join(",")

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      {/* Product Header */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader className="flex flex-row items-center gap-6">
          <Avatar src={product.image} alt={product.name} className="h-24 w-24 rounded-lg border border-slate-700 bg-slate-800" />
          <div className="flex-1">
            <CardTitle className="text-white text-3xl mb-1">{product.name}</CardTitle>
            <div className="text-slate-400 text-sm mb-2">Barcode: <span className="font-mono text-slate-200">{product.barcode}</span></div>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-slate-300">Total Sales: <b>{product.totalSales}</b></span>
              <span className="text-slate-300">Revenue: <b>${product.revenue.toLocaleString()}</b></span>
              <Badge className="bg-cyan-700 text-cyan-100">Sales Rank #{product.salesRank}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex-1" />
          <Button asChild className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg">
            <a href={`mailto:?bcc=${allEmails}`} title="Email all customers for this product">
              Email All Customers
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Sales Trend Chart */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white text-xl">Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-slate-400">
            {Array.isArray(product.salesTrend) && product.salesTrend.length > 0 ? (
              <ChartContainer data={product.salesTrend} />
            ) : (
              <span>No sales trend data available.</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Customers & Frequently Bought Together */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-lg">Top 5 Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(product.topCustomers) && product.topCustomers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Purchases</TableHead>
                    <TableHead>Last Purchase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.topCustomers.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.purchases}</TableCell>
                      <TableCell>{c.lastPurchase}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <span>No customer data available.</span>
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-lg">Frequently Bought Together</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(product.frequentlyBoughtTogether) && product.frequentlyBoughtTogether.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Barcode</TableHead>
                    <TableHead>Times Bought Together</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.frequentlyBoughtTogether.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell className="font-mono text-xs">{p.barcode}</TableCell>
                      <TableCell>{p.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <span>No frequently bought together data available.</span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Customers Table */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white text-xl">All Customers Who Purchased This Product</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(product.allCustomers) && product.allCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Purchases</TableHead>
                  <TableHead>Last Purchase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.allCustomers.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.purchases}</TableCell>
                    <TableCell>{c.lastPurchase}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <span>No customer data available.</span>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 