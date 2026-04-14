import Navigation from '@/components/Navigation'
import { BookOpen, Lock, Eye, Layers } from 'lucide-react'

const MODULES = [
  {
    id: 'A',
    title: 'Business Adoption',
    question: 'How many venues or public entities adopt Sinfonik, and at what pace?',
    inputs: ['Adoption rate (% of eligible venues)', 'Business type distribution', 'Ramp-up speed'],
    outputs: ['Adopting venue count', 'Adopting business count', 'Coverage footprint'],
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'B',
    title: 'Music Exposure',
    question: 'How much additional exposure do local artists get under each adoption scenario?',
    inputs: ['Local artist share slider', 'Avg. music hours per user/day', 'Venue reach multiplier'],
    outputs: ['Local exposure gain', 'Effective audience reach', 'Discovery probability'],
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'C',
    title: 'Royalty / Income Transmission',
    question: 'How does exposure convert into songwriter income, mechanical royalties, or downstream discovery?',
    inputs: ['Royalty pass-through rate', 'Mechanical royalty pool size', 'Discovery conversion'],
    outputs: ['Royalty lift ($)', 'Median income lift per songwriter', 'Top-line royalty pool delta'],
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'D',
    title: 'Regional Economic Impact',
    question: 'How does added creative income and reduced licensing friction affect local output and jobs?',
    inputs: ['Regional output multiplier', 'Employment elasticity', 'Business savings per adopter'],
    outputs: ['Total economic output delta ($)', 'Jobs supported', 'Tourism spillover', 'Tax revenue ROI'],
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'E',
    title: 'Distributional Impact',
    question: 'How do gains change income concentration among songwriters, and what does that imply for Gini and poverty?',
    inputs: ['Gini calibration coefficient', 'Poverty conversion assumption', 'Income distribution model'],
    outputs: ['Gini coefficient change', 'Poverty rate change', 'Songwriter income distribution shift'],
    color: 'from-rose-500 to-pink-600',
  },
]

const PUBLIC_INPUTS = [
  'Region (city, county, state, or country)',
  'Venue adoption rate (0–100%)',
  'Local artist share (0–100%)',
  'Timeframe (1, 3, or 5 years)',
  'Scenario type: conservative / base / accelerated',
]

const PRIVATE_INPUTS = [
  'Exact weighting scheme and output multipliers',
  'Full causal chain and internal formulas',
  'Calibration factors by region',
  'Assumptions about pass-through from exposure to royalties',
  'Any proprietary benchmarks from pilots',
  'Sensitivity ranges not for public release',
  'Scenario scoring rules for "conservative / base / accelerated"',
]

export default function MethodologyPage() {
  return (
    <div className="min-h-screen pb-20">
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 pt-28">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <BookOpen size={18} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Methodology</h1>
            <p className="text-sm text-slate-400">Enough transparency to look credible — without revealing the proprietary engine</p>
          </div>
        </div>
      </div>
    </div>
  )
}
