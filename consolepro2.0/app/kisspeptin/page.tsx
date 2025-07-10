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
  Heart,
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

const kisspeptinInfo: ProductInfo = {
  name: "Kisspeptin-10",
  scientificName: "Kisspeptin-10 (Metastin)",
  category: "Reproductive Hormone Peptide",
  description: "Kisspeptin-10 is a 10 amino acid peptide that acts as a potent stimulator of gonadotropin-releasing hormone (GnRH) secretion. It regulates the hypothalamic-pituitary-gonadal axis and has shown therapeutic potential for reproductive disorders, sexual function enhancement, and fertility treatment. Kisspeptin-10 plays a crucial role in the regulation of puberty, reproductive function, and sexual behavior through its action on the hypothalamic-pituitary-gonadal axis.",
  benefits: [
    "Stimulates GnRH secretion and regulates reproductive hormones",
    "Enhances sexual arousal and function in both genders",
    "Supports fertility treatment and ovulation induction",
    "Treats hypogonadotropic hypogonadism",
    "Improves testosterone and estrogen production",
    "Regulates menstrual cycles and reproductive function",
    "Supports puberty development and sexual maturation",
    "Enhances libido and sexual performance",
    "Assists in fertility treatments and reproductive medicine",
    "Generally well-tolerated with minimal side effects"
  ],
  dosage: "0.05-0.2 mg per injection, 2-3 times weekly",
  halfLife: "Approximately 4-6 hours",
  administration: "Subcutaneous injection (primary route)",
  sideEffects: [
    "Generally well-tolerated in clinical trials",
    "Minimal side effects reported at recommended doses",
    "Potential for desensitization with chronic high-dose use",
    "Injection site reactions (mild, transient)",
    "No significant safety concerns at recommended doses"
  ],
  contraindications: [
    "Pregnancy (unless specifically indicated for fertility treatment)",
    "Active hormone-sensitive malignancies",
    "Uncontrolled cardiovascular disease",
    "Known hypersensitivity to kisspeptin",
    "Not approved for human therapeutic use in most countries",
    "Research use only with proper oversight"
  ],
  researchStatus: "Clinical Research Phase",
  imageUrl: "/kisspeptin_10.png",
  gradientImageUrl: "/kisspeptin-gradient.jpg",
  molecularWeight: "1,147.3 Da",
  sequence: "Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe",
  storage: "Lyophilized: Store at -4°F, stable for 24+ months. Reconstituted: Store at 39°F, use within 28 days. Room temperature: Stable for 3 weeks unreconstituted.",
  availability: "Available",
  price: "$299.99 per vial",
  combinations: [
    "Can be combined with <Link href='/hcg' className='text-cyan-400 hover:text-cyan-300 underline'>HCG</Link> for enhanced fertility treatment",
    "May be used with <Link href='/hgh' className='text-cyan-400 hover:text-cyan-300 underline'>HGH</Link> for comprehensive hormone optimization",
    "Compatible with <Link href='/ghrp-2' className='text-cyan-400 hover:text-cyan-300 underline'>GHRP-2</Link> for synergistic effects on growth hormone and reproductive hormones"
  ]
}

export default function KisspeptinProductPage() {
  const [selectedProduct] = useState<ProductInfo>(kisspeptinInfo)

  return (
    <DashboardLayout defaultSection="product-information">
      <div className="space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-400" />
            Kisspeptin-10 Product Information
          </h2>
          <p className="text-slate-400">
            Comprehensive information about Kisspeptin-10, including research data, dosing guidelines, and safety information.
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
                      <Badge variant="secondary" className="bg-pink-500/20 text-pink-400 border-pink-500/30">
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
                  <Heart className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Potent GnRH stimulator for reproductive health</span>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Enhances sexual function and fertility</span>
                </div>
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Regulates hypothalamic-pituitary-gonadal axis</span>
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
                        <h4 className="font-semibold text-white mb-2">GnRH Stimulation</h4>
                        <p className="text-slate-300 text-sm">
                          Binds to kisspeptin receptors (GPR54) in the hypothalamus, 
                          triggering the release of gonadotropin-releasing hormone.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Hormone Regulation</h4>
                        <p className="text-slate-300 text-sm">
                          Stimulates the pituitary gland to release LH and FSH, 
                          which regulate testosterone and estrogen production.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Reproductive Function</h4>
                        <p className="text-slate-300 text-sm">
                          Plays a crucial role in puberty onset, sexual maturation, 
                          and maintenance of reproductive function.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Sexual Behavior</h4>
                        <p className="text-slate-300 text-sm">
                          Influences sexual arousal, libido, and reproductive behavior 
                          through central nervous system effects.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedProduct.combinations && (
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-purple-400" />
                        Combination Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProduct.combinations.map((combination, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300" dangerouslySetInnerHTML={{ __html: combination }} />
                          </div>
                        ))}
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
                          <h5 className="font-semibold text-cyan-400 mb-2">Standard Research Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.1-0.2 mg per injection</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">2-3 times weekly</span></div>
                            <div><span className="text-slate-400">Concentration:</span> <span className="text-white">0.2 mg/ml</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Low-Dose Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.07 mg (154 lb adult)</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">Daily or every other day</span></div>
                            <div><span className="text-slate-400">Concentration:</span> <span className="text-white">0.1 mg/ml</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-400 mb-2">High-Response Protocol</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.2-0.3 mg per injection</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">2 times weekly</span></div>
                            <div><span className="text-slate-400">Concentration:</span> <span className="text-white">0.5 mg/ml</span></div>
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
                            <h5 className="font-semibold text-purple-400 mb-2">Conservative Dosing (0.225 mcg/lb)</h5>
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
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-green-400 mb-2">High-Dose Protocol (0.9 mcg/lb)</h5>
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
                              <span className="text-slate-300">Inject into abdomen, thigh, or upper arm (rotate sites)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Inject slowly over 10-15 seconds</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Optimal timing: Empty stomach (2-3 hours post-meal)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Reconstitution Options</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Option 1: 0.2 mg/ml (1 mg in 5 ml bacteriostatic water)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Option 2: 0.1 mg/ml (1 mg in 10 ml bacteriostatic water)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">Option 3: 0.5 mg/ml (5 mg in 10 ml bacteriostatic water)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Applications */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Special Applications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-cyan-400 mb-2">Male Hypogonadism</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.1-0.15 mg per injection</span></div>
                            <div><span className="text-slate-400">Frequency:</span> <span className="text-white">3 times weekly</span></div>
                            <div><span className="text-slate-400">Duration:</span> <span className="text-white">4-12 weeks with monitoring</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-2">Female Fertility Support</h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.05-0.1 mg per injection</span></div>
                            <div><span className="text-slate-400">Timing:</span> <span className="text-white">Cycle-specific administration</span></div>
                            <div><span className="text-slate-400">Monitoring:</span> <span className="text-white">Required with ultrasound and hormones</span></div>
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
                          <span className="text-white">4-12 weeks on, 2-4 weeks off</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Desensitization Prevention:</span>
                          <span className="text-white">Use lowest effective dose</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Monitoring:</span>
                          <span className="text-white">Regular hormone response assessment</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Long-term:</span>
                          <span className="text-white">Individual assessment required</span>
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
                          <li className="text-slate-300">• LH, FSH, testosterone/estradiol levels</li>
                          <li className="text-slate-300">• Liver function tests</li>
                          <li className="text-slate-300">• Cardiovascular assessment</li>
                          <li className="text-slate-300">• Pregnancy test (females of reproductive age)</li>
                          <li className="text-slate-300">• Comprehensive hormone panel</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">During Treatment</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="text-slate-300">• Hormone levels at 2-4 week intervals</li>
                          <li className="text-slate-300">• Blood pressure and heart rate</li>
                          <li className="text-slate-300">• Sexual function assessment</li>
                          <li className="text-slate-300">• Side effect evaluation</li>
                          <li className="text-slate-300">• Reproductive function monitoring</li>
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
                              <span className="text-slate-300 text-sm">Potent stimulator of GnRH secretion in clinical trials</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Effective for treating hypogonadotropic hypogonadism</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Enhances sexual function and fertility in both genders</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Well-tolerated with minimal side effects</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Clinical Applications</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-cyan-400 mb-1">Male Hypogonadism</h5>
                              <p className="text-slate-300 text-sm">0.1-0.15 mg per injection, 3 times weekly</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-purple-400 mb-1">Female Fertility</h5>
                              <p className="text-slate-300 text-sm">0.05-0.1 mg per injection, cycle-specific</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-green-400 mb-1">Sexual Function</h5>
                              <p className="text-slate-300 text-sm">0.1-0.2 mg per injection, 2-3 times weekly</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                              <h5 className="font-semibold text-yellow-400 mb-1">Reproductive Health</h5>
                              <p className="text-slate-300 text-sm">0.07 mg daily or every other day</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Research Limitations</h4>
                          <p className="text-slate-300 text-sm">
                            Limited long-term human safety data. Most studies focus on short-term reproductive outcomes. 
                            Individual response may vary significantly. Not approved for therapeutic use in most countries. 
                            Desensitization may occur with chronic high-dose use.
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
                  Kisspeptin-10 is not approved for human therapeutic use in most countries. Always consult with a qualified 
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