import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import dynamic from "next/dynamic";
import { CustomerOrdersDialog } from "./CustomerOrdersDialog"
import { DashboardLayout } from "@/components/dashboard-layout"

const SalesTrendChart = dynamic(() => import("./SalesTrendChart"), { ssr: false });

// Notion page mapping by product name (lowercase, no volume)
const notionLinks: Record<string, string> = {
  adipotide: "https://www.notion.so/adipotide-1f9b01f2ff8f808f8aaef6e5879a13bc?source=copy_link",
  // ... (rest unchanged)
}

function normalizeProductName(name: string) {
  return name.replace(/\s*\d+\s*mg/gi, '').replace(/\s+/g, '_').toLowerCase().trim()
}

export function getDriveDirectImage(url: string) {
  if (!url || url.trim() === "") return "/placeholder.svg";
  // If it's a Google Drive share link, convert it
  const match = url.match(/\/file\/d\/([\w-]+)\//);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  // If it's a local image path (e.g., Product_Images/filename.jpg), serve from public
  if (url.startsWith("Product_Images/")) {
    return `/${url}`;
  }
  // If it's already a direct Google Drive link or a valid URL, return as is
  if (url.startsWith("http")) {
    return url;
  }
  // Fallback to placeholder
  return "/placeholder.svg";
}

async function fetchLiveProductProfile(barcode: string) {
  // Fetch all data in parallel - include both active and archived orders
  const [inventoryRes, salesRes, ordersRes, archivedOrdersRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/inventory`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/sales`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/orders?sheet=Orders`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/orders?sheet=Archived Orders`, { cache: 'no-store' }),
  ])
  const [inventory, sales, orders, archivedOrders] = await Promise.all([
    inventoryRes.json(),
    salesRes.json(),
    ordersRes.json(),
    archivedOrdersRes.json(),
  ])
  // Find product
  const product = inventory.find((item: any) => item.barcode === barcode)
  if (!product) return null

  // Sales for this product
  const productSales = sales.filter((s: any) => s["Product Barcode"] === barcode)
  
  // Orders for this product - combine active and archived orders
  const allOrders = [...orders, ...archivedOrders]
  const productOrders = allOrders.filter((order: any) => {
    if (Array.isArray(order.products)) {
      return order.products.some((p: any) => p.barcode === barcode)
    }
    // Also check if the order has the product in the items field
    return order.items && order.items.toLowerCase().includes(product.product.toLowerCase())
  })

  console.log(`Total orders: ${allOrders.length}`)
  console.log(`Orders containing product ${barcode}: ${productOrders.length}`)
  if (productOrders.length > 0) {
    console.log(`Sample order structure:`, productOrders[0])
  }

  // Top customers: aggregate by customer_id, but use name/email/phone from order row
  const customerMap: Record<string, { customer_id: string, name: string, email: string, phone: string, purchases: number, lastPurchase: string, orders: any[] }> = {}
  
  console.log(`Processing ${productOrders.length} orders for product ${barcode}`)
  
  for (const order of productOrders) {
    const customerId = order.customer_id || order.customerId || "Unknown"
    const name = order.customerName || order.customer_name || "Unknown"
    const email = order.customerEmail || order.customer_email || "Unknown"
    const phone = order.customerPhone || order.customer_phone || order.phone || ""
    
    console.log(`Order ${order.orderId}: customerId=${customerId}, name=${name}, email=${email}`)
    
    if (!customerMap[customerId]) {
      customerMap[customerId] = {
        customer_id: customerId,
        name,
        email,
        phone,
        purchases: 0,
        lastPurchase: order.orderDate || order.order_date || "",
        orders: []
      }
    }
    customerMap[customerId].purchases += 1
    customerMap[customerId].orders.push(order)
    if ((order.orderDate || order.order_date || "") > customerMap[customerId].lastPurchase) {
      customerMap[customerId].lastPurchase = order.orderDate || order.order_date || ""
    }
  }
  const allCustomers = Object.values(customerMap)
  const topCustomers = [...allCustomers].sort((a, b) => b.purchases - a.purchases).slice(0, 5)
  
  console.log(`Found ${allCustomers.length} unique customers, top 5:`, topCustomers)

  // Frequently bought together - find products bought in the same orders as this product
  const togetherMap: Record<string, { name: string, barcode: string, count: number }> = {}
  
  // Create a map of barcode to product name from inventory
  const barcodeToName: Record<string, string> = {}
  inventory.forEach((item: any) => {
    if (item.barcode && item.product) {
      barcodeToName[item.barcode] = item.product
    }
  })
  
  console.log(`Looking for frequently bought together products for barcode: ${barcode}`)
  console.log(`Found ${productOrders.length} orders containing this product`)
  console.log(`Total orders available: ${allOrders.length}`)
  
  // Debug: Log first few orders to see their structure
  console.log("Sample orders structure:")
  allOrders.slice(0, 3).forEach((order, index) => {
    console.log(`Order ${index + 1}:`, {
      orderId: order.orderId,
      items: order.items,
      products: order.products,
      hasProductsArray: Array.isArray(order.products),
      productsLength: order.products?.length || 0
    })
  })
  
  // Look through all orders to find orders that contain this product
  let ordersWithTargetProduct = 0
  for (const order of allOrders) {
    // Check if this order contains our target product
    const hasTargetProduct = order.products?.some((p: any) => p.barcode === barcode) || 
                           (order.items && order.items.toLowerCase().includes(product.product.toLowerCase()))
    
    if (hasTargetProduct) {
      ordersWithTargetProduct++
      console.log(`Order ${order.orderId} contains target product`)
      console.log(`Order products:`, order.products)
      console.log(`Order items:`, order.items)
      
      // Now look for other products in this same order
      if (order.products && Array.isArray(order.products) && order.products.length > 0) {
        for (const p of order.products) {
          if (p.barcode && p.barcode !== barcode) {
            const productName = p.name || barcodeToName[p.barcode] || `Unknown Product (${p.barcode})`
            if (!togetherMap[p.barcode]) {
              togetherMap[p.barcode] = { name: productName, barcode: p.barcode, count: 0 }
            }
            togetherMap[p.barcode].count += 1
            console.log(`Found co-purchase: ${productName} (${p.barcode})`)
          }
        }
      } else {
        console.log(`Order ${order.orderId} has no products array or it's empty:`, order.products)
        // Fallback: try to parse items field if products array is empty
        if (order.items && order.items !== product.product) {
          console.log(`Trying to parse items field: ${order.items}`)
          // This is a simplified approach - we can't get barcodes from items field
          // but we can at least show that other items were bought together
        }
      }
    }
  }
  
  console.log(`Total orders containing target product: ${ordersWithTargetProduct}`)
  
  const frequentlyBoughtTogether = Object.values(togetherMap).sort((a, b) => b.count - a.count).slice(0, 5)
  console.log(`Frequently bought together results:`, frequentlyBoughtTogether)
  console.log(`Together map:`, togetherMap)

  // Sales trend (by day)
  const salesTrendMap: Record<string, number> = {}
  for (const sale of productSales) {
    const date = sale["Timestamp"]?.slice(0, 10) || ""
    if (!salesTrendMap[date]) salesTrendMap[date] = 0
    salesTrendMap[date] += parseInt(sale["Quantity"] || "1")
  }
  const salesTrend = Object.entries(salesTrendMap).map(([date, sales]) => ({ date, sales })).sort((a, b) => a.date.localeCompare(b.date))

  // Revenue
  const revenue = productSales.reduce((sum: number, s: any) => sum + (parseFloat(s["Product Price"] || "0") * parseInt(s["Quantity"] || "1")), 0)

  // Sales rank (by total sales)
  const productSalesCounts: Record<string, number> = {}
  for (const s of sales) {
    const bc = s["Product Barcode"]
    productSalesCounts[bc] = (productSalesCounts[bc] || 0) + parseInt(s["Quantity"] || "1")
  }
  const sortedSales = Object.entries(productSalesCounts).sort((a, b) => b[1] - a[1])
  const salesRank = sortedSales.findIndex(([bc]) => bc === barcode) + 1

  return {
    ...product,
    totalSales: productSales.reduce((sum: number, s: any) => sum + parseInt(s["Quantity"] || "1"), 0),
    salesRank,
    revenue,
    topCustomers,
    allCustomers,
    frequentlyBoughtTogether,
    salesTrend,
    productOrders,
  }
}

export default async function ProductDetailPage({ params }: { params: { barcode?: string } }) {
  if (!params || !params.barcode) {
    return <div className="text-red-500 text-center py-10">Error: No barcode provided in URL.</div>;
  }
  const { barcode } = params
  const product = await fetchLiveProductProfile(barcode)
  if (!product) {
    return <div className="text-red-500 text-center py-10">Error: Product not found for barcode: {barcode}</div>;
  }

  // Explicitly assign the correct image path for each product
  let productImage = "/placeholder.svg";
  if (["Semaglutide 2mg", "Semaglutide 5mg", "Semaglutide 10mg"].includes(product.product)) productImage = "/semaglutide.png";
  else if (["Tirzepatide 10 mg", "Tirzepatide 15 mg", "Tirzepatide 30 mg", "Tirzepatide 5mg", "Tirzepatide 60 mg"].includes(product.product)) productImage = "/tirzepatide.png";
  else if (["BPC-157 10 mg", "BPC-157 2 mg", "BPC-157 5 mg"].includes(product.product)) productImage = "/bpc157.png";
  else if (["AOD-9604 2 mg"].includes(product.product)) productImage = "/aod_9604.png";
  else if (["Cagrilintide 10 mg", "Cagrilintide 5 mg"].includes(product.product)) productImage = "/cagrilintide.png";
  else if (["Epithalon 10mg"].includes(product.product)) productImage = "/epithalon.png";
  else if (["GHK-Cu 100mg", "GHK-Cu 50mg"].includes(product.product)) productImage = "/ghk_cu.png";
  else if (["GHRP-2 - 2mg", "GHRP-2 5mg"].includes(product.product)) productImage = "/ghrp_2.png";
  else if (["HCG 5,000iu"].includes(product.product)) productImage = "/hcg.png";
  else if (["Hexarelin 2mg", "Hexarelin 5mg"].includes(product.product)) productImage = "/hexarelin.png";
  else if (["MOTS-C 10mg"].includes(product.product)) productImage = "/mots_c.png";
  else if (["NAD+ 500mg"].includes(product.product)) productImage = "/nad_.png";
  else if (["Oxytocin Acetate - 2mg"].includes(product.product)) productImage = "/oxytocin_acetate.png";
  else if (["PEG-MGF"].includes(product.product)) productImage = "/peg_mgf.png";
  else if (["PT-141 10mg", "PT-141 5mg"].includes(product.product)) productImage = "/pt_141.png";
  else if (["Retatrutide 10 MG"].includes(product.product)) productImage = "/retatrutide.png";
  else if (["Selank 5mg"].includes(product.product)) productImage = "/selank.png";
  else if (["Semax 10mg"].includes(product.product)) productImage = "/semax.png";
  else if (["Sermorelin 2mg", "Sermorelin 5mg"].includes(product.product)) productImage = "/sermorelin.png";
  else if (["Snap-8 10mg"].includes(product.product)) productImage = "/snap_8.png";
  else if (["SS-31 10mg", "SS-31 50mg"].includes(product.product)) productImage = "/ss_31.png";
  else if (["TB-500 10mg", "TB-500  2mg", "TB-500  5mg"].includes(product.product)) productImage = "/tb_500.png";
  else if (["Tesamorelin 10 mg", "Tesamorelin 2 mg", "Tesamorelin 5 mg"].includes(product.product)) productImage = "/tesamorelin.png";
  else if (["Thymosin alpha 1 - 10 MG", "Thymosin alpha 1 - 5 MG"].includes(product.product)) productImage = "/thymosin_alpha_1.png";
  else if (["Thymulin 10 mg"].includes(product.product)) productImage = "/thymulin.png";

  const baseProductName = product.product
    .replace(/\s*\d+\s*mg/gi, '') // remove mg/strength
    .replace(/[-\s]+/g, '_') // replace spaces/dashes with underscores
    .replace(/_+/g, '_') // collapse multiple underscores
    .toLowerCase()
    .trim();
  const productImagePath = `/${baseProductName}.png`;
  const allEmails = product.allCustomers.map((c: any) => c.email).join(",")

  const ProductDetailContent = () => (
    <div className="space-y-8">
      {/* Product Header */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <div style={{ width: 273, height: 154, borderRadius: 16, overflow: 'hidden', background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={productImage}
            alt={product.product}
            width={273}
            height={154}
            style={{ objectFit: 'cover', width: 273, height: 154, borderRadius: 16 }}
          />
        </div>
        <div className="flex-1">
          <div className="text-3xl font-bold text-white mb-1">{product.product}</div>
          <div className="text-cyan-400 text-sm mb-2 font-mono">Barcode: {product.barcode}</div>
          <div className="flex flex-wrap gap-6 items-center mb-2">
            <span className="text-slate-300 text-lg">Total Sales: <b className="text-white">{product.totalSales}</b></span>
            <span className="text-slate-300 text-lg">Revenue: <b className="text-white">${product.revenue.toLocaleString()}</b></span>
            <Badge className="bg-cyan-700 text-cyan-100 text-base px-4 py-2 rounded-lg">Sales Rank #{product.salesRank}</Badge>
          </div>
          {notionLinks[normalizeProductName(product.product)] && (
            <a
              href={notionLinks[normalizeProductName(product.product)]}
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

      {/* Top 5 Customers Section */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
        <div className="text-white text-lg font-semibold mb-4">Top 5 Customers</div>
        {Array.isArray(product.topCustomers) && product.topCustomers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Phone</TableHead>
                <TableHead className="text-slate-300">Purchases</TableHead>
                <TableHead className="text-slate-300">Last Purchase</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.topCustomers.map((c: any, i: number) => (
                <TableRow key={i} className="hover:bg-slate-800/60">
                  <TableCell className="text-white font-medium">
                    <Link 
                      href={`/customers/${c.customer_id}`}
                      className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                    >
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-cyan-300 font-mono">{c.email}</TableCell>
                  <TableCell className="text-cyan-300 font-mono">{c.phone}</TableCell>
                  <TableCell className="text-white">{c.purchases}</TableCell>
                  <TableCell className="text-slate-300 font-mono">{c.lastPurchase}</TableCell>
                  <TableCell>
                    <CustomerOrdersDialog customer={c} productName={product.product} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <span className="text-slate-400">No customer data available.</span>
        )}
      </div>

      {/* Frequently Bought Together Section */}
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
              {product.frequentlyBoughtTogether.map((p: any, i: number) => (
                <TableRow key={i} className="hover:bg-slate-800/60">
                  <TableCell className="text-white font-medium">
                    <Link 
                      href={`/inventory/${p.barcode}`}
                      className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                    >
                      {p.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-cyan-300 font-mono">{p.barcode}</TableCell>
                  <TableCell className="text-white">{p.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <span className="text-slate-400">No data available.</span>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <ProductDetailContent />
    </DashboardLayout>
  );
}