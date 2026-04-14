'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

const INCOME_BRACKETS = [
  { label: '<$15k', baseline: 18, scenario: 11 },
  { label: '$15–25k', baseline: 22, scenario: 16 },
  { label: '$25–40k', baseline: 25, scenario: 22 },
  { label: '$40–65k', baseline: 18, scenario: 24 },
  { label: '$65–100k', baseline: 11, scenario: 17 },
  { label: '>$100k', baseline: 6, scenario: 10 },
]

interface Props {
  adoptionRate?: number
}

export default function IncomeDistributionChart({ adoptionRate = 0.3 }: Props) {
  // Scale shift based on adoption rate
  const shift = adoptionRate * 0.5
  const data = INCOME_BRACKETS.map(b => ({
    ...b,
    scenario: Math.max(1, Math.round(b.scenario + (b.label.includes('<') ? -b.scenario * shift : b.scenario * shift * 0.3))),
  }))

  return (
    <div className="card-glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white mb-1">Songwriter Income Distribution</h3>
      <p className="text-xs text-slate-500 mb-4">% of songwriters in each bracket — baseline vs. Sinfonik scenario</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8', fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
          <Bar dataKey="baseline" name="Baseline" fill="#1e3a5f" radius={[3, 3, 0, 0]} />
          <Bar dataKey="scenario" name="Sinfonik Scenario" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
