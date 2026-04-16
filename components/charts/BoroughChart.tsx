'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { REGION_META } from '@/lib/data/nyc'

const COLORS = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe']

interface Props {
  metric?: 'venues' | 'songwriters'
  regionKey?: string
}

export default function BoroughChart({ metric = 'venues', regionKey = 'nyc' }: Props) {
  const meta = REGION_META[regionKey] ?? REGION_META.nyc
  const data = meta.districts.map(d => ({
    name: d.name,
    venues: d.venues,
    songwriters: d.songwriters,
  }))

  const isNyc = regionKey === 'nyc'
  const districtLabel = isNyc ? 'Borough' : 'District'

  return (
    <div className="card-glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white mb-1">
        {metric === 'venues'
          ? `Eligible Venues by ${districtLabel}`
          : `Songwriter Population by ${districtLabel}`}
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Estimated {meta.label} distribution of Sinfonik participation potential
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            contentStyle={{
              background: '#0d1526',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#94a3b8', fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Bar
            dataKey={metric}
            name={metric === 'venues' ? 'Venues' : 'Songwriters'}
            radius={[0, 4, 4, 0]}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
