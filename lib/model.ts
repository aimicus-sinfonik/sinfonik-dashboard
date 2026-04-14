// Sinfonik Economic Impact Model — Server-Side Only
// Formulas and calibration coefficients are kept private (never sent to browser)

import { NYC_BASELINE, REGIONS } from './data/nyc'

export interface ScenarioInputs {
  region: string
  adoptionRate: number        // 0–1: fraction of eligible venues adopting Sinfonik
  localArtistShare: number    // 0–1: share of playlist exposure given to local artists
  avgHoursPerDay: number      // avg music usage hours per day per user
  tourismUpliftFactor: number // 1.0 = baseline; >1 = boost from events/tourism
  scenarioType: 'conservative' | 'base' | 'accelerated'
  policySupport: number       // 0–1: level of public policy / grant matching
  timeframeYears?: number     // 1, 3, or 5 years
}

export interface ScenarioOutputs {
  region: string
  scenarioType: string
  timeframeYears: number

  // Delta vs baseline
  economicOutputDelta: number      // USD
  employmentDelta: number          // jobs
  giniChange: number               // negative = more equal
  povertyChange: number            // negative = fewer below poverty
  medianIncomeLift: number         // USD/year per songwriter
  mechanicalRoyaltyLift: number    // USD total
  smallBusinessSavings: number     // USD total
  tourismSpillover: number         // USD indirect tourism impact
  taxRevenueImpact: number         // USD government ROI

  // Absolute (baseline + delta)
  economicOutputTotal: number
  employmentTotal: number
  giniTotal: number
  povertyRateTotal: number
  medianIncomeTotal: number

  // Confidence
  confidenceLow: number
  confidenceHigh: number

  // Narrative
  narrative: string

  // Input echo (safe to return)
  inputs: Omit<ScenarioInputs, 'region'>
}

// Scenario type multipliers — never sent to browser
const SCENARIO_MULTIPLIERS = {
  conservative: 0.65,
  base: 1.0,
  accelerated: 1.45,
}

const POLICY_MULTIPLIER = (policySupport: number) => 1 + policySupport * 0.35

export function runScenario(inputs: ScenarioInputs): ScenarioOutputs {
  const region = REGIONS[inputs.region]
  if (!region) throw new Error(`Unknown region: ${inputs.region}`)

  const priv = region._private
  const timeframe = inputs.timeframeYears ?? 3
  const scenarioMult = SCENARIO_MULTIPLIERS[inputs.scenarioType]
  const policyMult = POLICY_MULTIPLIER(inputs.policySupport)

  // --- Module A: Business adoption ---
  const adoptingVenues = Math.round(region.eligibleVenues * inputs.adoptionRate)
  const adoptingBusinesses = Math.round(region.musicBusinesses * inputs.adoptionRate * 0.7)

  // --- Module B: Music exposure ---
  const localExposureGain = inputs.adoptionRate * inputs.localArtistShare * 0.6
  const reachMultiplier = inputs.avgHoursPerDay / 3.5 // normalized to avg 3.5h baseline
  const effectiveExposure = localExposureGain * reachMultiplier

  // --- Module C: Royalty / income transmission ---
  const royaltyLift = region.mechanicalRoyaltyPool
    * inputs.adoptionRate
    * inputs.localArtistShare
    * priv.royaltyPassThrough
    * scenarioMult
    * policyMult
    * Math.min(timeframe / 3, 1.5)

  const medianIncomeLift = (royaltyLift / region.songwriterPopulation)
    * priv.localMultiplierCalibration
    * scenarioMult

  // --- Module D: Regional economic impact ---
  const directEconomicOutput = adoptingVenues * 85_000       // avg incremental revenue per venue
    + adoptingBusinesses * 12_000                             // avg savings per business
    + royaltyLift

  const totalEconomicOutput = directEconomicOutput
    * priv.outputMultiplier
    * scenarioMult
    * policyMult
    * (1 + (timeframe - 1) * 0.18)   // time compounding

  // employmentElasticity = jobs supported per $1M of incremental economic output
  // scenarioMult is already embedded in totalEconomicOutput — do not apply twice
  const employmentDelta = Math.round(
    (totalEconomicOutput / 1_000_000) * priv.employmentElasticity
  )

  // --- Module E: Distributional impact ---
  const giniChange = -(inputs.adoptionRate * inputs.localArtistShare
    * priv.giniImprovementPerPoint * 100
    * scenarioMult
    * policyMult)

  const povertyChange = -(inputs.adoptionRate * inputs.localArtistShare
    * priv.povertyLiftPerPoint * 100
    * scenarioMult
    * policyMult)

  // --- Tourism & tax spillover ---
  const tourismSpillover = region.tourismContribution
    * priv.tourismMusicShare
    * effectiveExposure
    * (inputs.tourismUpliftFactor - 1 + 0.05)
    * scenarioMult

  const smallBusinessSavings = adoptingBusinesses * 3_200 * scenarioMult

  const taxRevenueImpact = (totalEconomicOutput + tourismSpillover) * 0.065

  // --- Confidence bands ---
  const confidenceWidth = scenarioMult === SCENARIO_MULTIPLIERS.base ? 0.15 : 0.25
  const confidenceLow = totalEconomicOutput * (1 - confidenceWidth)
  const confidenceHigh = totalEconomicOutput * (1 + confidenceWidth)

  // --- Narrative ---
  const adoptionPct = Math.round(inputs.adoptionRate * 100)
  const localPct = Math.round(inputs.localArtistShare * 100)
  const narrative = generateNarrative({
    region: region.name,
    adoptionPct,
    localPct,
    economicOutput: totalEconomicOutput,
    employmentDelta,
    giniChange,
    povertyChange,
    scenarioType: inputs.scenarioType,
    timeframe,
  })

  return {
    region: inputs.region,
    scenarioType: inputs.scenarioType,
    timeframeYears: timeframe,

    economicOutputDelta: totalEconomicOutput,
    employmentDelta,
    giniChange,
    povertyChange,
    medianIncomeLift,
    mechanicalRoyaltyLift: royaltyLift,
    smallBusinessSavings,
    tourismSpillover,
    taxRevenueImpact,

    economicOutputTotal: region.gdpBaseline + totalEconomicOutput,
    employmentTotal: region.employmentBaseline + employmentDelta,
    giniTotal: Math.max(0, region.giniBaseline + giniChange),
    povertyRateTotal: Math.max(0, region.povertyRateBaseline + povertyChange),
    medianIncomeTotal: region.medianSongwriterIncome + medianIncomeLift,

    confidenceLow,
    confidenceHigh,

    narrative,
    inputs: {
      adoptionRate: inputs.adoptionRate,
      localArtistShare: inputs.localArtistShare,
      avgHoursPerDay: inputs.avgHoursPerDay,
      tourismUpliftFactor: inputs.tourismUpliftFactor,
      scenarioType: inputs.scenarioType,
      policySupport: inputs.policySupport,
      timeframeYears: timeframe,
    },
  }
}

function generateNarrative(p: {
  region: string, adoptionPct: number, localPct: number,
  economicOutput: number, employmentDelta: number,
  giniChange: number, povertyChange: number,
  scenarioType: string, timeframe: number
}): string {
  const outputM = (p.economicOutput / 1_000_000).toFixed(0)
  const giniDir = p.giniChange < 0 ? 'decrease' : 'increase'
  const povDir = p.povertyChange < 0 ? 'decrease' : 'increase'
  const povAbs = Math.abs(p.povertyChange * 100).toFixed(1)
  const giniAbs = Math.abs(p.giniChange).toFixed(3)
  return (
    `Under a ${p.scenarioType} scenario, if ${p.region} adopts Sinfonik across ` +
    `${p.adoptionPct}% of eligible venues with ${p.localPct}% local artist share, ` +
    `the region could generate an additional $${outputM}M in economic output and ` +
    `support ${p.employmentDelta.toLocaleString()} new jobs over ${p.timeframe} year${p.timeframe > 1 ? 's' : ''}. ` +
    `Songwriter income inequality is projected to ${giniDir} by ${giniAbs} Gini points, ` +
    `and the songwriter poverty rate would ${povDir} by ${povAbs} percentage points.`
  )
}

export function getBaseline(regionId: string) {
  const region = REGIONS[regionId]
  if (!region) return null

  // Return only public-safe fields
  const { _private, ...publicData } = region
  void _private

  return {
    ...publicData,
    // Pre-computed baseline scenario
    baseline: runScenario({
      region: regionId,
      adoptionRate: 0,
      localArtistShare: 0,
      avgHoursPerDay: 3.5,
      tourismUpliftFactor: 1.0,
      scenarioType: 'base',
      policySupport: 0,
      timeframeYears: 3,
    }),
  }
}
