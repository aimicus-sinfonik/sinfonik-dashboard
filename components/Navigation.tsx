'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music2, BarChart3, FlaskConical, BookOpen } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Music2 },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/scenario-lab', label: 'Scenario Lab', icon: FlaskConical },
  { href: '/methodology', label: 'Methodology', icon: BookOpen },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:shadow-sky-400/50 transition-shadow">
          <Music2 size={16} className="text-white" />
        </div>
        <span className="font-bold text-white tracking-tight text-lg">SINFONIK</span>
        <span className="text-xs text-sky-400 font-medium uppercase tracking-widest hidden sm:inline">Impact</span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
