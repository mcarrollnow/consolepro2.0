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
}

const hghInfo: ProductInfo = {
  name: "HGH",
  scientificName: "Human Growth Hormone (Somatropin)",
  category: "Growth Hormone Therapy",
  description: "Human Growth Hormone (HGH) is a recombinant form of naturally occurring growth hormone produced by the pituitary gland. It's FDA-approved for various growth disorders in children and specific conditions in adults including growth hormone deficiency, muscle wasting, and short bowel syndrome. HGH plays a crucial role in growth, metabolism, and tissue repair throughout the body.",
  benefits: [
    "Stimulates growth and cell reproduction in humans",
    "Enhances muscle mass and strength",
    "Improves bone density and skeletal growth",
    "Accelerates wound healing and tissue repair",
    "Enhances metabolic function and fat metabolism",
    "Improves skin elasticity and collagen production",
    "Boosts energy levels and exercise performance",
    "Supports immune system function",
    "May improve cognitive function and memory",
    "FDA-approved for specific medical conditions"
  ],
  dosage: "0.2-6.0 mg daily (varies by indication)",
  halfLife: "Approximately 2-3 hours",
  administration: "Subcutaneous injection (primary method)",
  sideEffects: [
    "Peripheral edema (swelling) and fluid retention",
    "Joint pain and stiffness, carpal tunnel syndrome",
    "Muscle pain and discomfort",
    "Insulin resistance and glucose intolerance",
    "Increased appetite and weight gain",
    "Headache and dizziness",
    "Injection site reactions",
    "Sleep disturbances and fatigue",
    "Rare: diabetes mellitus, increased cancer risk",
    "Benign intracranial hypertension (rare)"
  ],
  contraindications: [
    "Active malignancy or cancer diagnosis",
    "Critical illness or acute life-threatening conditions",
    "Closed epiphyses in children (for growth indication)",
    "Severe respiratory impairment",
    "Known hypersensitivity to somatropin",
    "Pregnancy and lactation (safety not established)",
    "Active proliferative diabetic retinopathy",
    "Severe sleep apnea (may worsen condition)"
  ],
  researchStatus: "FDA-Approved for Specific Indications",
  imageUrl: "/hgh.png",
  gradientImageUrl: "/hgh-gradient.jpg",
  molecularWeight: "22,125 Da",
  sequence: "191 amino acid single-chain polypeptide",
  storage: "Refrigerated (2-8°C). Reconstituted: 14-28 days refrigerated depending on brand.",
  availability: "Available",
  price: "$1,000-3,000+ per month"
}

export default function HGHProductPage() {
  const [selectedProduct] = useState<ProductInfo>(hghInfo)

  return (
    <DashboardLayout defaultSection="product-information">
      <div className="space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="h-8 w-8 text-cyan-400" />
            HGH Product Information
          </h2>
          <p className="text-slate-400">
            Comprehensive information about Human Growth Hormone (HGH), including FDA-approved uses, dosing guidelines, and safety information.
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
                  <Badge variant="outline" className="text-green-400 border-green-500/30">
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
                  <span className="text-slate-300 text-sm">FDA-approved for specific medical conditions</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Comprehensive growth and metabolic effects</span>
                </div>
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Enhanced muscle mass and tissue repair</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Requires medical supervision and prescription</span>
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
                        <h4 className="font-semibold text-white mb-2">Growth Stimulation</h4>
                        <p className="text-slate-300 text-sm">
                          Binds to growth hormone receptors throughout the body, 
                          stimulating cell growth, reproduction, and regeneration.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">IGF-1 Production</h4>
                        <p className="text-slate-300 text-sm">
                          Stimulates the liver to produce insulin-like growth factor-1 (IGF-1), 
                          which mediates many growth hormone effects.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Metabolic Effects</h4>
                        <p className="text-slate-300 text-sm">
                          Enhances protein synthesis, promotes fat breakdown, 
                          and improves glucose metabolism and energy utilization.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Tissue Repair</h4>
                        <p className="text-slate-300 text-sm">
                          Accelerates wound healing, muscle repair, and 
                          tissue regeneration through enhanced cellular processes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                    {/* FDA-Approved Protocols */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">FDA-Approved Adult Indications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">Adult GHD</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Starting:</span> <span className="text-white">0.2-0.3 mg daily</span></div>
                            <div><span className="text-slate-400">Maintenance:</span> <span className="text-white">0.15-1.33 mg daily</span></div>
                            <div><span className="text-slate-400">Route:</span> <span className="text-white">Subcutaneous</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">HIV Wasting</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">4-6 mg daily</span></div>
                            <div><span className="text-slate-400">Weight-based:</span> <span className="text-white">45-75+ kg</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">Until improvement</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-400 mb-2">Short Bowel</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.1 mg/kg daily</span></div>
                            <div><span className="text-slate-400">Max:</span> <span className="text-white">8 mg/day</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">Up to 4 weeks</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pediatric Dosing */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Pediatric Dosing (FDA-Approved)</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-cyan-400 mb-2">Growth Hormone Deficiency</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Dose:</span>
                                <span className="text-white">0.16-0.24 mg/kg/week</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Frequency:</span>
                                <span className="text-white">6-7 injections/week</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Daily:</span>
                                <span className="text-white">0.023-0.034 mg/kg/day</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-purple-400 mb-2">Turner Syndrome</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Dose:</span>
                                <span className="text-white">Up to 0.375 mg/kg/week</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Higher doses:</span>
                                <span className="text-white">May be required</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Duration:</span>
                                <span className="text-white">Until near-final height</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Off-Label Protocols */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Off-Label Anti-Aging Protocols</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">Conservative</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.5-1.0 IU daily</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">5-6 days/week</span></div>
                            <div><span className="text-slate-400">Timing:</span> <span className="text-white">Before bedtime</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Intermediate</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">1-2 IU daily</span></div>
                            <div><span className="text-slate-400">Schedule:</span> <span className="text-white">Mon-Fri</span></div>
                            <div><span className="text-slate-400">Monitoring:</span> <span className="text-white">IGF-1 quarterly</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-400 mb-2">Advanced</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">2-4 IU daily</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">Daily or 6 days/week</span></div>
                            <div><span className="text-slate-400">Supervision:</span> <span className="text-white">Medical required</span></div>
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
                              <span className="text-slate-300">Use 29-31 gauge insulin syringe</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Inject into abdomen, thigh, or upper arm</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Rotate injection sites daily</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Optimal timing: Before bedtime on empty stomach</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Delivery Systems</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Pre-filled pens: Most convenient, auto-injectors</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Vials and syringes: Traditional method, cost-effective</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Cartridge systems: Reusable pen devices</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cycling */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Treatment Cycles</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Adult Deficiency:</span>
                          <span className="text-white">Continuous therapy, long-term or lifelong</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Anti-Aging Use:</span>
                          <span className="text-white">6 months on, 2-3 months off</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Monitoring:</span>
                          <span className="text-white">IGF-1 levels every 1-3 months</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Dose Adjustments:</span>
                          <span className="text-white">Based on response and tolerance</span>
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
                          <li className="text-slate-300">• IGF-1 levels and growth hormone stimulation test</li>
                          <li className="text-slate-300">• Glucose tolerance test and HbA1c</li>
                          <li className="text-slate-300">• Comprehensive metabolic panel</li>
                          <li className="text-slate-300">• Thyroid function tests (T4, TSH)</li>
                          <li className="text-slate-300">• Cancer screening (age-appropriate)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">During Treatment</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• IGF-1 levels every 1-3 months</li>
                          <li className="text-slate-300">• Glucose/HbA1c monitoring</li>
                          <li className="text-slate-300">• Lipid profile assessment</li>
                          <li className="text-slate-300">• Blood pressure monitoring</li>
                          <li className="text-slate-300">• Regular cancer screenings</li>
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
                          Molecular Structure
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="text-slate-300 text-sm">
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
                        <Badge variant="outline" className="text-green-400 border-green-500/30">
                          {selectedProduct.researchStatus}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">FDA-Approved Indications</h4>
                          <div className="bg-slate-900/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Adult growth hormone deficiency</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Pediatric growth hormone deficiency</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">HIV-associated wasting syndrome</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Short bowel syndrome</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Brand Names</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-cyan-400 mb-1">Genotropin®</h5>
                              <p className="text-slate-300 text-sm">Pfizer (powder and cartridge)</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-purple-400 mb-1">Humatrope®</h5>
                              <p className="text-slate-300 text-sm">Eli Lilly (powder for injection)</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-green-400 mb-1">Norditropin®</h5>
                              <p className="text-slate-300 text-sm">Novo Nordisk (pre-filled pens)</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-yellow-400 mb-1">Saizen®</h5>
                              <p className="text-slate-300 text-sm">EMD Serono (powder and solution)</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Legal Considerations</h4>
                          <div className="bg-slate-900/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Prescription medication requiring medical supervision</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Schedule III controlled substance in some jurisdictions</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Banned in most competitive sports (WADA prohibited)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Anti-aging use is off-label and not FDA-approved</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-white mb-2">Combination Therapy Options</h4>
                          <div className="bg-slate-900/50 p-3 rounded-lg space-y-3">
                            <p className="text-slate-300 text-sm mb-3">
                              HGH can be combined with various peptide alternatives for enhanced effects or as safer alternatives:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" />
                                <Link href="/sermorelin" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                                  Sermorelin
                                </Link>
                                <span className="text-slate-300 text-sm">- Stimulates natural GH production</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                                <Link href="/ghrp-2" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                                  GHRP-2/GHRP-6
                                </Link>
                                <span className="text-slate-300 text-sm">- Growth hormone releasing peptides</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                                <Link href="/ipamorelin" className="text-green-400 hover:text-green-300 text-sm font-medium">
                                  Ipamorelin
                                </Link>
                                <span className="text-slate-300 text-sm">- Selective GH secretagogue</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                                <Link href="/cjc-1295" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                                  CJC-1295
                                </Link>
                                <span className="text-slate-300 text-sm">- Long-acting GHRH analog</span>
                              </div>
                            </div>
                            <div className="mt-3 p-2 bg-slate-800/50 rounded">
                              <p className="text-slate-300 text-xs">
                                <strong>Comparative Considerations:</strong> Peptides generally offer lower cost, better tolerability, 
                                easier legal access, while HGH provides more potent effects but with stricter requirements.
                              </p>
                            </div>
                          </div>
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
                  HGH is a prescription medication that requires medical supervision and cannot be legally obtained without a prescription. 
                  This information is for educational purposes only and should not be considered as medical advice. 
                  Only FDA-approved indications are legitimate medical uses. Anti-aging and athletic performance uses are off-label 
                  and carry significant health and legal risks. Always consult with a qualified healthcare professional before 
                  considering any hormone therapy. Black market HGH products are dangerous and illegal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 