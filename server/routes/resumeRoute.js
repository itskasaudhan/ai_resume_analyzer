const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadResume, getMyResumes } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MULTER SETUP (File Upload Config)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// POST /api/resume/upload
router.post('/upload', protect, upload.single('resume'), uploadResume);

// GET /api/resume/my
router.get('/my', protect, getMyResumes);

module.exports = router;