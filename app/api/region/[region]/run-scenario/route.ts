import { NextRequest, NextResponse } from 'next/server'
import { runScenario, ScenarioInputs } from '@/lib/model'

// Rate limiting (simple in-memory; use Redis in production)
const requestCounts = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30
const WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = requestCounts.get(ip)
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

export async function POST(
  req: NextRequest,
  { params }: { params: { region: string } }
) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: Partial<ScenarioInputs>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate inputs
  const adoptionRate = Number(body.adoptionRate ?? 0.2)
  const localArtistShare = Number(body.localArtistShare ?? 0.4)
  const avgHoursPerDay = Number(body.avgHoursPerDay ?? 3.5)
  const tourismUpliftFactor = Number(body.tourismUpliftFactor ?? 1.0)
  const policySupport = Number(body.policySupport ?? 0)
  const timeframeYears = Number(body.timeframeYears ?? 3)
  const scenarioType = (['conservative', 'base', 'accelerated'].includes(body.scenarioType ?? ''))
    ? (body.scenarioType as ScenarioInputs['scenarioType'])
    : 'base'

  if (
    adoptionRate < 0 || adoptionRate > 1 ||
    localArtistShare < 0 || localArtistShare > 1 ||
    avgHoursPerDay < 0.5 || avgHoursPerDay > 12 ||
    tourismUpliftFactor < 0.5 || tourismUpliftFactor > 3 ||
    policySupport < 0 || policySupport > 1 ||
    ![1, 3, 5].includes(timeframeYears)
  ) {
    return NextResponse.json({ error: 'Input values out of allowed range' }, { status: 422 })
  }

  try {
    const result = runScenario({
      region: params.region.toLowerCase(),
      adoptionRate,
      localArtistShare,
      avgHoursPerDay,
      tourismUpliftFactor,
      scenarioType,
      policySupport,
      timeframeYears,
    })
    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
