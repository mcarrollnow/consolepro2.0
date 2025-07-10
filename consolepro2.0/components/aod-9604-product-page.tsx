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
  Zap
} from "lucide-react"
import Image from "next/image"

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

const aod9604Info: ProductInfo = {
  name: "AOD-9604",
  scientificName: "Anti-Obesity Drug-9604 (HGH Fragment 176-191)",
  category: "Fat Metabolism Peptide",
  description: "AOD-9604 is a synthetic peptide derived from the C-terminal fragment of human growth hormone (amino acids 176-191). It stimulates lipolysis (fat breakdown) and inhibits lipogenesis (fat formation) without affecting blood sugar or IGF-1 levels. This targeted approach makes it unique among weight management peptides, offering fat loss benefits without the systemic effects of full growth hormone.",
  benefits: [
    "Stimulates lipolysis via beta-3 adrenergic receptors",
    "Inhibits lipogenesis in adipocytes without affecting glucose metabolism",
    "Preserves lean muscle mass during weight loss",
    "No impact on blood glucose or insulin sensitivity",
    "Enhanced fat oxidation during exercise",
    "Improved body composition when combined with resistance training",
    "Cartilage repair and joint health support",
    "Anti-aging and regenerative effects",
    "Generally well-tolerated with minimal side effects",
    "No serious adverse events reported at recommended doses"
  ],
  dosage: "0.3-0.5 mg daily (research-based dosing)",
  halfLife: "Approximately 30-60 minutes",
  administration: "Subcutaneous injection (primary) or intranasal spray",
  sideEffects: [
    "Generally well-tolerated in clinical trials",
    "Injection site reactions (mild, transient)",
    "Rare: headache, nausea, dizziness",
    "No significant impact on blood glucose or growth",
    "No serious adverse events reported at recommended doses"
  ],
  contraindications: [
    "Known hypersensitivity to AOD-9604",
    "Active malignancy (relative contraindication)",
    "Severe cardiovascular disease",
    "Pregnancy/lactation (insufficient data)",
    "Not approved for human therapeutic use",
    "Research use only with proper oversight"
  ],
  researchStatus: "Clinical Research Phase",
  imageUrl: "/aod-9604.png",
  gradientImageUrl: "/aod-9604-gradient.jpg",
  molecularWeight: "1,817.9 Da",
  sequence: "Phe-Leu-Arg-Ile-Val-Gln-Cys-Arg-Ser-Val-Glu-Gly-Ser-Cys-Gly-Phe",
  storage: "Lyophilized: Store at -4°F, stable for 24+ months. Reconstituted: Store at 39°F, use within 28 days.",
  availability: "Available",
  price: "$249.99 per vial"
}

export function AOD9604ProductPage() {
  const [selectedProduct] = useState<ProductInfo>(aod9604Info)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Activity className="h-8 w-8 text-cyan-400" />
          AOD-9604 Product Information
        </h2>
        <p className="text-slate-400">
          Comprehensive information about AOD-9604, including research data, dosing guidelines, and safety information.
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
                <span className="text-slate-300 text-sm">Targeted fat metabolism without systemic effects</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Preserves lean muscle mass during weight loss</span>
              </div>
              <div className="flex items-start gap-2">
                <Activity className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Enhanced exercise performance and recovery</span>
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
                      <h4 className="font-semibold text-white mb-2">Lipolysis Stimulation</h4>
                      <p className="text-slate-300 text-sm">
                        Activates beta-3 adrenergic receptors in adipose tissue, 
                        triggering the breakdown of stored fat into free fatty acids.
                      </p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Lipogenesis Inhibition</h4>
                      <p className="text-slate-300 text-sm">
                        Prevents the formation of new fat cells and reduces 
                        fat storage in existing adipocytes.
                      </p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Metabolic Enhancement</h4>
                      <p className="text-slate-300 text-sm">
                        Increases metabolic rate and fat oxidation without 
                        affecting glucose metabolism or insulin sensitivity.
                      </p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Muscle Preservation</h4>
                      <p className="text-slate-300 text-sm">
                        Maintains lean muscle mass during weight loss by 
                        targeting fat-specific metabolic pathways.
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
                        <h5 className="font-semibold text-cyan-400 mb-2">Weight Loss Protocol</h5>
                        <div className="space-y-1 text-sm">
                          <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.3 mg daily</span></div>
                          <div><span className="text-slate-400">Duration:</span> <span className="text-white">8-12 weeks</span></div>
                          <div><span className="text-slate-400">Frequency:</span> <span className="text-white">Once daily</span></div>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-400 mb-2">Fat Loss Protocol</h5>
                        <div className="space-y-1 text-sm">
                          <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.5 mg daily</span></div>
                          <div><span className="text-slate-400">Duration:</span> <span className="text-white">6-8 weeks</span></div>
                          <div><span className="text-slate-400">Frequency:</span> <span className="text-white">Once daily</span></div>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h5 className="font-semibold text-green-400 mb-2">Maintenance Protocol</h5>
                        <div className="space-y-1 text-sm">
                          <div><span className="text-slate-400">Dose:</span> <span className="text-white">0.25 mg daily</span></div>
                          <div><span className="text-slate-400">Duration:</span> <span className="text-white">Long-term</span></div>
                          <div><span className="text-slate-400">Frequency:</span> <span className="text-white">5 days/week</span></div>
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
                          <h5 className="font-semibold text-cyan-400 mb-2">Standard Dosing (1.36 mcg/lb)</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">110 lbs:</span>
                              <span className="text-white">0.15 mg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">154 lbs:</span>
                              <span className="text-white">0.21 mg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">198 lbs:</span>
                              <span className="text-white">0.27 mg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">220 lbs:</span>
                              <span className="text-white">0.30 mg</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-purple-400 mb-2">High-Dose Protocol (2.27 mcg/lb)</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">110 lbs:</span>
                              <span className="text-white">0.25 mg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">154 lbs:</span>
                              <span className="text-white">0.35 mg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">198 lbs:</span>
                              <span className="text-white">0.45 mg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">220 lbs:</span>
                              <span className="text-white">0.50 mg</span>
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
                            <span className="text-slate-300">Use 27-31 gauge, 0.5 inch needle</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300">Inject into subcutaneous tissue of abdomen or thigh</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300">Rotate injection sites to prevent lipodystrophy</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300">Optimal timing: Empty stomach, morning administration</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-400 mb-2">Intranasal Spray (Alternative)</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300">Dose: 0.1-0.2 mg per spray</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300">Frequency: 2-3 sprays daily</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300">Lower bioavailability than injection</span>
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
                        <span className="text-white">8-12 weeks on, 2-4 weeks off</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Continuous Use:</span>
                        <span className="text-white">Monitor for effectiveness plateau</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Break Periods:</span>
                        <span className="text-white">Allow metabolic reset</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Long-term:</span>
                        <span className="text-white">Periodic dose holidays recommended</span>
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
                        <li className="text-slate-300">• Lipid profile</li>
                        <li className="text-slate-300">• Thyroid function tests</li>
                        <li className="text-slate-300">• Body composition analysis</li>
                        <li className="text-slate-300">• Cardiovascular assessment</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">During Treatment</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="text-slate-300">• Monthly weight and body composition</li>
                        <li className="text-slate-300">• Quarterly lipid profile</li>
                        <li className="text-slate-300">• Blood glucose monitoring</li>
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
                            <span className="text-slate-300 text-sm">Significant fat loss in clinical trials</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">No impact on blood glucose or IGF-1 levels</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">Preserved lean muscle mass during weight loss</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">Enhanced exercise performance and recovery</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Clinical Applications</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-cyan-400 mb-1">Obesity Treatment</h5>
                            <p className="text-slate-300 text-sm">0.3-0.5 mg daily for 12-24 weeks</p>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-purple-400 mb-1">Body Composition</h5>
                            <p className="text-slate-300 text-sm">0.25-0.3 mg daily for 8-16 weeks</p>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-green-400 mb-1">Metabolic Enhancement</h5>
                            <p className="text-slate-300 text-sm">0.2-0.3 mg daily for 12+ weeks</p>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-yellow-400 mb-1">Joint Support</h5>
                            <p className="text-slate-300 text-sm">0.25 mg daily for 16-24 weeks</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Research Limitations</h4>
                        <p className="text-slate-300 text-sm">
                          Limited long-term human safety data. Most studies are short-term (8-12 weeks). 
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
                AOD-9604 is not approved for human therapeutic use in most countries. Always consult with a qualified 
                healthcare professional before starting any new treatment. The information provided may not be complete 
                or up-to-date with the latest research findings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 