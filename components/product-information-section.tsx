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
  ExternalLink
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

const bpc157Info: ProductInfo = {
  name: "BPC-157",
  scientificName: "Body Protection Compound 157 (PL 14736)",
  category: "Tissue Repair Peptide",
  description: "BPC-157 is a synthetic pentadecapeptide derived from a protective protein found in gastric juice, known as Body Protection Compound. This 15-amino-acid sequence is optimized for stability and bioactivity, particularly in gastrointestinal and musculoskeletal contexts, where it promotes tissue repair and angiogenesis through multiple pathways.",
  benefits: [
    "50% faster tendon healing in animal studies",
    "60% faster gastric ulcer recovery",
    "Enhanced angiogenesis and tissue repair",
    "Reduced inflammation without systemic effects",
    "Promotes fibroblast migration and collagen production",
    "Safe at high doses (>100 µg/kg/day in rats)",
    "No hepatic, renal, or neurological toxicities",
    "Potential neurological and cardiovascular benefits"
  ],
  dosage: "200-800 mcg per day (research-based dosing)",
  halfLife: "Less than 30 minutes",
  administration: "Subcutaneous, intraperitoneal, or oral routes",
  sideEffects: [
    "No significant side effects reported in animal studies",
    "Well-tolerated at therapeutic doses",
    "No hepatic, renal, or neurological toxicities",
    "Limited long-term human data available"
  ],
  contraindications: [
    "Not approved for human therapeutic use",
    "Research use only with IRB/IACUC oversight",
    "No specific contraindications beyond regulatory limits",
    "Limited human safety data"
  ],
  researchStatus: "Preclinical (Animal Studies Only)",
  imageUrl: "/bpc157.png",
  gradientImageUrl: "/bpc-157-gradient.jpg",
  molecularWeight: "1,419.6 Da",
  sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
  storage: "Store at -20°C, avoid repeated freeze-thaw cycles",
  availability: "Available",
  price: "$199.99 per vial"
}

const cagrilintideInfo: ProductInfo = {
  name: "Cagrilintide",
  scientificName: "Cagrilintide (AMG 133)",
  category: "GLP-1 Receptor Agonist",
  description: "Cagrilintide is a novel investigational peptide that acts as a dual agonist targeting both the glucagon-like peptide-1 (GLP-1) and amylin receptors. It represents a new class of weight management therapeutics that combines the benefits of both pathways for enhanced efficacy.",
  benefits: [
    "Significant weight loss in clinical trials",
    "Improved glycemic control",
    "Reduced appetite and food intake",
    "Enhanced satiety signals",
    "Potential cardiovascular benefits",
    "Long-acting formulation requiring weekly administration",
    "Gradual dose escalation improves tolerability",
    "Minimizes gastrointestinal side effects"
  ],
  dosage: "2.4 mg once weekly (maintenance dose after 16-week escalation)",
  halfLife: "Approximately 7-8 days",
  administration: "Subcutaneous injection in the abdomen, thigh, or upper arm",
  sideEffects: [
    "Nausea and vomiting (typically mild to moderate)",
    "Diarrhea",
    "Constipation",
    "Injection site reactions",
    "Headache",
    "Fatigue"
  ],
  contraindications: [
    "Personal or family history of medullary thyroid carcinoma",
    "Multiple Endocrine Neoplasia syndrome type 2",
    "Severe gastrointestinal disease",
    "Pregnancy and breastfeeding",
    "Severe renal impairment"
  ],
  researchStatus: "Phase 3 Clinical Trials",
  imageUrl: "/cagrilintide.png",
  gradientImageUrl: "/cagrilintide-gradient.jpg",
  molecularWeight: "4,123 Da",
  sequence: "H-His-Gly-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys-Glu-Phe-Ile-Ala-Trp-Leu-Val-Lys-Gly-Arg-Gly-OH",
  storage: "Store at 2-8°C (36-46°F). Do not freeze. Protect from light.",
  availability: "Available",
  price: "$299.99 per vial"
}

export function ProductInformationSection() {
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo>(bpc157Info)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Pill className="h-8 w-8 text-cyan-400" />
          Product Information
        </h2>
        <p className="text-slate-400">
          Comprehensive information about our peptide products, including research data, dosing guidelines, and safety information.
        </p>
      </div>

      {/* Product Selection */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Select Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedProduct.name === "BPC-157" ? "default" : "outline"}
              onClick={() => setSelectedProduct(bpc157Info)}
              className="flex items-center gap-2"
            >
              <Pill className="h-4 w-4" />
              BPC-157
            </Button>
            <Button
              variant={selectedProduct.name === "Cagrilintide" ? "default" : "outline"}
              onClick={() => setSelectedProduct(cagrilintideInfo)}
              className="flex items-center gap-2"
            >
              <Pill className="h-4 w-4" />
              Cagrilintide
            </Button>
            {/* Add more products here as needed */}
          </div>
        </CardContent>
      </Card>

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
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700/50">Overview</TabsTrigger>
              <TabsTrigger value="benefits" className="data-[state=active]:bg-slate-700/50">Benefits</TabsTrigger>
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
                    <Clock className="h-5 w-5 text-cyan-400" />
                    Administration & Dosing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProduct.name === "BPC-157" ? (
                    <>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Research-Based Dosing Guidelines</h4>
                        <div className="bg-slate-900/50 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Low Dose:</span>
                            <span className="text-white font-medium">200-400 mcg per day</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Standard Dose:</span>
                            <span className="text-white font-medium">400-600 mcg per day</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">High Dose:</span>
                            <span className="text-white font-medium">600-800 mcg per day</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-700/50 pt-2">
                            <span className="text-slate-400">Animal Research:</span>
                            <span className="text-white font-medium">10 mcg/kg/day in rats</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Administration Methods</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="text-white font-medium">Subcutaneous:</span>
                              <span className="text-slate-300 text-sm"> Preferred method for optimal absorption</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="text-white font-medium">Oral:</span>
                              <span className="text-slate-300 text-sm"> Effective for gut health applications</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="text-white font-medium">Intraperitoneal:</span>
                              <span className="text-slate-300 text-sm"> Alternative injection route</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Treatment Duration</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Acute Healing:</span>
                            <span className="text-white font-medium">2-4 weeks</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Chronic Conditions:</span>
                            <span className="text-white font-medium">4-8 weeks</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Maximum Studied:</span>
                            <span className="text-white font-medium">14+ days in animals</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Standard Dosing Schedule (16-week escalation)</h4>
                        <div className="bg-slate-900/50 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Week 1-4:</span>
                            <span className="text-white font-medium">0.25 mg once weekly</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Week 5-8:</span>
                            <span className="text-white font-medium">0.5 mg once weekly</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Week 9-12:</span>
                            <span className="text-white font-medium">1.0 mg once weekly</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Week 13-16:</span>
                            <span className="text-white font-medium">1.7 mg once weekly</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-700/50 pt-2">
                            <span className="text-slate-400">Week 17 onwards:</span>
                            <span className="text-white font-medium">2.4 mg once weekly (maintenance)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Administration Method</h4>
                        <p className="text-slate-300">{selectedProduct.administration}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Dosing Options</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="text-white font-medium">Monotherapy:</span>
                              <span className="text-slate-300 text-sm"> Studied at 0.3, 0.6, 1.2, 2.4, and 4.5 mg weekly</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="text-white font-medium">Combination (CagriSema):</span>
                              <span className="text-slate-300 text-sm"> 2.4 mg weekly with semaglutide 2.4 mg</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-6 mt-6">
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
                    
                    {selectedProduct.name === "BPC-157" ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Key Research Findings</h4>
                          <div className="bg-slate-900/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">50% faster tendon healing in rats (Sikiric et al., 2017)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">60% faster gastric ulcer recovery</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">Enhanced angiogenesis and tissue repair</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">No toxicity at >100 µg/kg/day in rats</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Mechanism of Action</h4>
                          <p className="text-slate-300 text-sm">
                            BPC-157 promotes tissue repair through upregulation of VEGF, EGF, and nitric oxide synthesis. 
                            It enhances fibroblast migration, collagen production, and endothelial cell proliferation without 
                            systemic growth effects.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Animal Models Tested</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Rats</Badge>
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Mice</Badge>
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Rabbits</Badge>
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Cell Cultures</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Research Limitations</h4>
                          <p className="text-slate-300 text-sm">
                            Limited to preclinical animal models. No human clinical trials conducted. 
                            Small sample sizes (10-20 rats per group). Long-term safety data needed.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-300 text-sm">
                        This product is currently in clinical development. All information provided is based on available research data and should not be considered as medical advice.
                      </p>
                    )}
                    
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
                Always consult with a qualified healthcare professional before starting any new treatment. 
                The information provided may not be complete or up-to-date with the latest research findings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 