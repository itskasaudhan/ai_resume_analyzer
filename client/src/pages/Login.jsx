import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const API_URL = 'https://ai-resume-analyzer-2-70e6.onrender.com/api'

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
        toast.success('Login successful! 🎉')
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
        toast.success('Account created! 🎉')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">

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
          className="absolute top-4 right-4 text-xl px-3 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 transition-all backdrop-blur-sm border border-gray-700">
          {darkMode ? '☀️' : '🌙'}
        </button>
      )}

      {/* Main card */}
      <div className={`w-full max-w-md relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-4 backdrop-blur-sm">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">ResumeAI</h1>
          <p className="text-gray-400 mt-2 text-sm">Analyze your resume with the power of AI</p>

          {/* Feature badges */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {['AI Powered', 'Instant Analysis', 'Free'].map(badge => (
              <span key={badge} className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                ✦ {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50"
          style={{ boxShadow: '0 0 60px rgba(99, 102, 241, 0.15)' }}>

          {/* Tabs */}
          <div className="flex mb-8 bg-gray-800/80 rounded-2xl p-1">
            {['login', 'register'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}>
                {tab === 'login' ? '🔑 Login' : '✨ Register'}
              </button>
            ))}
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Email</label>
                <input type="email" required
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-600 text-sm"
                  placeholder="you@example.com"/>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Password</label>
                <input type="password" required
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-600 text-sm"
                  placeholder="••••••••"/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2 shadow-lg"
                style={{ boxShadow: loading ? 'none' : '0 0 20px rgba(99, 102, 241, 0.4)' }}>
                {loading ? '⏳ Logging in...' : 'Login →'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Full Name</label>
                <input type="text" required
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-600 text-sm"
                  placeholder="Your Name"/>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Email</label>
                <input type="email" required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-600 text-sm"
                  placeholder="you@example.com"/>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Password</label>
                <input type="password" required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-600 text-sm"
                  placeholder="••••••••"/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2 shadow-lg"
                style={{ boxShadow: loading ? 'none' : '0 0 20px rgba(99, 102, 241, 0.4)' }}>
                {loading ? '⏳ Creating account...' : 'Create Account →'}
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Powered by Groq AI • Built with React & Node.js
        </p>
      </div>
    </div>
  )
}

export default Login