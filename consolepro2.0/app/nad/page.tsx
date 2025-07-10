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
  combinations?: string[]
}

const nadInfo: ProductInfo = {
  name: "NAD+",
  scientificName: "Nicotinamide Adenine Dinucleotide",
  category: "Cellular Energy & Anti-Aging",
  description: "NAD+ (Nicotinamide Adenine Dinucleotide) is a critical coenzyme involved in cellular energy production, DNA repair, and aging processes. NAD+ levels naturally decline with age, leading to decreased cellular function and increased susceptibility to age-related diseases. NAD+ supplementation has shown promise in supporting cellular energy production, DNA repair mechanisms, and overall cellular health.",
  benefits: [
    "Enhances cellular energy production and metabolism",
    "Supports DNA repair and cellular regeneration",
    "Improves cognitive function and mental clarity",
    "Supports healthy aging and longevity",
    "Enhances exercise performance and recovery",
    "Supports cardiovascular health and function",
    "Improves sleep quality and recovery",
    "Supports immune system function",
    "May help with addiction recovery and brain health",
    "Supports mitochondrial function and cellular health"
  ],
  dosage: "25-1500 mg daily (varies by administration method)",
  halfLife: "Approximately 4-6 hours (varies by form)",
  administration: "Oral supplementation, subcutaneous injection, or intravenous therapy",
  sideEffects: [
    "Generally well-tolerated with minimal side effects",
    "High-dose IV administration may cause nausea or headache",
    "Rare: shortness of breath with rapid IV administration",
    "Injection site reactions (mild, transient)",
    "Constipation (rare, typically with high doses)",
    "Flushing or warmth sensation (especially with IV)"
  ],
  contraindications: [
    "Known hypersensitivity to NAD+ or precursors",
    "Pregnancy/lactation (limited safety data)",
    "Severe cardiovascular disease (monitor blood pressure)",
    "Kidney disease (caution with high doses)",
    "Active malignancy (consult healthcare provider)",
    "Not approved for therapeutic use in most countries"
  ],
  researchStatus: "Clinical Research Phase",
  imageUrl: "/nad_.png",
  gradientImageUrl: "/nad-gradient.jpg",
  molecularWeight: "663.43 Da",
  sequence: "C21H27N7O14P2",
  storage: "Lyophilized: Store at -4°F, stable for 24+ months. Reconstituted: Store at 39°F, use within 30 days.",
  availability: "Available",
  price: "$299.99 per vial",
  combinations: [
    "NR + Pterostilbene for enhanced sirtuin activity",
    "NMN + Resveratrol for synergistic anti-aging effects",
    "NAD+ + BPC-157 for enhanced cellular repair",
    "NAD+ + GHK-Cu for comprehensive anti-aging support"
  ]
}

export default function NADProductPage() {
  const [selectedProduct] = useState<ProductInfo>(nadInfo)

  return (
    <DashboardLayout defaultSection="product-information">
      <div className="space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="h-8 w-8 text-cyan-400" />
            NAD+ Product Information
          </h2>
          <p className="text-slate-400">
            Comprehensive information about NAD+, including research data, dosing guidelines, and safety information.
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
                  <span className="text-slate-300 text-sm">Critical coenzyme for cellular energy production</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Supports DNA repair and cellular regeneration</span>
                </div>
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Enhances cognitive function and mental clarity</span>
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
                        <h4 className="font-semibold text-white mb-2">Cellular Energy Production</h4>
                        <p className="text-slate-300 text-sm">
                          NAD+ serves as a critical coenzyme in cellular respiration, 
                          facilitating the conversion of nutrients into cellular energy (ATP).
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">DNA Repair & Maintenance</h4>
                        <p className="text-slate-300 text-sm">
                          Supports DNA repair mechanisms and cellular regeneration 
                          through activation of repair enzymes like PARP and sirtuins.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Anti-Aging Effects</h4>
                        <p className="text-slate-300 text-sm">
                          Activates sirtuin proteins that regulate cellular aging, 
                          metabolism, and stress response pathways.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Mitochondrial Support</h4>
                        <p className="text-slate-300 text-sm">
                          Enhances mitochondrial function and efficiency, 
                          improving cellular energy production and reducing oxidative stress.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedProduct.combinations && (
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                        Combination Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-slate-300 text-sm mb-4">
                          NAD+ can be combined with other compounds for enhanced effects:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-900/50 p-4 rounded-lg">
                            <h5 className="font-semibold text-cyan-400 mb-2">NR + Pterostilbene</h5>
                            <p className="text-slate-300 text-sm mb-2">Enhanced sirtuin activity and NAD+ abundance</p>
                            <div className="text-xs text-slate-400">
                              <div>Low Dose: 250 mg NR + 50 mg pterostilbene daily</div>
                              <div>High Dose: 500 mg NR + 100 mg pterostilbene daily</div>
                            </div>
                          </div>
                          <div className="bg-slate-900/50 p-4 rounded-lg">
                            <h5 className="font-semibold text-purple-400 mb-2">NMN + Resveratrol</h5>
                            <p className="text-slate-300 text-sm mb-2">Synergistic anti-aging and cellular repair effects</p>
                            <div className="text-xs text-slate-400">
                              <div>Standard: 250-500 mg NMN + 100-200 mg resveratrol daily</div>
                            </div>
                          </div>
                          <div className="bg-slate-900/50 p-4 rounded-lg">
                            <h5 className="font-semibold text-green-400 mb-2">NAD+ + <Link href="/bpc-157" className="text-green-400 hover:text-green-300 underline">BPC-157</Link></h5>
                            <p className="text-slate-300 text-sm mb-2">Enhanced cellular repair and tissue regeneration</p>
                            <div className="text-xs text-slate-400">
                              <div>Combined therapy for comprehensive healing support</div>
                            </div>
                          </div>
                          <div className="bg-slate-900/50 p-4 rounded-lg">
                            <h5 className="font-semibold text-yellow-400 mb-2">NAD+ + <Link href="/ghk-cu" className="text-yellow-400 hover:text-yellow-300 underline">GHK-Cu</Link></h5>
                            <p className="text-slate-300 text-sm mb-2">Comprehensive anti-aging and skin health support</p>
                            <div className="text-xs text-slate-400">
                              <div>Synergistic effects on cellular regeneration</div>
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
                    {/* Oral Supplementation */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Oral Supplementation (Precursors)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">Nicotinamide Riboside (NR)</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Low Dose:</span> <span className="text-white">100-250 mg daily</span></div>
                            <div><span className="text-slate-400">Standard:</span> <span className="text-white">250-500 mg daily</span></div>
                            <div><span className="text-slate-400">High Dose:</span> <span className="text-white">500-1000 mg daily</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Nicotinamide Mononucleotide (NMN)</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Low Dose:</span> <span className="text-white">150-250 mg daily</span></div>
                            <div><span className="text-slate-400">Standard:</span> <span className="text-white">250-500 mg daily</span></div>
                            <div><span className="text-slate-400">High Dose:</span> <span className="text-white">500-900 mg daily</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-400 mb-2">Nicotinamide (NAM)</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Low Dose:</span> <span className="text-white">300-500 mg daily</span></div>
                            <div><span className="text-slate-400">Standard:</span> <span className="text-white">500-900 mg daily</span></div>
                            <div><span className="text-slate-400">High Dose:</span> <span className="text-white">900-3000 mg daily</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Injection Protocols */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Injection Protocols</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">Subcutaneous Injection</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Starting Dose:</span> <span className="text-white">25-50 mg per injection</span></div>
                            <div><span className="text-slate-400">Standard Dose:</span> <span className="text-white">50-200 mg per injection</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">1-3 times per week</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">Varies by individual needs</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Intravenous Therapy</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Low Dose:</span> <span className="text-white">500 mg per session</span></div>
                            <div><span className="text-slate-400">Standard:</span> <span className="text-white">750-1000 mg per session</span></div>
                            <div><span className="text-slate-400">High Dose:</span> <span className="text-white">1000-1500 mg per session</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">Weekly to monthly</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Treatment Programs */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Treatment Programs</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-cyan-400 mb-2">Initial Loading Phase (IV)</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Days 1-3:</span>
                                <span className="text-white">500-750 mg daily</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Days 4-7:</span>
                                <span className="text-white">750-1000 mg daily</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Maintenance:</span>
                                <span className="text-white">500-1000 mg weekly</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-purple-400 mb-2">Historical Protocol (1961 Study)</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Initial:</span>
                                <span className="text-white">500-1000 mg daily for 4 days</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Week 1-4:</span>
                                <span className="text-white">Two injections weekly</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Maintenance:</span>
                                <span className="text-white">One injection every 2 months</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Administration Guidelines */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Administration Guidelines</h4>
                      <div className="space-y-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">Timing Considerations</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Daily consistency is key for optimal results</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Most people prefer morning administration for energy benefits</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Can be taken with or without food</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Reconstitution Instructions</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">500mg Vial: Add 5mL of Bacteriostatic Water</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">1000mg Vial: Add 10mL of Bacteriostatic Water</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Storage: Refrigerate reconstituted vials; use within 30 days</span>
                            </div>
                          </div>
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
                          <li className="text-slate-300">• Comprehensive metabolic panel</li>
                          <li className="text-slate-300">• NAD+ levels (if available)</li>
                          <li className="text-slate-300">• Cardiovascular assessment</li>
                          <li className="text-slate-300">• Kidney function tests</li>
                          <li className="text-slate-300">• Cognitive function assessment</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">During Treatment</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• Monthly energy and cognitive assessments</li>
                          <li className="text-slate-300">• Quarterly metabolic monitoring</li>
                          <li className="text-slate-300">• Blood pressure monitoring (IV therapy)</li>
                          <li className="text-slate-300">• Injection site assessment</li>
                          <li className="text-slate-300">• Adverse event monitoring</li>
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
                          Molecular Formula
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
                              <span className="text-slate-300 text-sm">Significant increase in NAD+ levels with supplementation</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Improved cellular energy production and metabolism</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Enhanced cognitive function and mental clarity</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Support for addiction recovery and brain health</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Clinical Applications</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-cyan-400 mb-1">Anti-Aging & Longevity</h5>
                              <p className="text-slate-300 text-sm">250-500 mg daily for cellular health and aging support</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-purple-400 mb-1">Cognitive Enhancement</h5>
                              <p className="text-slate-300 text-sm">250-1000 mg daily for brain health and mental clarity</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-green-400 mb-1">Energy & Performance</h5>
                              <p className="text-slate-300 text-sm">500-1500 mg IV for enhanced energy and recovery</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-yellow-400 mb-1">Addiction Recovery</h5>
                              <p className="text-slate-300 text-sm">High-dose IV therapy for brain health support</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Research Limitations</h4>
                          <p className="text-slate-300 text-sm">
                            Limited long-term human safety data. Most studies are short-term (8-12 weeks). 
                            Individual response may vary. NAD+ is considered a dietary supplement, not a drug. 
                            The FDA does not currently evaluate dietary supplements in their current regulations.
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
                  NAD+ is considered a dietary supplement, not a drug. The FDA does not currently evaluate dietary 
                  supplements in their current regulations. Always consult with a qualified healthcare professional 
                  before starting any new treatment. The information provided may not be complete or up-to-date 
                  with the latest research findings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 