'use client'

import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, AlertCircle, AlertOctagon, Terminal, Loader2, RefreshCw } from 'lucide-react'

interface LogEntry {
  id: number
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'critical'
  category: string
  source: string
  message: string
  metadata?: any
}

export default function ErrorsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/logs?level=error&limit=100')
      if (!res.ok) throw new Error('Failed to fetch logs')
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
            <AlertOctagon size={20} style={{ color: '#ef4444' }} />
            Error Console
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Server-side and database errors from app_logs. For client-side crashes, check Sentry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sentry link placeholder for phase 2 */}
          <button
            onClick={() => window.open('https://sentry.io', '_blank')}
            className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-semibold cursor-pointer hover:bg-white/5 transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            Open Sentry ↗
          </button>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all disabled:opacity-50"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <Loader2 size={24} className="animate-spin" style={{ color: '#ef4444' }} />
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Loading error logs...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-xs" style={{ color: '#ef4444' }}>
            {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: 'rgba(74,222,128,0.1)' }}>
              <CheckCircle size={20} style={{ color: '#4ade80' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>No Errors Found</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Your application is running smoothly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                <tr>
                  <th className="p-4 font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Time</th>
                  <th className="p-4 font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Source</th>
                  <th className="p-4 font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Message</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}>
                    <td className="p-4 whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-md font-mono text-[10px]" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--foreground)' }}>
                        {log.source}
                      </span>
                    </td>
                    <td className="p-4 w-full">
                      <div className="flex flex-col gap-2">
                        <span className="font-medium" style={{ color: log.level === 'critical' ? '#ef4444' : '#fbbf24' }}>
                          {log.message}
                        </span>
                        {expandedRow === log.id && log.metadata && (
                          <div className="mt-2 p-3 rounded-lg overflow-x-auto" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                            <pre className="text-[10px] font-mono leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function CheckCircle({ size, style }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}
