import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input } from '../components/ui'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div>
          <p className="text-sm font-medium text-slate-500">Welcome back</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Login to Notes</h1>
          <p className="mt-2 text-sm text-slate-500">Use your email and password. A new user is created automatically if the email does not exist.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <Input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <Input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
          </div>
          {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={busy}>
            {busy ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
