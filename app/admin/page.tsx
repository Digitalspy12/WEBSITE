'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Activity,
  Database,
  Shield,
  Wifi,
  WifiOff,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Zap,
  FileText,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface HealthStatus {
  status: 'ok' | 'degraded' | 'down' | 'loading'
  supabase: string
  latencyMs: number
  timestamp: string
  error?: string
}

interface ContentFreshness {
  lastUpdated: string | null
  totalKeys: number
}

export default function SystemHealthPage() {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'loading',
    supabase: 'checking...',
    latencyMs: 0,
    timestamp: new Date().toISOString(),
  })
  const [authStatus, setAuthStatus] = useState<'ok' | 'error' | 'loading'>('loading')
  const [contentFreshness, setContentFreshness] = useState<ContentFreshness>({ lastUpdated: null, totalKeys: 0 })
  const [recentErrors, setRecentErrors] = useState<number>(0)
  const [refreshing, setRefreshing] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkHealth = useCallback(async () => {
    setRefreshing(true)
    try {
      const start = Date.now()
      const res = await fetch('/api/health')
      const data = await res.json()
      setHealth({
        ...data,
        latencyMs: data.latencyMs || (Date.now() - start),
      })
    } catch {
      setHealth({
        status: 'down',
        supabase: 'unreachable',
        latencyMs: 0,
        timestamp: new Date().toISOString(),
        error: 'Failed to reach health endpoint',
      })
    }
    setLastCheck(new Date())
    setRefreshing(false)
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      setAuthStatus(error || !user ? 'error' : 'ok')
    } catch {
      setAuthStatus('error')
    }
  }, [])

  const checkContentFreshness = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('site_content')
        .select('updated_at')
        .order('updated_at', { ascending: false })

      if (!error && data) {
        setContentFreshness({
          lastUpdated: data[0]?.updated_at || null,
          totalKeys: data.length,
        })
      }
    } catch {
      // Silently fail — not critical
    }
  }, [])

  const checkRecentErrors = useCallback(async () => {
    try {
      const supabase = createClient()
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { count } = await supabase
        .from('app_logs')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', since)
        .in('level', ['error', 'critical'])

      setRecentErrors(count || 0)
    } catch {
      // Table may not exist yet — silently fail
    }
  }, [])

  const runAllChecks = useCallback(async () => {
    await Promise.all([
      checkHealth(),
      checkAuth(),
      checkContentFreshness(),
      checkRecentErrors(),
    ])
  }, [checkHealth, checkAuth, checkContentFreshness, checkRecentErrors])

  useEffect(() => {
    runAllChecks()
    const interval = setInterval(runAllChecks, 60000) // Refresh every 60s
    return () => clearInterval(interval)
  }, [runAllChecks])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', text: '#4ade80', glow: 'rgba(74,222,128,0.15)' }
      case 'degraded': return { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', text: '#fbbf24', glow: 'rgba(251,191,36,0.15)' }
      case 'loading': return { bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', text: '#94a3b8', glow: 'rgba(148,163,184,0.1)' }
      default: return { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#ef4444', glow: 'rgba(239,68,68,0.15)' }
    }
  }

  const formatRelativeTime = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const overallStatus = health.status === "loading" || authStatus === "loading" ? "loading" : health.status === "ok" && authStatus === "ok"
    ? 'ok'
    : health.status === 'down' || authStatus === 'error'
      ? 'down'
      : 'degraded'

  const sc = getStatusColor(overallStatus)

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
            <Activity size={20} style={{ color: 'var(--primary)' }} />
            System Health
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Real-time status of all platform services. Auto-refreshes every 60 seconds.
          </p>
        </div>
        <button
          onClick={runAllChecks}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-semibold cursor-pointer hover:bg-white/5 transition-all disabled:opacity-50"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          Refresh All
        </button>
      </div>

      {/* Overall Status Banner */}
      <div
        className="p-5 rounded-2xl border flex items-center gap-4"
        style={{
          background: sc.bg,
          borderColor: sc.border,
          boxShadow: `0 0 30px ${sc.glow}`,
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: sc.bg, border: `1px solid ${sc.border}` }}
        >
          {overallStatus === 'loading' ? (
            <Loader2 size={24} className="animate-spin" style={{ color: sc.text }} />
          ) : overallStatus === 'ok' ? (
            <CheckCircle size={24} style={{ color: sc.text }} />
          ) : overallStatus === 'degraded' ? (
            <AlertTriangle size={24} style={{ color: sc.text }} />
          ) : (
            <XCircle size={24} style={{ color: sc.text }} />
          )}
        </div>
        <div>
          <h2 className="text-base font-bold" style={{ color: sc.text }}>
            {overallStatus === 'loading' ? 'Checking...' :
              overallStatus === 'ok' ? 'All Systems Operational' :
                overallStatus === 'degraded' ? 'Partial Degradation Detected' :
                  'System Down — Action Required'}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Last checked: {lastCheck ? lastCheck.toLocaleTimeString() : '...'}
          </p>
        </div>
      </div>

      {/* Service Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Supabase Database */}
        <StatusCard
          icon={Database}
          title="Supabase Database"
          status={health.status === 'loading' ? 'loading' : health.status === 'ok' ? 'ok' : 'down'}
          details={[
            { label: 'Connection', value: health.supabase },
            { label: 'Latency', value: health.status === 'loading' ? '...' : `${health.latencyMs}ms` },
          ]}
          error={health.error}
        />

        {/* Supabase Auth */}
        <StatusCard
          icon={Shield}
          title="Supabase Auth"
          status={authStatus}
          details={[
            { label: 'Session', value: authStatus === 'ok' ? 'Active' : authStatus === 'loading' ? 'Checking...' : 'Failed' },
          ]}
        />

        {/* API Health */}
        <StatusCard
          icon={Wifi}
          title="API Routes"
          status={health.status === 'loading' ? 'loading' : health.status === 'ok' ? 'ok' : 'down'}
          details={[
            { label: 'Endpoint', value: '/api/health' },
            { label: 'Response', value: health.status === 'loading' ? '...' : `${health.latencyMs}ms` },
          ]}
        />

        {/* Content Freshness */}
        <StatusCard
          icon={FileText}
          title="Content Freshness"
          status={contentFreshness.totalKeys > 0 ? 'ok' : 'loading'}
          details={[
            { label: 'Last Update', value: formatRelativeTime(contentFreshness.lastUpdated) },
            { label: 'Total Keys', value: contentFreshness.totalKeys.toString() },
          ]}
        />

        {/* Errors (24h) */}
        <StatusCard
          icon={AlertTriangle}
          title="Errors (24h)"
          status={recentErrors === 0 ? 'ok' : recentErrors > 10 ? 'down' : 'degraded'}
          details={[
            { label: 'Error Count', value: recentErrors.toString() },
            { label: 'Severity', value: recentErrors === 0 ? 'None' : recentErrors > 10 ? 'High' : 'Low' },
          ]}
        />

        {/* ISR Cache */}
        <StatusCard
          icon={Zap}
          title="ISR Cache"
          status="ok"
          details={[
            { label: 'Strategy', value: 'revalidate: 3600' },
            { label: 'Mode', value: 'Stale-While-Revalidate' },
          ]}
        />
      </div>

      {/* Quick Diagnostics */}
      <div
        className="p-5 rounded-2xl border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
          <Clock size={14} style={{ color: 'var(--primary)' }} />
          Quick Diagnostics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <DiagnosticItem
            label="Homepage Rendering"
            value="ISR (Static)"
            ok
          />
          <DiagnosticItem
            label="Image Source"
            value="/public (Edge CDN)"
            ok
          />
          <DiagnosticItem
            label="DB Connection Mode"
            value="Anon Key (Read)"
            ok
          />
          <DiagnosticItem
            label="Keep-Alive"
            value="cron-job.org"
            ok={health.status === 'ok'}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────

function StatusCard({
  icon: Icon,
  title,
  status,
  details,
  error,
}: {
  icon: any
  title: string
  status: 'ok' | 'degraded' | 'down' | 'error' | 'loading'
  details: { label: string; value: string }[]
  error?: string
}) {
  const normalizedStatus = status === 'error' ? 'down' : status
  const colors = {
    ok: { dot: '#4ade80', bg: 'rgba(74,222,128,0.06)' },
    degraded: { dot: '#fbbf24', bg: 'rgba(251,191,36,0.06)' },
    down: { dot: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
    loading: { dot: '#94a3b8', bg: 'rgba(148,163,184,0.06)' },
  }
  const c = colors[normalizedStatus]

  return (
    <div
      className="p-4 rounded-xl border flex flex-col gap-3 transition-all hover:border-[rgba(255,107,43,0.15)]"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: c.bg }}
          >
            <Icon size={14} style={{ color: c.dot }} />
          </div>
          <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {normalizedStatus === 'loading' ? (
            <Loader2 size={10} className="animate-spin" style={{ color: c.dot }} />
          ) : (
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: c.dot,
                boxShadow: `0 0 6px ${c.dot}`,
              }}
            />
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: c.dot }}>
            {normalizedStatus === 'loading' ? 'Checking' :
              normalizedStatus === 'ok' ? 'Online' :
                normalizedStatus === 'degraded' ? 'Warning' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
        {details.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
              {d.label}
            </span>
            <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--foreground)' }}>
              {d.value}
            </span>
          </div>
        ))}
        {error && (
          <p className="text-[10px] mt-1 p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

function DiagnosticItem({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg border"
      style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}
    >
      <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {ok !== undefined && (
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: ok ? '#4ade80' : '#ef4444' }}
          />
        )}
        <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--foreground)' }}>
          {value}
        </span>
      </div>
    </div>
  )
}
