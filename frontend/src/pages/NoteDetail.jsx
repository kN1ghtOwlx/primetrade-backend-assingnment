import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Button, Card, Input, Textarea } from '../components/ui'
import api from '../api/client'
import { formatDateTime } from '../utils/date'
import { useAuth } from '../context/AuthContext'

export default function NoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [note, setNote] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const loadNote = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/notes/${id}`)
      setNote(data)
      setTitle(data.title || '')
      setDescription(data.description || '')
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load note')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNote()
  }, [id])

  const signOut = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.put(`/notes/update/${id}`, { title, description })
      setInfo('Note updated')
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not update note')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    setError('')
    try {
      await api.delete(`/notes/delete/${id}`)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not delete note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={signOut} onCreate={() => navigate('/')} onGoAdmin={() => navigate('/admin')} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-sm text-slate-500">Loading note...</div>
        ) : note ? (
          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-500">Created on {formatDateTime(note.createdAt)}</p>
              <h1 className="text-2xl font-semibold text-slate-900">{note.title}</h1>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                <Textarea rows="8" value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update'}</Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/')}>Back</Button>
                <Button type="button" variant="danger" onClick={handleDelete} disabled={saving}>Delete</Button>
              </div>
            </form>

            {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            {info ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{info}</p> : null}
          </Card>
        ) : (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error || 'Note not found'}</p>
        )}
      </main>
    </div>
  )
}
