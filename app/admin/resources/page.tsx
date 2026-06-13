'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  BarChart3,
  TrendingUp,
  Mail,
  AlertTriangle,
  Database,
  Users,
  RefreshCw,
  Loader2,
} from 'lucide-react'

export default function ResourceMonitorPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    leadsToday: 0,
    leadsThisWeek: 0,
    leadsTotal: 0,
    errorsToday: 0,
    logsTotal: 0,
    auditToday: 0,
    contentKeys: 0,
  })

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

      const [leadsTotal, leadsToday, leadsWeek, errorsToday, logsTotal, auditToday, contentKeys] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
        supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
        supabase.from('app_logs').select('*', { count: 'exact', head: true }).gte('timestamp', todayStart).in('level', ['error', 'critical']),
        supabase.from('app_logs').select('*', { count: 'exact', head: true }),
        supabase.from('admin_audit_log').select('*', { count: 'exact', head: true }).gte('timestamp', todayStart),
        supabase.from('site_content').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        leadsTotal: leadsTotal.count || 0,
        leadsToday: leadsToday.count || 0,
        leadsThisWeek: leadsWeek.count || 0,
        errorsToday: errorsToday.count || 0,
        logsTotal: logsTotal.count || 0,
        auditToday: auditToday.count || 0,
        contentKeys: contentKeys.count || 0,
      })
    } catch (e) {
      console.error('Failed to fetch resource stats:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
            <BarChart3 size={20} style={{ color: 'var(--primary)' }} />
            Resource Monitor
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Application-level metrics. Not duplicating Supabase dashboard data.
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-semibold cursor-pointer hover:bg-white/5 transition-all disabled:opacity-50"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 min-h-[300px]">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Loading metrics...</p>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={Mail} label="Leads Today" value={stats.leadsToday} accent="#38bdf8" />
            <MetricCard icon={TrendingUp} label="Leads This Week" value={stats.leadsThisWeek} accent="#4ade80" />
            <MetricCard icon={AlertTriangle} label="Errors Today" value={stats.errorsToday} accent={stats.errorsToday > 0 ? '#ef4444' : '#4ade80'} />
            <MetricCard icon={Users} label="Admin Actions Today" value={stats.auditToday} accent="#a78bfa" />
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Database size={14} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>Database Records</span>
              </div>
              <div className="flex flex-col gap-2">
                <StatRow label="Total Leads" value={stats.leadsTotal} />
                <StatRow label="Total Log Entries" value={stats.logsTotal} />
                <StatRow label="Content Keys" value={stats.contentKeys} />
              </div>
            </div>

            <div className="p-5 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={14} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>Storage Estimate</span>
              </div>
              <div className="flex flex-col gap-2">
                <StatRow label="Leads" value={`~${Math.round(stats.leadsTotal * 0.1)} KB`} />
                <StatRow label="Logs" value={`~${Math.round(stats.logsTotal * 2)} KB`} />
                <StatRow label="Budget" value="500 MB" />
              </div>
            </div>

            <div className="p-5 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>Traffic Architecture</span>
              </div>
              <div className="flex flex-col gap-2">
                <StatRow label="Rendering" value="ISR" />
                <StatRow label="Revalidate" value="3600s" />
                <StatRow label="Images" value="Edge CDN" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent: string }) {
  return (
    <div
      className="p-4 rounded-xl border flex flex-col gap-2"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}12` }}
        >
          <Icon size={13} style={{ color: accent }} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
          {label}
        </span>
      </div>
      <p className="text-2xl font-black" style={{ color: accent }}>
        {value}
      </p>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
      <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--foreground)' }}>{value}</span>
    </div>
  )
}
