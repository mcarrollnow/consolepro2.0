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

// Notion page mapping by product name (lowercase, no volume)
const notionLinks: Record<string, string> = {
  adipotide: "https://www.notion.so/adipotide-1f9b01f2ff8f808f8aaef6e5879a13bc?source=copy_link",
  aod_9604: "https://www.notion.so/aod_9604-1f9b01f2ff8f8057aac0f919f2584e27?source=copy_link",
  bpc_157: "https://www.notion.so/bpc_157-1f9b01f2ff8f80cdb4c9df17649f12e8?source=copy_link",
  cagrilintide: "https://www.notion.so/cagrilintide-1f9b01f2ff8f806092eafff798ac9c1e?source=copy_link",
  cjc_1295_with_dac: "https://www.notion.so/cjc_1295_with_dac-1f9b01f2ff8f80819338cba953b91e5a?source=copy_link",
  dsip: "https://www.notion.so/dsip-1f9b01f2ff8f8023a65bd17de77c8c73?source=copy_link",
  epithalon: "https://www.notion.so/epithalon-1f9b01f2ff8f800a9a42c7005cd53954?source=copy_link",
  ghk_cu: "https://www.notion.so/ghk_cu-1f9b01f2ff8f80d6b0efe6a218259dcd?source=copy_link",
  ghrp_2: "https://www.notion.so/ghrp_2-1f9b01f2ff8f80199f32fa6e061b568c?source=copy_link",
  hcg: "https://www.notion.so/hcg-1f9b01f2ff8f80fbb0dadc3b40f407ac?source=copy_link",
  hexarelin: "https://www.notion.so/hexarelin-1f9b01f2ff8f807186e9d73024d247c6?source=copy_link",
  hgh: "https://www.notion.so/hgh-1f9b01f2ff8f80e48c52e50d62196420?source=copy_link",
  igf_lr3: "https://www.notion.so/igf_Ir3-1f9b01f2ff8f80a888e6cf322f716aaf?source=copy_link",
  ipamorelin: "https://www.notion.so/ipamorelin-1f9b01f2ff8f80d089c7d657e4f208b0?source=copy_link",
  kisspeptin_10: "https://www.notion.so/kisspeptin_10-1f9b01f2ff8f809989ccc96334ceb59a?source=copy_link",
  melanotan_2: "https://www.notion.so/melanotan_2-1f9b01f2ff8f807994f0f79ae9216eac?source=copy_link",
  mots_c: "https://www.notion.so/mots_c-1f9b01f2ff8f8036ad87d50db17f4852?source=copy_link",
  nad: "https://www.notion.so/nad-1f9b01f2ff8f809bb07acae44a6dde17?source=copy_link",
  oxytocin_acetate: "https://www.notion.so/oxytocin_acetate-1f9b01f2ff8f80709f5ffe64efbf3cb5?source=copy_link",
  peg_mgf: "https://www.notion.so/peg_mgf-1f9b01f2ff8f80ddb084dc9c8f3b2139?source=copy_link",
  pt_141: "https://www.notion.so/pt_141-1f9b01f2ff8f80c2904ff1c7c0868522?source=copy_link",
  retatrutide: "https://www.notion.so/retatrutide-1f9b01f2ff8f80df929dcb59fb70a949?source=copy_link",
  selank: "https://www.notion.so/selank-1f9b01f2ff8f8065b4a4e945280be588?source=copy_link",
  semaglutide: "https://www.notion.so/semaglutide-1f9b01f2ff8f804cb9d9c9e180cea9d2?source=copy_link",
  semax: "https://www.notion.so/semax-1f9b01f2ff8f80d481d5dde0f05611cd?source=copy_link",
  sermorelin: "https://www.notion.so/sermorelin-1f9b01f2ff8f8087a287c836be53a57a?source=copy_link",
  snap_8: "https://www.notion.so/snap_8-1f9b01f2ff8f803fa28bf83c138406a0?source=copy_link",
  ss_31: "https://www.notion.so/ss_31-1f9b01f2ff8f8020a5ead8e6eec90bd5?source=copy_link",
  tesamorelin: "https://www.notion.so/tesamorelin-1f9b01f2ff8f80c5807ce237fdead5a3?source=copy_link",
  thymosin_alpha_1: "https://www.notion.so/thymosin_alpha_1-1f9b01f2ff8f80baa9bdcf0832b45d9c?source=copy_link",
  thymosin_beta_4: "https://www.notion.so/thymosin_beta_4-1f9b01f2ff8f80a4b4abe19d5b320110?source=copy_link",
  thymulin: "https://www.notion.so/thymulin-1f9b01f2ff8f8092900fe8b4f062a821?source=copy_link",
  tirzepatide: "https://www.notion.so/tirzepatide-1f9b01f2ff8f80ac9bc3dab81a393879?source=copy_link",
}

function normalizeProductName(name: string) {
  // Remove volume info (e.g., 2mg, 5mg, etc.), lowercase, trim
  return name.replace(/\s*\d+\s*mg/gi, '').replace(/\s+/g, '_').toLowerCase().trim()
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

  // Notion link lookup
  const notionKey = normalizeProductName(product.name)
  const notionUrl = notionLinks[notionKey]

  console.log("ProductDetailPage product:", product);

  // Collect all customer emails for group email
  const allEmails = product.allCustomers.map(c => c.email).join(",")

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
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
            {notionUrl && (
              <a
                href={notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
              >
                View Notion Profile
              </a>
            )}
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
    </div>
  )
} 