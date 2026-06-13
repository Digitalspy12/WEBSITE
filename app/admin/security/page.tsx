'use client'

import { useState, useEffect, useCallback } from 'react'
import { Shield, ShieldAlert, Loader2, RefreshCw, Key } from 'lucide-react'

interface AuditEntry {
  id: number
  timestamp: string
  user_email: string
  action: string
  target?: string
  details?: any
}

export default function SecurityPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/audit') // We need to create this endpoint
      if (!res.ok) throw new Error('Failed to fetch security logs')
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
            <Shield size={20} style={{ color: '#a78bfa' }} />
            Security & Audit
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Immutable record of all admin actions and authentication events.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-semibold cursor-pointer hover:bg-white/5 transition-all disabled:opacity-50"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <Loader2 size={24} className="animate-spin" style={{ color: '#a78bfa' }} />
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Loading audit trail...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-xs" style={{ color: '#ef4444' }}>
            {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs" style={{ color: 'var(--muted-foreground)' }}>
            No audit records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                <tr>
                  <th className="p-4 font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Time</th>
                  <th className="p-4 font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>User</th>
                  <th className="p-4 font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Action</th>
                  <th className="p-4 font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Target / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Key size={12} style={{ color: 'var(--primary)' }} />
                        <span style={{ color: 'var(--foreground)' }}>{log.user_email}</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 w-full">
                      <div className="flex flex-col gap-1">
                        {log.target && (
                          <span className="font-mono text-[10px]" style={{ color: 'var(--foreground)' }}>
                            {log.target}
                          </span>
                        )}
                        {log.details && (
                          <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
                            {JSON.stringify(log.details)}
                          </span>
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
