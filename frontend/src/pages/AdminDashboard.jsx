import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'
import { Badge, Button, Card } from '../components/ui'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { formatDateOnly } from '../utils/date'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [notesByUser, setNotesByUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [usersRes, notesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/all-notes')
      ])

      const allUsers = usersRes.data.users || []
      const allNotes = notesRes.data.notes || []

      const grouped = {}
      for (const note of allNotes) {
        const id = note.userId?._id || note.userId
        if (!grouped[id]) grouped[id] = []
        grouped[id].push(note)
      }

      setUsers(allUsers)
      setNotesByUser(grouped)
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const signOut = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const totalUsers = useMemo(() => users.length, [users])

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={signOut} onCreate={() => navigate('/')} onGoAdmin={() => navigate('/admin')} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Admin dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Total users: {totalUsers}</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/')}>Back to notes</Button>
        </div>

        {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        {loading ? (
          <div className="mt-6 text-sm text-slate-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No users found" subtitle="The admin list is empty right now." />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map(item => {
              const noteCount = notesByUser[item._id]?.length || 0
              return (
                <button
                  key={item._id}
                  onClick={() => navigate(`/admin/user/${item._id}`)}
                  className="text-left"
                >
                  <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-slate-900">{item.email}</h2>
                        <p className="mt-1 text-sm text-slate-500">Joined {formatDateOnly(item.createdAt)}</p>
                      </div>
                      <Badge tone={item.role === 'admin' ? 'green' : 'slate'}>{item.role}</Badge>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
                      <div>
                        <p className="text-slate-500">Notes</p>
                        <p className="font-semibold text-slate-900">{noteCount}</p>
                      </div>
                    </div>
                  </Card>
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
