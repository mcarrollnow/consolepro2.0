'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Calculator } from 'lucide-react'

interface Product {
  barcode: string
  product: string
  salePrice?: string
  costPrice: string
}

interface B2BProduct {
  barcode: string
  productName: string
  price: number
}

interface PlaygroundItem {
  id: string
  pricingType: 'retail' | 'b2b'
  productBarcode: string
  quantity: number
  promoCode: string
  customAdjustmentType: 'percentage' | 'fixed' | 'none'
  customAdjustmentValue: number
}

interface CalculationResult {
  originalPrice: number
  discountedPrice: number
  totalOriginal: number
  totalDiscounted: number
  totalSavings: number
  discountApplied: boolean
  discountType?: string
  appliedRule?: string
}

export default function PlaygroundPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [b2bProducts, setB2bProducts] = useState<B2BProduct[]>([])
  const [items, setItems] = useState<PlaygroundItem[]>([])
  const [results, setResults] = useState<Record<string, CalculationResult>>({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load products on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setInitialLoading(true)
      setError(null)
      try {
        await Promise.all([loadProducts(), loadB2BProducts()])
      } catch (err) {
        setError('Failed to load product data. Please refresh the page.')
      } finally {
        setInitialLoading(false)
      }
    }
    loadAllData()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/inventory')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to load products:', error)
      throw error
    }
  }

  const loadB2BProducts = async () => {
    try {
      const response = await fetch('/b2b_product_price_list.csv')
      const csvText = await response.text()
      const lines = csvText.split('\n').slice(1) // Skip header
      const b2bData: B2BProduct[] = lines
        .filter(line => line.trim())
        .map(line => {
          const [barcode, productName, price] = line.split(',')
          return {
            barcode: barcode.trim(),
            productName: productName.trim(),
            price: parseFloat(price.trim()) || 0
          }
        })
      setB2bProducts(b2bData)
    } catch (error) {
      console.error('Failed to load B2B products:', error)
    }
  }

  const addItem = () => {
    const newItem: PlaygroundItem = {
      id: Date.now().toString(),
      pricingType: 'retail',
      productBarcode: '',
      quantity: 1,
      promoCode: '',
      customAdjustmentType: 'none',
      customAdjustmentValue: 0
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
    const newResults = { ...results }
    delete newResults[id]
    setResults(newResults)
  }

  const updateItem = (id: string, updates: Partial<PlaygroundItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const calculatePrice = async (item: PlaygroundItem) => {
    setLoading(true)
    try {
      let originalPrice = 0
      let productName = ''

      // Get base price based on pricing type
      if (item.pricingType === 'retail') {
        const product = products.find(p => p.barcode === item.productBarcode)
        if (product) {
          originalPrice = parseFloat(product.salePrice?.replace('$', '').replace(',', '') || '0')
          productName = product.product
        }
      } else {
        const b2bProduct = b2bProducts.find(p => p.barcode === item.productBarcode)
        if (b2bProduct) {
          originalPrice = b2bProduct.price
          productName = b2bProduct.productName
        }
      }

      if (originalPrice === 0) {
        setResults(prev => ({
          ...prev,
          [item.id]: {
            originalPrice: 0,
            discountedPrice: 0,
            totalOriginal: 0,
            totalDiscounted: 0,
            totalSavings: 0,
            discountApplied: false
          }
        }))
        return
      }

      let discountedPrice = originalPrice
      let discountType = 'None'
      let appliedRule = 'No discount applied'

      // Apply promo code if provided
      if (item.promoCode.trim()) {
        try {
          const response = await fetch('/api/universal-discount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              barcode: item.productBarcode,
              quantity: item.quantity,
              discountCode: item.promoCode,
              originalPrice
            })
          })

          const discountResult = await response.json()
          if (discountResult.success) {
            discountedPrice = discountResult.unitPrice
            discountType = discountResult.discountType
            appliedRule = discountResult.appliedRule
          }
        } catch (error) {
          console.error('Error applying promo code:', error)
        }
      }

      // Apply custom adjustment
      if (item.customAdjustmentType !== 'none' && item.customAdjustmentValue > 0) {
        if (item.customAdjustmentType === 'percentage') {
          const adjustment = (discountedPrice * item.customAdjustmentValue) / 100
          discountedPrice -= adjustment
          appliedRule += ` + ${item.customAdjustmentValue}% custom adjustment`
        } else {
          discountedPrice -= item.customAdjustmentValue
          appliedRule += ` + $${item.customAdjustmentValue} custom adjustment`
        }
      }

      // Ensure price doesn't go below 0
      discountedPrice = Math.max(0, discountedPrice)

      const totalOriginal = originalPrice * item.quantity
      const totalDiscounted = discountedPrice * item.quantity
      const totalSavings = totalOriginal - totalDiscounted

      setResults(prev => ({
        ...prev,
        [item.id]: {
          originalPrice,
          discountedPrice,
          totalOriginal,
          totalDiscounted,
          totalSavings,
          discountApplied: totalSavings > 0,
          discountType,
          appliedRule
        }
      }))
    } catch (error) {
      console.error('Error calculating price:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAll = () => {
    items.forEach(item => calculatePrice(item))
  }

  const getProductOptions = (pricingType: 'retail' | 'b2b') => {
    if (pricingType === 'retail') {
      return products.map(product => ({
        value: product.barcode,
        label: `${product.product} (${product.barcode})`
      }))
    } else {
      return b2bProducts.map(product => ({
        value: product.barcode,
        label: `${product.productName} (${product.barcode})`
      }))
    }
  }

  const getTotalSummary = () => {
    const totals = Object.values(results).reduce((acc, result) => ({
      totalOriginal: acc.totalOriginal + result.totalOriginal,
      totalDiscounted: acc.totalDiscounted + result.totalDiscounted,
      totalSavings: acc.totalSavings + result.totalSavings
    }), { totalOriginal: 0, totalDiscounted: 0, totalSavings: 0 })

    return totals
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Pricing Playground</h1>
            <p className="text-slate-400 mt-2">
              Test product pricing with different quantities, discount codes, and custom adjustments
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={addItem} className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button onClick={calculateAll} disabled={loading || items.length === 0} className="bg-green-600 hover:bg-green-700">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate All
            </Button>
          </div>
        </div>

      {items.length === 0 && (
        <Card className="bg-slate-900/80 border-slate-700/60">
          <CardContent className="p-8 text-center">
            <p className="text-slate-400 mb-4">No items added yet. Click "Add Item" to start testing pricing scenarios.</p>
            <Button onClick={addItem} className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={item.id} className="bg-slate-900/80 border-slate-700/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Item {index + 1}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Pricing Type */}
                <div>
                  <Label className="text-slate-300">Pricing Type</Label>
                  <Select
                    value={item.pricingType}
                    onValueChange={(value: 'retail' | 'b2b') => updateItem(item.id, { pricingType: value, productBarcode: '' })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail Pricing</SelectItem>
                      <SelectItem value="b2b">B2B Pricing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Selection */}
                <div>
                  <Label className="text-slate-300">Product</Label>
                  <Select
                    value={item.productBarcode}
                    onValueChange={(value) => updateItem(item.id, { productBarcode: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {getProductOptions(item.pricingType).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div>
                  <Label className="text-slate-300">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>

                {/* Promo Code */}
                <div>
                  <Label className="text-slate-300">Promo Code</Label>
                  <Input
                    placeholder="e.g., NBAPRIL, WELCOME10"
                    value={item.promoCode}
                    onChange={(e) => updateItem(item.id, { promoCode: e.target.value })}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>

                {/* Custom Adjustment Type */}
                <div>
                  <Label className="text-slate-300">Custom Adjustment Type</Label>
                  <Select
                    value={item.customAdjustmentType}
                    onValueChange={(value: 'percentage' | 'fixed' | 'none') => updateItem(item.id, { customAdjustmentType: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Adjustment Value */}
                <div>
                  <Label className="text-slate-300">
                    {item.customAdjustmentType === 'percentage' ? 'Percentage (%)' : 
                     item.customAdjustmentType === 'fixed' ? 'Fixed Amount ($)' : 'Value'}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step={item.customAdjustmentType === 'percentage' ? '0.1' : '0.01'}
                    value={item.customAdjustmentValue}
                    onChange={(e) => updateItem(item.id, { customAdjustmentValue: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600"
                    disabled={item.customAdjustmentType === 'none'}
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <div className="flex justify-end">
                <Button
                  onClick={() => calculatePrice(item)}
                  disabled={loading || !item.productBarcode}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Calculate Price
                </Button>
              </div>

              {/* Results */}
              {results[item.id] && (
                <div className="mt-4 p-4 bg-slate-800/60 rounded-lg border border-slate-600">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Unit Price:</span>
                      <div className="text-white font-semibold">${results[item.id].originalPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Final Price:</span>
                      <div className="text-white font-semibold">${results[item.id].discountedPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Total:</span>
                      <div className="text-white font-semibold">${results[item.id].totalDiscounted.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Savings:</span>
                      <div className="text-green-400 font-semibold">${results[item.id].totalSavings.toFixed(2)}</div>
                    </div>
                  </div>
                  {results[item.id].discountApplied && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        {results[item.id].discountType}
                      </Badge>
                      <p className="text-slate-300 text-xs mt-1">{results[item.id].appliedRule}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      {Object.keys(results).length > 0 && (
        <Card className="bg-slate-900/80 border-slate-700/60">
          <CardHeader>
            <CardTitle className="text-white">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-800/60 rounded-lg">
                <div className="text-slate-400 text-sm">Total Original</div>
                <div className="text-white text-2xl font-bold">${getTotalSummary().totalOriginal.toFixed(2)}</div>
              </div>
              <div className="text-center p-4 bg-slate-800/60 rounded-lg">
                <div className="text-slate-400 text-sm">Total Final</div>
                <div className="text-white text-2xl font-bold">${getTotalSummary().totalDiscounted.toFixed(2)}</div>
              </div>
              <div className="text-center p-4 bg-green-600/20 rounded-lg border border-green-600/40">
                <div className="text-green-400 text-sm">Total Savings</div>
                <div className="text-green-400 text-2xl font-bold">${getTotalSummary().totalSavings.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
             )}
      </div>
    </DashboardLayout>
  )
} 