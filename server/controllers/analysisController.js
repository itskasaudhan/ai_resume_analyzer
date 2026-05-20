const Groq = require('groq-sdk');
const Resume = require('../models/Resume');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ANALYZE RESUME
//  POST /api/analysis/analyze/:resumeId
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const shortText = resume.extractedText.substring(0, 8000);

    const prompt = `You are an expert resume analyzer. Analyze the following resume and provide:
1. A score out of 100
2. Key strengths (3-5 points)
3. Areas for improvement (3-5 points)
4. Specific suggestions to improve the resume

Format your response as JSON with this structure:
{
  "score": <number>,
  "strengths": [<string>, ...],
  "improvements": [<string>, ...],
  "suggestions": [<string>, ...],
  "summary": "<brief overall summary>"
}

Return ONLY the JSON object, no extra text or markdown.

Resume text:
${shortText}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;
    const cleanJSON = responseText.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleanJSON);

    resume.score = analysis.score;
    resume.strengths = analysis.strengths;
    resume.improvements = analysis.improvements;
    resume.suggestions = analysis.suggestions;
    resume.summary = analysis.summary;
    resume.analysis = responseText;
    await resume.save();

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully!',
      analysis: {
        score: analysis.score,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        suggestions: analysis.suggestions,
        summary: analysis.summary
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GENERATE INTERVIEW QUESTIONS
//  POST /api/analysis/questions/:resumeId
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const generateQuestions = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const shortText = resume.extractedText.substring(0, 8000);

    const prompt = `You are an expert technical interviewer. Generate a UNIQUE and DIFFERENT set of questions each time. Do not repeat previous questions. Based on the following resume, generate 10 likely interview questions grouped into 3 categories.

Format your response as JSON:
{
  "technical": [
    { "question": "<question>", "answer": "<detailed model answer 2-3 sentences>", "tip": "<short answer tip>" },
    ...3-4 questions
  ],
  "behavioral": [
    { "question": "<question>", "answer": "<detailed model answer 2-3 sentences>", "tip": "<short answer tip>" },
    ...3 questions
  ],
  "hr": [
    { "question": "<question>", "answer": "<detailed model answer 2-3 sentences>", "tip": "<short answer tip>" },
    ...2-3 questions
  ]
}

Return ONLY the JSON object, no extra text or markdown.

Resume:
${shortText}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 1.0,
    });

    const responseText = completion.choices[0].message.content;
    const cleanJSON = responseText.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleanJSON);

    res.status(200).json({
      success: true,
      message: 'Interview questions generated!',
      questions
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MATCH JOB DESCRIPTION
//  POST /api/analysis/match/:resumeId
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const matchJobDescription = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ success: false, message: 'Job description is required' });

    const resumeText = resume.extractedText.substring(0, 6000);
    const jdText = jobDescription.substring(0, 3000);

    const prompt = `You are an expert ATS (Applicant Tracking System) and career coach. Compare the following resume with the job description and provide a detailed match analysis.

Format your response as JSON:
{
  "matchScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "matchedKeywords": [<keywords found in both resume and JD>],
  "missingKeywords": [<important keywords in JD but missing from resume>],
  "improvements": [
    { "area": "<area name>", "suggestion": "<specific actionable suggestion>" }
  ],
  "strengths": [<things resume does well for this JD>]
}

Return ONLY the JSON object, no extra text or markdown.

Resume:
${resumeText}

Job Description:
${jdText}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;
    const cleanJSON = responseText.replace(/```json|```/g, '').trim();
    const match = JSON.parse(cleanJSON);

    res.status(200).json({
      success: true,
      message: 'Job description matched!',
      match
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyzeResume, generateQuestions, matchJobDescription };