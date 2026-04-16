import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'
import { Badge, Button, Card, Input, SectionTitle, Textarea } from '../components/ui'
import api from '../api/client'
import { formatDateOnly } from '../utils/date'
import { useAuth } from '../context/AuthContext'

const blankForm = { title: '', description: '' }

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(blankForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const loadNotes = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/notes')
      setNotes(data.notes || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const handleCreate = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/notes/create', form)
      setForm(blankForm)
      setFormOpen(false)
      setInfo('Note created')
      await loadNotes()
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create note')
    } finally {
      setSaving(false)
    }
  }

  const count = useMemo(() => notes.length, [notes])

  const openAdmin = async () => {
    if (user?.role === 'admin') {
      navigate('/admin')
      return
    }
    setInfo('Only admins can open the admin dashboard')
  }

  const signOut = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={signOut} onCreate={() => setFormOpen(true)} onGoAdmin={openAdmin} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionTitle
          title="Your dashboard"
          subtitle={`You have ${count} note${count === 1 ? '' : 's'}`}
          actions={<Button onClick={() => setFormOpen(true)}>New note</Button>}
        />

        {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        {info ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{info}</p> : null}

        {formOpen ? (
          <Card className="mt-6 p-5">
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                <Textarea rows="5" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create note'}</Button>
                <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        ) : null}

        <div className="mt-6">
          {loading ? (
            <div className="text-sm text-slate-500">Loading notes...</div>
          ) : notes.length === 0 ? (
            <EmptyState
              title="No notes yet"
              subtitle="Create your first note to see it here."
              action={<Button onClick={() => setFormOpen(true)}>Create note</Button>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map(note => (
                <button
                  key={note._id}
                  onClick={() => navigate(`/note/${note._id}`)}
                  className="text-left"
                >
                  <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-slate-900">{note.title}</h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                          {note.description || 'No description'}
                        </p>
                      </div>
                      <Badge>{user?.role || 'user'}</Badge>
                    </div>
                    <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      {formatDateOnly(note.createdAt)}
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
