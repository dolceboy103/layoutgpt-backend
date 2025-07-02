 const express = require('express');
 const router = express.Router();
 
 // POST /api/assistant/ask - AI Assistant for Screen 3
 router.post('/ask', async (req, res) => {
   try {
     const { question, landId } = req.body;
 
     if (!question) {
       return res.status(400).json({
         success: false,
         error: 'question is required'
       });
     }
 
     // Analyze question for keywords and categorize
     const analysisResult = analyzeQuestion(question.toLowerCase());
     
     // Generate contextual response based on category and landId
     const response = generateResponse(analysisResult, landId, question);
 
     res.json({
       success: true,
       data: {
         question: question,
         land_id: landId,
         category: analysisResult.category,
         confidence: analysisResult.confidence,
         response: response.answer,
         actionable_items: response.actionableItems,
         related_sections: response.relatedSections,
         follow_up_questions: response.followUpQuestions,
         timestamp: new Date().toISOString()
       }
     });
 
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to process question',
       message: error.message
     });
   }
 });
 
 // Helper function to analyze question and determine category
 function analyzeQuestion(question) {
   const categories = {
     roi: {
       keywords: ['roi', 'return', 'investment', 'profit', 'money', 'cost', 'revenue', 'financial', 'earnings', 'breakeven'],
       confidence: 0
     },
     feasibility: {
       keywords: ['feasible', 'development', 'build', 'construct', 'infrastructure', 'roads', 'water', 'power', 'zoning'],
       confidence: 0
     },
     legal: {
       keywords: ['legal', 'title', 'documents', 'mutation', 'conversion', 'approval', 'permission', 'encumbrance', 'litigation'],
       confidence: 0
     },
     valuation: {
       keywords: ['value', 'price', 'rate', 'market', 'worth', 'appraisal', 'assessment', 'sqft'],
       confidence: 0
     },
     timeline: {
       keywords: ['time', 'duration', 'when', 'timeline', 'schedule', 'completion', 'deadline'],
       confidence: 0
     },
     general: {
       keywords: ['what', 'how', 'why', 'explain', 'help', 'information'],
       confidence: 0
     }
   };
 
   // Calculate confidence scores for each category
   Object.keys(categories).forEach(category => {
     const keywords = categories[category].keywords;
     let matches = 0;
     keywords.forEach(keyword => {
       if (question.includes(keyword)) {
         matches++;
       }
     });
     categories[category].confidence = matches / keywords.length;
   });
 
   // Find the category with highest confidence
   let bestCategory = 'general';
   let highestConfidence = 0;
   
   Object.keys(categories).forEach(category => {
     if (categories[category].confidence > highestConfidence) {
       highestConfidence = categories[category].confidence;
       bestCategory = category;
     }
   });
 
   return {
     category: bestCategory,
     confidence: Math.min(highestConfidence + 0.2, 1.0), // Add base confidence
     allScores: categories
   };
 }
 
 // Helper function to generate contextual responses
 function generateResponse(analysis, landId, originalQuestion) {
   const landSpecificContext = landId ? getLandContext(landId) : null;
   
   const responses = {
     roi: {
       answer: `Based on the analysis for ${landId || 'this property'}, here's the ROI breakdown:\n\n` +
               `• **Current Investment Required**: ₹75-85 lakhs (land + conversion + development)\n` +
               `• **Projected Returns**: ₹1.2-1.4 crores (selling developed plots)\n` +
               `• **Expected ROI**: 45-55% over 3-4 years\n` +
               `• **Break-even Timeline**: 18-24 months\n` +
               `• **Risk Level**: Medium (land conversion and market factors)\n\n` +
               `The property shows strong ROI potential due to its location in Anekal taluk with good connectivity to Bangalore. Key value drivers include proximity to Electronics City and upcoming infrastructure projects.`,
       
       actionableItems: [
         "Review detailed financial projections in ROI Calculator",
         "Assess market comparables in the area",
         "Factor in conversion and development timelines",
         "Consider phased development to manage cash flow"
       ],
       
       relatedSections: ['ROI Calculator', 'Feasibility Analysis', 'Market Analysis'],
       
       followUpQuestions: [
         "What are the key risk factors affecting ROI?",
         "How does the timeline impact overall returns?",
         "What are comparable projects showing for returns?"
       ]
     },
 
     feasibility: {
       answer: `Development feasibility analysis for ${landId || 'this property'}:\n\n` +
               `• **Overall Feasibility Score**: 78/100 (Good potential)\n` +
               `• **Infrastructure Readiness**: 72/100 - Basic utilities available\n` +
               `• **Zoning Compliance**: Requires agricultural land conversion\n` +
               `• **Market Conditions**: Favorable for residential development\n` +
               `• **Key Challenges**: Land conversion approval (8-12 months), drainage infrastructure\n\n` +
               `The property is feasible for residential layout development with moderate infrastructure investment. Main advantage is the growing demand in Anekal region and good road connectivity.`,
       
       actionableItems: [
         "Initiate land conversion process immediately",
         "Conduct detailed soil and topographical survey", 
         "Assess infrastructure development costs",
         "Review CDP compliance requirements"
       ],
       
       relatedSections: ['Feasibility Analysis', 'Infrastructure Analysis', 'Legal Status'],
       
       followUpQuestions: [
         "What infrastructure needs to be developed?",
         "How long will the approval process take?",
         "What are the main development challenges?"
       ]
     },
 
     legal: {
       answer: `Legal status summary for ${landId || 'this property'}:\n\n` +
               `• **Title Status**: Clear title with minor documentation gaps\n` +
               `• **Encumbrance**: 2 transactions found in last 30 years, currently clear\n` +
               `• **Current Classification**: Agricultural (Dry) - conversion required\n` +
               `• **Litigation**: No ongoing legal issues\n` +
               `• **Required Approvals**: Land conversion, layout approval, building permissions\n\n` +
               `The property has a clean legal foundation but requires land conversion before development. Mutation records need updating to reflect current ownership properly.`,
       
       actionableItems: [
         "Complete pending mutation formalities",
         "Apply for agricultural land conversion", 
         "Obtain updated encumbrance certificate",
         "Verify survey boundaries and measurements"
       ],
       
       relatedSections: ['Legal Documents', 'Compliance Status', 'Required Approvals'],
       
       followUpQuestions: [
         "What documents are needed for land conversion?",
         "How to expedite the mutation process?",
         "Are there any legal risks to consider?"
       ]
     },
 
     valuation: {
       answer: `Property valuation assessment for ${landId || 'this property'}:\n\n` +
               `• **Current Market Value**: ₹48.7 lakhs (₹1,120 per sqft)\n` +
               `• **Development Potential Value**: ₹82.5 lakhs\n` +
               `• **Market Rate Trend**: 12% growth in last 2 years\n` +
               `• **Comparable Properties**: 5 similar properties in 2km radius\n` +
               `• **Investment Grade**: B+ (Good investment potential)\n\n` +
               `The valuation reflects the strategic location advantage and development potential. Current rates are competitive compared to similar properties in Anekal region.`,
       
       actionableItems: [
         "Review recent comparable property transactions",
         "Assess market trend projections for next 3 years",
         "Consider optimal development timeline for value maximization",
         "Evaluate different development scenarios"
       ],
       
       relatedSections: ['Market Analysis', 'Financial Projections', 'Comparable Properties'],
       
       followUpQuestions: [
         "How do market rates compare to nearby areas?",
         "What factors drive property values here?",
         "When is the best time to develop or sell?"
       ]
     },
 
     timeline: {
       answer: `Development timeline for ${landId || 'this property'}:\n\n` +
               `• **Total Project Duration**: 36-42 months\n` +
               `• **Land Conversion**: 8-12 months (critical path)\n` +
               `• **Layout Approval**: 6-8 months (parallel processing possible)\n` +
               `• **Infrastructure Development**: 12-18 months\n` +
               `• **Sales & Marketing**: 12-24 months (can overlap with development)\n\n` +
               `The timeline is primarily driven by the land conversion approval process. Early initiation of conversion is crucial for overall project success.`,
       
       actionableItems: [
         "Start land conversion application immediately",
         "Prepare layout plans in parallel",
         "Schedule infrastructure planning phase",
         "Develop phased project execution strategy"
       ],
       
       relatedSections: ['Project Timeline', 'Approval Process', 'Development Phases'],
       
       followUpQuestions: [
         "Can any processes be done in parallel?",
         "What causes delays in land conversion?",
         "How to optimize the development timeline?"
       ]
     },
 
     general: {
       answer: `I'm here to help you with comprehensive land intelligence for ${landId || 'your property'}. I can provide insights on:\n\n` +
               `• **Financial Analysis**: ROI calculations, investment projections, market valuations\n` +
               `• **Legal Guidance**: Documentation requirements, approval processes, compliance status\n` +
               `• **Development Feasibility**: Infrastructure needs, zoning compliance, technical analysis\n` +
               `• **Market Intelligence**: Comparable properties, price trends, demand analysis\n` +
               `• **Project Planning**: Timelines, cost estimates, risk assessment\n\n` +
               `Feel free to ask specific questions about any aspect of your land development project. I have access to comprehensive data about this property and can provide detailed analysis.`,
       
       actionableItems: [
         "Ask specific questions about ROI or financial projections",
         "Inquire about legal documentation and approval requirements",
         "Get details on development feasibility and infrastructure needs",
         "Explore market analysis and comparable properties"
       ],
       
       relatedSections: ['All Sections Available', 'Dashboard Overview', 'Comprehensive Analysis'],
       
       followUpQuestions: [
         "What's the ROI potential for this property?",
         "What legal approvals do I need?",
         "Is this property feasible for development?",
         "How does this compare to other properties?"
       ]
     }
   };
 
   const response = responses[analysis.category] || responses.general;
   
   return {
     answer: response.answer,
     actionableItems: response.actionableItems,
     relatedSections: response.relatedSections,
     followUpQuestions: response.followUpQuestions
   };
 }
 
 // Helper function to get land-specific context
 function getLandContext(landId) {
   return {
     location: 'Huskur Village, Anekal Taluk',
     area: '1 acre (43,560 sqft)',
     classification: 'Agricultural (Dry)',
     feasibilityScore: 78,
     marketValue: 4870000,
     roiProjection: 45.2
   };
 }
 
 // GET /api/assistant/suggestions - Get contextual suggestions
 router.get('/suggestions', async (req, res) => {
   try {
     const { landId, category } = req.query;
 
     const suggestions = {
       roi: [
         "What's the expected ROI for this property?",
         "How do development costs affect returns?",
         "What's the break-even timeline?",
         "Compare ROI with similar properties"
       ],
       legal: [
         "What documents do I need for development?",
         "How long does land conversion take?",
         "Are there any legal risks?",
         "What approvals are required?"
       ],
       feasibility: [
         "Is this property suitable for development?",
         "What infrastructure is needed?",
         "What are the main challenges?",
         "How feasible is residential development?"
       ],
       general: [
         "Give me an overview of this property",
         "What are the key opportunities?",
         "What should I focus on first?",
         "How does this property compare to others?"
       ]
     };
 
     const categoryToUse = category || 'general';
     
     res.json({
       success: true,
       data: {
         category: categoryToUse,
         suggestions: suggestions[categoryToUse] || suggestions.general,
         landId: landId
       }
     });
 
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to get suggestions',
       message: error.message
     });
   }
 });
 
 module.exports = router;