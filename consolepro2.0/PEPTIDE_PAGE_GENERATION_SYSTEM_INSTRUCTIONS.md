# Peptide Page Generation System Instructions

## Overview
You are tasked with automatically generating comprehensive product pages for every peptide in the `@/Peptide Research` directory. Each peptide should get its own dedicated page following the exact design pattern established for AOD-9604. This process should be completed one peptide at a time, with a new chat started for each peptide to maintain optimal memory space and prevent stalling.

## Core Requirements
- **NO USER APPROVAL REQUIRED**: Execute all steps automatically without waiting for user confirmation
- **COMPLETE EACH PEPTIDE FULLY**: Do not stop until the entire process is complete for each peptide
- **PUSH TO GIT**: Every peptide page must be successfully committed and pushed before moving to the next
- **NEW CHAT PER PEPTIDE**: Start a fresh chat for each new peptide to maintain memory efficiency
- **FOLLOW EXACT PATTERN**: Use the AOD-9604 implementation as the template for all peptides
-**DOCUMENT COMPLETION OF PEPTIDE**: When you complete each peptide page, document your completion by adding (Already completed) to the right of the Peptide on the Peptide List you are following to complete. Save this document so that the next chat will start at the next one in queue.
-**YOU MUST ADD THIS SECTION**: Athough AOD-9604 is a template, an importangt piece was left out and you must include in every page moving forward. There is data in the dosing-guide.md file in each peptide folder that talks about combinations with other peptides. Include all of the content regarding that and make the other peptides names clickable so the user can click the name and it directs the user to that peptides research page. 


## Reference Implementation
The AOD-9604 implementation serves as the complete reference for all future peptide pages. This implementation demonstrates:

### Key Implementation Details
- **File Structure**: `app/aod-9604/page.tsx` with complete React component
- **Data Extraction**: Comprehensive parsing of dosing guidelines and research data
- **Navigation Integration**: Proper sidebar sub-item addition under Product Info
- **Image Management**: Gradient image copying and product image verification
- **Git Operations**: Successful commit and push workflow
- **Quality Standards**: Complete tabs (Overview, Dosing, Safety, Technical) with comprehensive data

### Technical Patterns Established
- ProductInfo interface with all required fields
- Responsive design with proper mobile compatibility
- Consistent styling matching the established design system
- Proper error handling and data validation
- SEO-friendly structure and meta information

## Process Flow for Each Peptide

### Step 1: Analyze Peptide Research Files
1. **Locate peptide directory**: Find the peptide folder in `Peptide Research/[Peptide Name] - Peptide Standard_files/`
2. **Read dosing guidelines**: Look for `[peptide_name]_dosing_guidelines.md` or similar dosing files
3. **Extract key information**:
   - Scientific name and category
   - Description and mechanism of action
   - Benefits and clinical applications
   - Dosing protocols and administration methods
   - Side effects and contraindications
   - Research status and limitations
   - Molecular weight and amino acid sequence
   - Storage instructions
   -Include all combination therapy data from dosing guides and making any peptides that exist in the list to be clickable to their page

### Step 2: Check Existing Resources
1. **Verify image exists**: Check if `[peptide_name].png` exists in `public/` directory
2. **Copy gradient image**: Copy `[peptide_name]-gradient.jpg` from research files to `public/` directory
3. **Check existing page**: Verify if `app/[peptide-name]/page.tsx` already exists
4. **Important to know**: The page that is in each folder is a copy of a page from another website, it is not complete and is only in the folder for content extraction, do not waste time trying to complete the build of that page, you are building a new page based off of what was created for AOD-9604 as a template.

### Step 3: Create Product Page
1. **Create page file**: Generate `app/[peptide-name]/page.tsx` following the AOD-9604 template
2. **Structure the data**: Create a comprehensive `ProductInfo` object with all extracted information
3. **Implement tabs**: Include Overview, Dosing, Safety, and Technical tabs
4. **Add sidebar toggle**: Include mobile sidebar toggle button in top-left corner for all peptide pages
5. **Add all sections**:
   - Product image and basic info
   - Quick stats (half-life, dosage, molecular weight, research status)
   - Key features and benefits
   - Detailed dosing guidelines with protocols
   - Safety information and monitoring
   - Technical specifications
   - Research findings and limitations
   - Proper disclaimer

### Step 4: Update Navigation
1. **Add to sidebar**: Update `components/sidebar-nav.tsx` to include the new peptide as a sub-item under "Product Info"
2. **Follow naming convention**: Use consistent naming (e.g., "BPC-157", "Semaglutide", etc.)
3. **Maintain structure**: Keep the sub-items properly indented and styled

### Step 5: Git Operations
1. **Add all files**: `git add .`
2. **Commit changes**: `git commit -m "Add [Peptide Name] product page and sidebar sub-link under Product Info"`
3. **Push to remote**: `git push`
4. **Verify success**: Ensure push completes successfully

## Technical Specifications

### File Structure
```
app/[peptide-name]/
  └── page.tsx                    # Main product page component

public/
  ├── [peptide-name].png         # Product image
  └── [peptide-name]-gradient.jpg # Gradient image

components/
  └── sidebar-nav.tsx            # Updated navigation
```

### Page Template Structure
```typescript
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
```

### Navigation Structure
```typescript
{
  id: "product-information", 
  label: "Product Info", 
  icon: Pill, 
  path: "/?section=product-information",
  subItems: [
    { id: "aod-9604", label: "AOD-9604", icon: Pill, path: "/aod-9604" },
    { id: "[peptide-name]", label: "[Peptide Name]", icon: Pill, path: "/[peptide-name]" },
    // ... additional peptides
  ]
}
```

## Peptide List to Process
Based on the Peptide Research directory, process these peptides in order: Make sure to mark (Already completed) after every peptide you complete

1. **AOD-9604** ✅ (Already completed)
2. **BPC-157** (Already completed)
3. **Cagrilintide**  (Already completed)
4. **Epithalon** (Already completed)
5. **GHK-Cu** (Already completed)
6. **GHRP-2** (Already completed)
7. **HCG** (Already completed)
8. **Hexarelin** ✅ (Already completed)
9. **HGH** ✅ (Already completed)
10. **IGF-1 LR3** (Already completed)
11. **Kisspeptin** ✅ (Already completed)
12. **Melanotan II (MT-2)** ✅ (Already completed)
13. **MOTS-c** (Already completed)
14. **NAD+** ✅ (Already completed)
15. **PEG-MGF** ✅ (Already completed)
16. **PT-141**
17. **Selank**
18. **Semaglutide**
19. **Semax**
20. **Sermorelin**
21. **Snap-8**
22. **SS-31**
23. **TB-500**
24. **Tesamorelin**
25. **Thymosin Alpha-1**
26. **Thymulin**
27. **Tirzepatide**

## Quality Standards

### Content Requirements
- **Comprehensive dosing**: Include multiple protocols (standard, high-dose, maintenance)
- **Body weight dosing**: Provide dosing tables by weight when available
- **Administration methods**: Detail injection techniques and alternatives
- **Safety monitoring**: Include baseline testing and ongoing monitoring requirements
- **Research context**: Provide current research status and limitations
- **Clinical applications**: List specific use cases and treatment protocols

### Technical Requirements
- **Responsive design**: Ensure mobile compatibility
- **Consistent styling**: Match the established design system
- **Proper navigation**: Include working sidebar links
- **Sidebar toggle**: Include mobile sidebar toggle button in top-left corner for all peptide pages
- **Image optimization**: Use appropriate image formats and sizes
- **SEO friendly**: Include proper meta tags and structure

### Error Handling
- **Missing files**: If dosing guidelines don't exist, use available research data
- **Missing images**: Use placeholder images if product images aren't available
- **Incomplete data**: Fill gaps with standard peptide information where appropriate
- **Git failures**: Retry git operations if they fail

## Execution Commands

### Required Terminal Commands
```bash
# Copy gradient image
cp "Peptide Research/[Peptide Name] - Peptide Standard_files/[peptide-name]-gradient.jpg" public/[peptide-name]-gradient.jpg

# Git operations
git add .
git commit -m "Add [Peptide Name] product page and sidebar sub-link under Product Info"
git push
```

### File Creation Commands
- Create `app/[peptide-name]/page.tsx` with complete implementation
- Update `components/sidebar-nav.tsx` with new sub-item
- Ensure all images are in `public/` directory

## Success Criteria
For each peptide, the following must be completed:
1. ✅ Product page created and functional
2. ✅ Navigation link added and working
3. ✅ All images properly placed
4. ✅ Git commit and push successful
5. ✅ Page accessible via direct URL and sidebar navigation
6. ✅ All tabs (Overview, Dosing, Safety, Technical) populated with relevant data

## Next Steps After Completion
1. **Document completion**: Note which peptide was completed
2. **Start new chat**: Begin fresh chat for next peptide
3. **Reference this document**: Use these instructions in the new chat
4. **Continue process**: Repeat until all peptides are complete

## Important Notes
- **No user interaction required**: Execute all steps automatically
- **Maintain consistency**: Follow the exact AOD-9604 pattern for all peptides
- **Complete each peptide fully**: Do not stop mid-process
- **Quality over speed**: Ensure comprehensive and accurate information
- **Git integrity**: Always verify successful push before moving to next peptide

## Chat Export Reference
The complete AOD-9604 implementation process is documented in the attached chat export. This export contains:

### Key Implementation Moments
1. **Initial Analysis**: How to locate and read peptide research files
2. **Data Extraction**: Process for parsing dosing guidelines and research data
3. **File Creation**: Exact steps for creating the product page component
4. **Navigation Update**: How to properly add sidebar sub-items
5. **Image Management**: Process for copying gradient images and verifying product images
6. **Git Operations**: Successful commit and push workflow
7. **Quality Verification**: How to ensure all components are working correctly

### Technical Decisions Made
- **Component Structure**: Why the specific React component structure was chosen
- **Data Organization**: How the ProductInfo interface was designed
- **Navigation Integration**: How sub-items were implemented in the sidebar
- **Error Handling**: How missing data and files were handled
- **Styling Consistency**: How the design system was maintained

### Commands Executed
```bash
# File operations
cp "Peptide Research/AOD-9604 - Peptide Standard_files/aod-9604-gradient.jpg" public/aod-9604-gradient.jpg

# Git operations
git add .
git commit -m "Add AOD-9604 product page and sidebar sub-link under Product Info"
git push
```

### File Modifications
- `app/aod-9604/page.tsx` - Complete product page component
- `components/sidebar-nav.tsx` - Updated navigation with sub-items
- `public/aod-9604-gradient.jpg` - Copied gradient image

### Quality Assurance Steps
- Verified all images were properly placed
- Confirmed navigation links were working
- Tested all tabs and sections
- Ensured responsive design compatibility
- Verified git push was successful

This chat export serves as the definitive reference for implementing all future peptide pages with the same level of quality and completeness.

This system instruction document should be referenced in each new chat to ensure consistent execution across all peptide pages. 
<DO NOT DELETE THIS CHAT>
# Create product information page
_Exported on 7/4/2025 at 16:12:32 MST from Cursor (1.2.1)_

---

**User**

@/AOD-9604 - Peptide Standard_files Can you create a page for this following this design /?section=product-information

---

**Cursor**

I'll help you create a page for AOD-9604 following the design pattern from your product information section. Let me first examine the existing structure and then create the new page.


Now let me examine the AOD-9604 dosing guidelines to understand the specific information for this peptide:


Now let me create a comprehensive AOD-9604 product page following the design pattern from the existing product information section:


```typescriptreact
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
```

```typescriptreact
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
```

Let me try creating the file in a different location:


```typescriptreact
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

export default function AOD9604ProductPage() {
  const [selectedProduct] = useState<ProductInfo>(aod9604Info)

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
    </div>
  )
}
```

Let me check if the directory exists and create it:


Great! The directory already exists. Let me check what's in it:


The file already exists! Let me read it to see what's currently there:


Perfect! The AOD-9604 page already exists and follows the design pattern I was looking for. Let me check if there are any images that need to be added to the public directory:


Great! I can see that the AOD-9604 image (`aod_9604.png`) already exists in the public directory. Now let me check if there's a gradient image that needs to be added. Let me copy the gradient image from the research files:


Perfect! Now let me verify that the AOD-9604 page is working correctly by checking if there are any issues with the current implementation. Let me also check if we need to add a route to the main navigation or if it's accessible via a direct URL:


Perfect! The AOD-9604 product page is already complete and follows the design pattern from the product information section. Let me verify that the gradient image was copied successfully:


Your AOD-9604 product page is already implemented at `/aod-9604` and follows the same design as your `/product-information` section. It includes:

- A hero/header with icon and title
- Product image, stats, and badges
- Tabs for Overview, Dosing, Safety, and Technical details
- All relevant research, dosing, and safety info
- A disclaimer at the bottom

The images (`aod_9604.png` and `aod-9604-gradient.jpg`) are present in your `public/` directory, so the visuals will display correctly.

**To view the page:**  
Go to `/aod-9604` in your app.  
If you want it linked in your main navigation, let me know and I can add that for you.

If you need any tweaks to the content or want to add more peptides in this style, just ask!

---

**User**

i want it linked under product information

---

**Cursor**

```typescriptreact
// ... existing code ...
const navItems = [
  { id: "daily-overview", label: "Daily Overview", icon: BarChart3, path: "/" },
  { id: "latest-updates", label: "Latest Updates", icon: Sparkles, path: "/?section=latest-updates" },
  { id: "inventory", label: "Inventory", icon: Package, path: "/?section=inventory" },
  { id: "active-orders", label: "Active Orders", icon: Clock, path: "/?section=active-orders" },
  { id: "order-archive", label: "Order Archive", icon: FileText, path: "/?section=order-archive" },
  { id: "customers", label: "Customers", icon: Users, path: "/?section=customers" },
  { id: "discount-codes", label: "Discount Codes", icon: Percent, path: "/?section=discount-codes" },
  { id: "invoices", label: "Invoices", icon: FileText, path: "/?section=invoices" },
  { id: "messaging", label: "Messaging", icon: MessageSquare, path: "/?section=messaging" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/?section=analytics" },
  { id: "product-information", label: "Product Info", icon: Pill, path: "/?section=product-information",
    subItems: [
      { id: "aod-9604", label: "AOD-9604", icon: Pill, path: "/aod-9604" },
    ]
  },
  { id: "emails", label: "Email Center", icon: Mail, path: "/?section=emails" },
  { id: "settings", label: "Settings", icon: Settings, path: "/?section=settings" },
]
// ... existing code ...
        {/* Navigation */}
        <nav className={cn(
          "p-2 space-y-1",
          isMobile && collapsed && "hidden"
        )}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <div key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => handleSectionClick(item.id, item.path)}
                  className={cn(
                    "w-full justify-start text-left transition-all duration-200",
                    collapsed ? "px-2" : "px-3",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-l" />
                  )}
                </Button>
                {/* Render subItems if present and not collapsed */}
                {item.subItems && !collapsed && (
                  <div className="ml-8 space-y-1">
                    {item.subItems.map((sub) => (
                      <Link key={sub.id} href={sub.path} legacyBehavior>
                        <a
                          className={cn(
                            "block px-3 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800/50 text-sm transition-all duration-200",
                            usePathname() === sub.path && "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30"
                          )}
                        >
                          <sub.icon className="h-4 w-4 mr-2 inline-block align-middle" />
                          <span className="align-middle">{sub.label}</span>
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
// ... existing code ...
```

You will now see an "AOD-9604" sub-link under "Product Info" in your sidebar navigation. Clicking it will take you directly to the AOD-9604 product page. The link is visually grouped and indented under "Product Info" for clarity.

If you want to add more products as sub-links in the future, you can simply add them to the `subItems` array in the navigation config.

Let me know if you want to further customize the navigation or add more product pages!

---

**User**

then push to git'

---

**Cursor**

All changes have been committed and pushed to git:

- The AOD-9604 product page is live.
- The sidebar now includes an "AOD-9604" sub-link under "Product Info."

Your repository is up to date with these enhancements. If you need to add more products, further customize navigation, or deploy, just let me know!

</DO NOT DELETE THIS CHAT!>