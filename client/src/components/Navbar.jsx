import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const confirmLogout = () => {
    logout()
    navigate('/login')
  }

  const bg = darkMode ? 'bg-gray-900' : 'bg-white'
  const border = darkMode ? 'border-gray-800' : 'border-gray-200'
  const text = darkMode ? 'text-white' : 'text-gray-900'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'
  const toggleBg = darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'

  return (
    <>
      <nav className={`${bg} border-b ${border} px-6 py-4 transition-colors duration-300`}>
        <div className="flex items-center w-full">
          <h1 className={`text-xl font-bold ${text}`}>ResumeAI</h1>

          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl ${toggleBg} transition-all`}
              title="Toggle dark/light mode">
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

            <div
              className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold"
              title={user?.name}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-xl transition-all">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setShowLogoutConfirm(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${bg} rounded-3xl border ${border} p-8 max-w-sm w-full shadow-2xl transition-colors duration-300`}
            style={{ boxShadow: '0 0 60px rgba(0,0,0,0.3)' }}>

            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            <h3 className={`text-lg font-bold ${text} mb-2`}>Log out of ResumeAI?</h3>
            <p className={`${subtext} text-sm mb-6`}>
              You'll need to sign in again to access your dashboard and resume history.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar