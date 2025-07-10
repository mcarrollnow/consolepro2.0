"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  DollarSign,
  Percent,
  Trash2,
  Package
} from "lucide-react"
import { DiscountCode, DiscountCodeUsage, CreateDiscountCodeRequest } from '@/lib/types/discount'

export function DiscountCodesSection() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
  const [usageData, setUsageData] = useState<DiscountCodeUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive' | 'expired'>('all')
  const [formData, setFormData] = useState<CreateDiscountCodeRequest>({
    code: '',
    type: 'percentage',
    value: 10,
    minOrderAmount: undefined,
    maxDiscount: undefined,
    usageLimit: 100,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: '',
    applicableProducts: [],
    overridePrices: {},
  })
  const [inventoryData, setInventoryData] = useState<Array<{barcode: string, product: string, price: number}>>([])
  const [selectedProducts, setSelectedProducts] = useState<{[barcode: string]: number}>({})

  // Custom Peptide Pricing State
  const [useCustomPeptidePricing, setUseCustomPeptidePricing] = useState(false)
  const [peptidePricingMethod, setPeptidePricingMethod] = useState<'text-fields' | 'dropdown'>('text-fields')
  const [customPeptidePrices, setCustomPeptidePrices] = useState<{[peptide: string]: string}>({})
  const [dropdownSelectedPeptides, setDropdownSelectedPeptides] = useState<Array<{peptide: string, price: string}>>([])
  const [currentDropdownPeptide, setCurrentDropdownPeptide] = useState('')
  const [currentDropdownPrice, setCurrentDropdownPrice] = useState('')

  // Peptide list matching Google Sheets columns
  const PEPTIDES = [
    'Adipotide - 10 MG', 'AOD-9604 2mg', 'BPC 157 10mg', 'BPC 157 2mg', 'BPC 157 5mg', 
    'Cagrilintide 10mg', 'Cagrilintide 5mg', 'CJC-1295 WITH DAC 2mg', 'CJC-1295 with DAC 5mg', 
    'CJC-1295 without DAC 10mg', 'CJC-1295 without DAC 2mg', 'CJC-1295 without DAC 5mg', 
    'DSIP (Delta Sleep-Inducing Peptide) 5mg', 'Epithalon 10mg', 'GHK-Cu 100mg', 'GHK-Cu 50mg', 
    'GHRP-2 - 2mg', 'GHRP-2 5mg', 'HCG 5', 'Hexarelin 2mg', 'Hexarelin 5mg', 'HMG 75iu/vial', 
    'IGF-1 LR3 .1mg', 'IGF-1 LR3 1mg', 'Ipamorelin 10mg', 'Ipamorelin 2mg', 'Ipamorelin 5mg', 
    'Kisspeptin-10 5mg', 'Melanotan 2 10mg', 'MOTS-C 10mg', 'NAD+ 500mg', 'Oxytocin Acetate - 2mg', 
    'PEG-MGF', 'PT-141 10mg', 'PT-141 5mg', 'Retatrutide 10 MG', 'Selank 5mg', 'Semaglutide 10mg', 
    'Semaglutide 2mg', 'Semaglutide 5mg', 'Semax 10mg', 'Sermorelin 2mg', 'Sermorelin 5mg', 
    'Snap-8 10mg', 'SS-31 10mg', 'SS-31 50mg', 'TB-500 10mg', 'TB-500 2mg', 'TB-500 5mg', 
    'Tesamorelin 10 mg', 'Tesamorelin 2 mg', 'Tesamorelin 5 mg', 'Thymosin alpha 1 - 10 MG', 
    'Thymosin alpha 1 - 5 MG', 'Thymulin', 'Tirzepatide 10 mg', 'Tirzepatide 15 mg', 
    'Tirzepatide 30 mg', 'Tirzepatide 5mg', 'Tirzepatide 60 mg'
  ]

  useEffect(() => {
    fetchDiscountCodes()
    fetchUsageData()
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    try {
      const response = await fetch('/api/inventory')
      if (response.ok) {
        const data = await response.json()
        setInventoryData(data)
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    }
  }

  const fetchDiscountCodes = async () => {
    try {
      const response = await fetch('/api/console-discount-codes')
      const result = await response.json()
      
      if (result.success) {
        setDiscountCodes(result.data)
      } else {
        setError('Failed to load discount codes')
      }
    } catch (err) {
      setError('Failed to load discount codes')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/console-discount-codes/usage')
      const result = await response.json()
      
      if (result.success) {
        setUsageData(result.data)
      }
    } catch (err) {
      console.error('Failed to load usage data:', err)
    }
  }

  const handleCreateDiscountCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/console-discount-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setShowCreateForm(false)
        setFormData({
          code: '',
          type: 'percentage',
          value: 10,
          minOrderAmount: undefined,
          maxDiscount: undefined,
          usageLimit: 100,
          validFrom: new Date().toISOString().split('T')[0],
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: '',
          applicableProducts: [],
          overridePrices: {},
        })
        fetchDiscountCodes()
      } else {
        alert(result.error || 'Failed to create discount code')
      }
    } catch (err) {
      alert('Failed to create discount code')
    }
  }

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, code: result }))
  }

  // Custom Peptide Pricing Helpers
  const addDropdownPeptide = () => {
    if (currentDropdownPeptide && currentDropdownPrice && parseFloat(currentDropdownPrice) > 0) {
      setDropdownSelectedPeptides(prev => [
        ...prev.filter(p => p.peptide !== currentDropdownPeptide),
        { peptide: currentDropdownPeptide, price: currentDropdownPrice }
      ])
      setCurrentDropdownPeptide('')
      setCurrentDropdownPrice('')
    }
  }

  const removeDropdownPeptide = (peptideToRemove: string) => {
    setDropdownSelectedPeptides(prev => prev.filter(p => p.peptide !== peptideToRemove))
  }

  const getAvailableDropdownPeptides = () => {
    const selectedPeptideNames = dropdownSelectedPeptides.map(p => p.peptide)
    return PEPTIDES.filter(peptide => !selectedPeptideNames.includes(peptide))
  }

  const handleCustomPricingToggle = (enabled: boolean) => {
    setUseCustomPeptidePricing(enabled)
    if (enabled) {
      setFormData(prev => ({ ...prev, type: 'price_override' }))
    } else {
      setCustomPeptidePrices({})
      setDropdownSelectedPeptides([])
      setCurrentDropdownPeptide('')
      setCurrentDropdownPrice('')
    }
  }

  const updateFormWithCustomPricing = () => {
    if (!useCustomPeptidePricing) return

    let finalPrices: {[peptide: string]: string} = {}
    
    if (peptidePricingMethod === 'text-fields') {
      finalPrices = { ...customPeptidePrices }
    } else {
      dropdownSelectedPeptides.forEach(item => {
        finalPrices[item.peptide] = item.price
      })
    }

    // Filter out empty prices and convert to numbers
    const cleanedPrices: {[peptide: string]: number} = {}
    Object.entries(finalPrices).forEach(([peptide, price]) => {
      const numPrice = parseFloat(price)
      if (price && numPrice > 0) {
        cleanedPrices[peptide] = numPrice
      }
    })

    setFormData(prev => ({
      ...prev,
      type: 'price_override' as 'percentage' | 'fixed' | 'price_override',
      overridePrices: cleanedPrices
    }))
  }

  const toggleDiscountStatus = async (codeId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/console-discount-codes/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeId, isActive: !currentStatus }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchDiscountCodes()
      } else {
        alert(result.error || 'Failed to toggle status')
      }
    } catch (err) {
      alert('Failed to toggle status')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (discount: DiscountCode) => {
    const now = new Date()
    const validFrom = new Date(discount.validFrom)
    const validUntil = new Date(discount.validUntil)
    
    if (!discount.isActive) {
      return <Badge variant="destructive">Inactive</Badge>
    }
    
    if (now < validFrom) {
      return <Badge variant="secondary">Pending</Badge>
    }
    
    if (now > validUntil) {
      return <Badge variant="destructive">Expired</Badge>
    }
    
    if (discount.usedCount >= discount.usageLimit) {
      return <Badge variant="destructive">Used Up</Badge>
    }
    
    return <Badge variant="default">Active</Badge>
  }

  const filteredDiscountCodes = discountCodes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'active' && code.isActive && new Date() >= new Date(code.validFrom) && new Date() <= new Date(code.validUntil) && code.usedCount < code.usageLimit) ||
                         (filterType === 'inactive' && !code.isActive) ||
                         (filterType === 'expired' && new Date() > new Date(code.validUntil))
    
    return matchesSearch && matchesFilter
  })

  const getUsageForCode = (codeId: string) => {
    return usageData.filter(usage => usage.discountCodeId === codeId)
  }

  if (loading) return <div className="text-center py-8">Loading discount codes...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="space-y-6" data-section="discount-codes">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Discount Codes</h2>
          <p className="text-slate-400">Manage promotional codes and track usage</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showCreateForm ? 'Cancel' : 'Create Code'}
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Create New Discount Code</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDiscountCode} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-white">Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="Enter code or generate"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      type="button"
                      onClick={generateRandomCode}
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-white">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'percentage' | 'fixed' | 'price_override') => setFormData(prev => ({ ...prev, type: value }))}
                    disabled={useCustomPeptidePricing}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="price_override">Price Override</SelectItem>
                    </SelectContent>
                  </Select>
                  {useCustomPeptidePricing && (
                    <p className="text-xs text-slate-400">Automatically set to "Price Override" for custom peptide pricing</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value" className="text-white">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    max={formData.type === 'percentage' ? 100 : undefined}
                    step={formData.type === 'percentage' ? 1 : 0.01}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="usageLimit" className="text-white">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount" className="text-white">Min Order Amount</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={formData.minOrderAmount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount" className="text-white">Max Discount</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={formData.maxDiscount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validFrom" className="text-white">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validUntil" className="text-white">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              {/* Custom Product Pricing Section */}
              <Card className="bg-slate-900/50 border-slate-600">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="customPricing"
                        name="pricingType"
                        checked={useCustomPeptidePricing}
                        onChange={(e) => handleCustomPricingToggle(e.target.checked)}
                        className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 focus:ring-cyan-500"
                      />
                      <Label htmlFor="customPricing" className="text-white font-medium">
                        Custom Product Pricing
                      </Label>
                    </div>
                    <Package className="h-5 w-5 text-cyan-400" />
                  </div>
                  <p className="text-sm text-slate-400 ml-6">
                    Set specific prices for individual peptides (overrides standard discount logic)
                  </p>
                </CardHeader>

                {useCustomPeptidePricing && (
                  <CardContent>
                    {/* Pricing Method Selection */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-white">Pricing Method</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="textFields"
                              name="pricingMethod"
                              value="text-fields"
                              checked={peptidePricingMethod === 'text-fields'}
                              onChange={(e) => setPeptidePricingMethod(e.target.value as 'text-fields' | 'dropdown')}
                              className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 focus:ring-cyan-500"
                            />
                            <Label htmlFor="textFields" className="text-slate-300">
                              Insert text into fields (all peptides at once)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="dropdown"
                              name="pricingMethod"
                              value="dropdown"
                              checked={peptidePricingMethod === 'dropdown'}
                              onChange={(e) => setPeptidePricingMethod(e.target.value as 'text-fields' | 'dropdown')}
                              className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 focus:ring-cyan-500"
                            />
                            <Label htmlFor="dropdown" className="text-slate-300">
                              Use dropdown (select peptides one by one)
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Text Fields Method */}
                      {peptidePricingMethod === 'text-fields' && (
                        <div className="space-y-4">
                          <div className="text-sm text-slate-400">
                            Enter custom prices for any peptides. Leave blank to use standard discount logic.
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-4 border border-slate-600 rounded-lg">
                            {PEPTIDES.map((peptide) => (
                              <div key={peptide} className="space-y-1">
                                <Label className="text-xs text-slate-300">{peptide}</Label>
                                <Input
                                  type="number"
                                  value={customPeptidePrices[peptide] || ''}
                                  onChange={(e) => setCustomPeptidePrices(prev => ({ 
                                    ...prev, 
                                    [peptide]: e.target.value 
                                  }))}
                                  placeholder="$0.00"
                                  min="0"
                                  step="0.01"
                                  className="bg-slate-700 border-slate-600 text-white text-sm h-8"
                                />
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            onClick={updateFormWithCustomPricing}
                            variant="outline"
                            className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                          >
                            Apply Text Field Pricing ({Object.keys(customPeptidePrices).filter(k => customPeptidePrices[k]).length} peptides)
                          </Button>
                        </div>
                      )}

                      {/* Dropdown Method */}
                      {peptidePricingMethod === 'dropdown' && (
                        <div className="space-y-4">
                          <div className="text-sm text-slate-400">
                            Select peptides one by one and set their prices. Add as many as needed (1-60).
                          </div>
                          
                          {/* Add New Peptide */}
                          {getAvailableDropdownPeptides().length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-800/50 rounded-lg">
                              <div className="space-y-2">
                                <Label className="text-white">Select Peptide</Label>
                                <Select
                                  value={currentDropdownPeptide}
                                  onValueChange={setCurrentDropdownPeptide}
                                >
                                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue placeholder="Choose a peptide..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-700 border-slate-600 max-h-48">
                                    {getAvailableDropdownPeptides().map((peptide) => (
                                      <SelectItem key={peptide} value={peptide}>
                                        {peptide}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-white">Set Price</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    value={currentDropdownPrice}
                                    onChange={(e) => setCurrentDropdownPrice(e.target.value)}
                                    placeholder="$0.00"
                                    min="0"
                                    step="0.01"
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                  <Button
                                    type="button"
                                    onClick={addDropdownPeptide}
                                    disabled={!currentDropdownPeptide || !currentDropdownPrice || parseFloat(currentDropdownPrice) <= 0}
                                    className="bg-cyan-500 hover:bg-cyan-600"
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Selected Peptides List */}
                          {dropdownSelectedPeptides.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-white">Selected Peptides ({dropdownSelectedPeptides.length})</Label>
                                <Button
                                  type="button"
                                  onClick={updateFormWithCustomPricing}
                                  variant="outline"
                                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                                >
                                  Apply Dropdown Pricing
                                </Button>
                              </div>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {dropdownSelectedPeptides.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                                    <div>
                                      <div className="text-white font-medium">{item.peptide}</div>
                                      <div className="text-sm text-slate-400">${item.price}</div>
                                    </div>
                                    <Button
                                      type="button"
                                      onClick={() => removeDropdownPeptide(item.peptide)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {getAvailableDropdownPeptides().length === 0 && (
                            <div className="text-center py-4 text-slate-400">
                              All peptides have been selected! You can remove some to add different ones.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
              
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                Create Discount Code
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Codes</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => { fetchDiscountCodes(); fetchUsageData(); }}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="codes" className="space-y-4">
        <TabsList className="bg-slate-800/50 border-slate-700/50">
          <TabsTrigger value="codes" className="data-[state=active]:bg-slate-700">Discount Codes</TabsTrigger>
          <TabsTrigger value="usage" className="data-[state=active]:bg-slate-700">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="codes" className="space-y-4">
          {filteredDiscountCodes.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="pt-6 text-center text-slate-400">
                No discount codes found
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredDiscountCodes.map((discount) => (
                <Card key={discount.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {discount.type === 'percentage' ? (
                            <Percent className="h-5 w-5 text-cyan-400" />
                          ) : (
                            <DollarSign className="h-5 w-5 text-green-400" />
                          )}
                          <span className="font-mono text-lg font-bold text-white">
                            {discount.code}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(discount.code)}
                            className="text-slate-400 hover:text-white"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        {getStatusBadge(discount)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={discount.isActive}
                          onCheckedChange={() => toggleDiscountStatus(discount.id, discount.isActive)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(discount.code)}
                          className="text-slate-400 hover:text-white"
                        >
                          {discount.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Value:</span>
                        <span className="text-white font-medium">
                          {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-400">Usage:</span>
                        <span className="text-white font-medium">
                          {discount.usedCount} / {discount.usageLimit}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-400">Valid:</span>
                        <span className="text-white font-medium">
                          {formatDate(discount.validFrom)} - {formatDate(discount.validUntil)}
                        </span>
                      </div>
                    </div>
                    
                    {discount.description && (
                      <div className="mt-2 text-sm text-slate-400">
                        {discount.description}
                      </div>
                    )}
                    
                    {discount.minOrderAmount && (
                      <div className="mt-2 text-sm text-slate-400">
                        Min order: ${discount.minOrderAmount}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {usageData.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  No usage data available
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-white">{usageData.length}</div>
                      <div className="text-slate-400">Total Uses</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        ${usageData.reduce((sum, usage) => sum + usage.discountAmount, 0).toFixed(2)}
                      </div>
                      <div className="text-slate-400">Total Discounts Given</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        ${usageData.reduce((sum, usage) => sum + usage.orderTotal, 0).toFixed(2)}
                      </div>
                      <div className="text-slate-400">Total Order Value</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Recent Usage</h3>
                    {usageData.slice(0, 10).map((usage) => (
                      <div key={usage.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{usage.orderCode}</div>
                          <div className="text-sm text-slate-400">{usage.customerEmail}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">-${usage.discountAmount.toFixed(2)}</div>
                          <div className="text-sm text-slate-400">{formatDate(usage.usedAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 