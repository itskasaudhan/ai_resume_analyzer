import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import JobMatch from './pages/JobMatch'
import { AuthProvider } from './context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/jobmatch/:resumeId" element={
              <ProtectedRoute>
                <JobMatch />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App