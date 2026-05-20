import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 dark:bg-gray-900 light:bg-white border-b border-gray-800 dark:border-gray-800 px-6 py-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <h1 className="text-xl font-bold text-white dark:text-white">ResumeAI</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Dark/Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all"
            title="Toggle dark/light mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span className="text-gray-400 text-sm">👋 {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-xl transition-all">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar