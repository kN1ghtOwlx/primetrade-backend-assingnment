import React from 'react'

export function Button({ className = '', variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100'
  }

  return (
    <button
      className={[
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        styles[variant],
        className
      ].join(' ')}
      {...props}
    />
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={[
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400',
        className
      ].join(' ')}
      {...props}
    />
  )
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={[
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400',
        className
      ].join(' ')}
      {...props}
    />
  )
}

export function Card({ className = '', ...props }) {
  return (
    <div
      className={[
        'rounded-2xl border border-slate-200 bg-white shadow-soft',
        className
      ].join(' ')}
      {...props}
    />
  )
}

export function Badge({ className = '', tone = 'slate', ...props }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700'
  }

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className
      ].join(' ')}
      {...props}
    />
  )
}

export function PageShell({ children }) {
  return <div className="min-h-screen bg-slate-50">{children}</div>
}

export function SectionTitle({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}
