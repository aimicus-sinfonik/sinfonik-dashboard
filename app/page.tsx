import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { ArrowRight, TrendingUp, Users, Music, DollarSign, MapPin } from 'lucide-react'

const STATS = [
  { label: 'NYC Eligible Venues', value: '1,850+', icon: MapPin },
  { label: 'Local Songwriters', value: '47,000', icon: Music },
  { label: 'Streaming Users', value: '5.1M', icon: Users },
  { label: 'Music Sector GDP', value: '$1.1B', icon: DollarSign },
]

const FEATURES = [
  {
    title: 'Baseline vs. Sinfonik',
    desc: "Compare current economic conditions to projected outcomes with Sinfonik adoption across NYC venues and businesses.",
    icon: TrendingUp,
    color: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Songwriter Equity',
    desc: "Model changes to income distribution, Gini coefficient, and poverty rates for NYC's songwriter community.",
    icon: Users,
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Scenario Lab',
    desc: 'Adjust adoption rate, local artist share, tourism factors, and policy support to explore different futures.',
    icon: Music,
    color: 'from-emerald-500 to-teal-600',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-medium text-sky-300 tracking-wide uppercase"
            style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            NYC Regional Impact Model - Public Preview
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-none">
            <span className="text-white">If New York City adopted</span>
            <br />
            <span className="gradient-text">Sinfonik</span>
            <span className="text-white">...</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Explore the projected economic impact on songwriter incomes, local businesses,
            and regional GDP when music licensing works for everyone.
          </p>

          <p className="text-sm text-slate-500 max-w-xl mx-auto mb-10">
            Starting with New York City -- then generalizing to any region.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-sky-500 hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/30"
            >
              Explore NYC Dashboard
              <ArrowRight size={16} />
            </Link>
            <Link href="/scenario-lab"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-300 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Try Scenario Lab
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-glass rounded-2xl p-5 text-center">
              <Icon size={20} className="text-sky-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Three layers of insight
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ title, desc, icon: Icon, color }) => (
              <div key={title} className="card-glass rounded-2xl p-6 hover:card-glow transition-all">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto card-glass rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Built for policymakers, EDOs, and artists
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            This public dashboard shows the headline story. The strategic modeling engine that
            powers it remains private -- so you can share insights without revealing your competitive edge.
          </p>
          <Link href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all shadow-lg shadow-sky-500/20"
          >
            Open the Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 text-center border-t border-white/5">
        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Sinfonik. All projections are model estimates.
          Economic outputs, employment figures, and distributional metrics are illustrative,
          not guarantees.
        </p>
      </footer>
    </div>
  )
}
