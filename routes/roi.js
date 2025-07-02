 const express = require('express');
 const router = express.Router();
 
 // POST /api/roi/calculate - Calculate ROI for Screen 6
 router.post('/calculate', async (req, res) => {
   try {
     const {
       land_cost,
       conversion_cost,
       dev_cost, 
       market_rate,
       land_area_acres = 1.0,
       plot_size_sqft = 1200
     } = req.body;
 
     // Validate required inputs
     if (!land_cost || !conversion_cost || !dev_cost || !market_rate) {
       return res.status(400).json({
         success: false,
         error: 'land_cost, conversion_cost, dev_cost, and market_rate are required'
       });
     }
 
     // Convert inputs to numbers
     const landCost = parseFloat(land_cost);
     const conversionCost = parseFloat(conversion_cost);
     const devCost = parseFloat(dev_cost);
     const marketRate = parseFloat(market_rate);
     const landAreaAcres = parseFloat(land_area_acres);
     const plotSizeSqft = parseInt(plot_size_sqft);
 
     // ROI Calculations
     const totalLandSqft = landAreaAcres * 43560; // 1 acre = 43,560 sqft
     const usableAreaPercentage = 0.65; // 35% for roads, amenities, setbacks
     const sellableAreaSqft = totalLandSqft * usableAreaPercentage;
     const numberOfPlots = Math.floor(sellableAreaSqft / plotSizeSqft);
     const actualSellableArea = numberOfPlots * plotSizeSqft;
 
     // Cost Calculations
     const totalLandCost = landCost;
     const totalConversionCost = conversionCost;
     const totalDevCost = devCost;
     const marketingCost = actualSellableArea * marketRate * 0.05; // 5% of revenue
     const legalCost = 150000; // Fixed legal/approval costs
     const totalCost = totalLandCost + totalConversionCost + totalDevCost + marketingCost + legalCost;
 
     // Revenue Calculations  
     const totalRevenue = actualSellableArea * marketRate;
     const netProfit = totalRevenue - totalCost;
     const roiPercentage = (netProfit / totalCost) * 100;
 
     // Breakeven Analysis
     const breakevenPrice = totalCost / actualSellableArea;
     const profitMargin = ((marketRate - breakevenPrice) / marketRate) * 100;
 
     // Timeline Analysis
     const paybackPeriodMonths = totalCost / (netProfit / 36); // Assuming 3-year project
 
     const calculationResults = {
       input_parameters: {
         land_cost: landCost,
         conversion_cost: conversionCost,
         development_cost: devCost,
         market_rate: marketRate,
         land_area_acres: landAreaAcres,
         plot_size_sqft: plotSizeSqft
       },
       
       area_analysis: {
         total_land_sqft: Math.round(totalLandSqft),
         sellable_area_sqft: Math.round(actualSellableArea),
         usable_percentage: Math.round(usableAreaPercentage * 100),
         number_of_plots: numberOfPlots,
         area_per_plot: plotSizeSqft
       },
 
       cost_breakdown: {
         land_cost: landCost,
         conversion_cost: conversionCost,
         development_cost: devCost,
         marketing_cost: Math.round(marketingCost),
         legal_approval_cost: legalCost,
         total_cost: Math.round(totalCost)
       },
 
       revenue_analysis: {
         selling_rate_per_sqft: marketRate,
         total_revenue: Math.round(totalRevenue),
         net_profit: Math.round(netProfit),
         roi_percentage: Math.round(roiPercentage * 100) / 100,
         profit_margin_percentage: Math.round(profitMargin * 100) / 100
       },
 
       breakeven_analysis: {
         breakeven_price_per_sqft: Math.round(breakevenPrice),
         margin_above_breakeven: Math.round(marketRate - breakevenPrice),
         minimum_selling_price: Math.round(breakevenPrice * 1.1), // 10% margin
         payback_period_months: Math.round(paybackPeriodMonths)
       },
 
       risk_metrics: {
         investment_grade: netProfit > 0 ? (roiPercentage > 25 ? 'A' : 'B') : 'C',
         risk_level: roiPercentage > 30 ? 'Low' : roiPercentage > 15 ? 'Medium' : 'High',
         sensitivity_to_price_drop: {
           '10_percent_drop': Math.round(((actualSellableArea * marketRate * 0.9) - totalCost)),
           '20_percent_drop': Math.round(((actualSellableArea * marketRate * 0.8) - totalCost))
         }
       },
 
       timeline_projections: {
         land_acquisition: '1-2 months',
         conversion_approval: '8-12 months', 
         development_phase: '12-18 months',
         sales_marketing: '18-24 months',
         total_project_duration: '39-56 months'
       },
 
       key_metrics: {
         sellable_area: Math.round(actualSellableArea),
         total_cost: Math.round(totalCost),
         revenue: Math.round(totalRevenue),
         roi_percentage: Math.round(roiPercentage * 100) / 100,
         breakeven_price: Math.round(breakevenPrice)
       }
     };
 
     res.json({
       success: true,
       message: 'ROI calculation completed successfully',
       data: calculationResults
     });
 
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to calculate ROI',
       message: error.message
     });
   }
 });
 
 // GET /api/roi/market-data - Get market data for ROI calculations
 router.get('/market-data', async (req, res) => {
   try {
     const { district, taluk, property_type = 'residential' } = req.query;
 
     // Mock market data
     const marketData = {
       location: {
         district: district || 'Bangalore Urban',
         taluk: taluk || 'Anekal',
         property_type
       },
       price_trends: {
         current_rate_per_sqft: 2800,
         last_year_rate: 2500,
         growth_percentage: 12,
         projected_rate_3_years: 3500
       },
       comparable_projects: [
         {
           project_name: 'Green Valley Layout',
           distance_km: 2.5,
           selling_rate_per_sqft: 2900,
           plot_sizes: [30, 40, 50],
           sold_percentage: 85
         },
         {
           project_name: 'Sunrise Gardens',
           distance_km: 4.2,
           selling_rate_per_sqft: 2600,
           plot_sizes: [30, 40],
           sold_percentage: 72
         }
       ],
       infrastructure_factors: {
         road_connectivity: 'Good',
         water_availability: 'Moderate',
         power_supply: 'Good',
         proximity_to_city: '25 km',
         schools_hospitals: 'Adequate'
       },
       market_sentiment: 'Positive'
     };
 
     res.json({
       success: true,
       data: marketData
     });
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to fetch market data',
       message: error.message
     });
   }
 });
 
 // POST /api/roi/scenarios - Compare multiple ROI scenarios
 router.post('/scenarios', async (req, res) => {
   try {
     const { scenarios } = req.body;
 
     if (!scenarios || !Array.isArray(scenarios)) {
       return res.status(400).json({
         success: false,
         error: 'scenarios array is required'
       });
     }
 
     // Mock scenario comparison
     const comparisonData = scenarios.map((scenario, index) => {
       const totalLandSqft = (scenario.land_area_acres || 1) * 43560;
       const sellableAreaSqft = totalLandSqft * 0.65;
       const plotsCount = Math.floor(sellableAreaSqft / (scenario.plot_size_sqft || 1200));
       const actualSellableArea = plotsCount * (scenario.plot_size_sqft || 1200);
       
       const totalCost = scenario.land_cost + scenario.conversion_cost + scenario.dev_cost + (actualSellableArea * scenario.market_rate * 0.05) + 150000;
       const totalRevenue = actualSellableArea * scenario.market_rate;
       const netProfit = totalRevenue - totalCost;
       const roiPercentage = (netProfit / totalCost) * 100;
 
       return {
         scenario_id: `scenario_${index + 1}`,
         name: scenario.name || `Scenario ${index + 1}`,
         parameters: scenario,
         results: {
           plots_count: plotsCount,
           sellable_area: actualSellableArea,
           total_cost: Math.round(totalCost),
           total_revenue: Math.round(totalRevenue),
           net_profit: Math.round(netProfit),
           roi_percentage: Math.round(roiPercentage * 100) / 100,
           payback_period_months: Math.ceil((totalCost / (netProfit / 36)))
         }
       };
     });
 
     res.json({
       success: true,
       data: {
         scenarios: comparisonData,
         best_scenario: comparisonData.reduce((best, current) => 
           current.results.roi_percentage > best.results.roi_percentage ? current : best
         )
       }
     });
   } catch (error) {
     res.status(500).json({
       success: false,
       error: 'Failed to compare scenarios',
       message: error.message
     });
   }
 });
 
 module.exports = router;