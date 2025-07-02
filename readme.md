 # LayoutGPT Backend API
 
 Complete Node.js backend for the LayoutGPT land intelligence platform.
 
 ## 📁 Project Structure
 
 ```
 backend/
 ├── server.js              # Main Express server
 ├── package.json           # Dependencies & scripts
 ├── README.md              # This file
 └── routes/
     ├── land.js            # Land upload & dashboard APIs
     ├── assistant.js       # AI Assistant API
     ├── agent.js           # Feasibility analysis API
     ├── docs.js            # Document generation API
     ├── roi.js             # ROI calculator API
     └── logs.js            # Debug console API
 ```
 
 ## 🚀 Quick Start
 
 ### 1. Install Dependencies
 ```bash
 cd backend
 npm install
 ```
 
 ### 2. Start the Server
 ```bash
 npm start
 ```
 
 The server will start on http://localhost:5000
 
 ### 3. Health Check
 ```bash
 curl http://localhost:5000/api/health
 ```
 
 ## 📋 API Endpoints
 
 ### Land Management (Screens 1 & 2)
 - `POST /api/land/upload` - Upload land data
 - `GET /api/land/:id` - Get comprehensive land data
 - `GET /api/land/search` - Search land units
 
 ### AI Assistant (Screen 3)
 - `POST /api/assistant/ask` - Ask intelligent questions
 - `GET /api/assistant/suggestions` - Get contextual suggestions
 
 ### Feasibility Analysis (Screen 4)
 - `POST /api/agent/run/feasibility` - Run comprehensive analysis
 
 ### Document Generation (Screen 5)
 - `POST /api/docs/generate` - Generate legal documents
 
 ### ROI Calculator (Screen 6)
 - `POST /api/roi/calculate` - Calculate ROI and financial metrics
 - `GET /api/roi/market-data` - Get market data
 - `POST /api/roi/scenarios` - Compare scenarios
 
 ### Debug Console (Screen 7)
 - `GET /api/logs/:landId` - Get agent execution logs
 - `GET /api/logs/stats/:landId` - Get execution statistics
 
 ## 💻 Sample API Calls
 
 ### Upload Land Data
 ```bash
 curl -X POST "http://localhost:5000/api/land/upload" \
   -H "Content-Type: application/json" \
   -d '{
     "village": "Huskur",
     "taluk": "Anekal", 
     "survey_number": "257/3A"
   }'
 ```
 
 ### Get Dashboard Data
 ```bash
 curl "http://localhost:5000/api/land/Anekal-Huskur-257_3A"
 ```
 
 ### Ask AI Assistant
 ```bash
 curl -X POST "http://localhost:5000/api/assistant/ask" \
   -H "Content-Type: application/json" \
   -d '{
     "question": "What is the ROI potential for this property?",
     "landId": "Anekal-Huskur-257_3A"
   }'
 ```
 
 ### Calculate ROI
 ```bash
 curl -X POST "http://localhost:5000/api/roi/calculate" \
   -H "Content-Type: application/json" \
   -d '{
     "land_cost": 5000000,
     "conversion_cost": 1250000,
     "dev_cost": 1500000,
     "market_rate": 2800
   }'
 ```
 
 ### Generate Document
 ```bash
 curl -X POST "http://localhost:5000/api/docs/generate" \
   -H "Content-Type: application/json" \
   -d '{
     "landId": "Anekal-Huskur-257_3A",
     "docType": "EC"
   }'
 ```
 
 ## 🔧 Features
 
 - **Complete API Coverage**: All 7 screens supported
 - **Realistic Mock Data**: Indian real estate focused
 - **Error Handling**: Proper HTTP status codes and messages
 - **Input Validation**: Required parameter checking
 - **CORS Enabled**: Frontend integration ready
 - **File Upload**: PDF, image, Excel support
 - **Comprehensive Documentation**: Each endpoint documented
 
 ## 📊 Technologies Used
 
 - **Node.js** - Runtime environment
 - **Express.js** - Web framework
 - **Multer** - File upload handling
 - **CORS** - Cross-origin resource sharing
 - **dotenv** - Environment configuration
 
 ## 🌐 Frontend Integration
 
 This backend is designed to work with the 7-screen LayoutGPT frontend:
 
 1. **index.html** → `/api/land/upload`
 2. **dashboard.html** → `/api/land/:id`
 3. **assistant.html** → `/api/assistant/ask`
 4. **feasibility.html** → `/api/agent/run/feasibility`
 5. **documents.html** → `/api/docs/generate`
 6. **roi.html** → `/api/roi/calculate`
 7. **logs.html** → `/api/logs/:landId`
 
 ## 📁 Next Steps
 
 1. **Database Integration**: Add MongoDB/PostgreSQL
 2. **Authentication**: Implement user management
 3. **Real AI Models**: Connect to actual AI services
 4. **Deployment**: Deploy to cloud platform
 5. **Testing**: Add comprehensive test suite
 
 ## 🎯 Business Logic
 
 The API implements authentic Indian real estate workflows:
 - Karnataka land classification and conversion
 - Government document formats (EC, RTC, Mutation)
 - Bangalore market rates and trends
 - Legal compliance and risk assessment
 - Financial modeling with realistic ROI calculations
 
 Perfect for land developers, real estate agents, investors, and legal professionals in the Indian market!