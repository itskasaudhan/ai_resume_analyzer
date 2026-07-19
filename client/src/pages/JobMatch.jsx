import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'


const API_URL = 'https://ai-resume-analyzer-2-70e6.onrender.com/api'

const JobMatch = () => {
  const { resumeId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [match, setMatch] = useState(null)

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description!')
      return
    }
    setLoading(true)
    setMatch(null)
    try {
      const res = await axios.post(
        `${API_URL}/analysis/match/${resumeId}`,
        { jobDescription },
        { headers: { 'Authorization': `Bearer ${token}` }}
      )
      setMatch(res.data.match)
      toast.success('Match analysis done! ')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBorder = (score) => {
    if (score >= 70) return 'border-green-400'
    if (score >= 50) return 'border-yellow-400'
    return 'border-red-400'
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-all">
            ← Back
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white"> Job Description Matcher</h2>
            <p className="text-gray-400">Paste a job description to see how well your resume matches</p>
          </div>
        </div>

        {/* JD Input */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 mb-8">
          <label className="text-gray-400 text-sm mb-2 block">
            Paste Job Description Here
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            placeholder="Paste the full job description here..."
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-indigo-500 transition-all resize-none"
          />
          <button
            onClick={handleMatch}
            disabled={loading || !jobDescription.trim()}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all">
            {loading ? ' Analyzing Match...' : ' Match My Resume'}
          </button>
        </div>

        {/* Results */}
        {match && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-8"> Match Results</h2>

            {/* Match Score */}
            <div className="flex justify-center mb-8">
              <div className={`w-36 h-36 rounded-full border-8 ${getScoreBorder(match.matchScore)} flex flex-col items-center justify-center`}>
                <span className={`text-4xl font-bold ${getScoreColor(match.matchScore)}`}>
                  {match.matchScore}%
                </span>
                <span className="text-gray-400 text-sm">Match</span>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2"> Summary</h3>
              <p className="text-white">{match.summary}</p>
            </div>

            {/* Matched & Missing Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              {/* Matched Keywords */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <h3 className="text-green-400 font-semibold mb-3"> Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {match.matchedKeywords.map((keyword, i) => (
                    <span key={i}
                      className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <h3 className="text-red-400 font-semibold mb-3"> Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {match.missingKeywords.map((keyword, i) => (
                    <span key={i}
                      className="bg-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Strengths */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
              <h3 className="text-indigo-400 font-semibold mb-3"> Strengths</h3>
              <ul className="space-y-2">
                {match.strengths.map((item, i) => (
                  <li key={i} className="text-indigo-300 text-sm flex items-start gap-2">
                    <span>✓</span><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <h3 className="text-yellow-400 font-semibold mb-3"> Improvements Needed</h3>
              <ul className="space-y-2">
                {match.improvements.map((item, i) => (
                  <li key={i} className="text-yellow-300 text-sm flex items-start gap-2">
                    <span>{i + 1}.</span>
                    <span><strong>{item.area}:</strong> {item.suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default JobMatch