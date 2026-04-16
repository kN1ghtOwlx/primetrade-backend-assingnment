import { useAuth } from '../context/AuthContext'

export default function AdminOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading...</div>
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft">
          <h1 className="text-xl font-semibold text-slate-900">Admin access only</h1>
          <p className="mt-2 text-sm text-slate-500">You do not have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return children
}
