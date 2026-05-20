const Resume = require('../models/Resume');
const pdfParse = require('pdf-parse');
const fs = require('fs');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UPLOAD RESUME
//  POST /api/resume/upload
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const uploadResume = async (req, res) => {
  try {
    // 1. Check if file was uploaded
    console.log('uploaded');
    console.log(req.file)
    if (!req.file) {
        
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    // 2. Read the uploaded PDF file
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);

    // 3. Extract text from PDF
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    // 4. Check if text was extracted
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF'
      });
    }

    // 5. Save resume to MongoDB
    const resume = await Resume.create({
      user: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      extractedText: extractedText
    });

    // 6. Send response
    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully!',
      resume: {
        id: resume._id,
        originalName: resume.originalName,
        extractedText: resume.extractedText.substring(0, 200) + '...',
        createdAt: resume.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GET MY RESUMES
//  GET /api/resume/my
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select('-extractedText')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { uploadResume, getMyResumes };