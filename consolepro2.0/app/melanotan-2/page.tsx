"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Pill, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Activity,
  Target,
  Shield,
  Zap,
  Sun,
  Heart,
  Eye,
  Menu
} from "lucide-react"
import Image from "next/image"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"

interface ProductInfo {
  name: string
  scientificName: string
  category: string
  description: string
  benefits: string[]
  dosage: string
  halfLife: string
  administration: string
  sideEffects: string[]
  contraindications: string[]
  researchStatus: string
  imageUrl: string
  gradientImageUrl?: string
  molecularWeight?: string
  sequence?: string
  storage?: string
  availability: "Available" | "Limited" | "Out of Stock"
  price?: string
  combinations?: string
}

const melanotan2Info: ProductInfo = {
  name: "Melanotan II (MT-2)",
  scientificName: "Ac-Ser-Tyr-Ser-Nle-Glu-His-D-Phe-Arg-Trp-Gly-Lys-Pro-Val-NH2",
  category: "Melanocortin Receptor Agonist",
  description: "Melanotan II (MT-2) is a synthetic analog of alpha-melanocyte stimulating hormone (α-MSH) that stimulates melanogenesis and has been studied for skin tanning, erectile dysfunction, and appetite suppression. It works by activating melanocortin receptors (MC1R, MC3R, MC4R, MC5R) to increase melanin production and affect various physiological processes including sexual function and appetite regulation.",
  benefits: [
    "Stimulates melanogenesis for skin tanning without UV exposure",
    "May improve erectile function through MC4R activation",
    "Appetite suppression and potential weight loss effects",
    "Enhanced skin pigmentation and protection",
    "Potential neuroprotective and anti-inflammatory effects",
    "May improve sexual performance and libido",
    "Reduced need for UV exposure for tanning",
    "Long-lasting tanning effects with proper maintenance",
    "Potential mood enhancement through melanocortin pathways",
    "May support skin health and protection"
  ],
  dosage: "0.25-1.0 mg daily (loading phase), 0.5-1.0 mg 2-3x/week (maintenance)",
  halfLife: "Approximately 2-3 hours",
  administration: "Subcutaneous injection only",
  sideEffects: [
    "Nausea (very common, especially initial doses)",
    "Facial flushing and skin darkening",
    "Decreased appetite and spontaneous erections (males)",
    "Darkening of existing moles and freckles",
    "New freckle formation and uneven pigmentation",
    "Potential permanent skin darkening",
    "Injection site reactions and infections",
    "Blood pressure changes and cardiovascular effects",
    "Hormonal disruption and mood changes",
    "Theoretical increased melanoma risk"
  ],
  contraindications: [
    "Pregnancy and breastfeeding (absolute contraindication)",
    "History of melanoma or skin cancer",
    "Multiple moles or atypical moles",
    "Cardiovascular disease and uncontrolled hypertension",
    "Known hypersensitivity to MT-2 or related compounds",
    "Active malignancy or cancer treatment",
    "Severe liver or kidney disease",
    "Not approved for human therapeutic use",
    "Research use only with proper oversight"
  ],
  researchStatus: "Research Chemical - Not FDA Approved",
  imageUrl: "/melanotan_2.png",
  gradientImageUrl: "/melanotan-2-gradient.jpg",
  molecularWeight: "1,024.2 Da",
  sequence: "Ac-Ser-Tyr-Ser-Nle-Glu-His-D-Phe-Arg-Trp-Gly-Lys-Pro-Val-NH2",
  storage: "Lyophilized: Store at -4°F, stable for 24+ months. Reconstituted: Store at 39°F, use within 28 days.",
  availability: "Available",
  price: "$199.99 per vial",
  combinations: "Melanotan II is often used in combination with other peptides for enhanced effects. Common combinations include:\n\n• **BPC-157**: For enhanced healing and recovery during tanning cycles\n• **TB-500**: For improved tissue repair and skin health\n• **GHK-Cu**: For skin rejuvenation and anti-aging effects\n• **Epithalon**: For telomere support and longevity benefits\n\n**Important Note**: All combination therapy should be approached with extreme caution and under medical supervision, as MT-2 carries significant safety risks and is not approved for human use."
}

export default function Melanotan2ProductPage() {
  const [selectedProduct] = useState<ProductInfo>(melanotan2Info)

  return (
    <DashboardLayout defaultSection="product-information">
      <div className="space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sun className="h-8 w-8 text-orange-400" />
            Melanotan II (MT-2) Product Information
          </h2>
          <p className="text-slate-400">
            Comprehensive information about Melanotan II (MT-2), including research data, dosing guidelines, and safety information.
          </p>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image and Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-700/50">
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
                      <p className="text-slate-400 text-sm">{selectedProduct.scientificName}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        {selectedProduct.category}
                      </Badge>
                      <Badge 
                        variant={selectedProduct.availability === "Available" ? "default" : "destructive"}
                        className={selectedProduct.availability === "Available" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                      >
                        {selectedProduct.availability}
                      </Badge>
                    </div>

                    {selectedProduct.price && (
                      <div className="text-2xl font-bold text-white">
                        {selectedProduct.price}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Half-life:</span>
                  <span className="text-white font-medium">{selectedProduct.halfLife}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Dosage:</span>
                  <span className="text-white font-medium">{selectedProduct.dosage}</span>
                </div>
                {selectedProduct.molecularWeight && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Molecular Weight:</span>
                    <span className="text-white font-medium">{selectedProduct.molecularWeight}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Research Status:</span>
                  <Badge variant="outline" className="text-red-400 border-red-500/30">
                    {selectedProduct.researchStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Sun className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Stimulates melanogenesis without UV exposure</span>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">May improve erectile function and libido</span>
                </div>
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Appetite suppression and weight loss effects</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Enhanced skin protection and pigmentation</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700/50">
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700/50">Overview</TabsTrigger>
                <TabsTrigger value="dosing" className="data-[state=active]:bg-slate-700/50">Dosing</TabsTrigger>
                <TabsTrigger value="safety" className="data-[state=active]:bg-slate-700/50">Safety</TabsTrigger>
                <TabsTrigger value="technical" className="data-[state=active]:bg-slate-700/50">Technical</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Info className="h-5 w-5 text-cyan-400" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 leading-relaxed">{selectedProduct.description}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      Key Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedProduct.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      Mechanism of Action
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Melanocortin Receptor Activation</h4>
                        <p className="text-slate-300 text-sm">
                          Binds to MC1R, MC3R, MC4R, and MC5R receptors to stimulate 
                          melanogenesis and affect various physiological processes.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Melanin Production</h4>
                        <p className="text-slate-300 text-sm">
                          Increases tyrosinase activity and melanin synthesis in 
                          melanocytes, leading to skin darkening.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Sexual Function</h4>
                        <p className="text-slate-300 text-sm">
                          MC4R activation in the brain may improve erectile function 
                          and sexual performance through central mechanisms.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Appetite Regulation</h4>
                        <p className="text-slate-300 text-sm">
                          MC4R activation in the hypothalamus suppresses appetite 
                          and may lead to reduced food intake and weight loss.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Combination Therapy Section */}
                {selectedProduct.combinations && (
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-400" />
                        Combination Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <p className="text-slate-300 text-sm whitespace-pre-line">
                            {selectedProduct.combinations}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Link href="/bpc-157" className="block">
                            <div className="bg-slate-900/50 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                              <h5 className="font-semibold text-cyan-400 mb-1">BPC-157</h5>
                              <p className="text-slate-300 text-sm">Enhanced healing and recovery</p>
                            </div>
                          </Link>
                          <Link href="/tb-500" className="block">
                            <div className="bg-slate-900/50 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                              <h5 className="font-semibold text-purple-400 mb-1">TB-500</h5>
                              <p className="text-slate-300 text-sm">Tissue repair and skin health</p>
                            </div>
                          </Link>
                          <Link href="/ghk-cu" className="block">
                            <div className="bg-slate-900/50 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                              <h5 className="font-semibold text-green-400 mb-1">GHK-Cu</h5>
                              <p className="text-slate-300 text-sm">Skin rejuvenation and anti-aging</p>
                            </div>
                          </Link>
                          <Link href="/epithalon" className="block">
                            <div className="bg-slate-900/50 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                              <h5 className="font-semibold text-yellow-400 mb-1">Epithalon</h5>
                              <p className="text-slate-300 text-sm">Telomere support and longevity</p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="dosing" className="space-y-6 mt-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-cyan-400" />
                      Dosing Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Loading Phase */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Loading Phase (Tanning)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">Conservative Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Week 1:</span> <span className="text-white">0.25 mg daily</span></div>
                            <div><span className="text-slate-400">Week 2:</span> <span className="text-white">0.5 mg daily</span></div>
                            <div><span className="text-slate-400">Week 3-4:</span> <span className="text-white">0.75-1.0 mg daily</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">Until desired pigmentation</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Standard Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Daily Dose:</span> <span className="text-white">0.5-1.0 mg daily</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">2-4 weeks</span></div>
                            <div><span className="text-slate-400">Administration:</span> <span className="text-white">Subcutaneous injection</span></div>
                            <div><span className="text-slate-400">UV Exposure:</span> <span className="text-white">Minimal required</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Phase */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Maintenance Phase</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Frequency:</span>
                            <span className="text-white">2-3 times per week</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Dose:</span>
                            <span className="text-white">0.5-1.0 mg per injection</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Duration:</span>
                            <span className="text-white">As needed to maintain tan</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Monitoring:</span>
                            <span className="text-white">Adjust based on pigmentation response</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clinical Research Dosing */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Clinical Research Dosing</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-orange-400 mb-2">Erectile Dysfunction Studies</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose Range:</span> <span className="text-white">0.025 mg/kg body weight</span></div>
                            <div><span className="text-slate-400">Typical Dose:</span> <span className="text-white">1.75-2.0 mg per administration</span></div>
                            <div><span className="text-slate-400">Timing:</span> <span className="text-white">1-3 hours before sexual activity</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">As needed basis</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-400 mb-2">Appetite Suppression Research</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.5-1.0 mg daily</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">Variable study periods</span></div>
                            <div><span className="text-slate-400">Monitoring:</span> <span className="text-white">Weight, appetite, food intake</span></div>
                            <div><span className="text-slate-400">Route:</span> <span className="text-white">Subcutaneous administration</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Administration */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Administration Methods</h4>
                      <div className="space-y-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">Subcutaneous Injection (Primary)</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Reconstitute with bacteriostatic water</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Typical concentration: 10mg in 2-3ml water</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Inject into abdomen, thigh, or upper arm</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Use insulin syringe (29-31 gauge)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Rotate injection sites each time</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reconstitution Calculations */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Reconstitution Calculations</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">For 10mg vial with 2ml water:</span>
                            <span className="text-white">Concentration: 5mg/ml</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">0.5mg dose:</span>
                            <span className="text-white">0.1ml (10 units on insulin syringe)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">1.0mg dose:</span>
                            <span className="text-white">0.2ml (20 units on insulin syringe)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Store reconstituted:</span>
                            <span className="text-white">Refrigerated, use within 28 days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cycling */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Cycling Protocols</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Loading Phase:</span>
                          <span className="text-white">2-4 weeks</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Maintenance Phase:</span>
                          <span className="text-white">Ongoing as needed</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Rest Periods:</span>
                          <span className="text-white">Some users cycle off periodically</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Seasonal Use:</span>
                          <span className="text-white">Often used before summer months</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        Side Effects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedProduct.sideEffects.map((effect, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        Contraindications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedProduct.contraindications.map((contraindication, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{contraindication}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-400" />
                      Safety Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Pre-Treatment Assessment</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• Full body mole mapping and photography</li>
                          <li className="text-slate-300">• Dermatology consultation (strongly recommended)</li>
                          <li className="text-slate-300">• Cardiovascular assessment and blood pressure</li>
                          <li className="text-slate-300">• Skin type and cancer risk evaluation</li>
                          <li className="text-slate-300">• Medical history review and risk assessment</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">During Treatment</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• Weekly skin examination and mole monitoring</li>
                          <li className="text-slate-300">• Blood pressure checks and side effect documentation</li>
                          <li className="text-slate-300">• Regular dermatology follow-ups</li>
                          <li className="text-slate-300">• Skin cancer screening and surveillance</li>
                          <li className="text-slate-300">• Photography comparison for mole changes</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      FDA Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-400 mb-2">Critical Safety Concerns</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="text-slate-300">• <strong>Not approved for human use</strong> by FDA</li>
                          <li className="text-slate-300">• <strong>Unregulated product quality</strong> with contamination risks</li>
                          <li className="text-slate-300">• <strong>Melanoma risk</strong> due to mole darkening and unknown long-term effects</li>
                          <li className="text-slate-300">• <strong>Cardiovascular effects</strong> and blood pressure changes</li>
                          <li className="text-slate-300">• <strong>Hormonal disruption</strong> affecting multiple systems</li>
                          <li className="text-slate-300">• <strong>Permanent skin changes</strong> that may be irreversible</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedProduct.sequence && (
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <FileText className="h-5 w-5 text-cyan-400" />
                          Amino Acid Sequence
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="text-slate-300 text-sm font-mono break-all">
                            {selectedProduct.sequence}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedProduct.storage && (
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Info className="h-5 w-5 text-cyan-400" />
                          Storage Instructions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300">{selectedProduct.storage}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Research Information */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      Research & Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Current Status:</span>
                        <Badge variant="outline" className="text-red-400 border-red-500/30">
                          {selectedProduct.researchStatus}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Key Research Findings</h4>
                          <div className="bg-slate-900/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Effective melanogenesis stimulation without UV exposure</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Potential erectile dysfunction treatment through MC4R activation</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Appetite suppression and weight loss effects in research studies</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Significant safety concerns and FDA warnings against use</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Clinical Applications</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-orange-400 mb-1">Skin Tanning</h5>
                              <p className="text-slate-300 text-sm">0.5-1.0 mg daily for 2-4 weeks loading</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-purple-400 mb-1">Erectile Dysfunction</h5>
                              <p className="text-slate-300 text-sm">1.75-2.0 mg 1-3 hours before activity</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-green-400 mb-1">Appetite Suppression</h5>
                              <p className="text-slate-300 text-sm">0.5-1.0 mg daily for weight loss</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-yellow-400 mb-1">Maintenance Tanning</h5>
                              <p className="text-slate-300 text-sm">0.5-1.0 mg 2-3 times per week</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Research Limitations</h4>
                          <p className="text-slate-300 text-sm">
                            Not approved for human therapeutic use. Significant safety concerns including melanoma risk, 
                            cardiovascular effects, and hormonal disruption. Unregulated market with variable product quality 
                            and contamination risks. Limited long-term safety data available.
                          </p>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Research Papers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Critical Safety Warning</h4>
                <p className="text-slate-300 text-sm">
                  <strong>Melanotan II is NOT approved for human use by the FDA and poses significant health risks.</strong> 
                  This information is for educational purposes only and should not be considered as medical advice. 
                  MT-2 carries serious safety concerns including melanoma risk, cardiovascular effects, and hormonal disruption. 
                  The FDA strongly warns against its use. Always consult with a qualified healthcare professional and consider 
                  safer alternatives for tanning and other desired effects. The information provided may not be complete 
                  or up-to-date with the latest research findings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 