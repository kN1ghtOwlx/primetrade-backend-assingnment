import { Link, useLocation } from 'react-router-dom'
import { Badge, Button } from './ui'

export default function Navbar({ user, onLogout, onCreate, onGoAdmin }) {
  const location = useLocation()
  const isAdmin = user?.role === 'admin'

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">N</div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Notes</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isAdmin ? 'green' : 'slate'}>{user?.role || 'user'}</Badge>
          {location.pathname !== '/' ? <Button variant="secondary" onClick={onCreate}>New note</Button> : null}
          {isAdmin ? <Button variant="secondary" onClick={onGoAdmin}>Admin dashboard</Button> : null}
          <Button onClick={onLogout}>Logout</Button>
        </div>
      </div>
    </header>
  )
}
