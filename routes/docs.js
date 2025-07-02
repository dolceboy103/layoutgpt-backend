 const express = require('express');
 const router = express.Router();
 
 // POST /api/docs/generate - Generate documents with preview for Screen 5
 router.post('/generate', async (req, res) => {
   try {
     const {
       landId,
       docType
     } = req.body;
 
     if (!landId || !docType) {
       return res.status(400).json({
         success: false,
         error: 'landId and docType are required'
       });
     }
 
     // Generate document with preview
     const documentData = generateDocumentWithPreview(landId, docType);
     
     if (!documentData) {
       return res.status(400).json({
         success: false,
         error: `Document type '${docType}' not supported. Available types: EC, Mutation, Conversion Order, RTC, Layout Plan, Legal Report`
       });
     }
 
     res.json({
       success: true,
       message: `${documentData.title} generated successfully`,
       data: documentData
     });
 
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to generate document preview',
       message: error.message
     });
   }
 });
 
 // Helper function for document generation with preview
 function generateDocumentWithPreview(landId, docType) {
   const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
   
   // Extract location details from landId for realistic content
   const locationParts = landId.split('-');
   const taluk = locationParts[0] || 'Anekal';
   const village = locationParts[1] || 'Huskur';
   const surveyNumber = locationParts[2] || '257/3A';
 
   const documentTemplates = {
     'EC': {
       title: 'Encumbrance Certificate',
       preview: `ENCUMBRANCE CERTIFICATE
 
 Government of Karnataka
 Sub-Registrar Office, ${taluk}
 
 Survey Number: ${surveyNumber}
 Village: ${village}
 Taluk: ${taluk}
 District: Bangalore Urban
 
 CERTIFICATE DETAILS:
 Period: 01/01/2020 to 31/12/2024
 
 ENCUMBRANCE ENTRIES:
 1. Registered Sale Deed No. 2547/2022
    Date: 15/03/2022
    Consideration: Rs. 45,00,000
    From: Ramesh Kumar S/o Krishnappa
    To: Suresh Gowda S/o Venkatesh
    Survey No: ${surveyNumber}
    Area: 1 Acre 10 Guntas
 
 2. Mortgage Deed No. 1234/2023
    Date: 08/07/2023  
    Amount: Rs. 25,00,000
    Mortgagor: Suresh Gowda
    Mortgagee: State Bank of India, ${taluk} Branch
    Survey No: ${surveyNumber}
 
 REMARKS: Two encumbrance entries found in the specified period. 
 Property has one active mortgage with State Bank of India.
 No litigation or disputes found in records.
 
 CERTIFIED that the above are the only transactions 
 registered in this office during the specified period.
 
 Place: ${taluk}
 Date: ${new Date().toLocaleDateString('en-IN')}
 
                                     Sub-Registrar
                                     ${taluk}, Bangalore Urban District`,
       
       download_url: `/downloads/ec_${documentId}.pdf`,
       file_size: '2.1 MB',
       pages: 3
     },
 
     'Mutation': {
       title: 'Mutation Extract',
       preview: `MUTATION EXTRACT
 
 Revenue Department
 Government of Karnataka
 Village: ${village}, Taluk: ${taluk}
 
 Survey No: ${surveyNumber}
 Sub-division: 3A
 Total Extent: 1 Acre 10 Guntas
 Classification: Dry Land (Agricultural)
 
 CURRENT OWNERSHIP DETAILS:
 Owner Name: Suresh Gowda S/o Late Krishnappa
 Father's Name: Krishnappa (Deceased - 2018)
 Address: #123, Main Road, ${village} Village
          ${taluk} Taluk, Bangalore Urban District
 Contact: 9876543210
 
 PREVIOUS OWNERSHIP:
 Previous Owner: Ramesh Kumar S/o Nagaraj
 Mutation Date: 15/03/2022
 Mutation Order No: MUT/2022/4567
 Reason for Mutation: Sale by registered deed
 
 LAND CLASSIFICATION:
 Land Type: Dry Land (Agricultural)
 Soil Type: Red Laterite
 Classification: 'Jirayat' - Rain-fed cultivation
 Water Source: Rain-fed, one bore well
 Kharab Area: 25% of total area (rocky patches)
 
 CULTIVATION DETAILS:
 Main Crops: Ragi, Groundnut (Kharif)
            Vegetables (Rabi season)
 Irrigation: Bore well + rain-fed
 Trees: Coconut (15 nos), Mango (8 nos)
 
 REVENUE ASSESSMENT:
 Land Revenue: Rs. 125/- per annum
 Water Rate: Nil (bore well)
 Betterment Tax: Nil
 Total Assessment: Rs. 125/- per annum
 
 MUTATION STATUS: PENDING COMPLETION
 Current Status: Name entry completed, 
                 signature verification pending
 Reason for Delay: Name spelling discrepancy in 
                   revenue records vs sale deed
 Action Required: Affidavit for name correction + 
                  village accountant verification
 
 SURVEY DETAILS:
 Total Survey Area: 1 Acre 10 Guntas (46,200 sqft)
 Boundaries:
 North: Survey No. 256 (Vacant land)
 South: 30ft Village Road
 East: Survey No. 258 (Agricultural land)
 West: Nala (Storm water drain)
 
 Village Accountant: Manjunath K.R.
 Date: ${new Date().toLocaleDateString('en-IN')}
 Signature: ________________`,
       
       download_url: `/downloads/mutation_${documentId}.pdf`,
       file_size: '1.8 MB',
       pages: 2
     },
 
     'Conversion Order': {
       title: 'Land Conversion Order',
       preview: `LAND CONVERSION ORDER
 
 Office of the Deputy Commissioner
 Bangalore Urban District
 Government of Karnataka
 
 Application No: LCO/2024/5647
 Date: ${new Date().toLocaleDateString('en-IN')}
 
 Survey No: ${surveyNumber}
 Village: ${village}
 Taluk: ${taluk}
 District: Bangalore Urban
 
 APPLICANT DETAILS:
 Name: Suresh Gowda S/o Krishnappa
 Address: #123, Main Road, ${village} Village
 Contact: 9876543210
 Email: suresh.gowda@email.com
 
 PROPERTY DETAILS:
 Total Area Applied: 1 Acre 10 Guntas (46,200 sqft)
 Current Classification: Agricultural Land (Dry)
 Requested Classification: Non-Agricultural (Residential Layout)
 Land Revenue Survey No: ${surveyNumber}
 
 CONVERSION DETAILS:
 Purpose: Residential Layout Development
 Type of Construction: Individual Plot Development
 Intended Use: Sale of residential plots
 Expected Timeline: 3-4 years
 
 PREMIUM CALCULATION:
 Basic Rate: Rs. 270/- per sqft
 Applicable Area: 46,200 sqft
 Total Premium: Rs. 12,47,400/-
 Development Charges: Rs. 2,31,000/-
 Processing Fee: Rs. 25,000/-
 TOTAL AMOUNT: Rs. 15,03,400/-
 
 CURRENT STATUS: UNDER PROCESS
 Application Submitted: 15/01/2024
 Expected Processing Time: 6-8 months
 Current Stage: Technical Verification
 
 DOCUMENTS SUBMITTED:
 ✓ Survey Settlement Copy with latest amendments
 ✓ RTC Extract (Village Accountant certified)
 ✓ Mutation Extract with ownership details
 ✓ NOC from Agriculture Department
 ✓ Soil Classification Report
 ❌ Kharab Survey Report (Pending from Survey Department)
 ❌ Site Inspection Report (Pending from Revenue Inspector)
 ❌ Environmental Impact Assessment (If required)
 
 APPROVAL PROCESS STATUS:
 1. Document Verification: COMPLETED ✓
 2. Agriculture Dept NOC: COMPLETED ✓
 3. Revenue Inspector Site Visit: IN PROGRESS 🔄
 4. Technical Committee Review: PENDING ⏳
 5. Premium Payment: PENDING ⏳
 6. Final Order Issuance: PENDING ⏳
 
 NEXT STEPS REQUIRED:
 1. Complete Kharab demarcation by Survey Department
 2. Revenue Inspector site visit and report submission
 3. Technical committee review and recommendation
 4. Premium payment upon technical clearance
 5. Final conversion order issuance
 
 CONDITIONS (When approved):
 - Development to be completed within 5 years
 - Minimum infrastructure as per BDA norms required
 - Annual returns to be filed for 3 years
 - Non-compliance may result in penalty/reversal
 
 CONTACT INFORMATION:
 Land Conversion Officer: Sri. Rajesh Kumar IAS
 Phone: 080-12345678
 Email: landconversion.bangaloreud@gov.in
 Office Hours: 10:00 AM to 5:00 PM (Mon-Fri)
 
 Deputy Commissioner
 Bangalore Urban District`,
       
       download_url: `/downloads/conversion_${documentId}.pdf`,
       file_size: '2.5 MB',
       pages: 4
     },
 
     'RTC': {
       title: 'Record of Rights, Tenancy & Crops',
       preview: `RECORD OF RIGHTS, TENANCY AND CROPS (RTC)
 
 Village: ${village}
 Taluk: ${taluk}
 District: Bangalore Urban
 State: Karnataka
 
 Survey No: ${surveyNumber}
 Sub-division: 3A
 Khasra No: 125
 Total Area: 1 Acre 10 Guntas
 
 LAND OWNERSHIP DETAILS:
 Registered Owner: Suresh Gowda S/o Krishnappa
 Khatedar: Suresh Gowda
 Cultivator: Self
 Tenant: Nil
 Share in Land: Full ownership (Patta)
 
 FAMILY DETAILS:
 Father's Name: Krishnappa (Deceased)
 Spouse: Lakshmi Devi
 Children: 2 (Raj Kumar, Priya Kumari)
 Guardian: Self
 
 LAND CLASSIFICATION:
 Land Class: Dry Land (Bagayat)
 Soil Type: Red Laterite Soil
 Irrigation: Rain-fed + 1 Bore well
 Classification Grade: II Class
 Sub-soil Water: Available at 45 ft depth
 
 CROP DETAILS:
 Kharif Season (June-November):
 - Main Crop: Ragi (Finger Millet) - 60%
 - Secondary Crop: Groundnut - 30%
 - Remaining: Fallow/Mixed crops - 10%
 
 Rabi Season (December-March):
 - Vegetables: Tomato, Chilli, Onion
 - Area Under Cultivation: 70%
 - Remaining: Fallow
 
 Annual Crop Yield:
 - Ragi: 8-10 Quintals per acre
 - Groundnut: 6-8 Quintals per acre
 - Vegetables: Seasonal, market dependent
 
 LAND REVENUE ASSESSMENT:
 Basic Land Revenue: Rs. 125/- per annum
 Water Rate: Nil (bore well)
 Local Cess: Rs. 15/- per annum
 Education Cess: Rs. 10/- per annum
 Total Annual Assessment: Rs. 150/-
 
 LAND IMPROVEMENTS:
 - Bore well with pump set (2019)
 - Drip irrigation system (partial)
 - Farm shed (400 sqft)
 - Compound wall (partial - 200m)
 
 TREES ON LAND:
 - Coconut Trees: 15 nos (bearing)
 - Mango Trees: 8 nos (5 bearing, 3 young)
 - Other Fruit Trees: Sapota (3), Guava (2)
 - Timber Trees: Nil
 
 KHARAB (UNCULTIVABLE) AREA:
 Type: Rocky patches and natural depression
 Area: 25% of total land (approx 11,550 sqft)
 Reason: Rocky terrain, natural water collection area
 Potential Use: Can be leveled for construction
 
 ENCUMBRANCE STATUS:
 Mortgage: Yes (Rs. 25,00,000 with SBI)
 Litigation: Nil
 Attachment: Nil
 Prohibition: Nil
 
 SURVEY BOUNDARIES:
 North: Survey No. 256 - Vacant Government Land
 South: 30 ft Village Panchayat Road
 East: Survey No. 258 - Srinivas (Agricultural)
 West: Government Storm Water Drain (Nala)
 
 ROAD ACCESS:
 Main Road: 30 ft wide tar road (South side)
 Distance to Main Road: Direct access
 Approach: All weather motorable road
 Public Transport: Bus stop 200m away
 
 UTILITIES AVAILABILITY:
 Electricity: Available (BESCOM connection)
 Water: Bore well + possible BWSSB extension
 Drainage: Natural drainage + proposed UGD
 Telephone/Internet: Mobile tower coverage good
 
 REMARKS:
 - Land suitable for residential development
 - Good road connectivity and infrastructure
 - Requires land conversion for non-agricultural use
 - Market value appreciating due to IT corridor proximity
 
 Village Accountant: Manjunath K.R.
 Signature: ________________
 Date: ${new Date().toLocaleDateString('en-IN')}
 Seal: Village Panchayat, ${village}`,
       
       download_url: `/downloads/rtc_${documentId}.pdf`,
       file_size: '1.5 MB',
       pages: 2
     },
 
     'Layout Plan': {
       title: 'Proposed Layout Plan',
       preview: `PROPOSED LAYOUT PLAN
 
 Project Name: ${village} Residency
 Survey No: ${surveyNumber}
 Village: ${village}, Taluk: ${taluk}
 Total Area: 1 Acre 10 Guntas (46,200 sqft)
 
 DEVELOPER DETAILS:
 Name: ABC Developers Pvt Ltd
 License No: BDA/DEV/2024/1234
 Address: #456, MG Road, Bangalore
 Contact: +91-80-12345678
 Architect: XYZ Associates (License: AR/2024/5678)
 
 LAYOUT SPECIFICATIONS:
 Total Plots Proposed: 35 nos
 Individual Plot Sizes: 
 - 30x40 ft (1200 sqft): 25 plots
 - 30x50 ft (1500 sqft): 10 plots
 
 ROAD NETWORK:
 Main Approach Road: 30 ft (Existing village road)
 Primary Internal Road: 25 ft wide (North-South)
 Secondary Roads: 20 ft wide (East-West)
 Tertiary Roads: 15 ft wide (Plot access)
 Total Road Area: 11,550 sqft (25%)
 
 INFRASTRUCTURE PLANNING:
 Underground Drainage: Complete UGD system with STP
 Water Supply: Overhead tank (50,000L) + underground sump
 Electrical: Underground cabling with street lighting
 Storm Water: Proper drainage with retention pond
 Solid Waste: Designated collection points (3 nos)
 
 AMENITIES PROVIDED:
 Children's Play Area: 2,310 sqft (5%)
 Community Hall: 1,500 sqft
 Common Parking: 1,850 sqft
 Landscape/Gardens: 3,200 sqft
 Security Cabin: 100 sqft
 
 SETBACK REQUIREMENTS:
 Front Setback: 6 meters from main approach road
 Side Setbacks: 3 meters minimum from boundaries
 Internal Plot Setbacks: As per BBMP regulations
 - Front: 10 ft, Side: 5 ft, Rear: 8 ft
 
 AREA ALLOCATION:
 Plotted Area: 27,720 sqft (60%)
 Roads & Footpaths: 11,550 sqft (25%)
 Parks & Open Space: 4,620 sqft (10%)
 Community Facilities: 2,310 sqft (5%)
 TOTAL: 46,200 sqft (100%)
 
 TECHNICAL SPECIFICATIONS:
 Road Surface: Interlocking concrete blocks/Asphalt
 Footpaths: Cement concrete with tactile tiles
 Street Lighting: LED fixtures with solar backup
 Boundary Wall: 6 ft height with ornamental gates
 Landscaping: Native species with drip irrigation
 
 UTILITY CONNECTIONS:
 BESCOM: Electrical connection with transformer
 BWSSB: Water connection (applied)
 BBMP: UGD connection to main line
 Internet: Fiber optic ready infrastructure
 
 STATUTORY APPROVALS REQUIRED:
 ❌ BDA Layout Approval (Applied)
 ❌ BWSSB Water Connection NOC (In process)
 ❌ BESCOM Power Connection (Estimated 3 months)
 ❌ BBMP UGD Connection (Pending layout approval)
 ❌ Fire Department NOC (If required)
 ❌ Pollution Board NOC for STP
 
 FINANCIAL ESTIMATES:
 Development Cost: Rs. 185 lakhs
 Infrastructure: Rs. 125 lakhs
 Approval Costs: Rs. 35 lakhs
 Marketing: Rs. 25 lakhs
 TOTAL PROJECT COST: Rs. 370 lakhs
 
 TIMELINE:
 Layout Approval: 6-8 months
 Infrastructure Development: 12-18 months
 Sales & Marketing: 18-24 months
 Total Project Duration: 36-42 months
 
 MARKETING PROJECTIONS:
 Expected Selling Rate: Rs. 2,800/sqft
 Total Sales Value: Rs. 920 lakhs
 Net Profit Margin: 35-40%
 Target Buyers: IT professionals, Investors
 
 COMPLIANCE CERTIFICATES:
 Environmental Impact: Not required (< 5 acres)
 Tree Preservation: 3 existing trees to be retained
 Rain Water Harvesting: Mandatory for all plots
 Solar Power: Encouraged for street lighting
 
 Prepared by: XYZ Associates
 Architect License: AR/2024/5678
 Date: ${new Date().toLocaleDateString('en-IN')}
 Signature: ________________
 
 Approved by: ABC Developers Pvt Ltd
 Director Signature: ________________
 Company Seal: ________________`,
       
       download_url: `/downloads/layout_${documentId}.pdf`,
       file_size: '3.2 MB',
       pages: 8
     },
 
     'Legal Report': {
       title: 'Legal Due Diligence Report',
       preview: `LEGAL DUE DILIGENCE REPORT
 
 Property Reference: ${landId}
 Report Date: ${new Date().toLocaleDateString('en-IN')}
 Prepared by: Legal Associates Bangalore
 Report No: LDR/2024/1234
 
 CLIENT INFORMATION:
 Client Name: Confidential
 Property Location: Survey No ${surveyNumber}, ${village}
 Purpose: Investment Due Diligence
 Scope: Comprehensive Legal Verification
 
 EXECUTIVE SUMMARY:
 Legal Grade: B (Moderate Risk - Proceed with Caution)
 Overall Recommendation: INVESTIBLE with conditions
 Title Status: Clear with minor documentation gaps
 Risk Level: Medium (manageable risks identified)
 
 TITLE VERIFICATION:
 Chain of Title: Verified for 30 years (1994-2024)
 Root of Title: Clear derivation from government grant
 Original Title Holder: State Government (Agricultural Grant)
 Current Title Status: Clear marketable title
 Title Documents: Available and verified
 
 TITLE CHAIN ANALYSIS:
 1994: Government Grant to Krishnappa (Original Patta)
 2010: Inheritance by Ramesh Kumar (Son of Krishnappa)
 2022: Sale to Suresh Gowda (Registered Sale Deed)
 Current: Suresh Gowda (Clear ownership)
 
 DOCUMENT VERIFICATION:
 ✓ Original Sale Deed (2022) - Verified & Registered
 ✓ Previous Title Deeds - Available and genuine
 ✓ Survey Settlement - Latest version obtained
 ✓ Revenue Records - Updated (with minor discrepancies)
 ❌ Mutation - Incomplete (name spelling issues)
 ✓ Encumbrance Certificate - Clear for 30 years
 ✓ Non-Encumbrance Certificate - Current & valid
 
 STATUTORY COMPLIANCE:
 Land Classification: Agricultural (requires conversion)
 Stamp Duty: Paid as per ready reckoner rates
 Registration: Properly registered with Sub-Registrar
 Property Tax: Nil (agricultural classification)
 Municipal Approvals: Not applicable (agricultural)
 
 ENCUMBRANCE ANALYSIS:
 Verification Period: 01/01/1994 to 31/12/2024
 Total Transactions: 3 (including current)
 Outstanding Mortgages: 1 (SBI - Rs. 25,00,000)
 Litigation: None found in court records
 Attachments: None
 
 DETAILED ENCUMBRANCE:
 1. Government Grant (1994): Krishnappa
    Value: Revenue Settlement
    Status: Original title creation
 
 2. Sale Deed 1247/2010: Inheritance
    From: Krishnappa Estate to Ramesh Kumar
    Value: Natural succession
    Status: Completed
 
 3. Sale Deed 2547/2022: Commercial Sale
    From: Ramesh Kumar to Suresh Gowda
    Consideration: Rs. 45,00,000
    Stamp Duty: Rs. 2,70,000 (paid)
    Registration: Rs. 15,000 (paid)
    Status: Completed
 
 4. Mortgage Deed 1234/2023: Bank Loan
    Mortgagor: Suresh Gowda
    Mortgagee: State Bank of India
    Amount: Rs. 25,00,000
    Status: Active (no defaults found)
 
 LITIGATION SEARCH:
 Civil Courts: No cases found
 Criminal Courts: No criminal cases
 Revenue Courts: No disputes
 Consumer Courts: Not applicable
 Debt Recovery: No DRT cases
 Company Law: Not applicable
 
 SURVEY & BOUNDARIES:
 Survey Settlement: Latest version verified
 Boundary Description: Clearly demarcated
 Survey Numbers: Consistent across documents
 Measurements: Minor variations within tolerance
 Disputed Boundaries: None identified
 Encroachments: None visible
 
 STATUTORY CLEARANCES:
 Income Tax: No demands found (Form 26AS checked)
 Wealth Tax: Not applicable
 Property Tax: Current (agricultural exemption)
 Utility Bills: No outstanding dues
 Society Dues: Not applicable
 
 RISK ASSESSMENT:
 
 HIGH RISK FACTORS:
 1. Land Conversion Requirement
    Issue: Currently agricultural, needs conversion
    Impact: Cannot develop without conversion
    Mitigation: Apply immediately, budget for delays
    Timeline: 8-12 months minimum
 
 2. Incomplete Mutation
    Issue: Name spelling discrepancy in revenue records
    Impact: May delay future transactions
    Mitigation: File name correction affidavit
    Timeline: 2-3 months
 
 MEDIUM RISK FACTORS:
 1. Outstanding Mortgage
    Issue: Rs. 25 lakh bank mortgage active
    Impact: Requires bank NOC for sale/development
    Mitigation: Obtain explicit NOC or pay off loan
    Timeline: 1-2 months
 
 2. Infrastructure Development
    Issue: Rural location requires infrastructure
    Impact: High development costs
    Mitigation: Factor in development costs
    Timeline: During project planning
 
 LOW RISK FACTORS:
 1. Minor Survey Variations
    Issue: Small measurement differences in documents
    Impact: Minimal, within acceptable limits
    Mitigation: Professional survey recommended
    Timeline: 2 weeks
 
 2. Agricultural Classification
    Issue: Currently agricultural land
    Impact: Standard for rural properties
    Mitigation: Normal conversion process
    Timeline: Part of conversion process
 
 RECOMMENDATIONS:
 
 IMMEDIATE ACTIONS (Before Purchase):
 1. Obtain bank NOC for mortgage or arrange payment
 2. Initiate land conversion application process
 3. File mutation correction with revenue department
 4. Conduct professional boundary survey
 5. Verify all utility connections feasibility
 
 MEDIUM TERM ACTIONS (Post Purchase):
 1. Complete land conversion process
 2. Finalize mutation correction
 3. Obtain layout approval (if developing)
 4. Update property records with new classification
 
 LEGAL OPINION:
 The property has a clear and marketable title with manageable legal risks. The main challenges are:
 1. Land conversion requirement (standard for agricultural land)
 2. Outstanding mortgage (requires bank cooperation)
 3. Minor documentation gaps (easily rectifiable)
 
 The property is SUITABLE FOR INVESTMENT subject to:
 - Successful land conversion
 - Mortgage clearance/NOC
 - Completion of pending documentation
 
 FINANCIAL IMPLICATIONS:
 Legal Costs: Rs. 75,000 - Rs. 1,25,000
 Conversion Costs: Rs. 12,50,000 - Rs. 15,00,000
 Documentation: Rs. 25,000 - Rs. 50,000
 Professional Fees: Rs. 1,00,000 - Rs. 1,50,000
 
 CONCLUSION:
 This property represents a GOOD INVESTMENT OPPORTUNITY with moderate legal risks that are standard for agricultural land conversion projects in Bangalore periphery. All identified issues are resolvable through proper legal processes.
 
 Advocate Name: Adv. Ramesh Rao
 Bar Council No: KAR/2015/12345
 Signature: ________________
 Date: ${new Date().toLocaleDateString('en-IN')}
 Seal: Legal Associates Bangalore
 
 DISCLAIMER: This report is based on documents provided and public records available. Actual ground conditions and future legal developments may vary.`,
       
       download_url: `/downloads/legal_${documentId}.pdf`,
       file_size: '2.8 MB',
       pages: 6
     }
   };
 
   const docData = documentTemplates[docType];
   
   if (!docData) {
     return null;
   }
 
   return {
     document_id: documentId,
     landId,
     docType,
     title: docData.title,
     preview: docData.preview,
     download_url: docData.download_url,
     file_size: docData.file_size,
     pages: docData.pages,
     generated_at: new Date().toISOString(),
     expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
     status: 'completed'
   };
 }
 
 module.exports = router;