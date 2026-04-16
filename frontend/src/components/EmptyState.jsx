export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <p className="text-base font-medium text-slate-900">{title}</p>
      {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
