const express = require('express');
const router = express.Router();

// GET /api/test
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 API is working!',
    timestamp: new Date().toISOString()
  });
});

// GET /api/test/health
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'Server is healthy 💚',
    uptime: `${Math.floor(process.uptime())} seconds`
  });
});

module.exports = router;