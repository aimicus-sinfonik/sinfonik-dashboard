'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

// Proportional estimates by borough (NYC venue density / songwriter population)
const BOROUGH_DATA = [
  { borough: 'Manhattan', venues: 680, songwriters: 18200, impact: 1.0 },
  { borough: 'Brooklyn', venues: 510, songwriters: 14300, impact: 0.82 },
  { borough: 'Queens', venues: 290, songwriters: 7800, impact: 0.54 },
  { borough: 'Bronx', venues: 200, songwriters: 4900, impact: 0.41 },
  { borough: 'Staten I.', venues: 170, songwriters: 1800, impact: 0.28 },
]

const COLORS = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe']

interface Props {
  metric?: 'venues' | 'songwriters'
}

export default function BoroughChart({ metric = 'venues' }: Props) {
  return (
    <div className="card-glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white mb-1">
        {metric === 'venues' ? 'Eligible Venues by Borough' : 'Songwriter Population by Borough'}
      </h3>
      <p className="text-xs text-slate-500 mb-4">Estimated distribution of Sinfonik participation potential</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={BOROUGH_DATA} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="borough" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={68} />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8', fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Bar dataKey={metric} name={metric === 'venues' ? 'Venues' : 'Songwriters'} radius={[0, 4, 4, 0]}>
            {BOROUGH_DATA.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
