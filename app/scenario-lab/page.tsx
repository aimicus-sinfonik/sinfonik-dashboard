'use client'

import { useState, useCallback, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import {
  FlaskConical, Pin, X, TrendingUp, Users, DollarSign,
  BarChart3, Music, Building2,
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend,
} from 'recharts'
import { REGION_META } from '@/lib/data/nyc'

interface ScenarioResult {
  economicOutputDelta: number
  economicOutputTotal: number
  employmentDelta: number
  employmentTotal: number
  giniChange: number
  povertyChange: number
  medianIncomeLift: number
  mechanicalRoyaltyLift: number
  smallBusinessSavings: number
  tourismSpillover: number
  taxRevenueImpact: number
  giniTotal: number
  povertyRateTotal: number
  medianIncomeTotal: number
  narrative: string
  confidenceLow: number
  confidenceHigh: number
}

interface LabInputs {
  adoptionRate: number
  localArtistShare: number
  tourismUpliftFactor: number
  policySupport: number
  scenarioType: 'conservative' | 'base' | 'accelerated'
  timeframeYears: 1 | 3 | 5
}

interface SavedScenario {
  id: string
  label: string
  inputs: LabInputs
  result: ScenarioResult
  color: string
  regionKey: string
}

const PIN_COLORS = ['#0ea5e9', '#a855f7', '#10b981', '#f59e0b']

const DEFAULT_INPUTS: LabInputs = {
  adoptionRate: 0.3,
  localArtistShare: 0.5,
  tourismUpliftFactor: 1.05,
  policySupport: 0.3,
  scenarioType: 'base',
  timeframeYears: 3,
}

const RADAR_MAXES = {
  economicOutputDelta: 700_000_000,
  employmentDelta: 22_000,
  giniImprovement: 0.07,
  povertyReduction: 0.12,
  medianIncomeLift: 28_000,
}

const fmt = (n: number, d = 0) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: d }).format(n)
const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`
const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`

function normalize(val: number, max: number) {
  return Math.min(100, Math.max(0, Math.round((val / max) * 100)))
}

const RADAR_AXES = [
  'Economic Output',
  'Employment',
  'Songwriter Equity',
  'Poverty Reduction',
  'Income Lift',
]

function getRadarValues(r: ScenarioResult): number[] {
  return [
    normalize(r.economicOutputDelta, RADAR_MAXES.economicOutputDelta),
    normalize(r.employmentDelta, RADAR_MAXES.employmentDelta),
    normalize(-r.giniChange, RADAR_MAXES.giniImprovement),
    normalize(-r.povertyChange, RADAR_MAXES.povertyReduction),
    normalize(r.medianIncomeLift, RADAR_MAXES.medianIncomeLift),
  ]
}

function buildRadarData(
  current: ScenarioResult | null,
  pinned: SavedScenario[]
): Record<string, string | number>[] {
  return RADAR_AXES.map((axis, i) => {
    const row: Record<string, string | number> = { axis }
    if (current) row.current = getRadarValues(current)[i]
    pinned.forEach((s, j) => { row[`pin_${j}`] = getRadarValues(s.result)[i] })
    return row
  })
}

function buildComparisonData(pinned: SavedScenario[]): Record<string, string | number>[] {
  return [
    {
      metric: 'Output ($M)',
      ...Object.fromEntries(pinned.map((s, j) => [`pin_${j}`, +(s.result.economicOutputDelta / 1_000_000).toFixed(1)])),
    },
    {
      metric: 'Jobs',
      ...Object.fromEntries(pinned.map((s, j) => [`pin_${j}`, s.result.employmentDelta])),
    },
    {
      metric: 'Income Lift ($k)',
      ...Object.fromEntries(pinned.map((s, j) => [`pin_${j}`, +(s.result.medianIncomeLift / 1_000).toFixed(1)])),
    },
    {
      metric: 'Royalty ($M)',
      ...Object.fromEntries(pinned.map((s, j) => [`pin_${j}`, +(s.result.mechanicalRoyaltyLift / 1_000_000).toFixed(1)])),
    },
  ]
}

let _idCounter = 0

export default function ScenarioLabPage() {
  const [regionKey, setRegionKey] = useState<string>('nyc')
  const [inputs, setInputs] = useState<LabInputs>(DEFAULT_INPUTS)
  const [result, setResult] = useState<ScenarioResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [pinned, setPinned] = useState<SavedScenario[]>([])

  const run = useCallback(async (key: string, inp: LabInputs) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/region/${key}/run-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adoptionRate: inp.adoptionRate,
          localArtistShare: inp.localArtistShare,
          tourismUpliftFactor: inp.tourismUpliftFactor,
          policySupport: inp.policySupport,
          scenarioType: inp.scenarioType,
          timeframeYears: inp.timeframeYears,
          avgHoursPerDay: 3.5,
        }),
      })
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { run(regionKey, inputs) }, [run, regionKey, inputs])

  const pin = () => {
    if (!result || pinned.length >= 4) return
    const meta = REGION_META[regionKey]
    const label = [
      meta?.shortLabel ?? regionKey.toUpperCase(),
      `${Math.round(inputs.adoptionRate * 100)}% adopt`,
      `${Math.round(inputs.localArtistShare * 100)}% local`,
      inputs.scenarioType,
      `${inputs.timeframeYears}yr`,
    ].join(' · ')
    setPinned(p => [
      ...p,
      {
        id: String(++_idCounter),
        label,
        inputs,
        result,
        color: PIN_COLORS[p.length % PIN_COLORS.length],
        regionKey,
      },
    ])
  }

  const unpin = (id: string) => setPinned(p => p.filter(s => s.id !== id))

  const radarData = buildRadarData(result, pinned)
  const comparisonData = pinned.length > 0 ? buildComparisonData(pinned) : []

  return (
    <div className="min-h-screen pb-24">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 pt-28">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium uppercase tracking-widest mb-2">
              <FlaskConical size={14} />
              Scenario Lab
            </div>
            <h1 className="text-3xl font-extrabold text-white">Explore Adoption Futures</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Tune all parameters and pin snapshots to compare outcomes side-by-side
            </p>
          </div>
          <div className="flex gap-2">
            {Object.entries(REGION_META).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setRegionKey(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  regionKey === key ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
                style={regionKey !== key ? { background: 'rgba(255,255,255,0.06)' } : {}}
              >
                {meta.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Controls + Live Results */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-6 mb-8">

          {/* Controls */}
          <div className="card-glass rounded-2xl p-6 flex flex-col gap-5">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Parameters</div>

            {[
              {
                key: 'adoptionRate' as const,
                label: 'Venue Adoption Rate',
                min: 0, max: 100,
                toDisplay: (v: number) => Math.round(v * 100),
                fromDisplay: (v: number) => v / 100,
                fmtDisplay: (v: number) => `${v}%`,
              },
              {
                key: 'localArtistShare' as const,
                label: 'Local Artist Share',
                min: 0, max: 100,
                toDisplay: (v: number) => Math.round(v * 100),
                fromDisplay: (v: number) => v / 100,
                fmtDisplay: (v: number) => `${v}%`,
              },
              {
                key: 'tourismUpliftFactor' as const,
                label: 'Tourism Uplift Factor',
                min: 100, max: 200,
                toDisplay: (v: number) => Math.round(v * 100),
                fromDisplay: (v: number) => v / 100,
                fmtDisplay: (v: number) => `${(v / 100).toFixed(2)}×`,
              },
              {
                key: 'policySupport' as const,
                label: 'Policy Support Level',
                min: 0, max: 100,
                toDisplay: (v: number) => Math.round(v * 100),
                fromDisplay: (v: number) => v / 100,
                fmtDisplay: (v: number) => `${v}%`,
              },
            ].map(({ key, label, min, max, toDisplay, fromDisplay, fmtDisplay }) => {
              const display = toDisplay(inputs[key] as number)
              const pct = ((display - min) / (max - min)) * 100
              return (
                <div key={key}>
                  <label className="text-xs text-slate-400 flex justify-between mb-2">
                    <span>{label}</span>
                    <span className="text-sky-400 font-semibold">{fmtDisplay(display)}</span>
                  </label>
                  <input
                    type="range" min={min} max={max} value={display}
                    onChange={e => setInputs(i => ({ ...i, [key]: fromDisplay(Number(e.target.value)) }))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, #0ea5e9 ${pct}%, #1e293b ${pct}%)` }}
                  />
                </div>
              )
            })}

            <div>
              <div className="text-xs text-slate-400 mb-2">Scenario Type</div>
              <div className="flex gap-2">
                {(['conservative', 'base', 'accelerated'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setInputs(i => ({ ...i, scenarioType: s }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs capitalize font-medium transition-all ${
                      inputs.scenarioType === s ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    style={inputs.scenarioType !== s ? { background: 'rgba(255,255,255,0.06)' } : {}}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-2">Timeframe</div>
              <div className="flex gap-2">
                {([1, 3, 5] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setInputs(i => ({ ...i, timeframeYears: t }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      inputs.timeframeYears === t ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    style={inputs.timeframeYears !== t ? { background: 'rgba(255,255,255,0.06)' } : {}}
                  >
                    {t}yr
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={pin}
              disabled={!result || pinned.length >= 4}
              className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Pin size={14} />
              Pin Scenario{pinned.length > 0 ? ` (${pinned.length}/4)` : ''}
            </button>
          </div>

          {/* Live results */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: 'Economic Output Δ',
                  value: result ? fmtM(result.economicOutputDelta) : '—',
                  sub: result ? `Total: ${fmtM(result.economicOutputTotal)}` : '',
                  icon: <TrendingUp size={16} />, color: 'text-sky-400',
                },
                {
                  label: 'Jobs Supported Δ',
                  value: result ? `+${fmt(result.employmentDelta)}` : '—',
                  sub: result ? `Total: ${fmt(result.employmentTotal)}` : '',
                  icon: <Users size={16} />, color: 'text-violet-400',
                },
                {
                  label: 'Gini Coefficient Δ',
                  value: result ? result.giniChange.toFixed(3) : '—',
                  sub: result ? `Gini: ${result.giniTotal.toFixed(3)}` : '',
                  icon: <BarChart3 size={16} />, color: 'text-emerald-400',
                },
                {
                  label: 'Poverty Rate Δ',
                  value: result ? `${(result.povertyChange * 100).toFixed(1)}pp` : '—',
                  sub: result ? `Rate: ${fmtPct(result.povertyRateTotal)}` : '',
                  icon: <Music size={16} />, color: 'text-amber-400',
                },
              ].map(({ label, value, sub, icon, color }) => (
                <div key={label} className="card-glass rounded-2xl p-5">
                  <div className={`${color} mb-2 opacity-70`}>{icon}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</div>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: 'Median Income Lift',
                  value: result ? `+$${fmt(result.medianIncomeLift)}` : '—',
                  icon: <DollarSign size={14} />,
                },
                {
                  label: 'Royalty Lift',
                  value: result ? fmtM(result.mechanicalRoyaltyLift) : '—',
                  icon: <Music size={14} />,
                },
                {
                  label: 'Small Biz Savings',
                  value: result ? fmtM(result.smallBusinessSavings) : '—',
                  icon: <Building2 size={14} />,
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="card-glass rounded-xl p-4">
                  <div className="text-sky-400 opacity-50 mb-1">{icon}</div>
                  <div className="text-xs text-slate-500 mb-1">{label}</div>
                  <div className="text-lg font-bold text-white">{value}</div>
                </div>
              ))}
            </div>

            {result && (
              <div className="card-glass rounded-2xl p-5 flex-1">
                <div className="text-xs text-sky-400 font-semibold uppercase tracking-widest mb-2">
                  Model Narrative
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{result.narrative}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Confidence range: {fmtM(result.confidenceLow)} — {fmtM(result.confidenceHigh)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Radar */}
          <div className="card-glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-1">Impact Profile</h3>
            <p className="text-xs text-slate-500 mb-4">
              Normalized scores across 5 dimensions — current scenario{pinned.length > 0 ? ' vs pinned' : ''}
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                {result && (
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                )}
                {pinned.map((s, j) => (
                  <Radar
                    key={s.id}
                    name={s.label}
                    dataKey={`pin_${j}`}
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={0.08}
                    strokeWidth={1.5}
                    strokeDasharray="5 3"
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison bar */}
          <div className="card-glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-1">Pinned Scenario Comparison</h3>
            <p className="text-xs text-slate-500 mb-4">
              {pinned.length === 0
                ? 'Pin scenarios to compare them here'
                : `${pinned.length} scenario${pinned.length > 1 ? 's' : ''} pinned`}
            </p>
            {pinned.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData} barGap={4} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="metric"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0d1526',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: '#94a3b8', fontSize: 12 }}
                    itemStyle={{ fontSize: 11 }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 10, color: '#64748b' }}
                    formatter={(_, entry) => {
                      const idx = parseInt(String(entry.dataKey).replace('pin_', ''))
                      return pinned[idx]?.label ?? entry.dataKey
                    }}
                  />
                  {pinned.map((s, j) => (
                    <Bar
                      key={s.id}
                      dataKey={`pin_${j}`}
                      fill={s.color}
                      radius={[3, 3, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-center">
                <Pin size={28} className="text-slate-700" />
                <p className="text-sm text-slate-600">
                  Adjust parameters and click<br />
                  <span className="text-slate-500">&quot;Pin Scenario&quot;</span> to save a snapshot
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pinned scenario cards */}
        {pinned.length > 0 && (
          <div className="mb-8">
            <div className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-4">
              Pinned Scenarios
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pinned.map((s, j) => (
                <div
                  key={s.id}
                  className="card-glass rounded-2xl p-5 relative"
                  style={{ borderTop: `3px solid ${s.color}` }}
                >
                  <button
                    onClick={() => unpin(s.id)}
                    className="absolute top-3 right-3 text-slate-600 hover:text-white transition-colors"
                  >
                    <X size={13} />
                  </button>
                  <div className="text-xs font-medium text-white mb-3 pr-5 leading-relaxed">
                    {s.label}
                  </div>
                  <div className="space-y-2">
                    {[
                      { k: 'Output Δ', v: fmtM(s.result.economicOutputDelta) },
                      { k: 'Jobs Δ', v: `+${fmt(s.result.employmentDelta)}` },
                      { k: 'Gini Δ', v: s.result.giniChange.toFixed(3), green: true },
                      { k: 'Poverty Δ', v: `${(s.result.povertyChange * 100).toFixed(1)}pp`, green: true },
                      { k: 'Tax ROI', v: fmtM(s.result.taxRevenueImpact) },
                    ].map(({ k, v, green }) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-slate-500">{k}</span>
                        <span className={green ? 'text-emerald-400 font-medium' : 'text-white font-medium'}>
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-3 pt-2 border-t text-xs text-slate-600"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    Scenario #{j + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed bottom-6 right-6 card-glass rounded-full px-4 py-2 text-xs text-sky-400 flex items-center gap-2 z-50">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Recalculating...
        </div>
      )}
    </div>
  )
}
