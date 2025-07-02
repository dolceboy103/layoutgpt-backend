 const express = require('express');
 const router = express.Router();
 
 // GET /api/logs/:landId - Get agent execution logs for Screen 7
 router.get('/:landId', async (req, res) => {
   try {
     const { landId } = req.params;
     const { limit = 50, status, agent_type, start_date, end_date } = req.query;
 
     if (!landId) {
       return res.status(400).json({
         success: false,
         error: 'landId parameter is required'
       });
     }
 
     // Generate mock agent execution logs
     const agentTypes = [
       'feasibility_agent',
       'legal_agent', 
       'financial_agent',
       'market_analysis_agent',
       'zoning_agent',
       'risk_assessment_agent',
       'document_agent',
       'valuation_agent'
     ];
 
     const statuses = ['running', 'completed', 'failed', 'pending'];
     
     const mockLogs = [];
     const now = new Date();
     
     // Generate 15-30 log entries for the land unit
     const numLogs = Math.floor(Math.random() * 16) + 15;
     
     for (let i = 0; i < numLogs; i++) {
       const agentType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
       const status = statuses[Math.floor(Math.random() * statuses.length)];
       const timestamp = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000)); // 2 hours apart
       
       const log = {
         execution_id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
         land_id: landId,
         agent_type: agentType,
         timestamp: timestamp.toISOString(),
         status: status,
         summary: generateSummary(agentType, status),
         duration_ms: Math.floor(Math.random() * 30000) + 2000,
         input_data: generateInputData(agentType),
         output_data: status === 'completed' ? generateOutputData(agentType) : null,
         error_message: status === 'failed' ? generateErrorMessage(agentType) : null,
         confidence_score: status === 'completed' ? Math.random() * 0.3 + 0.7 : null,
         agent_version: '1.2.3',
         triggered_by: i % 3 === 0 ? 'user_request' : 'auto_trigger'
       };
       
       mockLogs.push(log);
     }
 
     // Apply filters
     let filteredLogs = mockLogs;
     
     if (status) {
       filteredLogs = filteredLogs.filter(log => log.status === status);
     }
     
     if (agent_type) {
       filteredLogs = filteredLogs.filter(log => log.agent_type === agent_type);
     }
     
     if (start_date) {
       filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(start_date));
     }
     
     if (end_date) {
       filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(end_date));
     }
 
     // Sort by timestamp (newest first) and limit
     filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
     filteredLogs = filteredLogs.slice(0, parseInt(limit));
 
     // Generate summary statistics
     const summary = {
       total_executions: mockLogs.length,
       completed: mockLogs.filter(log => log.status === 'completed').length,
       failed: mockLogs.filter(log => log.status === 'failed').length,
       running: mockLogs.filter(log => log.status === 'running').length,
       pending: mockLogs.filter(log => log.status === 'pending').length,
       avg_duration_ms: Math.round(mockLogs.reduce((sum, log) => sum + log.duration_ms, 0) / mockLogs.length),
       success_rate: Math.round((mockLogs.filter(log => log.status === 'completed').length / mockLogs.length) * 100)
     };
 
     res.json({
       success: true,
       data: {
         land_id: landId,
         logs: filteredLogs,
         summary: summary,
         filters_applied: {
           limit: parseInt(limit),
           status: status || null,
           agent_type: agent_type || null,
           start_date: start_date || null,
           end_date: end_date || null
         }
       }
     });
 
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to fetch agent logs',
       message: error.message
     });
   }
 });
 
 // Helper function to generate realistic summaries
 function generateSummary(agentType, status) {
   const summaries = {
     feasibility_agent: {
       completed: 'Feasibility analysis completed. Property suitable for residential development with moderate infrastructure requirements.',
       running: 'Analyzing land feasibility including zoning compliance, infrastructure availability, and development potential.',
       failed: 'Feasibility analysis failed due to insufficient survey data. Retrying with additional parameters.',
       pending: 'Feasibility analysis queued. Waiting for zoning verification to complete.'
     },
     legal_agent: {
       completed: 'Legal verification completed. Clear title with minor documentation gaps. Encumbrance check successful.',
       running: 'Performing comprehensive legal due diligence including title verification and encumbrance analysis.',
       failed: 'Legal verification failed. Unable to access revenue records. Manual intervention required.',
       pending: 'Legal analysis pending. Waiting for document upload completion.'
     },
     financial_agent: {
       completed: 'Financial analysis completed. ROI projection: 45.2%. Break-even analysis shows 18-month payback period.',
       running: 'Computing financial projections including ROI analysis, cash flow modeling, and risk assessment.',
       failed: 'Financial calculation failed due to invalid market rate data. Recalibrating with updated inputs.',
       pending: 'Financial analysis queued. Awaiting conversion cost estimates.'
     },
     market_analysis_agent: {
       completed: 'Market analysis completed. Current rate: ₹2,800/sqft. 12% growth projected over 3 years.',
       running: 'Analyzing local market trends, comparable sales, and price projections for target area.',
       failed: 'Market analysis failed. Unable to fetch comparable property data. Retrying with broader search radius.',
       pending: 'Market analysis pending. Waiting for location coordinates verification.'
     },
     zoning_agent: {
       completed: 'Zoning verification completed. Agricultural land requires conversion. CDP compliance confirmed.',
       running: 'Verifying zoning regulations, land use permissions, and CDP compliance for development approval.',
       failed: 'Zoning verification failed. Unable to access CDP records. Manual verification required.',
       pending: 'Zoning analysis pending. Waiting for survey number validation.'
     },
     risk_assessment_agent: {
       completed: 'Risk assessment completed. Medium risk profile identified. Primary concerns: conversion timeline, market volatility.',
       running: 'Evaluating investment risks including regulatory, market, and execution risks for development project.',
       failed: 'Risk assessment failed due to incomplete financial data. Requesting additional input parameters.',
       pending: 'Risk assessment queued. Waiting for legal verification results.'
     },
     document_agent: {
       completed: 'Document generation completed. Created EC, RTC, and mutation extracts. All templates processed successfully.',
       running: 'Generating required legal documents including encumbrance certificate and revenue records.',
       failed: 'Document generation failed. Template rendering error for legal report. Investigating issue.',
       pending: 'Document generation pending. Waiting for legal verification to complete.'
     },
     valuation_agent: {
       completed: 'Property valuation completed. Current market value: ₹52.3L. Fair value assessment: ₹48.7L.',
       running: 'Performing comprehensive property valuation using market comparables and development potential analysis.',
       failed: 'Valuation failed due to insufficient comparable data. Expanding search criteria and retrying.',
       pending: 'Valuation analysis pending. Waiting for market analysis completion.'
     }
   };
 
   return summaries[agentType] ? summaries[agentType][status] : `${agentType} execution ${status}`;
 }
 
 // Helper function to generate mock input data
 function generateInputData(agentType) {
   const inputs = {
     feasibility_agent: {
       survey_number: '257/3A',
       village: 'Huskur',
       taluk: 'Anekal',
       area_acres: 1.0,
       property_type: 'agricultural'
     },
     legal_agent: {
       owner_name: 'Suresh Gowda',
       survey_number: '257/3A',
       verification_period: '30_years',
       document_types: ['title_deed', 'encumbrance', 'mutation']
     },
     financial_agent: {
       land_cost: 5000000,
       conversion_cost: 1250000,
       development_cost: 1500000,
       market_rate: 2800
     },
     market_analysis_agent: {
       location: 'Anekal, Bangalore Urban',
       radius_km: 5,
       property_type: 'residential_plots',
       analysis_period: '24_months'
     },
     zoning_agent: {
       survey_number: '257/3A',
       current_classification: 'agricultural',
       intended_use: 'residential_layout',
       area_sqft: 43560
     },
     risk_assessment_agent: {
       investment_amount: 7750000,
       project_timeline: 36,
       market_conditions: 'stable',
       regulatory_complexity: 'medium'
     },
     document_agent: {
       land_id: 'BangaloreUrban-Anekal-Huskur-257_3A',
       document_types: ['EC', 'RTC', 'Mutation', 'Legal_Report'],
       template_version: '2.1'
     },
     valuation_agent: {
       property_details: {
         area_acres: 1.0,
         location: 'Huskur Village',
         infrastructure_score: 75,
         market_access: 'good'
       }
     }
   };
 
   return inputs[agentType] || { agent_type: agentType };
 }
 
 // Helper function to generate mock output data
 function generateOutputData(agentType) {
   const outputs = {
     feasibility_agent: {
       feasibility_score: 78,
       development_potential: 'high',
       infrastructure_rating: 'moderate',
       approval_timeline: '8-12 months',
       key_challenges: ['conversion approval', 'infrastructure development']
     },
     legal_agent: {
       title_status: 'clear',
       encumbrance_entries: 2,
       legal_issues: ['pending mutation'],
       risk_level: 'low',
       recommendation: 'proceed with caution'
     },
     financial_agent: {
       roi_percentage: 45.2,
       payback_period_months: 18,
       net_profit: 8950000,
       break_even_price: 1850,
       investment_grade: 'B+'
     },
     market_analysis_agent: {
       current_rate: 2800,
       growth_rate: 12,
       comparable_properties: 5,
       market_sentiment: 'positive',
       price_trend: 'upward'
     },
     zoning_agent: {
       zoning_compliance: 'requires_conversion',
       cdp_status: 'compliant',
       setback_requirements: '30ft',
       density_allowed: '35 plots/acre',
       approval_probability: 85
     },
     risk_assessment_agent: {
       overall_risk: 'medium',
       risk_factors: ['market volatility', 'regulatory delays'],
       mitigation_strategies: ['phased development', 'price hedging'],
       confidence_level: 82
     },
     document_agent: {
       documents_generated: 4,
       successful_templates: ['EC', 'RTC', 'Legal_Report'],
       failed_templates: [],
       total_pages: 15,
       processing_time: '2.3 seconds'
     },
     valuation_agent: {
       market_value: 5230000,
       fair_value: 4870000,
       appreciation_potential: 'high',
       value_per_sqft: 1200,
       confidence_score: 88
     }
   };
 
   return outputs[agentType] || { status: 'completed' };
 }
 
 // Helper function to generate error messages
 function generateErrorMessage(agentType) {
   const errors = {
     feasibility_agent: 'Survey data incomplete. Missing infrastructure details.',
     legal_agent: 'Unable to access revenue department records. Network timeout.',
     financial_agent: 'Invalid market rate data. Calculation parameters out of range.',
     market_analysis_agent: 'Insufficient comparable property data. API rate limit exceeded.',
     zoning_agent: 'CDP records unavailable. Government portal maintenance in progress.',
     risk_assessment_agent: 'Risk calculation failed. Missing financial input parameters.',
     document_agent: 'Template rendering failed. Invalid document format specification.',
     valuation_agent: 'Valuation model error. Comparable property data insufficient.'
   };
 
   return errors[agentType] || 'Unknown error occurred during agent execution';
 }
 
 // GET /api/logs/stats/:landId - Get execution statistics
 router.get('/stats/:landId', async (req, res) => {
   try {
     const { landId } = req.params;
     const { timeframe = '7d' } = req.query;
 
     // Mock statistics data
     const stats = {
       land_id: landId,
       timeframe: timeframe,
       execution_stats: {
         total_executions: 127,
         successful_executions: 108,
         failed_executions: 12,
         pending_executions: 7,
         success_rate: 85.0,
         avg_execution_time: 15.7
       },
       agent_performance: {
         feasibility_agent: { executions: 18, success_rate: 94.4, avg_time: 12.3 },
         legal_agent: { executions: 15, success_rate: 80.0, avg_time: 22.1 },
         financial_agent: { executions: 21, success_rate: 90.5, avg_time: 8.7 },
         market_analysis_agent: { executions: 16, success_rate: 87.5, avg_time: 18.4 },
         zoning_agent: { executions: 14, success_rate: 78.6, avg_time: 25.2 },
         risk_assessment_agent: { executions: 19, success_rate: 89.5, avg_time: 14.1 },
         document_agent: { executions: 13, success_rate: 92.3, avg_time: 6.8 },
         valuation_agent: { executions: 11, success_rate: 81.8, avg_time: 19.6 }
       },
       error_patterns: [
         { error_type: 'API_TIMEOUT', count: 5, percentage: 41.7 },
         { error_type: 'DATA_INSUFFICIENT', count: 4, percentage: 33.3 },
         { error_type: 'VALIDATION_ERROR', count: 2, percentage: 16.7 },
         { error_type: 'SYSTEM_ERROR', count: 1, percentage: 8.3 }
       ]
     };
 
     res.json({
       success: true,
       data: stats
     });
 
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to fetch execution statistics',
       message: error.message
     });
   }
 });
 
 module.exports = router;