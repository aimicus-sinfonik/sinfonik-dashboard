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
    employmentElasticity: 32,         // jobs supported per $1M of incremental economic output (music sector, NYC)
    royaltyPassThrough: 0.72,        // % of royalties reaching artists
    giniImprovementPerPoint: 0.004,  // Gini reduction per 1% adoption
    povertyLiftPerPoint: 0.0012,     // poverty rate reduction per 1% adoption
    tourismMusicShare: 0.11,         // % of tourism spending attributable to music culture
    localMultiplierCalibration: 0.92,
  }
}

export type RegionBaseline = typeof NYC_BASELINE

export const LA_BASELINE: RegionBaseline = {
  region: 'la',
  name: 'Los Angeles',
  type: 'city',
  population: 3_979_576,

  eligibleVenues: 2_100,
  musicBusinesses: 5_800,
  songwriterPopulation: 62_000,
  streamingUsers: 4_200_000,

  gdpBaseline: 1_400_000_000,
  employmentBaseline: 45_000,
  medianSongwriterIncome: 38_000,
  giniBaseline: 0.67,
  povertyRateBaseline: 0.31,

  licensingSpendEstimate: 195_000_000,
  mechanicalRoyaltyPool: 31_000_000,

  tourismContribution: 35_000_000_000,
  smallBusinessCount: 255_000,
  localArtistExposureBaseline: 0.06,

  _private: {
    outputMultiplier: 1.7,
    employmentElasticity: 31,
    royaltyPassThrough: 0.70,
    giniImprovementPerPoint: 0.0038,
    povertyLiftPerPoint: 0.0011,
    tourismMusicShare: 0.13,
    localMultiplierCalibration: 0.89,
  }
}

export const CHICAGO_BASELINE: RegionBaseline = {
  region: 'chicago',
  name: 'Chicago',
  type: 'city',
  population: 2_696_555,

  eligibleVenues: 1_100,
  musicBusinesses: 2_800,
  songwriterPopulation: 22_000,
  streamingUsers: 2_100_000,

  gdpBaseline: 580_000_000,
  employmentBaseline: 18_000,
  medianSongwriterIncome: 28_500,
  giniBaseline: 0.58,
  povertyRateBaseline: 0.24,

  licensingSpendEstimate: 78_000_000,
  mechanicalRoyaltyPool: 11_000_000,

  tourismContribution: 16_000_000_000,
  smallBusinessCount: 135_000,
  localArtistExposureBaseline: 0.07,

  _private: {
    outputMultiplier: 1.6,
    employmentElasticity: 28,
    royaltyPassThrough: 0.68,
    giniImprovementPerPoint: 0.0035,
    povertyLiftPerPoint: 0.0010,
    tourismMusicShare: 0.09,
    localMultiplierCalibration: 0.87,
  }
}

export const REGIONS: Record<string, RegionBaseline> = {
  nyc: NYC_BASELINE,
  la: LA_BASELINE,
  chicago: CHICAGO_BASELINE,
}

export const REGION_META: Record<string, { label: string; shortLabel: string; districts: { name: string; venues: number; songwriters: number }[] }> = {
  nyc: {
    label: 'New York City',
    shortLabel: 'NYC',
    districts: [
      { name: 'Manhattan', venues: 680, songwriters: 18200 },
      { name: 'Brooklyn', venues: 510, songwriters: 14300 },
      { name: 'Queens', venues: 290, songwriters: 7800 },
      { name: 'Bronx', venues: 200, songwriters: 4900 },
      { name: 'Staten I.', venues: 170, songwriters: 1800 },
    ],
  },
  la: {
    label: 'Los Angeles',
    shortLabel: 'LA',
    districts: [
      { name: 'Valley', venues: 580, songwriters: 16800 },
      { name: 'West LA', venues: 490, songwriters: 14200 },
      { name: 'South LA', venues: 360, songwriters: 12400 },
      { name: 'Downtown', venues: 420, songwriters: 11600 },
      { name: 'East LA', venues: 250, songwriters: 7000 },
    ],
  },
  chicago: {
    label: 'Chicago',
    shortLabel: 'Chicago',
    districts: [
      { name: 'North Side', venues: 340, songwriters: 7700 },
      { name: 'Loop/Near N.', venues: 290, songwriters: 5500 },
      { name: 'South Side', venues: 240, songwriters: 4800 },
      { name: 'West Side', venues: 150, songwriters: 2800 },
      { name: 'Other', venues: 80, songwriters: 1200 },
    ],
  },
}
