const express = require('express');
const router = express.Router();
const { analyzeResume, generateQuestions, matchJobDescription } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze/:resumeId', protect, analyzeResume);
router.post('/questions/:resumeId', protect, generateQuestions);
router.post('/match/:resumeId', protect, matchJobDescription);

module.exports = router;