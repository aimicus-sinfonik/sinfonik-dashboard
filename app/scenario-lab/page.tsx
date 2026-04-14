'use client'

import { useState, useCallback, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { FlaskConical, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

export default function ScenarioLabPage() {
  return (
    <div className="min-h-screen pb-20">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 pt-28">
        <h1 className="text-2xl font-extrabold text-white">Scenario Lab</h1>
        <p className="text-sm text-slate-400">Adjust inputs to explore different Sinfonik adoption futures for NYC</p>
      </div>
    </div>
  )
}
