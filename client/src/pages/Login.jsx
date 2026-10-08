import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const API_URL = 'http://localhost:5000/api'

const FloatingOrb = ({ style }) => (
  <div className="absolute rounded-full blur-3xl opacity-20 animate-pulse" style={style} />
)

const Login = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })
  const [mounted, setMounted] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/auth/login`, loginData)
      if (res.data.success) {
        login(res.data.user, res.data.token)
        toast.success('Login successful!')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed!')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/auth/register`, registerData)
      if (res.data.success) {
        login(res.data.user, res.data.token)
        toast.success('Account created!')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed!')
    } finally {
      setLoading(false)
    }
  }

  // ── theme-dependent classes, same pattern as Dashboard.jsx ──
  const bg = darkMode ? 'bg-gray-950' : 'bg-slate-100'
  const card = darkMode ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white border-gray-200'
  const text = darkMode ? 'text-white' : 'text-gray-900'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'
  const inputBg = darkMode ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'
  const tabInactive = darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
  const tabBg = darkMode ? 'bg-gray-800/80' : 'bg-gray-200/80'

  return (
    <div className={`min-h-screen ${bg} flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300`}>

      {/* Animated background orbs */}
      <FloatingOrb style={{ width: 400, height: 400, background: '#6366f1', top: '-100px', left: '-100px', animationDuration: '4s' }} />
      <FloatingOrb style={{ width: 300, height: 300, background: '#8b5cf6', bottom: '-80px', right: '-80px', animationDuration: '6s' }} />
      <FloatingOrb style={{ width: 200, height: 200, background: '#3b82f6', top: '50%', left: '60%', animationDuration: '5s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Dark/Light toggle */}
      {setDarkMode && (
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-4 right-4 p-2.5 rounded-xl ${darkMode ? 'bg-gray-800/80 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-100 border-gray-300'} transition-all backdrop-blur-sm border`}>
          {darkMode ? (
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      )}

      {/* Main card */}
      <div className={`w-full max-w-md relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className={`text-4xl font-bold ${text} tracking-tight`}>ResumeAI</h1>
          <p className={`${subtext} mt-2 text-sm`}>Analyze your resume with the power of AI</p>

          {/* Feature badges */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {['AI Powered', 'Instant Analysis', 'Free'].map(badge => (
              <span key={badge} className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className={`${card} backdrop-blur-xl rounded-3xl shadow-2xl p-8 border transition-colors duration-300`}
          style={{ boxShadow: '0 0 60px rgba(99, 102, 241, 0.15)' }}>

          {/* Tabs */}
          <div className={`flex mb-8 ${tabBg} rounded-2xl p-1`}>
            {['login', 'register'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : tabInactive
                }`}>
                {tab === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={`${subtext} text-xs font-medium mb-2 block uppercase tracking-wider`}>Email</label>
                <input type="email" required
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className={`w-full ${inputBg} rounded-xl px-4 py-3 outline-none border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm`}
                  placeholder="you@example.com"/>
              </div>
              <div>
                <label className={`${subtext} text-xs font-medium mb-2 block uppercase tracking-wider`}>Password</label>
                <input type="password" required
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className={`w-full ${inputBg} rounded-xl px-4 py-3 outline-none border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm`}
                  placeholder="••••••••"/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2 shadow-lg"
                style={{ boxShadow: loading ? 'none' : '0 0 20px rgba(99, 102, 241, 0.4)' }}>
                {loading ? 'Logging in...' : 'Login →'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className={`${subtext} text-xs font-medium mb-2 block uppercase tracking-wider`}>Full Name</label>
                <input type="text" required
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  className={`w-full ${inputBg} rounded-xl px-4 py-3 outline-none border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm`}
                  placeholder="Your Name"/>
              </div>
              <div>
                <label className={`${subtext} text-xs font-medium mb-2 block uppercase tracking-wider`}>Email</label>
                <input type="email" required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  className={`w-full ${inputBg} rounded-xl px-4 py-3 outline-none border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm`}
                  placeholder="you@example.com"/>
              </div>
              <div>
                <label className={`${subtext} text-xs font-medium mb-2 block uppercase tracking-wider`}>Password</label>
                <input type="password" required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  className={`w-full ${inputBg} rounded-xl px-4 py-3 outline-none border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm`}
                  placeholder="••••••••"/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2 shadow-lg"
                style={{ boxShadow: loading ? 'none' : '0 0 20px rgba(99, 102, 241, 0.4)' }}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <p className={`text-center ${darkMode ? 'text-gray-600' : 'text-gray-400'} text-xs mt-6`}>
          
        </p>
      </div>
    </div>
  )
}

export default Login
