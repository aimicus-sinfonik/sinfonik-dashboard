import Navigation from '@/components/Navigation'
import { BookOpen, Lock, Eye, Layers, Shield, AlertTriangle } from 'lucide-react'

const MODULES = [
  {
    id: 'A',
    title: 'Business Adoption',
    question: 'How many venues or public entities adopt Sinfonik, and at what pace?',
    what: 'Estimates the number of eligible music-using businesses — bars, clubs, hotels, retail, restaurants — that adopt the Sinfonik platform given a user-supplied adoption rate.',
    publicInputs: ['Adoption rate (% of eligible venues)', 'Business type distribution'],
    publicOutputs: ['Adopting venue count', 'Adopting business count'],
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'B',
    title: 'Music Exposure',
    question: 'How much additional exposure do local artists get under each adoption scenario?',
    what: 'Translates venue adoption and user listening behavior into a measure of local artist exposure gain — combining adoption breadth, playlist allocation, and average daily listening hours.',
    publicInputs: ['Local artist share slider', 'Avg. music hours per user/day'],
    publicOutputs: ['Local exposure gain index', 'Effective audience reach multiplier'],
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'C',
    title: 'Royalty / Income Transmission',
    question: 'How does exposure convert into songwriter income and mechanical royalties?',
    what: 'Connects increased exposure to dollars flowing to songwriters — through mechanical royalties, performance income, and downstream discovery effects. Pass-through rates and conversion assumptions are kept server-side.',
    publicInputs: ['Local artist share', 'Adoption rate', 'Policy support level'],
    publicOutputs: ['Royalty lift ($)', 'Median income lift per songwriter'],
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'D',
    title: 'Regional Economic Impact',
    question: 'How does added creative income and reduced licensing friction affect local output and jobs?',
    what: 'Applies a regional economic multiplier to direct gains (venue revenue, business savings, royalty lift) to estimate total economic output delta. Employment is derived from incremental output using a sector-specific jobs-per-million figure calibrated to the NYC music ecosystem (~32 supported jobs per $1M, consistent with the baseline ratio of 35,000 jobs on $1.1B in music-sector GDP).',
    publicInputs: ['Adoption rate', 'Timeframe (1, 3, or 5 years)', 'Scenario type'],
    publicOutputs: ['Total economic output delta ($)', 'Jobs supported', 'Tourism spillover', 'Tax revenue ROI'],
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'E',
    title: 'Distributional Impact',
    question: 'How do gains change income concentration among songwriters, and what does that imply for Gini and poverty?',
    what: 'Models how royalty and income gains are distributed across the songwriter population. Incremental income tends to flow disproportionately to lower-income songwriters who currently earn little from streaming, shifting the income distribution and reducing the Gini coefficient.',
    publicInputs: ['Adoption rate', 'Local artist share', 'Policy support'],
    publicOutputs: ['Gini coefficient change', 'Poverty rate change', 'Songwriter income distribution shift'],
    color: 'from-rose-500 to-pink-600',
  },
]

const PUBLIC_INPUTS = [
  'Region (city, county, state, or country)',
  'Venue adoption rate (0–100%)',
  'Local artist share (0–100%)',
  'Average music hours per day per user',
  'Tourism / event boost factor',
  'Policy support level (grant matching, etc.)',
  'Timeframe (1, 3, or 5 years)',
  'Scenario type: conservative / base / accelerated',
]

const PRIVATE_INPUTS = [
  'Exact weighting scheme and output multipliers',
  'Full causal chain and internal formulas',
  'Calibration factors by region',
  'Royalty pass-through assumptions',
  'Any proprietary benchmarks from pilots',
  'Sensitivity ranges not for public release',
  'Scenario scoring rules for each scenario type',
  'Regional override parameters',
]

const DESIGN_PRINCIPLES = [
  {
    icon: Eye,
    label: 'Public enough to look serious',
    desc: 'Every headline output — economic delta, jobs, Gini, poverty rate — is sourced from standard economic methodology. Policymakers can follow the logic.',
    color: 'text-sky-400',
  },
  {
    icon: Lock,
    label: 'Private enough to stay proprietary',
    desc: 'Multipliers, elasticities, pass-through rates, and calibration notes live server-side only. The browser never receives them, even in API responses.',
    color: 'text-violet-400',
  },
  {
    icon: Shield,
    label: 'Rigorous enough to defend',
    desc: 'The five-module structure maps directly to established regional economics literature — IO multipliers, labor elasticities, Lorenz curve shifting. Each module can be explained independently.',
    color: 'text-emerald-400',
  },
  {
    icon: Layers,
    label: 'Simple enough to understand',
    desc: 'Sliders expose only the assumptions users actually control. The narrative summary translates outputs into plain English for non-technical audiences.',
    color: 'text-amber-400',
  },
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
            <p className="text-sm text-slate-400">Controlled transparency — credible without exposing the proprietary engine</p>
          </div>
        </div>
        <div className="card-glass rounded-2xl p-8 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">The Core Idea</h2>
          <p className="text-slate-400 leading-relaxed mb-4">The Sinfonik Impact Model separates the system into three layers. The <strong className="text-white">public presentation layer</strong> is what you see here — charts, sliders, scenario comparisons, and narrative summaries for external audiences. The <strong className="text-white">private modeling layer</strong> is where the economic logic lives: multipliers, assumptions, elasticity estimates, and region-specific coefficients — computed server-side, never sent to the browser. The <strong className="text-white">data layer</strong> holds regional inputs — population, venues, songwriter counts, income baselines, and tourism assumptions.</p>
          <p className="text-slate-400 leading-relaxed">This separation lets Sinfonik share visually rich, interactive insights with policymakers, EDOs, labels, and artists — while keeping the strategic modeling engine protected. The dashboard answers <em className="text-slate-300">what happens if a region adopts Sinfonik</em>, without revealing <em className="text-slate-300">exactly how the model reaches that answer</em>.</p>
        </div>
        <h2 className="text-lg font-bold text-white mb-4">Design Principles</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {DESIGN_PRINCIPLES.map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className="card-glass rounded-xl p-5">
              <Icon size={18} className={`${color} mb-3`} />
              <div className="text-sm font-semibold text-white mb-2">{label}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
        <h2 className="text-lg font-bold text-white mb-4">System Architecture</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Eye, label: 'Public Layer', desc: 'Charts, sliders, scenario comparisons, narrative summaries — for external audiences', color: 'text-sky-400' },
            { icon: Lock, label: 'Private Layer', desc: 'Multipliers, elasticities, calibration notes, model architecture — never sent to browser', color: 'text-violet-400' },
            { icon: Layers, label: 'Data Layer', desc: 'Regional inputs: population, venues, songwriter counts, income baselines, tourism assumptions', color: 'text-emerald-400' },
          ].map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className="card-glass rounded-xl p-5">
              <Icon size={18} className={`${color} mb-3`} />
              <div className="text-sm font-semibold text-white mb-2">{label}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
        <h2 className="text-lg font-bold text-white mb-6">Five Model Modules</h2>
        <div className="space-y-4 mb-10">
          {MODULES.map(m => (
            <div key={m.id} className="card-glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg`}>{m.id}</div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-1">Module {m.id}: {m.title}</h3>
                  <p className="text-sm text-slate-400 italic mb-3">{m.question}</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{m.what}</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><div className="text-xs text-slate-600 uppercase tracking-widest mb-2">Key Inputs</div><ul className="space-y-1">{m.publicInputs.map(i => (<li key={i} className="text-xs text-slate-400 flex items-start gap-1.5"><span className="text-slate-600 mt-0.5">→</span> {i}</li>))}</ul></div>
                    <div><div className="text-xs text-slate-600 uppercase tracking-widest mb-2">Outputs</div><ul className="space-y-1">{m.publicOutputs.map(o => (<li key={o} className="text-xs text-slate-400 flex items-start gap-1.5"><span className="text-emerald-600 mt-0.5">✓</span> {o}</li>))}</ul></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-lg font-bold text-white mb-4">What You Control vs. What Stays Private</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="card-glass rounded-2xl p-6"><div className="flex items-center gap-2 mb-4"><Eye size={16} className="text-sky-400" /><h3 className="text-sm font-semibold text-white">Public Inputs (user-controllable)</h3></div><ul className="space-y-2">{PUBLIC_INPUTS.map(i => (<li key={i} className="text-xs text-slate-400 flex items-start gap-2"><span className="text-sky-500 mt-0.5">•</span> {i}</li>))}</ul></div>
          <div className="card-glass rounded-2xl p-6"><div className="flex items-center gap-2 mb-4"><Lock size={16} className="text-violet-400" /><h3 className="text-sm font-semibold text-white">Private (server-side only)</h3></div><ul className="space-y-2">{PRIT�TE_INPUTS.map(i => (<li key={i} className="text-xs text-slate-400 flex items-start gap-2"><span className="text-violet-500 mt-0.5">•</span> {i}</li>))}</ul></div>
        </div>
        <div className="card-glass rounded-2xl p-6 border border-sky-500/10 mb-8">
          <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest mb-3">A Note on Employment Estimates</h3>
          <p className="text-sm text-slate-400 leading-relaxed">Employment figures use a sector-specific elasticity calibrated to the NYC music ecosystem — approximately <strong className="text-slate-300">32 supported jobs per $1M</strong> of incremental economic output. This is consistent with the baseline ratio of ~35,000 jobs on $1.1B in music-sector GDP (~31.8 jobs per $1M). The estimate covers direct, indirect, and induced employment — not new hires alone — and scales proportionally with economic output and scenario type.</p>
        </div>
        <div className="card-glass rounded-2xl p-6 border border-amber-500/10">
          <div className="flex items-center gap-2 mb-3"><AlertTriangle size={14} className="text-amber-400" /><h3 className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Important Disclaimer</h3></div>
          <p className="text-sm text-slate-400 leading-relaxed">All projections are model estimates based on publicly available economic data calibrated to the NYC music ecosystem. They are illustrative scenarios designed to support strategic planning and policy conversations — not guarantees of actual outcomes. Economic multipliers, elasticities, and distributional assumptions are subject to revision as real-world pilot data becomes available. This tool should be used as one input among many in policy or investment decisions.</p>
        </div>
      </div>
    </div>
  )
}
