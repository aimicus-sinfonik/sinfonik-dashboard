// NYC Baseline Data — Sinfonik Regional Impact Model
// All figures are estimates based on publicly available economic data

export const NYC_BASELINE = {
  region: 'nyc',
  name: 'New York City',
  type: 'city',
  population: 8_336_817,

  // Music market
  eligibleVenues: 1_850,          // bars, clubs, hotels, retail with music
  musicBusinesses: 4_200,         // music-using businesses (restaurants, retail, etc.)
  songwriterPopulation: 47_000,   // professional + semi-professional songwriters/musicians
  streamingUsers: 5_100_000,      // estimated active streaming users in NYC

  // Economic baselines
  gdpBaseline: 1_100_000_000,     // $1.1B direct music-sector contribution
  employmentBaseline: 35_000,     // jobs supported by local music ecosystem
  medianSongwriterIncome: 33_500, // USD/year median
  giniBaseline: 0.62,             // songwriter income Gini (0 = equal, 1 = max inequality)
  povertyRateBaseline: 0.27,      // 27% of songwriters below poverty threshold

  // Licensing & royalties
  licensingSpendEstimate: 148_000_000,   // total annual business licensing spend
  mechanicalRoyaltyPool: 22_000_000,     // estimated mechanical royalties generated in NYC

  // Tourism & local economy
  tourismContribution: 68_000_000_000,   // NYC tourism GDP contribution
  smallBusinessCount: 320_000,           // small businesses in NYC
  localArtistExposureBaseline: 0.08,     // 8% of streamed content is local NYC artists

  // Model calibration (kept server-side)
  _private: {
    outputMultiplier: 1.8,           // regional economic multiplier
    employmentElasticity: 0.045,     // jobs per $1M economic output
    royaltyPassThrough: 0.72,        // % of royalties reaching artists
    giniImprovementPerPoint: 0.004,  // Gini reduction per 1% adoption
    povertyLiftPerPoint: 0.0012,     // poverty rate reduction per 1% adoption
    tourismMusicShare: 0.11,         // % of tourism spending attributable to music culture
    localMultiplierCalibration: 0.92,
  }
}

export type RegionBaseline = typeof NYC_BASELINE

export const REGIONS: Record<string, RegionBaseline> = {
  nyc: NYC_BASELINE,
}
