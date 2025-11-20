import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ConfigWizard from './pages/ConfigWizard'
import Editor from './pages/Editor'
import './index.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

import { ThemeProvider } from './components/ThemeContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/config"
              element={
                <ProtectedRoute>
                  <ConfigWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:projectId"
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
