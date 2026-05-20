// ── Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// ── Connect to MongoDB
// ── Create uploads folder if not exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
connectDB();

// ── Create Express app
const app = express();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MIDDLEWARE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const testRoute = require('./routes/testRoute');
const authRoute = require('./routes/authRoute');
const resumeRoute = require('./routes/resumeRoute');
const analysisRoute = require('./routes/analysisRoute');

app.use('/api/test', testRoute);
app.use('/api/auth', authRoute);
app.use('/api/resume', resumeRoute);
app.use('/api/analysis', analysisRoute);
// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎯 AI Resume Analyzer API',
    version: '1.0.0',
    endpoints: {
      test:   '/api/test',
      health: '/api/test/health',
      auth:   '/api/auth   (coming soon)',
      resume: '/api/resume (coming soon)'
    }
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  404 HANDLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GLOBAL ERROR HANDLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  START SERVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🟢 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});