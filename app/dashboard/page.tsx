'use client'

import { useState, useEffect, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import MetricCard from '@/components/MetricCard'
import IncomeDistributionChart from '@/components/charts/IncomeDistributionChart'
import BoroughChart from '@/components/charts/BoroughChart'
import TimelineChart from '@/components/charts/TimelineChart'
import { TrendingUp, Users, DollarSign, BarChart3, Building2, Music } from 'lucide-react'

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

const DEFAULT_INPUTS = {
  adoptionRate: 0.3,
  localArtistShare: 0.5,
  scenarioType: 'base' as const,
  timeframeYears: 3,
}

const fmt = (n: number, decimals = 0) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(n)

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`

const fmtIncome = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${Math.round(n).toLocaleString()}`
}

function buildTimeline(result: ScenarioResult | null) {
  const base = 1_100_000_000
  const years = [2025, 2026, 2027, 2028, 2029]
  return years.map((y, i) => {
    const ramp = result ? result.economicOutputDelta * ((i + 1) / 5) : 0
    return {
      year: String(y),
      baseline: base + base * 0.02 * i,
      scenario: base + ramp + base * 0.02 * i,
      confidenceLow: base + ramp * 0.85 + base * 0.02 * i,
      confidenceHigh: base + ramp * 1.15 + base * 0.02 * i,
    }
  })
}

export default function DashboardPage() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [result, setResult] = useState<ScenarioResult | null>(null)
  const [loading, setLoading] = useState(false)

  const runScenario = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/region/nyc/run-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...inputs,
          avgHoursPerDay: 3.5,
          tourismUpliftFactor: 1.05,
          policySupport: 0.3,
        }),
      })
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }, [inputs])

  useEffect(() => { runScenario() }, [runScenario])

  const timeline = buildTimeline(result)

  return (
    <div className="min-h-screen pb-20">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 pt-28">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              New York City
            </div>
            <h1 className="text-3xl font-extrabold text-white">Regional Impact Dashboard</h1>
            <p className="text-slate-400 mt-1 text-sm">
              If NYC adopted Sinfonik across{' '}
              <span className="text-sky-300 font-semibold">{Math.round(inputs.adoptionRate * 100)}%</span>
              {' '}of eligible venues with{' '}
              <span className="text-sky-300 font-semibold">{Math.round(inputs.localArtistShare * 100)}%</span>
              {' '}local artist share...
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            {(['conservative', 'base', 'accelerated'] as const).map(s => (
              <button key={s} onClick={() => setInputs(i => ({ ...i, scenarioType: s }))}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${inputs.scenarioType === s ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
                style={inputs.scenarioType !== s ? { background: 'rgba(255,255,255,0.06)' } : {}}
              >{s}</button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8 card-glass rounded-2xl p-5">
          <div>
            <label className="text-xs text-slate-400 flex justify-between mb-2">
              <span>Venue Adoption Rate</span>
              <span className="text-sky-400 font-semibold">{Math.round(inputs.adoptionRate * 100)}%</span>
            </label>
            <input type="range" min={0} max={100} value={Math.round(inputs.adoptionRate * 100)}
              onChange={e => setInputs(i => ({ ...i, adoptionRate: Number(e.target.value) / 100 }))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #0ea5e9 ${Math.round(inputs.adoptionRate * 100)}%, #1e293b ${Math.round(inputs.adoptionRate * 100)}%)` }}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 flex justify-between mb-2">
              <span>Local Artist Share</span>
              <span className="text-sky-400 font-semibold">{Math.round(inputs.localArtistShare * 100)}%</span>
            </label>
            <input type="range" min={0} max={100} value={Math.round(inputs.localArtistShare * 100)}
              onChange={e => setInputs(i => ({ ...i, localArtistShare: Number(e.target.value) / 100 }))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #0ea5e9 ${Math.round(inputs.localArtistShare * 100)}%, #1e293b ${Math.round(inputs.localArtistShare * 100)}%)` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Economic Output" baseline="$1.1B"
            scenario={result ? fmtM(result.economicOutputTotal) : '-'}
            delta={result ? `+${fmtM(result.economicOutputDelta)}` : '-'}
            icon={<TrendingUp size={18} />} />
          <MetricCard label="Jobs Supported" baseline="35,000"
            scenario={result ? fmt(result.employmentTotal) : '-'}
            delta={result ? `+${fmt(result.employmentDelta)}` : '-'}
            icon={<Users size={18} />} />
          <MetricCard label="Songwriter Inequality" sublabel="Gini coefficient (lower = better)"
            baseline="Gini 0.620"
            scenario={result ? `Gini ${result.giniTotal.toFixed(3)}` : '-'}
            delta={result ? result.giniChange.toFixed(3) : '-'}
            deltaPositive={true} icon={<BarChart3 size={18} />} />
          <MetricCard label="Above Poverty Line" sublabel="Songwriters lifted"
            baseline="73%"
            scenario={result ? `${((1 - result.povertyRateTotal) * 100).toFixed(1)}%` : '-'}
            delta={result ? `+${(Math.abs(result.povertyChange) * 100).toFixed(1)}pp` : '-'}
            icon={<Music size={18} />} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <MetricCard label="Median Songwriter Income" baseline="$33,500/yr"
            scenario={result ? fmtIncome(result.medianIncomeTotal) : '-'}
            delta={result ? `+${fmtIncome(result.medianIncomeLift)}/yr` : '-'}
            icon={<DollarSign size={16} />} />
          <MetricCard label="Mechanical Royalty Lift" sublabel="Additional flow to songwriters"
            baseline="$22M baseline pool"
            scenario={result ? fmtM(22_000_000 + result.mechanicalRoyaltyLift) : '-'}
            delta={result ? `+${fmtM(result.mechanicalRoyaltyLift)}` : '-'}
            icon={<DollarSign size={16} />} />
          <MetricCard label="Small Business Savings" sublabel="Reduced licensing burden"
            baseline="$0 savings"
            scenario={result ? fmtM(result.smallBusinessSavings) : '-'}
            delta={result ? `+${fmtM(result.smallBusinessSavings)}` : '-'}
            icon={<Building2 size={16} />} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <IncomeDistributionChart adoptionRate={inputs.adoptionRate} />
          <BoroughChart metric="venues" />
          <TimelineChart data={timeline} title="Projected Economic Output" unit="$" />
          <BoroughChart metric="songwriters" />
        </div>

        {result && (
          <div className="card-glass rounded-2xl p-6 mb-8">
            <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest mb-3">Model Narrative</h3>
            <p className="text-slate-300 leading-relaxed">{result.narrative}</p>
            <p className="text-xs text-slate-600 mt-3">
              Confidence range: {fmtM(result.confidenceLow)} to {fmtM(result.confidenceHigh)} (+-15% base / +-25% other scenarios)
            </p>
          </div>
        )}

        {loading && (
          <div className="fixed bottom-6 right-6 card-glass rounded-full px-4 py-2 text-xs text-sky-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            Recalculating...
          </div>
        )}
      </div>
    </div>
  )
}
