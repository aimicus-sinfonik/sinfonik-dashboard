interface MetricCardProps {
  label: string
  baseline: string
  scenario: string
  delta: string
  deltaPositive?: boolean
  sublabel?: string
  icon?: React.ReactNode
}

export default function MetricCard({
  label, baseline, scenario, delta, deltaPositive = true, sublabel, icon
}: MetricCardProps) {
  return (
    <div className="card-glass rounded-2xl p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">{label}</div>
          {sublabel && <div className="text-xs text-slate-600">{sublabel}</div>}
        </div>
        {icon && <div className="text-sky-400 opacity-60">{icon}</div>}
      </div>

      <div className="flex items-end gap-3">
        <div>
          <div className="text-2xl font-bold text-white">{scenario}</div>
          <div className="text-xs text-slate-600 mt-0.5">Sinfonik scenario</div>
        </div>
        <div className="mb-1">
          <div className="text-xs text-slate-500">vs. baseline</div>
          <div className="text-xs text-slate-500">{baseline}</div>
        </div>
      </div>

      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold self-start ${
        deltaPositive
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'bg-rose-500/15 text-rose-400'
      }`}>
        {deltaPositive ? '▲' : '▼'} {delta}
      </div>
    </div>
  )
}
