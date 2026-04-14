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
  employmentDelta: number
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
const fmtK = (n: number) => `$${(n / 1_000).toFixed(0)}K`

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
        body: JSON.stringify({ ...inputs, avgHoursPerDay: 3.5, tourismUpliftFactor: 1.05, policySupport: 0.3 }),
      })
      setResult(await res.json())
    } finally { setLoading(false) }
  }, [inputs])

  useEffect(() => { runScenario() }, [runScenario])

  return (
    <div className="min-h-screen pb-20">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 pt-28">
        <h1 className="text-3xl font-extrabold text-white mb-2">Regional Impact Dashboard</h1>
        <p className="text-slate-400 mt-1 text-sm mb-6">New York City - base scenario, 30% adoption, 50% local artist share</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Economic Output" baseline="$1.1B" scenario={result ? fmtM(result.economicOutputDelta) : '—'} delta={result ? `+${fmtM(result.economicOutputDelta)}` : '—'} icon={<TrendingUp size={18} />} />
          <MetricCard label="Jobs Supported" baseline="35,000" scenario={result ? `+${fmt(result.employmentDelta)}` : '—'} delta={result ? `+${fmt(result.employmentDelta)}` : '—'} icon={<Users size={18} />} />
          <MetricCard label="Songwriter Inequality" sublabel="Gini coefficient" baseline="Gini 0.620" scenario={result ? `Gini ${result.giniTotal.toFixed(3)}` : '—'} delta={result ? result.giniChange.toFixed(3) : '—'} deltaPositive={true} icon={<BarChart3 size={18} />} />
          <MetricCard label="Median Songwriter Income" baseline="$33,500/yr" scenario={result ? fmtK(result.medianIncomeTotal) : '—'} delta={result ? `+${fmtK(result.medianIncomeLift)}/yr` : '—'} icon={<DollarSign size={16} />} />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <IncomeDistributionChart />
          <BoroughChart metric="venues" />
        </div>
      </div>
    </div>
  )
}
