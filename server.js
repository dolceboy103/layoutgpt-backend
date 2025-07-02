 const express = require('express');
 const cors = require('cors');
 const multer = require('multer');
 const path = require('path');
 require('dotenv').config();
 
 const app = express();
 const PORT = process.env.PORT || 5000;
 
 // Middleware
 app.use(cors());
 app.use(express.json({ limit: '50mb' }));
 app.use(express.urlencoded({ extended: true, limit: '50mb' }));
 
 // File upload configuration
 const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'uploads/')
   },
   filename: function (req, file, cb) {
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
   }
 });
 
 const upload = multer({ 
   storage: storage,
   limits: {
     fileSize: 10 * 1024 * 1024 // 10MB limit
   },
   fileFilter: (req, file, cb) => {
     // Allow PDFs, images, and Excel files
     const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
     if (allowedTypes.includes(file.mimetype)) {
       cb(null, true);
     } else {
       cb(new Error('Invalid file type. Only PDF, images, and Excel files are allowed.'), false);
     }
   }
 });
 
 // Make upload middleware available globally
 app.locals.upload = upload;
 
 // Routes
 const landRoutes = require('./routes/land');
 const agentRoutes = require('./routes/agent');
 const roiRoutes = require('./routes/roi');
 const docsRoutes = require('./routes/docs');
 const assistantRoutes = require('./routes/assistant');
 const logsRoutes = require('./routes/logs');
 
 // Mount routes
 app.use('/api/land', landRoutes);
 app.use('/api/agent', agentRoutes);
 app.use('/api/roi', roiRoutes);
 app.use('/api/docs', docsRoutes);
 app.use('/api/assistant', assistantRoutes);
 app.use('/api/logs', logsRoutes);
 
 // Health check endpoint
 app.get('/api/health', (req, res) => {
   res.json({ 
     status: 'OK', 
     timestamp: new Date().toISOString(),
     version: '1.0.0',
     service: 'LayoutGPT Backend'
   });
 });
 
 // Error handling middleware
 app.use((error, req, res, next) => {
   if (error instanceof multer.MulterError) {
     if (error.code === 'LIMIT_FILE_SIZE') {
       return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
     }
   }
   
   console.error('Error:', error);
   res.status(500).json({ 
     error: 'Internal server error',
     message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
   });
 });
 
 // 404 handler
 app.use('*', (req, res) => {
   res.status(404).json({ error: 'Route not found' });
 });
 
 // Start server
 app.listen(PORT, () => {
   console.log(`🚀 LayoutGPT Backend running on port ${PORT}`);
   console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
   console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
 });
 
 module.exports = app;