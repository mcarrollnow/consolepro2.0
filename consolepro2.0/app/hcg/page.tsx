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

const hcgInfo: ProductInfo = {
  name: "HCG",
  scientificName: "Human Chorionic Gonadotropin",
  category: "Fertility & Hormone Support Peptide",
  description: "HCG is a glycoprotein hormone that mimics luteinizing hormone (LH) and stimulates testosterone production in males and supports ovulation in females. It is used for fertility treatment, hypogonadism management, and testosterone therapy support. HCG plays a crucial role in maintaining testicular function during testosterone replacement therapy and can be used for ovulation induction in fertility treatments.",
  benefits: [
    "Stimulates testosterone production in males",
    "Supports ovulation induction in females",
    "Maintains testicular function during TRT",
    "Enhances fertility in both sexes",
    "Supports post-cycle therapy recovery",
    "Preserves testicular size and function",
    "Improves libido and sexual function",
    "Supports natural hormone production",
    "Used in fertility treatment protocols",
    "Helps manage hypogonadotropic hypogonadism"
  ],
  dosage: "250-3000 IU per injection (varies by protocol)",
  halfLife: "Approximately 24-36 hours",
  administration: "Subcutaneous or intramuscular injection",
  sideEffects: [
    "Injection site reactions (mild, transient)",
    "Mood changes and irritability",
    "Acne and oily skin",
    "Water retention and bloating",
    "Gynecomastia in men (due to estradiol increase)",
    "Ovarian hyperstimulation syndrome (women)",
    "Headache and fatigue",
    "Breast tenderness"
  ],
  contraindications: [
    "Prostate or breast cancer",
    "Ovarian hyperstimulation syndrome (OHSS)",
    "Uncontrolled thyroid disorders",
    "Known hypersensitivity to HCG",
    "Pregnancy (except specific fertility protocols)",
    "Active malignancy",
    "Severe cardiovascular disease"
  ],
  researchStatus: "FDA Approved for Specific Indications",
  imageUrl: "/hcg.png",
  gradientImageUrl: "/hcg-gradient.jpg",
  molecularWeight: "36,700 Da",
  sequence: "Glycoprotein hormone with alpha and beta subunits",
  storage: "Lyophilized: Store at 39-46°F, stable for 24+ months. Reconstituted: Store at 39°F, use within 30-60 days.",
  availability: "Available",
  price: "$299.99 per vial"
}

export default function HCGProductPage() {
  const [selectedProduct] = useState<ProductInfo>(hcgInfo)

  return (
    <DashboardLayout defaultSection="product-information">
      <div className="space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="h-8 w-8 text-cyan-400" />
            HCG Product Information
          </h2>
          <p className="text-slate-400">
            Comprehensive information about HCG, including research data, dosing guidelines, and safety information.
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
                  <span className="text-slate-300 text-sm">Stimulates testosterone production</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Supports fertility and ovulation</span>
                </div>
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Maintains testicular function during TRT</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">FDA approved for specific indications</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700/50">
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700/50">Overview</TabsTrigger>
                <TabsTrigger value="dosing" className="data-[state=active]:bg-slate-700/50">Dosing</TabsTrigger>
                <TabsTrigger value="safety" className="data-[state=active]:bg-slate-700/50">Safety</TabsTrigger>
                <TabsTrigger value="technical" className="data-[state=active]:bg-slate-700/50">Technical</TabsTrigger>
                <TabsTrigger value="combinations" className="data-[state=active]:bg-slate-700/50">Combinations</TabsTrigger>
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
                        <h4 className="font-semibold text-white mb-2">LH Mimicry</h4>
                        <p className="text-slate-300 text-sm">
                          HCG mimics luteinizing hormone (LH) and binds to LH receptors 
                          in the testes and ovaries, stimulating hormone production.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Testosterone Stimulation</h4>
                        <p className="text-slate-300 text-sm">
                          In males, HCG stimulates Leydig cells in the testes to produce 
                          testosterone and maintain testicular function.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Ovulation Induction</h4>
                        <p className="text-slate-300 text-sm">
                          In females, HCG triggers ovulation by stimulating the final 
                          maturation of ovarian follicles and egg release.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Fertility Enhancement</h4>
                        <p className="text-slate-300 text-sm">
                          Supports natural fertility processes and can be used in 
                          assisted reproductive technology protocols.
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
                    {/* Standard Protocols */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Standard Dosing Protocols</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">TRT Support Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">250-500 IU</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">2x weekly</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">Ongoing</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Post-Cycle Therapy</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">1000-3000 IU</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">3x weekly</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">4-6 weeks</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-400 mb-2">Fertility Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">1000-2000 IU</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">3x weekly</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">3-6 months</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body Weight Dosing */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Dosing by Body Weight</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-cyan-400 mb-2">Standard Dosing (Male)</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">110 lbs:</span>
                                <span className="text-white">250 IU</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">154 lbs:</span>
                                <span className="text-white">350 IU</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">198 lbs:</span>
                                <span className="text-white">450 IU</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">220 lbs:</span>
                                <span className="text-white">500 IU</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-purple-400 mb-2">High-Dose Protocol (PCT)</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">110 lbs:</span>
                                <span className="text-white">1000 IU</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">154 lbs:</span>
                                <span className="text-white">1500 IU</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">198 lbs:</span>
                                <span className="text-white">2000 IU</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">220 lbs:</span>
                                <span className="text-white">2500 IU</span>
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
                          <h5 className="font-semibold text-cyan-400 mb-2">Subcutaneous Injection (Preferred)</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Use 27-30 gauge, 0.5 inch needle</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Inject into subcutaneous tissue of abdomen or thigh</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Rotate injection sites to prevent irritation</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Clean injection site with alcohol before administration</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Intramuscular Injection (Alternative)</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Use 25-27 gauge, 1-1.5 inch needle</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Inject into gluteus, vastus lateralis, or deltoid</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Preferred for larger volumes (>1ml)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reconstitution */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Reconstitution Guidelines</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-semibold text-cyan-400 mb-2">Option 1: 1000 IU/ml</h5>
                            <p className="text-slate-300 text-sm">Dilute 5000 IU in 5 ml bacteriostatic water</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-purple-400 mb-2">Option 2: 500 IU/ml</h5>
                            <p className="text-slate-300 text-sm">Dilute 5000 IU in 10 ml bacteriostatic water</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-green-400 mb-2">Option 3: 2000 IU/ml</h5>
                            <p className="text-slate-300 text-sm">Dilute 10000 IU in 5 ml bacteriostatic water</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cycling */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Cycling Protocols</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">TRT Support:</span>
                          <span className="text-white">Ongoing with testosterone therapy</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Post-Cycle Therapy:</span>
                          <span className="text-white">4-6 weeks, then reduce dose</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Fertility Treatment:</span>
                          <span className="text-white">3-6 months trials</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Maintenance:</span>
                          <span className="text-white">Individualized protocols</span>
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
                          <li className="text-slate-300">• Testosterone, LH, FSH levels</li>
                          <li className="text-slate-300">• Estradiol levels</li>
                          <li className="text-slate-300">• Hematocrit and hemoglobin</li>
                          <li className="text-slate-300">• Prostate specific antigen (men >40)</li>
                          <li className="text-slate-300">• Pregnancy test (women)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">During Treatment</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• Testosterone, estradiol every 6-8 weeks</li>
                          <li className="text-slate-300">• Estradiol, ultrasound monitoring (women)</li>
                          <li className="text-slate-300">• Watch for signs of OHSS (women)</li>
                          <li className="text-slate-300">• Hematocrit, lipid profile (long-term)</li>
                          <li className="text-slate-300">• Sperm analysis (fertility protocols)</li>
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
                        <Badge variant="outline" className="text-green-400 border-green-500/30">
                          {selectedProduct.researchStatus}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Key Research Findings</h4>
                          <div className="bg-slate-900/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Effective for male hypogonadotropic hypogonadism</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Successful ovulation induction in fertility treatment</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Maintains testicular function during TRT</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Supports post-cycle therapy recovery</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Clinical Applications</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-cyan-400 mb-1">Male Hypogonadism</h5>
                              <p className="text-slate-300 text-sm">250-500 IU twice weekly for ongoing support</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-purple-400 mb-1">Fertility Treatment</h5>
                              <p className="text-slate-300 text-sm">1000-2000 IU three times weekly for 3-6 months</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-green-400 mb-1">Post-Cycle Therapy</h5>
                              <p className="text-slate-300 text-sm">1000-3000 IU three times weekly for 4-6 weeks</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-yellow-400 mb-1">Ovulation Induction</h5>
                              <p className="text-slate-300 text-sm">5000-10000 IU single injection for trigger</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Research Limitations</h4>
                          <p className="text-slate-300 text-sm">
                            While HCG is FDA approved for specific indications, off-label use requires careful monitoring. 
                            Individual response may vary significantly. Estradiol management is crucial to prevent side effects. 
                            Not approved for weight loss in most countries.
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

              <TabsContent value="combinations" className="space-y-6 mt-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      Peptide Combinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Common Combination Protocols</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">Testosterone Replacement Therapy</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Often combined with <a href="/testosterone" className="text-cyan-400 hover:text-cyan-300 underline">testosterone</a> in men</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Maintains testicular function during TRT</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Dose: 250-500 IU twice weekly</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Fertility Protocols</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Used with <a href="/fsh" className="text-purple-400 hover:text-purple-300 underline">FSH</a> in fertility protocols</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">May require estradiol management</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Coordinate with comprehensive reproductive care</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3">Estradiol Management</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300">HCG can increase estradiol production</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300">Monitor estradiol levels regularly</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300">Consider aromatase inhibitor if levels elevated</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300">Target estradiol: 20-30 pg/ml in men</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3">Drug Interactions</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300">May interact with testosterone therapy</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300">Monitor when used with fertility drugs</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300">Consider timing with other hormones</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300">Coordinate with comprehensive hormone therapy</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3">Related Peptides</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="/aod-9604" className="bg-slate-900/50 p-4 rounded-lg hover:bg-slate-800/50 transition-colors">
                          <h5 className="font-semibold text-cyan-400 mb-1">AOD-9604</h5>
                          <p className="text-slate-300 text-sm">Fat metabolism peptide for weight management</p>
                        </a>
                        <a href="/bpc-157" className="bg-slate-900/50 p-4 rounded-lg hover:bg-slate-800/50 transition-colors">
                          <h5 className="font-semibold text-green-400 mb-1">BPC-157</h5>
                          <p className="text-slate-300 text-sm">Healing and recovery peptide</p>
                        </a>
                        <a href="/ghk-cu" className="bg-slate-900/50 p-4 rounded-lg hover:bg-slate-800/50 transition-colors">
                          <h5 className="font-semibold text-purple-400 mb-1">GHK-Cu</h5>
                          <p className="text-slate-300 text-sm">Anti-aging and skin health peptide</p>
                        </a>
                      </div>
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
                  HCG is FDA approved for specific indications but requires proper medical supervision. Always consult with a qualified 
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