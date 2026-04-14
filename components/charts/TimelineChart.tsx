'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts'

interface TimelineData {
  year: string
  baseline: number
  scenario: number
  confidenceLow: number
  confidenceHigh: number
}

interface Props {
  data: TimelineData[]
  title: string
  unit?: string
  yDomain?: [number, number]
}

export default function TimelineChart({ data, title, unit = '$M', yDomain }: Props) {
  return (
    <div className="card-glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-4">Projected over 5 years — baseline vs. Sinfonik</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="scenarioGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={yDomain}
            tickFormatter={v => `${unit}${(v / 1_000_000).toFixed(0)}M`}
          />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8', fontSize: 12 }}
            formatter={(v: number) => [`${unit}${(v / 1_000_000).toFixed(1)}M`, '']}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
          <Area type="monotone" dataKey="confidenceHigh" fill="rgba(14,165,233,0.06)" stroke="none" name="" legendType="none" />
          <Area type="monotone" dataKey="confidenceLow" fill="rgba(14,165,233,0.06)" stroke="none" name="" legendType="none" />
          <Line type="monotone" dataKey="baseline" stroke="#1e3a5f" strokeWidth={2} dot={false} name="Baseline" />
          <Line type="monotone" dataKey="scenario" stroke="#0ea5e9" strokeWidth={2.5} dot={false} name="Sinfonik Scenario"
            strokeDasharray="none" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
