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

const igf1Lr3Info: ProductInfo = {
  name: "IGF-1 LR3",
  scientificName: "Insulin-like Growth Factor-1 Long R3",
  category: "Growth Factor Peptide",
  description: "IGF-1 LR3 is a synthetic analog of IGF-1 with an extended half-life due to amino acid substitutions that reduce binding to IGF-binding proteins. It directly stimulates muscle protein synthesis, satellite cell activation, and tissue repair. While IGF-1 has therapeutic applications, IGF-1 LR3 is primarily used in research settings and carries significant safety concerns including potential organ growth and severe hypoglycemia.",
  benefits: [
    "Enhanced muscle protein synthesis and anabolic signaling",
    "Satellite cell activation for muscle repair and growth",
    "Potential muscle fiber hyperplasia (new fiber formation)",
    "Accelerated tissue repair and recovery",
    "Enhanced glucose metabolism and insulin sensitivity",
    "Improved nutrient partitioning and utilization",
    "Extended half-life compared to regular IGF-1",
    "Reduced binding to IGF-binding proteins",
    "Direct growth factor activity",
    "Enhanced post-workout recovery"
  ],
  dosage: "20-120 mcg daily (research-based dosing)",
  halfLife: "Extended half-life due to amino acid modifications",
  administration: "Subcutaneous injection (primary method)",
  sideEffects: [
    "Severe hypoglycemia requiring glucose monitoring",
    "Injection site reactions (redness, swelling, pain)",
    "Potential irreversible organ enlargement (acromegaly-like effects)",
    "Hypotension and cardiovascular stress",
    "Theoretical cancer risk due to growth promotion",
    "Hand/foot swelling and facial changes",
    "Enhanced metabolic demands on cardiovascular system",
    "Potential allergic reactions and systemic responses"
  ],
  contraindications: [
    "Active malignancy or cancer diagnosis",
    "Pregnancy and breastfeeding (safety unknown)",
    "Diabetes (significant hypoglycemia risk)",
    "Children and adolescents (growth plate concerns)",
    "Severe cardiovascular disease",
    "Family history of cancer",
    "Not FDA-approved for human use",
    "Research use only with medical supervision"
  ],
  researchStatus: "Research Chemical - Not FDA Approved",
  imageUrl: "/igf_lr3.png",
  gradientImageUrl: "/igf-lr3-gradient.jpg",
  molecularWeight: "Approximately 7,649 Da",
  sequence: "Modified IGF-1 with R3 substitution for extended half-life",
  storage: "Lyophilized: Store at -4°F, stable for 24+ months. Reconstituted: Store refrigerated, use within 28 days.",
  availability: "Limited",
  price: "$349.99 per vial"
}

export default function IGF1LR3ProductPage() {
  const [selectedProduct] = useState<ProductInfo>(igf1Lr3Info)

  return (
    <DashboardLayout defaultSection="product-information">
      <div className="space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="h-8 w-8 text-cyan-400" />
            IGF-1 LR3 Product Information
          </h2>
          <p className="text-slate-400">
            Comprehensive information about IGF-1 LR3, including research data, dosing guidelines, and critical safety information.
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
                        className={selectedProduct.availability === "Available" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}
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
                  <Target className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Direct muscle protein synthesis stimulation</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Extended half-life compared to regular IGF-1</span>
                </div>
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Enhanced glucose metabolism and recovery</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Significant safety concerns and risks</span>
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
                        <h4 className="font-semibold text-white mb-2">Direct IGF-1 Activity</h4>
                        <p className="text-slate-300 text-sm">
                          Binds directly to IGF-1 receptors, bypassing the need for growth hormone 
                          to stimulate IGF-1 production in the liver.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Extended Half-Life</h4>
                        <p className="text-slate-300 text-sm">
                          Amino acid modifications reduce binding to IGF-binding proteins, 
                          extending the duration of action compared to regular IGF-1.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Muscle Protein Synthesis</h4>
                        <p className="text-slate-300 text-sm">
                          Activates mTOR pathway and stimulates muscle protein synthesis, 
                          leading to enhanced muscle growth and repair.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Glucose Metabolism</h4>
                        <p className="text-slate-300 text-sm">
                          Enhances glucose uptake and insulin sensitivity, but can cause 
                          severe hypoglycemia requiring careful monitoring.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-400" />
                      Combination Therapy & Alternatives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3">Comparison with Related Peptides</h4>
                        <div className="space-y-3">
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-cyan-400 mb-1">IGF-1 LR3 vs. Regular IGF-1</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-slate-300">Extended half-life due to amino acid modifications</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-slate-300">Reduced binding to IGF-binding proteins</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-slate-300">Less frequent dosing compared to regular IGF-1</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-slate-300">Higher cost and less research data</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-purple-400 mb-1">IGF-1 LR3 vs. <Link href="/hgh" className="text-purple-400 hover:text-purple-300 underline">Growth Hormone</Link></h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-slate-300">Direct IGF-1 activity vs. indirect stimulation</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-slate-300">Different side effect profiles and risks</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-slate-300">Both restricted for performance use</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-3">Safer Legal Alternatives</h4>
                        <div className="space-y-3">
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-green-400 mb-1">Protein Supplementation</h5>
                            <p className="text-slate-300 text-sm">High-quality protein sources for muscle growth</p>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-green-400 mb-1">Creatine Monohydrate</h5>
                            <p className="text-slate-300 text-sm">Well-studied and safe performance enhancer</p>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-green-400 mb-1">HMB (β-Hydroxy β-Methylbutyrate)</h5>
                            <p className="text-slate-300 text-sm">Muscle preservation and recovery support</p>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-green-400 mb-1">Branched-Chain Amino Acids</h5>
                            <p className="text-slate-300 text-sm">Recovery support and muscle protein synthesis</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Medical Growth Factor Therapy</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-blue-400 mb-1">Mecasermin (IGF-1)</h5>
                          <p className="text-slate-300 text-sm">FDA-approved for severe IGF-1 deficiency</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-400 mb-1"><Link href="/hgh" className="text-blue-400 hover:text-blue-300 underline">Growth Hormone</Link></h5>
                          <p className="text-slate-300 text-sm">For diagnosed growth hormone deficiencies</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm mt-3">
                        <strong>Important:</strong> These medical treatments require proper diagnosis, 
                        medical supervision, and are only available through healthcare providers.
                      </p>
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
                    {/* Standard Protocols */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Research-Based Dosing Protocols</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">Conservative Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">20-40 mcg daily</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">2-4 weeks max</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">Once daily</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Standard Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">40-80 mcg daily</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">4 weeks max</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">Split dosing</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-red-400 mb-2">Advanced Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">80-120 mcg daily</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">4-6 weeks max</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">2-3 times daily</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reconstitution */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Reconstitution Guidelines</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-cyan-400 mb-2">Standard Reconstitution</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">1mg vial + 2ml water:</span>
                                <span className="text-white">500 mcg/ml</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">40 mcg dose:</span>
                                <span className="text-white">0.08ml (8 units)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">80 mcg dose:</span>
                                <span className="text-white">0.16ml (16 units)</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-purple-400 mb-2">Storage Requirements</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Lyophilized:</span>
                                <span className="text-white">-4°F, 24+ months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Reconstituted:</span>
                                <span className="text-white">Refrigerated, 28 days</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Needle:</span>
                                <span className="text-white">29-31 gauge insulin syringe</span>
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
                              <span className="text-slate-300">Use 29-31 gauge insulin syringe</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Inject into abdomen, thigh, or target muscle area</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Can inject near target muscles for local effects</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Rotate injection sites to prevent reactions</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Timing Protocols</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Post-workout: Within 30 minutes for enhanced protein synthesis</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Pre-meal: 20-30 minutes before for enhanced nutrient uptake</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Avoid carbohydrates for 30-60 minutes post-injection</span>
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
                          <span className="text-white">4 weeks on, 4 weeks off</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Conservative Cycle:</span>
                          <span className="text-white">2-3 weeks on, 2-3 weeks off</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Extended Cycle:</span>
                          <span className="text-white">6-8 weeks max, 8-12 weeks rest</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Medical Oversight:</span>
                          <span className="text-white">Essential for extended use</span>
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
                          <li className="text-slate-300">• IGF-1 levels measurement</li>
                          <li className="text-slate-300">• Glucose tolerance test</li>
                          <li className="text-slate-300">• Complete blood count</li>
                          <li className="text-slate-300">• Comprehensive metabolic panel</li>
                          <li className="text-slate-300">• Cancer screening examinations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">During Treatment</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• Daily blood glucose monitoring</li>
                          <li className="text-slate-300">• Weekly IGF-1 levels</li>
                          <li className="text-slate-300">• Monthly physical examination</li>
                          <li className="text-slate-300">• Regular blood pressure monitoring</li>
                          <li className="text-slate-300">• Weight and body composition tracking</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      Emergency Protocols
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Hypoglycemia Management</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• Administer 15-20g fast-acting carbohydrates</li>
                          <li className="text-slate-300">• Monitor blood glucose every 15 minutes</li>
                          <li className="text-slate-300">• Seek medical attention if severe</li>
                          <li className="text-slate-300">• Keep glucose tablets available</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Severe Adverse Events</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• Discontinue immediately</li>
                          <li className="text-slate-300">• Seek immediate medical care</li>
                          <li className="text-slate-300">• Document symptoms and timeline</li>
                          <li className="text-slate-300">• Ongoing medical supervision</li>
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
                              <span className="text-slate-300 text-sm">Enhanced muscle protein synthesis in research studies</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Extended half-life compared to regular IGF-1</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Significant hypoglycemia risk requiring careful monitoring</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Potential organ growth and acromegaly-like effects</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Research Applications</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-cyan-400 mb-1">Muscle Growth Studies</h5>
                              <p className="text-slate-300 text-sm">Enhanced anabolic signaling and protein synthesis</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-purple-400 mb-1">Metabolic Research</h5>
                              <p className="text-slate-300 text-sm">Glucose metabolism and insulin sensitivity studies</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-green-400 mb-1">Recovery Studies</h5>
                              <p className="text-slate-300 text-sm">Tissue repair and satellite cell activation</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-yellow-400 mb-1">Safety Research</h5>
                              <p className="text-slate-300 text-sm">Risk assessment and monitoring protocols</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Research Limitations</h4>
                          <p className="text-slate-300 text-sm">
                            Limited human safety data. Not FDA-approved for human use. Significant safety concerns including 
                            hypoglycemia, organ growth, and theoretical cancer risk. Quality and purity concerns in unregulated market. 
                            Requires comprehensive medical supervision and monitoring.
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
                  IGF-1 LR3 is NOT FDA-approved for human use and is classified as a research chemical with significant safety risks. 
                  This information is for educational purposes only and should not be considered as medical advice. IGF-1 LR3 carries 
                  serious health risks including severe hypoglycemia, potential irreversible organ growth, and theoretical cancer risk. 
                  Always consult with a qualified healthcare professional before considering any experimental use. Consider safer, 
                  legal alternatives for muscle growth and performance enhancement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 