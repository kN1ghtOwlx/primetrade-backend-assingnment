import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'
import { Badge, Button, Card, Input, Textarea } from '../components/ui'
import api from '../api/client'
import { formatDateTime } from '../utils/date'
import { useAuth } from '../context/AuthContext'

export default function AdminUserDetail() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingNoteId, setEditingNoteId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const loadUser = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/admin/users')
      const current = (data.users || []).find(item => item._id === userId)
      setProfile(current || null)

      const notesRes = await api.get(`/admin/user/${userId}`)
      setNotes(notesRes.data.notes || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load user data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [userId])

  const signOut = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const startEdit = note => {
    setEditingNoteId(note._id)
    setTitle(note.title || '')
    setDescription(note.description || '')
  }

  const closeEdit = () => {
    setEditingNoteId('')
    setTitle('')
    setDescription('')
  }

  const saveNote = async e => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.put(`/notes/update/${editingNoteId}`, { title, description })
      setInfo('Note updated')
      closeEdit()
      await loadUser()
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not update note')
    } finally {
      setBusy(false)
    }
  }

  const toggleRole = async () => {
    if (!profile) return
    setBusy(true)
    setError('')
    try {
      const nextRole = profile.role === 'admin' ? 'user' : 'admin'
      await api.put(`/admin/set-role/${profile._id}`, { role: nextRole })
      setInfo(`Role changed to ${nextRole}`)
      await loadUser()
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not change role')
    } finally {
      setBusy(false)
    }
  }

  const deleteNote = async id => {
    setBusy(true)
    setError('')
    try {
      await api.delete(`/notes/delete/${id}`)
      setInfo('Note deleted')
      await loadUser()
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not delete note')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={signOut} onCreate={() => navigate('/')} onGoAdmin={() => navigate('/admin')} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-sm text-slate-500">Loading user...</div>
        ) : profile ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">{profile.email}</h1>
                <p className="mt-1 text-sm text-slate-500">Joined {formatDateTime(profile.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={profile.role === 'admin' ? 'green' : 'slate'}>{profile.role}</Badge>
                <Button variant="secondary" onClick={toggleRole} disabled={busy}>
                  Change role
                </Button>
                <Button variant="secondary" onClick={() => navigate('/admin')}>Back</Button>
              </div>
            </div>

            {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            {info ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{info}</p> : null}

            {editingNoteId ? (
              <Card className="mt-6 p-5">
                <form onSubmit={saveNote} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                    <Input value={title} onChange={e => setTitle(e.target.value)} required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                    <Textarea rows="6" value={description} onChange={e => setDescription(e.target.value)} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save note'}</Button>
                    <Button type="button" variant="secondary" onClick={closeEdit}>Exit</Button>
                  </div>
                </form>
              </Card>
            ) : null}

            <div className="mt-6">
              {notes.length === 0 ? (
                <EmptyState title="No notes for this user" subtitle="This account does not have notes yet." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {notes.map(note => (
                    <div key={note._id} onClick={() => startEdit(note)} className="cursor-pointer text-left">
                      <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                        <h2 className="text-base font-semibold text-slate-900">{note.title}</h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                          {note.description || 'No description'}
                        </p>
                        <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                          {formatDateTime(note.createdAt)}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">Open to edit</span>
                          <Button
                            type="button"
                            variant="ghost"
                            className="ml-auto px-0 text-rose-600 hover:bg-transparent"
                            onClick={e => {
                              e.stopPropagation()
                              deleteNote(note._id)
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyState title="User not found" subtitle="The selected user no longer exists." action={<Button onClick={() => navigate('/admin')}>Back</Button>} />
        )}
      </main>
    </div>
  )
}
