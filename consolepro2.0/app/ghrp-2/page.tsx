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
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useIsMobile } from "@/hooks/use-mobile"

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

const ghrp2Info: ProductInfo = {
  name: "GHRP-2",
  scientificName: "Growth Hormone Releasing Peptide-2",
  category: "Growth Hormone Stimulator",
  description: "GHRP-2 is a synthetic hexapeptide that stimulates growth hormone release through the growth hormone secretagogue receptor (GHSR). It is one of the most potent growth hormone releasing peptides with demonstrated efficacy in clinical trials, capable of increasing growth hormone secretion by 7-15 times baseline levels. GHRP-2 works by binding to the GHSR receptor in the pituitary gland and hypothalamus, triggering a cascade that results in increased growth hormone production and release.",
  benefits: [
    "Stimulates growth hormone release (7-15x baseline increase)",
    "Enhanced body composition and muscle growth",
    "Improved appetite and food intake regulation",
    "Age-related growth hormone decline treatment",
    "Metabolic function improvement and insulin sensitivity",
    "Enhanced exercise capacity and recovery",
    "Better sleep quality and tissue regeneration",
    "Anti-aging effects through hormone optimization",
    "Pediatric growth hormone deficiency treatment",
    "Generally well-tolerated with minimal side effects"
  ],
  dosage: "0.1-0.2 mg three times daily (subcutaneous)",
  halfLife: "Approximately 15-30 minutes",
  administration: "Subcutaneous injection (primary), intranasal spray (alternative)",
  sideEffects: [
    "Generally well-tolerated in clinical trials",
    "Increased appetite (common and expected effect)",
    "Mild water retention (transient)",
    "Transient hyperglycemia (rare)",
    "Injection site reactions (mild, temporary)",
    "Potential increase in cortisol at high doses (>600 mcg/day)",
    "Rare: headache, nausea, dizziness"
  ],
  contraindications: [
    "Active malignancy",
    "Severe heart disease",
    "Uncontrolled diabetes",
    "Known hypersensitivity to GHRP-2",
    "Pregnancy/lactation (insufficient data)",
    "Not approved for human therapeutic use",
    "Research use only with proper oversight"
  ],
  researchStatus: "Clinical Research Phase",
  imageUrl: "/ghrp_2.png",
  gradientImageUrl: "/ghrp-2-gradient.jpg",
  molecularWeight: "1,017.2 Da",
  sequence: "D-Ala-D-βNal-Ala-Trp-D-Phe-Lys-NH2",
  storage: "Lyophilized: Store at -4°F, stable for 24+ months. Reconstituted: Store at 39°F, use within 28 days.",
  availability: "Available",
  price: "$199.99 per vial"
}

export default function GHRP2ProductPage() {
  const [selectedProduct] = useState<ProductInfo>(ghrp2Info)

  return (
    <DashboardLayout defaultSection="product-information">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="h-8 w-8 text-cyan-400" />
            GHRP-2 Product Information
          </h2>
          <p className="text-slate-400">
            Comprehensive information about GHRP-2, including research data, dosing guidelines, and safety information.
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
                  <span className="text-slate-300 text-sm">Potent growth hormone stimulation (7-15x baseline)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Enhanced body composition and muscle growth</span>
                </div>
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Improved appetite regulation and metabolic function</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Rapid onset (15-30 minutes) with sustained effects</span>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Suitable for both adult and pediatric applications</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700/50">
                <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="dosing" className="text-slate-300 data-[state=active]:text-white">Dosing</TabsTrigger>
                <TabsTrigger value="safety" className="text-slate-300 data-[state=active]:text-white">Safety</TabsTrigger>
                <TabsTrigger value="technical" className="text-slate-300 data-[state=active]:text-white">Technical</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Info className="h-6 w-6 text-blue-400" />
                      Product Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold">Primary Applications:</h4>
                        <ul className="text-slate-300 text-sm space-y-1">
                          <li>• Growth hormone deficiency treatment</li>
                          <li>• Body composition optimization</li>
                          <li>• Anti-aging and longevity protocols</li>
                          <li>• Athletic performance enhancement</li>
                          <li>• Pediatric growth disorders</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold">Mechanism of Action:</h4>
                        <ul className="text-slate-300 text-sm space-y-1">
                          <li>• Binds to GHSR receptor</li>
                          <li>• Stimulates pituitary GH release</li>
                          <li>• Increases IGF-1 production</li>
                          <li>• Enhances metabolic function</li>
                          <li>• Improves tissue regeneration</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                      Key Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProduct.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Dosing Tab */}
              <TabsContent value="dosing" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Pill className="h-6 w-6 text-purple-400" />
                      Dosing Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Standard Dosing Protocol</h4>
                      <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Dose:</span>
                            <span className="text-white ml-2">0.1-0.2 mg per injection</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Frequency:</span>
                            <span className="text-white ml-2">3 times daily</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Timing:</span>
                            <span className="text-white ml-2">Morning, pre-workout, bedtime</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Duration:</span>
                            <span className="text-white ml-2">12-16 weeks with 4-week breaks</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Body Weight Dosing Table</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-600">
                              <th className="text-left text-slate-300 p-2">Body Weight</th>
                              <th className="text-left text-slate-300 p-2">Low Dose (mg)</th>
                              <th className="text-left text-slate-300 p-2">High Dose (mg)</th>
                              <th className="text-left text-slate-300 p-2">Volume (0.1 mg/ml)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-700/50">
                              <td className="text-white p-2">110 lbs</td>
                              <td className="text-white p-2">0.05</td>
                              <td className="text-white p-2">0.10</td>
                              <td className="text-white p-2">0.5-1.0 ml</td>
                            </tr>
                            <tr className="border-b border-slate-700/50">
                              <td className="text-white p-2">154 lbs</td>
                              <td className="text-white p-2">0.07</td>
                              <td className="text-white p-2">0.14</td>
                              <td className="text-white p-2">0.7-1.4 ml</td>
                            </tr>
                            <tr className="border-b border-slate-700/50">
                              <td className="text-white p-2">198 lbs</td>
                              <td className="text-white p-2">0.09</td>
                              <td className="text-white p-2">0.18</td>
                              <td className="text-white p-2">0.9-1.8 ml</td>
                            </tr>
                            <tr>
                              <td className="text-white p-2">220 lbs</td>
                              <td className="text-white p-2">0.10</td>
                              <td className="text-white p-2">0.20</td>
                              <td className="text-white p-2">1.0-2.0 ml</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Administration Guidelines</h4>
                      <div className="space-y-3">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h5 className="text-white font-medium mb-2">Injection Technique:</h5>
                          <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Use 27-30 gauge, 0.5 inch needle</li>
                            <li>• Clean injection site with alcohol</li>
                            <li>• Inject into subcutaneous tissue of abdomen or thigh</li>
                            <li>• Rotate injection sites to prevent lipodystrophy</li>
                            <li>• Inject slowly over 10-15 seconds</li>
                          </ul>
                        </div>
                        
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h5 className="text-white font-medium mb-2">Optimal Timing Schedule:</h5>
                          <ul className="text-slate-300 text-sm space-y-1">
                            <li>• <strong>Dose 1:</strong> Upon waking (fasted)</li>
                            <li>• <strong>Dose 2:</strong> Pre-workout or mid-afternoon</li>
                            <li>• <strong>Dose 3:</strong> Before bedtime (fasted)</li>
                            <li>• <strong>Spacing:</strong> Minimum 3-4 hours between doses</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Safety Tab */}
              <TabsContent value="safety" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                      Safety Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Baseline Testing Required</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-slate-700/30 rounded-lg p-3">
                          <ul className="text-slate-300 text-sm space-y-1">
                            <li>• IGF-1 and IGFBP-3 levels</li>
                            <li>• Growth hormone stimulation test</li>
                            <li>• Comprehensive metabolic panel</li>
                            <li>• Thyroid function tests</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3">
                          <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Cortisol and prolactin levels</li>
                            <li>• Cardiovascular assessment</li>
                            <li>• Blood glucose monitoring</li>
                            <li>• Blood pressure assessment</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Monitoring During Treatment</h4>
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <ul className="text-slate-300 text-sm space-y-2">
                          <li>• <strong>IGF-1 levels:</strong> Every 4-6 weeks</li>
                          <li>• <strong>Growth velocity:</strong> For pediatric patients</li>
                          <li>• <strong>Body composition analysis:</strong> Regular assessment</li>
                          <li>• <strong>Blood glucose:</strong> Monitor for changes</li>
                          <li>• <strong>Blood pressure:</strong> Regular assessment</li>
                          <li>• <strong>Cortisol and prolactin:</strong> Monitor levels</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Contraindications</h4>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <ul className="text-red-300 text-sm space-y-1">
                          {selectedProduct.contraindications.map((contraindication, index) => (
                            <li key={index}>• {contraindication}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Adverse Effects</h4>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <ul className="text-yellow-300 text-sm space-y-1">
                          {selectedProduct.sideEffects.map((effect, index) => (
                            <li key={index}>• {effect}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Special Considerations</h4>
                      <div className="space-y-3">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h5 className="text-white font-medium mb-2">Appetite Enhancement:</h5>
                          <p className="text-slate-300 text-sm">GHRP-2 significantly increases appetite. Monitor food intake and body weight. May be beneficial for cachexia or eating disorders.</p>
                        </div>
                        
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h5 className="text-white font-medium mb-2">Desensitization Risk:</h5>
                          <p className="text-slate-300 text-sm">Less prone to desensitization than other GHRPs. Monitor GH response over time and consider cycling protocols for long-term use.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Technical Tab */}
              <TabsContent value="technical" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <FileText className="h-6 w-6 text-cyan-400" />
                      Technical Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Molecular Information</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Molecular Weight:</span>
                            <span className="text-white">{selectedProduct.molecularWeight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Sequence:</span>
                            <span className="text-white text-sm">{selectedProduct.sequence}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Category:</span>
                            <span className="text-white">{selectedProduct.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Pharmacokinetics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Half-life:</span>
                            <span className="text-white">{selectedProduct.halfLife}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Peak Time:</span>
                            <span className="text-white">15-30 minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Duration:</span>
                            <span className="text-white">2-3 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Storage and Stability</h4>
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-white font-medium">Lyophilized Form:</h5>
                            <p className="text-slate-300 text-sm">Store at -4°F, stable for 24+ months</p>
                          </div>
                          <div>
                            <h5 className="text-white font-medium">Reconstituted Form:</h5>
                            <p className="text-slate-300 text-sm">Store at 39°F, use within 28 days</p>
                          </div>
                          <div>
                            <h5 className="text-white font-medium">Stability:</h5>
                            <p className="text-slate-300 text-sm">Maintain proper storage for optimal potency</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Research Status</h4>
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-white font-medium">Current Status:</h5>
                            <p className="text-slate-300 text-sm">{selectedProduct.researchStatus}</p>
                          </div>
                          <div>
                            <h5 className="text-white font-medium">Clinical Evidence:</h5>
                            <p className="text-slate-300 text-sm">Demonstrated efficacy in growth hormone stimulation with 7-15 fold increase over baseline levels</p>
                          </div>
                          <div>
                            <h5 className="text-white font-medium">Safety Profile:</h5>
                            <p className="text-slate-300 text-sm">Generally well-tolerated in clinical trials with minimal adverse effects</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Clinical Applications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h5 className="text-white font-medium mb-2">Adult Applications:</h5>
                          <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Growth hormone deficiency</li>
                            <li>• Body composition optimization</li>
                            <li>• Anti-aging protocols</li>
                            <li>• Athletic performance</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h5 className="text-white font-medium mb-2">Pediatric Applications:</h5>
                          <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Short stature treatment</li>
                            <li>• Growth hormone deficiency</li>
                            <li>• Growth velocity improvement</li>
                            <li>• Height optimization</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-red-400 font-semibold">Important Disclaimer</h4>
                <p className="text-red-300 text-sm leading-relaxed">
                  GHRP-2 is a research compound and is not approved for human therapeutic use by the FDA or other regulatory agencies. 
                  This information is provided for educational and research purposes only. The use of GHRP-2 should only be conducted 
                  under the supervision of qualified healthcare professionals in appropriate research settings. 
                  Always consult with a healthcare provider before considering any peptide therapy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
