import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NoteDetail from './pages/NoteDetail'
import AdminDashboard from './pages/AdminDashboard'
import AdminUserDetail from './pages/AdminUserDetail'
import ProtectedRoute from './components/ProtectedRoute'
import AdminOnlyRoute from './components/AdminOnlyRoute'

function RedirectHome() {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/note/:id" element={<ProtectedRoute><NoteDetail /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminOnlyRoute><AdminDashboard /></AdminOnlyRoute></ProtectedRoute>} />
          <Route path="/admin/user/:userId" element={<ProtectedRoute><AdminOnlyRoute><AdminUserDetail /></AdminOnlyRoute></ProtectedRoute>} />
          <Route path="*" element={<RedirectHome />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
