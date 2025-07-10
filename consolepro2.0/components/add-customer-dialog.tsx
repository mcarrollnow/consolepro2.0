"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddCustomerDialogProps {
  onCustomerAdded: () => void
}

export function AddCustomerDialog({ onCustomerAdded }: AddCustomerDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    // Structured billing address
    billingAddressStreet: "",
    billingAddressStreet2: "",
    billingAddressCity: "",
    billingAddressState: "",
    billingAddressZip: "",
    // Structured shipping address
    shippingAddressStreet: "",
    shippingAddressStreet2: "",
    shippingAddressCity: "",
    shippingAddressState: "",
    shippingAddressZip: "",
    nickname: "",
    birthday: "",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Build structured addresses
      const billingAddress = [
        formData.billingAddressStreet,
        formData.billingAddressStreet2,
        formData.billingAddressCity,
        formData.billingAddressState,
        formData.billingAddressZip
      ].filter(Boolean).join(", ")

      const shippingAddress = [
        formData.shippingAddressStreet,
        formData.shippingAddressStreet2,
        formData.shippingAddressCity,
        formData.shippingAddressState,
        formData.shippingAddressZip
      ].filter(Boolean).join(", ")

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          billingAddress, // Legacy format for backward compatibility
          shippingAddress, // Legacy format for backward compatibility
          // Structured fields
          addressStreet: formData.shippingAddressStreet || formData.billingAddressStreet,
          addressStreet2: formData.shippingAddressStreet2 || formData.billingAddressStreet2,
          addressCity: formData.shippingAddressCity || formData.billingAddressCity,
          addressState: formData.shippingAddressState || formData.billingAddressState,
          addressZip: formData.shippingAddressZip || formData.billingAddressZip,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Customer ${data.customer.customer_id} created successfully!`,
        })
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          billingAddressStreet: "",
          billingAddressStreet2: "",
          billingAddressCity: "",
          billingAddressState: "",
          billingAddressZip: "",
          shippingAddressStreet: "",
          shippingAddressStreet2: "",
          shippingAddressCity: "",
          shippingAddressState: "",
          shippingAddressZip: "",
          nickname: "",
          birthday: "",
          notes: ""
        })
        
        setIsOpen(false)
        onCustomerAdded()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create customer",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shippingAddressStreet: prev.billingAddressStreet,
      shippingAddressStreet2: prev.billingAddressStreet2,
      shippingAddressCity: prev.billingAddressCity,
      shippingAddressState: prev.billingAddressState,
      shippingAddressZip: prev.billingAddressZip,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/25">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Add New Customer</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-slate-300">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-slate-300">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mobile" className="text-slate-300">
                Mobile Number
              </Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter mobile number"
              />
            </div>
            
            <div>
              <Label htmlFor="nickname" className="text-slate-300">
                Nickname
              </Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter nickname"
              />
            </div>
          </div>

          {/* Birthday */}
          <div>
            <Label htmlFor="birthday" className="text-slate-300">
              Birthday
            </Label>
            <Input
              id="birthday"
              type="date"
              value={formData.birthday}
              onChange={(e) => handleInputChange("birthday", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Billing Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="billingAddressStreet" className="text-slate-300">
                  Street Address
                </Label>
                <Input
                  id="billingAddressStreet"
                  value={formData.billingAddressStreet}
                  onChange={(e) => handleInputChange("billingAddressStreet", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter street address"
                />
              </div>
              
              <div>
                <Label htmlFor="billingAddressStreet2" className="text-slate-300">
                  Street Address Line 2
                </Label>
                <Input
                  id="billingAddressStreet2"
                  value={formData.billingAddressStreet2}
                  onChange={(e) => handleInputChange("billingAddressStreet2", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingAddressCity" className="text-slate-300">
                    City
                  </Label>
                  <Input
                    id="billingAddressCity"
                    value={formData.billingAddressCity}
                    onChange={(e) => handleInputChange("billingAddressCity", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <Label htmlFor="billingAddressState" className="text-slate-300">
                    State
                  </Label>
                  <Input
                    id="billingAddressState"
                    value={formData.billingAddressState}
                    onChange={(e) => handleInputChange("billingAddressState", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="State/Province"
                  />
                </div>
                
                <div>
                  <Label htmlFor="billingAddressZip" className="text-slate-300">
                    Zip Code
                  </Label>
                  <Input
                    id="billingAddressZip"
                    value={formData.billingAddressZip}
                    onChange={(e) => handleInputChange("billingAddressZip", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="ZIP/Postal Code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Shipping Address</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyBillingToShipping}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Copy from Billing
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="shippingAddressStreet" className="text-slate-300">
                  Street Address
                </Label>
                <Input
                  id="shippingAddressStreet"
                  value={formData.shippingAddressStreet}
                  onChange={(e) => handleInputChange("shippingAddressStreet", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter street address"
                />
              </div>
              
              <div>
                <Label htmlFor="shippingAddressStreet2" className="text-slate-300">
                  Street Address Line 2
                </Label>
                <Input
                  id="shippingAddressStreet2"
                  value={formData.shippingAddressStreet2}
                  onChange={(e) => handleInputChange("shippingAddressStreet2", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="shippingAddressCity" className="text-slate-300">
                    City
                  </Label>
                  <Input
                    id="shippingAddressCity"
                    value={formData.shippingAddressCity}
                    onChange={(e) => handleInputChange("shippingAddressCity", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <Label htmlFor="shippingAddressState" className="text-slate-300">
                    State
                  </Label>
                  <Input
                    id="shippingAddressState"
                    value={formData.shippingAddressState}
                    onChange={(e) => handleInputChange("shippingAddressState", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="State/Province"
                  />
                </div>
                
                <div>
                  <Label htmlFor="shippingAddressZip" className="text-slate-300">
                    Zip Code
                  </Label>
                  <Input
                    id="shippingAddressZip"
                    value={formData.shippingAddressZip}
                    onChange={(e) => handleInputChange("shippingAddressZip", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="ZIP/Postal Code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-slate-300">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter any additional notes"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Customer
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 