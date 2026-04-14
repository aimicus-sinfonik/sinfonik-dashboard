import { NextRequest, NextResponse } from 'next/server'
import { runScenario } from '@/lib/model'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const region = searchParams.get('region') ?? 'nyc'
  const scenarioA = searchParams.get('scenarioA') ?? 'conservative'
  const scenarioB = searchParams.get('scenarioB') ?? 'accelerated'
  const adoption = Number(searchParams.get('adoption') ?? 0.3)
  const localShare = Number(searchParams.get('localShare') ?? 0.5)

  if (!['conservative', 'base', 'accelerated'].includes(scenarioA) ||
      !['conservative', 'base', 'accelerated'].includes(scenarioB)) {
    return NextResponse.json({ error: 'Invalid scenario type' }, { status: 422 })
  }

  const baseInputs = {
    region,
    adoptionRate: adoption,
    localArtistShare: localShare,
    avgHoursPerDay: 3.5,
    tourismUpliftFactor: 1.0,
    policySupport: 0.3,
    timeframeYears: 3 as const,
  }

  const [resultA, resultB] = await Promise.all([
    Promise.resolve(runScenario({ ...baseInputs, scenarioType: scenarioA as 'conservative' | 'base' | 'accelerated' })),
    Promise.resolve(runScenario({ ...baseInputs, scenarioType: scenarioB as 'conservative' | 'base' | 'accelerated' })),
  ])

  return NextResponse.json({
    region,
    [scenarioA]: resultA,
    [scenarioB]: resultB,
    delta: {
      economicOutput: resultB.economicOutputDelta - resultA.economicOutputDelta,
      employment: resultB.employmentDelta - resultA.employmentDelta,
      gini: resultB.giniChange - resultA.giniChange,
      poverty: resultB.povertyChange - resultA.povertyChange,
    }
  })
}
