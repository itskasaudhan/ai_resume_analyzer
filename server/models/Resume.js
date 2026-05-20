const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  suggestions: {
    type: [String],
    default: []
  },
  strengths: {
    type: [String],
    default: []
  },
  improvements: {
    type: [String],
    default: []
  },
  summary: {
    type: String,
    default: ''
  },
  analysis: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);