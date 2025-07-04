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

### Step 2: Check Existing Resources
1. **Verify image exists**: Check if `[peptide_name].png` exists in `public/` directory
2. **Copy gradient image**: Copy `[peptide_name]-gradient.jpg` from research files to `public/` directory
3. **Check existing page**: Verify if `app/[peptide-name]/page.tsx` already exists
4. **Important to know**: The page that is in each folder is a copy of a page from another website, it is not complete and is only in the folder for content extraction, do not waste time trying to complete the build of that page, you are building a new page based off of what was created for AOD-9604 as a template.

### Step 3: Create Product Page
1. **Create page file**: Generate `app/[peptide-name]/page.tsx` following the AOD-9604 template
2. **Structure the data**: Create a comprehensive `ProductInfo` object with all extracted information
3. **Implement tabs**: Include Overview, Dosing, Safety, and Technical tabs
4. **Add all sections**:
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
Based on the Peptide Research directory, process these peptides in order:

1. **AOD-9604** ✅ (Already completed)
2. **BPC-157** (Already completed)
3. **Cagrilintide**  (Already completed)
4. **Epithalon** (Already completed)
5. **GHK-Cu** (Already completed)
6. **GHRP-2**
7. **HCG**
8. **Hexarelin**
9. **HGH**
10. **IGF-1 LR3**
11. **Kisspeptin**
12. **Melanotan II (MT-2)**
13. **MOTS-c**
14. **NAD+**
15. **PEG-MGF**
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

