import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'


const API_URL = 'http://localhost:5000/api'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ICONS (inline SVG — no emoji, no extra deps)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
)

const ICONS = {
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  chat: 'M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  bulb: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  note: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  check: 'M5 13l4 4L19 7',
  checkCircle: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  cross: 'M6 18L18 6M6 6l12 12',
  target: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-4a6 6 0 100-12 6 6 0 000 12zm0-3a3 3 0 100-6 3 3 0 000 6z',
  upload: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9m0-9l-3 3m3-3l3 3',
  chevron: 'M19 9l-7 7-7-7',
  arrowRight: 'M14 5l7 7m0 0l-7 7m7-7H3',
  inbox: 'M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0l-2.5 5H6.5L4 13m16 0h-4l-1 2h-6l-1-2H4',
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  QUESTION CARD WITH DROPDOWN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const QuestionCard = ({ q, i, color, darkMode, text, innerCard }) => {
  const [open, setOpen] = useState(false)

  const colorMap = {
    blue:   { tip: 'text-blue-300',   label: 'text-blue-400',   border: 'border-blue-500/30',   answer: 'text-blue-100',   bg: 'bg-blue-500/5' },
    yellow: { tip: 'text-yellow-300', label: 'text-yellow-400', border: 'border-yellow-500/30', answer: 'text-yellow-100', bg: 'bg-yellow-500/5' },
    green:  { tip: 'text-green-300',  label: 'text-green-400',  border: 'border-green-500/30',  answer: 'text-green-100',  bg: 'bg-green-500/5' },
  }
  const c = colorMap[color]

  return (
    <div className={`${innerCard} rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} transition-all duration-300 overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex items-start justify-between gap-4 text-left">
        <p className={`${text} font-medium leading-relaxed`}>Q{i + 1}. {q.question}</p>
        <Icon path={ICONS.chevron} className={`${c.label} w-5 h-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {open && (
        <div className={`px-5 pb-5 border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-200'}`}>
          <div className="pt-4 space-y-3">
            {q.answer && (
              <div className={`rounded-xl p-4 ${c.bg} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${c.label} mb-2 flex items-center gap-1.5`}>
                  <Icon path={ICONS.chat} className="w-3.5 h-3.5" /> Model Answer
                </p>
                <p className={`${c.answer} text-sm leading-relaxed`}>{q.answer}</p>
              </div>
            )}
            {q.tip && (
              <div className="flex items-start gap-2">
                <span className={`${c.label} text-xs font-semibold uppercase tracking-wider shrink-0 mt-0.5 flex items-center gap-1`}>
                  <Icon path={ICONS.bulb} className="w-3.5 h-3.5" /> Tip:
                </span>
                <p className={`${c.tip} text-sm`}>{q.tip}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Dashboard = ({ darkMode, setDarkMode }) => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [resumeId, setResumeId] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setHistoryLoading(true)
    try {
      const res = await axios.get(`${API_URL}/resume/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setHistory(res.data.resumes)
    } catch (error) {
      console.error('Failed to fetch history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    validateAndSetFile(file)
  }

  const validateAndSetFile = (file) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only!')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB!')
      return
    }
    setSelectedFile(file)
    toast.success('File selected!')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) validateAndSetFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file first!')
      return
    }
    setLoading(true)
    setAnalysis(null)
    setQuestions(null)
    try {
      const formData = new FormData()
      formData.append('resume', selectedFile)
      toast.info('Uploading resume...')

      const uploadRes = await axios.post(
        `${API_URL}/resume/upload`, formData,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }}
      )

      const id = uploadRes.data.resume.id
      setResumeId(id)
      toast.info('Analyzing with AI...')

      const analyzeRes = await axios.post(
        `${API_URL}/analysis/analyze/${id}`, {},
        { headers: { 'Authorization': `Bearer ${token}` }}
      )

      setAnalysis(analyzeRes.data.analysis)
      toast.success('Resume analyzed!')
      fetchHistory()

    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const handleHistoryClick = (resume) => {
    if (!resume.score) {
      toast.info('This resume has not been analyzed yet!')
      return
    }
    setAnalysis({
      score: resume.score,
      strengths: resume.strengths || [],
      improvements: resume.improvements || [],
      suggestions: resume.suggestions || [],
      summary: resume.summary || ''
    })
    setResumeId(resume._id)
    setQuestions(null)
    setHistoryOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.success(`Loaded: ${resume.originalName}`)
  }

  const handleGenerateQuestions = async () => {
    if (!resumeId) return
    setQuestionsLoading(true)
    setQuestions(null)
    try {
      toast.info('Generating interview questions...')
      const res = await axios.post(
        `${API_URL}/analysis/questions/${resumeId}`, {},
        { headers: { 'Authorization': `Bearer ${token}` }}
      )
      setQuestions(res.data.questions)
      toast.success('Interview questions ready!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate questions!')
    } finally {
      setQuestionsLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreGlow = (score) => {
    if (score >= 70) return '0 0 30px rgba(74, 222, 128, 0.3)'
    if (score >= 50) return '0 0 30px rgba(250, 204, 21, 0.3)'
    return '0 0 30px rgba(248, 113, 113, 0.3)'
  }

  const getScoreBorder = (score) => {
    if (score >= 70) return 'border-green-400'
    if (score >= 50) return 'border-yellow-400'
    return 'border-red-400'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-400' }
    if (score >= 70) return { label: 'Good', color: 'text-green-400' }
    if (score >= 50) return { label: 'Average', color: 'text-yellow-400' }
    return { label: 'Needs Work', color: 'text-red-400' }
  }

  const bg = darkMode ? 'bg-gray-950' : 'bg-slate-100'
  const card = darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200'
  const text = darkMode ? 'text-white' : 'text-gray-900'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'
  const innerCard = darkMode ? 'bg-gray-800/80' : 'bg-gray-50'

  return (
    <div className={`min-h-screen ${bg} relative overflow-hidden`}>

      {darkMode && (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${text}`}>Dashboard</h1>
          <p className={`${subtext} mt-1`}>Upload your resume and get instant AI-powered insights</p>
        </div>

        {/* Stats Bar */}
        {analysis && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Resume Score', value: `${analysis.score}/100`, color: 'text-indigo-400' },
              { label: 'Strengths Found', value: analysis.strengths.length, color: 'text-green-400' },
              { label: 'Improvements', value: analysis.improvements.length, color: 'text-yellow-400' },
            ].map((stat, i) => (
              <div key={i} className={`${card} border rounded-2xl p-4 text-center backdrop-blur-sm`}>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className={`${subtext} text-xs mt-1`}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Upload Section */}
        <div className={`${card} rounded-3xl border p-8 mb-6 backdrop-blur-sm`}
          style={{ boxShadow: darkMode ? '0 0 40px rgba(99,102,241,0.08)' : 'none' }}>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Icon path={ICONS.document} className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${text}`}>Upload Resume</h2>
              <p className={`${subtext} text-sm`}>PDF format only, max 5MB</p>
            </div>
          </div>

          <div
            onClick={() => document.getElementById('resumeFile').click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              dragOver
                ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
                : selectedFile
                  ? 'border-indigo-500 bg-indigo-500/5'
                  : darkMode
                    ? 'border-gray-700 hover:border-indigo-500 hover:bg-indigo-500/5'
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
            }`}>

            <div className="flex justify-center mb-4">
              <Icon
                path={selectedFile ? ICONS.checkCircle : ICONS.upload}
                className={`w-12 h-12 transition-colors duration-300 ${
                  dragOver ? 'text-indigo-400' : selectedFile ? 'text-indigo-500' : subtext
                }`}
              />
            </div>

            {selectedFile ? (
              <div>
                <p className={`${text} font-semibold`}>{selectedFile.name}</p>
                <p className="text-indigo-400 text-sm mt-1">{(selectedFile.size / 1024).toFixed(1)} KB • Ready to analyze</p>
              </div>
            ) : (
              <div>
                <p className={`${text} font-medium`}>{dragOver ? 'Drop file here' : 'Drop your resume here'}</p>
                <p className={`${subtext} text-sm mt-1`}>or click to browse files</p>
              </div>
            )}

            <input type="file" id="resumeFile" accept=".pdf" className="hidden" onChange={handleFileSelect}/>
          </div>

          {selectedFile && (
            <button onClick={() => setSelectedFile(null)}
              className="mt-3 text-gray-500 hover:text-red-400 text-sm transition-all flex items-center gap-1">
              <Icon path={ICONS.cross} className="w-3.5 h-3.5" /> Remove file
            </button>
          )}

          <button onClick={handleUpload}
            disabled={loading || !selectedFile}
            className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-300"
            style={{ boxShadow: (!loading && selectedFile) ? '0 0 25px rgba(99,102,241,0.4)' : 'none' }}>
            {loading
              ? <span className="flex items-center justify-center gap-2">Processing your resume...</span>
              : <span className="flex items-center justify-center gap-2">Upload & Analyze</span>
            }
          </button>
        </div>

        {/* Resume History */}
        <div className={`${card} rounded-3xl border p-8 mb-6 backdrop-blur-sm`}
          style={{ boxShadow: darkMode ? '0 0 40px rgba(99,102,241,0.08)' : 'none' }}>

          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Icon path={ICONS.clock} className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h2 className={`text-xl font-bold ${text}`}>Resume History</h2>
                <p className={`${subtext} text-sm`}>{history.length} resume{history.length !== 1 ? 's' : ''} uploaded • click to view</p>
              </div>
            </div>
            <Icon path={ICONS.chevron} className={`${subtext} w-6 h-6 transition-transform duration-300 ${historyOpen ? 'rotate-180' : 'rotate-0'}`} />
          </button>

          {historyOpen && (
            <div className="mt-6">
              {historyLoading ? (
                <div className="text-center py-8">
                  <p className={subtext}>Loading history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <Icon path={ICONS.inbox} className={`w-10 h-10 mx-auto mb-3 ${subtext}`} />
                  <p className={subtext}>No resumes uploaded yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {history.slice(0, 5).map((resume, i) => {
                      const score = resume.score
                      const scoreColor = score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : score ? 'text-red-400' : 'text-gray-500'
                      const scoreBg = score >= 70 ? 'bg-green-500/10 border-green-500/20' : score >= 50 ? 'bg-yellow-500/10 border-yellow-500/20' : score ? 'bg-red-500/10 border-red-500/20' : 'bg-gray-500/10 border-gray-700'

                      return (
                        <div
                          key={i}
                          onClick={() => handleHistoryClick(resume)}
                          className={`${innerCard} rounded-2xl p-4 border ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} flex items-center justify-between gap-4 cursor-pointer hover:border-indigo-500/50 hover:scale-[1.01] transition-all duration-200`}>

                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                              <Icon path={ICONS.document} className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className={`${text} font-medium text-sm truncate`}>{resume.originalName}</p>
                              <p className={`${subtext} text-xs mt-0.5`}>
                                {new Date(resume.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className={`px-3 py-1.5 rounded-xl border text-sm font-bold ${scoreBg} ${scoreColor}`}>
                              {score ? `${score}/100` : 'Not analyzed'}
                            </div>
                            {score && <Icon path={ICONS.arrowRight} className="w-4 h-4 text-indigo-400" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {history.length > 5 && (
                    <p className={`${subtext} text-xs text-center mt-4`}>
                      Showing 5 of {history.length} resumes
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className={`${card} rounded-3xl border p-8 mb-6 backdrop-blur-sm`}
            style={{ boxShadow: darkMode ? '0 0 40px rgba(99,102,241,0.08)' : 'none' }}>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Icon path={ICONS.chart} className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${text}`}>Analysis Results</h2>
                <p className={`${subtext} text-sm`}>AI-powered resume evaluation</p>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center mb-8">
              <div
                className={`w-40 h-40 rounded-full border-8 ${getScoreBorder(analysis.score)} flex flex-col items-center justify-center mb-3 transition-all`}
                style={{ boxShadow: getScoreGlow(analysis.score) }}>
                <span className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </span>
                <span className={`${subtext} text-sm`}>/ 100</span>
              </div>
              <span className={`text-sm font-semibold px-4 py-1 rounded-full ${getScoreLabel(analysis.score).color} bg-gray-800/50 border border-gray-700`}>
                {getScoreLabel(analysis.score).label}
              </span>
            </div>

            {/* Summary */}
            <div className={`${innerCard} rounded-2xl p-5 mb-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon path={ICONS.note} className={`w-4 h-4 ${subtext}`} />
                <h3 className={`${subtext} text-sm font-semibold uppercase tracking-wider`}>Summary</h3>
              </div>
              <p className={`${text} leading-relaxed`}>{analysis.summary}</p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                  <Icon path={ICONS.checkCircle} className="w-4 h-4" /> Strengths
                </h3>
                <ul className="space-y-3">
                  {analysis.strengths.map((item, i) => (
                    <li key={i} className="text-green-300 text-sm flex items-start gap-2">
                      <Icon path={ICONS.check} className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                  <Icon path={ICONS.cross} className="w-4 h-4" /> Improvements
                </h3>
                <ul className="space-y-3">
                  {analysis.improvements.map((item, i) => (
                    <li key={i} className="text-red-300 text-sm flex items-start gap-2">
                      <Icon path={ICONS.cross} className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 mb-8">
              <h3 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
                <Icon path={ICONS.bulb} className="w-4 h-4" /> Suggestions
              </h3>
              <ul className="space-y-3">
                {analysis.suggestions.map((item, i) => (
                  <li key={i} className="text-indigo-300 text-sm flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={questionsLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-300">
              {questionsLoading ? 'Generating Questions...' : 'Generate Interview Questions'}
            </button>

            <button
              onClick={() => navigate(`/jobmatch/${resumeId}`)}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 mt-4"
              style={{ boxShadow: '0 0 25px rgba(99,102,241,0.4)' }}>
              Match with Job Description
            </button>
          </div>
        )}

        {/* Interview Questions */}
        {questions && (
          <div className={`${card} rounded-3xl border p-8 backdrop-blur-sm`}
            style={{ boxShadow: darkMode ? '0 0 40px rgba(99,102,241,0.08)' : 'none' }}>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Icon path={ICONS.target} className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${text}`}>Interview Questions</h2>
                <p className={`${subtext} text-sm`}>Click any question to see the answer</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
                <h3 className="text-blue-400 font-semibold text-base">Technical Questions</h3>
              </div>
              <div className="space-y-3">
                {questions.technical.map((q, i) => (
                  <QuestionCard key={i} q={q} i={i} color="blue" darkMode={darkMode} text={text} innerCard={innerCard} />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
                <h3 className="text-yellow-400 font-semibold text-base">Behavioral Questions</h3>
              </div>
              <div className="space-y-3">
                {questions.behavioral.map((q, i) => (
                  <QuestionCard key={i} q={q} i={i} color="yellow" darkMode={darkMode} text={text} innerCard={innerCard} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                <h3 className="text-green-400 font-semibold text-base">HR Questions</h3>
              </div>
              <div className="space-y-3">
                {questions.hr.map((q, i) => (
                  <QuestionCard key={i} q={q} i={i} color="green" darkMode={darkMode} text={text} innerCard={innerCard} />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
