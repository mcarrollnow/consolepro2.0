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
  Menu
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"

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

const hexarelinInfo: ProductInfo = {
  name: "Hexarelin",
  scientificName: "Growth Hormone-Releasing Hexapeptide",
  category: "Growth Hormone Releasing Peptide (GHRP)",
  description: "Hexarelin is a synthetic hexapeptide growth hormone-releasing peptide (GHRP) that stimulates growth hormone release through binding to the growth hormone secretagogue receptor (GHSR). It has demonstrated potent GH-releasing activity and cardioprotective effects, making it valuable for growth hormone deficiency treatment, cardiovascular protection, and body composition enhancement.",
  benefits: [
    "Potent growth hormone stimulation (7-15 fold increase)",
    "Cardiovascular protection and cardiac function improvement",
    "Muscle preservation and growth enhancement",
    "Metabolic dysfunction improvement",
    "Age-related GH decline reversal",
    "Body composition enhancement with increased lean mass",
    "Improved exercise capacity and recovery",
    "Enhanced metabolic markers and insulin sensitivity",
    "Cardioprotective effects in heart failure",
    "Generally well-tolerated with minimal side effects"
  ],
  dosage: "0.1-0.2 mg daily (research-based dosing)",
  halfLife: "Approximately 30-60 minutes",
  administration: "Subcutaneous injection (primary) or intravenous (clinical setting)",
  sideEffects: [
    "Generally well-tolerated in clinical trials",
    "Transient injection site reactions (mild)",
    "Potential water retention (dose-dependent)",
    "Possible increased appetite",
    "Risk of hypercortisolism at high doses",
    "Potential hyperprolactinemia",
    "May cause desensitization with chronic high-dose use"
  ],
  contraindications: [
    "Active malignancy",
    "Severe heart failure",
    "Uncontrolled diabetes",
    "Known hypersensitivity to hexarelin",
    "Pregnancy/lactation (insufficient data)",
    "Not approved for human therapeutic use",
    "Research use only with proper oversight"
  ],
  researchStatus: "Clinical Research Phase",
  imageUrl: "/hexarelin.png",
  gradientImageUrl: "/hexarelin-gradient.jpg",
  molecularWeight: "887.0 Da",
  sequence: "His-D-Trp-Ala-Trp-D-Phe-Lys-NH2",
  storage: "Lyophilized: Store at -4°F, stable for 24+ months. Reconstituted: Store at 39°F, use within 28 days.",
  availability: "Available",
  price: "$189.99 per vial",
  combinations: "Hexarelin may be combined with GHRH peptides like CJC-1295 or Sermorelin for synergistic effects on growth hormone release. It can also be used with other peptides like BPC-157 for enhanced recovery, or with AOD-9604 for body composition optimization. When combining with other GHRPs, monitor for additive effects on the GH axis."
}

export default function HexarelinProductPage() {
  const [selectedProduct] = useState<ProductInfo>(hexarelinInfo)

  return (
    <DashboardLayout defaultSection="product-information">
      <div className="space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="h-8 w-8 text-cyan-400" />
            Hexarelin Product Information
          </h2>
          <p className="text-slate-400">
            Comprehensive information about Hexarelin, including research data, dosing guidelines, and safety information.
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
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
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
                  <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
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
                  <Target className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Potent GH stimulation (7-15 fold increase)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Cardiovascular protection and cardiac function</span>
                </div>
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Muscle preservation and growth enhancement</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Well-tolerated with minimal side effects</span>
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
                        <h4 className="font-semibold text-white mb-2">GH Secretagogue Receptor Binding</h4>
                        <p className="text-slate-300 text-sm">
                          Binds to the growth hormone secretagogue receptor (GHSR) 
                          to stimulate growth hormone release from the pituitary gland.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Pulsatile GH Release</h4>
                        <p className="text-slate-300 text-sm">
                          Induces natural pulsatile growth hormone secretion patterns 
                          similar to endogenous GH release.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Cardioprotective Effects</h4>
                        <p className="text-slate-300 text-sm">
                          Improves cardiac function and provides cardiovascular protection 
                          through direct and indirect mechanisms.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Metabolic Enhancement</h4>
                        <p className="text-slate-300 text-sm">
                          Enhances metabolic function and body composition through 
                          increased IGF-1 production and tissue growth.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedProduct.combinations && (
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                                          <CardTitle className="text-white flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-purple-400" />
                      Peptide Combinations
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-slate-300 leading-relaxed">{selectedProduct.combinations}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-cyan-400 mb-1">Synergistic Combinations</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Link href="/cjc-1295" className="text-cyan-400 hover:underline">CJC-1295</Link>
                                <span className="text-slate-400">- Enhanced GH release</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link href="/sermorelin" className="text-cyan-400 hover:underline">Sermorelin</Link>
                                <span className="text-slate-400">- Natural GH stimulation</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link href="/bpc-157" className="text-cyan-400 hover:underline">BPC-157</Link>
                                <span className="text-slate-400">- Enhanced recovery</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-purple-400 mb-1">Body Composition</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Link href="/aod-9604" className="text-purple-400 hover:underline">AOD-9604</Link>
                                <span className="text-slate-400">- Fat metabolism</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link href="/igf-lr3" className="text-purple-400 hover:underline">IGF-1 LR3</Link>
                                <span className="text-slate-400">- Muscle growth</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link href="/tesamorelin" className="text-purple-400 hover:underline">Tesamorelin</Link>
                                <span className="text-slate-400">- GH optimization</span>
                              </div>
                            </div>
                          </div>
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
                    {/* Standard Protocols */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Standard Dosing Protocols</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">GH Stimulation Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.1 mg 3x daily</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">12-16 weeks</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">Morning, midday, night</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Cardiovascular Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.2 mg daily</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">Long-term</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">Once daily</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-400 mb-2">Body Composition Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.1 mg 2-3x daily</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">16 weeks</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">Cycled 4 weeks off</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body Weight Dosing */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Dosing by Body Weight</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h5 className="font-semibold text-cyan-400 mb-2">Standard Dosing (0.45 mcg/lb)</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">110 lbs:</span>
                                <span className="text-white">0.05 mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">154 lbs:</span>
                                <span className="text-white">0.07 mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">198 lbs:</span>
                                <span className="text-white">0.09 mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">220 lbs:</span>
                                <span className="text-white">0.10 mg</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-purple-400 mb-2">High-Dose Protocol (0.9 mcg/lb)</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">110 lbs:</span>
                                <span className="text-white">0.10 mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">154 lbs:</span>
                                <span className="text-white">0.14 mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">198 lbs:</span>
                                <span className="text-white">0.18 mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">220 lbs:</span>
                                <span className="text-white">0.20 mg</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-green-400 mb-2">Conservative Dosing (0.23 mcg/lb)</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">110 lbs:</span>
                                <span className="text-white">0.025 mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">154 lbs:</span>
                                <span className="text-white">0.035 mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">198 lbs:</span>
                                <span className="text-white">0.045 mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">220 lbs:</span>
                                <span className="text-white">0.050 mg</span>
                              </div>
                            </div>
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
                              <span className="text-slate-300">Use 27-30 gauge, 0.5-1 inch needle</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Inject into subcutaneous tissue of abdomen, thigh, or deltoid</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Rotate injection sites to prevent lipodystrophy</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Optimal timing: Empty stomach (2-3 hours post-meal)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Intravenous Administration (Clinical)</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Dose: 0.001-0.002 mg per kg body weight</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Frequency: Single dose for testing</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Monitoring: GH levels at 15, 30, 60, 90, 120 minutes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cycling */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Cycling Protocols</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Standard Cycle:</span>
                          <span className="text-white">12-16 weeks on, 4 weeks off</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Long-term Use:</span>
                          <span className="text-white">Monitor for desensitization</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Break Periods:</span>
                          <span className="text-white">Allow GH axis recovery</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Re-introduction:</span>
                          <span className="text-white">May require dose adjustment</span>
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
                        <h4 className="font-semibold text-white mb-2">Baseline Testing</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• IGF-1 and IGFBP-3 levels</li>
                          <li className="text-slate-300">• Growth hormone stimulation test</li>
                          <li className="text-slate-300">• Comprehensive metabolic panel</li>
                          <li className="text-slate-300">• Cardiovascular assessment</li>
                          <li className="text-slate-300">• Bone density (if indicated)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">During Treatment</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• IGF-1 levels every 4 weeks</li>
                          <li className="text-slate-300">• Growth hormone response testing</li>
                          <li className="text-slate-300">• Blood pressure monitoring</li>
                          <li className="text-slate-300">• Blood glucose monitoring</li>
                          <li className="text-slate-300">• Cortisol and prolactin levels</li>
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
                        <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                          {selectedProduct.researchStatus}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Key Research Findings</h4>
                          <div className="bg-slate-900/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">7-15 fold increase in growth hormone levels</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Cardioprotective effects in heart failure models</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Improved body composition and lean mass</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Enhanced metabolic function and exercise capacity</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Clinical Applications</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-cyan-400 mb-1">GH Deficiency</h5>
                              <p className="text-slate-300 text-sm">0.1 mg 3x daily for 16 weeks</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-purple-400 mb-1">Cardiovascular Disease</h5>
                              <p className="text-slate-300 text-sm">0.2 mg daily for long-term maintenance</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-green-400 mb-1">Age-Related GH Decline</h5>
                              <p className="text-slate-300 text-sm">0.05-0.1 mg 2x daily for 12-week cycles</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-yellow-400 mb-1">Muscle Wasting</h5>
                              <p className="text-slate-300 text-sm">0.2 mg daily for 12-24 weeks</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Research Limitations</h4>
                          <p className="text-slate-300 text-sm">
                            Limited long-term human safety data. May cause desensitization with chronic high-dose use. 
                            Individual response may vary. Not approved for therapeutic use in most countries.
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
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Important Disclaimer</h4>
                <p className="text-slate-300 text-sm">
                  This information is for educational purposes only and should not be considered as medical advice. 
                  Hexarelin is not approved for human therapeutic use in most countries. Always consult with a qualified 
                  healthcare professional before starting any new treatment. The information provided may not be complete 
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