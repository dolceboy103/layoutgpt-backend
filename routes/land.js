 const express = require('express');
 const router = express.Router();
 
 // POST /api/land/upload - Upload land data for Screen 1
 router.post('/upload', async (req, res) => {
   try {
     const { village, taluk, survey_number, upload_method = 'manual' } = req.body;
 
     if (!village || !taluk || !survey_number) {
       return res.status(400).json({
         success: false,
         error: 'village, taluk, and survey_number are required'
       });
     }
 
     // Generate unique landId
     const landId = `${taluk}-${village}-${survey_number}`.replace(/\s+/g, '');
     
     // Handle file upload if present
     let uploadedFile = null;
     if (req.file) {
       uploadedFile = {
         filename: req.file.filename,
         originalname: req.file.originalname,
         mimetype: req.file.mimetype,
         size: req.file.size,
         path: req.file.path
       };
     }
 
     // Mock land unit creation
     const landUnit = {
       land_id: landId,
       upload_method,
       location: {
         village,
         taluk,
         district: 'Bangalore Urban',
         state: 'Karnataka',
         survey_number
       },
       uploaded_file: uploadedFile,
       status: 'processing',
       created_at: new Date().toISOString(),
       estimated_completion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
     };
 
     res.json({
       success: true,
       message: 'Land data uploaded successfully',
       data: {
         landId: landId,
         redirect_url: `/dashboard.html?landId=${landId}`,
         land_unit: landUnit
       }
     });
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to upload land data',
       message: error.message
     });
   }
 });
 
 // GET /api/land/:id - Fetch comprehensive land data for Screen 2 Dashboard
 router.get('/:id', async (req, res) => {
   try {
     const { id: landId } = req.params;
 
     if (!landId) {
       return res.status(400).json({
         success: false,
         error: 'landId parameter is required'
       });
     }
 
     // Mock comprehensive land unit data
     const landData = {
       land_id: landId,
       basic_info: {
         village: 'Huskur',
         taluk: 'Anekal',
         district: 'Bangalore Urban',
         state: 'Karnataka',
         survey_number: '257/3A',
         area_acres: 1.0,
         area_sqft: 43560,
         classification: 'Agricultural (Dry)'
       },
       
       scores: {
         overall_feasibility: 78,
         legal_compliance: 65,
         infrastructure_readiness: 72,
         market_potential: 85,
         financial_viability: 81,
         risk_assessment: 'Medium'
       },
 
       red_flags: [
         {
           severity: 'high',
           category: 'legal',
           issue: 'Land conversion pending',
           description: 'Agricultural land requires conversion to non-agricultural before development',
           action_required: 'Apply for land conversion with DC office',
           estimated_timeline: '8-12 months'
         },
         {
           severity: 'medium', 
           category: 'documentation',
           issue: 'Mutation incomplete',
           description: 'Property mutation records show pending status',
           action_required: 'Complete mutation process with village accountant',
           estimated_timeline: '2-3 months'
         },
         {
           severity: 'low',
           category: 'infrastructure',
           issue: 'Limited drainage',
           description: 'Area lacks proper storm water drainage system',
           action_required: 'Plan for drainage infrastructure in layout',
           estimated_timeline: 'During development'
         }
       ],
 
       financial_estimates: {
         current_market_value: 4870000,
         development_potential_value: 8250000,
         estimated_roi_percentage: 45.2,
         break_even_timeline: '18 months',
         investment_grade: 'B+',
         price_per_sqft: 1120,
         projected_selling_rate: 2800
       },
 
       processing_status: {
         overall_progress: 67,
         stages: {
           data_collection: { status: 'completed', progress: 100 },
           legal_verification: { status: 'in_progress', progress: 75 },
           feasibility_analysis: { status: 'in_progress', progress: 60 },
           financial_modeling: { status: 'completed', progress: 100 },
           risk_assessment: { status: 'pending', progress: 0 },
           final_report: { status: 'pending', progress: 0 }
         },
         estimated_completion: '2024-12-28T10:30:00Z',
         last_updated: new Date().toISOString()
       },
 
       infrastructure_analysis: {
         road_connectivity: { status: 'good', details: 'Tar road 85m from property' },
         power_supply: { status: 'available', details: 'BESCOM connection feasible' },
         water_supply: { status: 'moderate', details: 'Borewell required, groundwater at 45ft' },
         drainage: { status: 'needs_development', details: 'Storm water drainage required' },
         telecom: { status: 'good', details: 'Fiber and mobile coverage available' }
       },
 
       legal_status: {
         title_verification: 'Clear title with minor documentation gaps',
         encumbrance_status: '2 entries found in last 30 years',
         litigation_status: 'No ongoing litigation',
         conversion_status: 'Agricultural - conversion required',
         approvals_needed: ['Land conversion', 'Layout approval', 'Building plan approval']
       },
 
       market_analysis: {
         current_rate_per_sqft: 1120,
         market_trend: 'Upward (12% growth in last 2 years)',
         comparable_properties: 5,
         demand_supply_ratio: 'Balanced',
         investment_sentiment: 'Positive'
       },
 
       next_actions: [
         {
           priority: 'high',
           action: 'Initiate land conversion process',
           timeline: '1-2 weeks',
           cost_estimate: 125000,
           responsible_party: 'Land Developer'
         },
         {
           priority: 'medium',
           action: 'Complete mutation formalities',
           timeline: '2-3 weeks', 
           cost_estimate: 15000,
           responsible_party: 'Legal Team'
         },
         {
           priority: 'medium',
           action: 'Conduct soil testing',
           timeline: '1 week',
           cost_estimate: 25000,
           responsible_party: 'Technical Team'
         }
       ],
 
       documents_available: [
         { type: 'Revenue Records', status: 'available', last_updated: '2024-01-15' },
         { type: 'Survey Settlement', status: 'available', last_updated: '2023-11-20' },
         { type: 'Encumbrance Certificate', status: 'partial', last_updated: '2024-01-10' },
         { type: 'Mutation Records', status: 'pending', last_updated: null }
       ],
 
       timeline_estimate: {
         total_project_duration: '36-42 months',
         key_milestones: {
           land_conversion: '8-12 months',
           layout_approval: '6-8 months',
           infrastructure_development: '12-18 months',
           sales_marketing: '12-24 months'
         }
       }
     };
 
     res.json({
       success: true,
       data: landData
     });
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to fetch land data',
       message: error.message
     });
   }
 });
 
 // GET /api/land/search - Search land units
 router.get('/search', async (req, res) => {
   try {
     const { village, taluk, district, limit = 10 } = req.query;
 
     // Mock search results
     const searchResults = [
       {
         land_id: 'Anekal-Huskur-257_3A',
         village: 'Huskur',
         taluk: 'Anekal',
         survey_number: '257/3A',
         area_acres: 1.0,
         feasibility_score: 78,
         market_value: 4870000,
         status: 'processing'
       },
       {
         land_id: 'Anekal-Jigani-142_2B',
         village: 'Jigani',
         taluk: 'Anekal',
         survey_number: '142/2B',
         area_acres: 0.75,
         feasibility_score: 82,
         market_value: 3650000,
         status: 'completed'
       }
     ];
 
     res.json({
       success: true,
       data: searchResults,
       total: searchResults.length,
       filters_applied: { village, taluk, district, limit }
     });
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to search land units',
       message: error.message
     });
   }
 });
 
 module.exports = router;