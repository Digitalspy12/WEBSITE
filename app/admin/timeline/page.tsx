'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, Loader2, RefreshCw } from 'lucide-react'

export default function TimelinePage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTimeline = useCallback(async () => {
    setLoading(true)
    try {
      const [logsRes, auditRes] = await Promise.all([
        fetch('/api/logs?limit=50'),
        fetch('/api/admin/audit')
      ])

      const logsData = await logsRes.json()
      const auditData = await auditRes.json()

      const merged = [
        ...(logsData.logs || []).map((l: any) => ({ ...l, type: 'log' })),
        ...(auditData.logs || []).map((a: any) => ({ ...a, type: 'audit' }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setEvents(merged.slice(0, 100))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTimeline()
  }, [fetchTimeline])

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
            <Clock size={20} style={{ color: 'var(--primary)' }} />
            Incident Timeline
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Merged chronological view of system events and admin actions.
          </p>
        </div>
        <button
          onClick={fetchTimeline}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-semibold cursor-pointer hover:bg-white/5 transition-all disabled:opacity-50"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="relative pl-6 border-l" style={{ borderColor: 'var(--border)' }}>
        {loading ? (
          <div className="flex items-center gap-2 text-xs py-8" style={{ color: 'var(--muted-foreground)' }}>
            <Loader2 size={14} className="animate-spin" /> Loading timeline...
          </div>
        ) : events.map((event, i) => (
          <div key={`${event.type}-${event.id}`} className="mb-8 relative">
            <div
              className="absolute -left-[30px] w-3 h-3 rounded-full mt-1.5"
              style={{ background: event.type === 'audit' ? '#a78bfa' : event.level === 'error' ? '#ef4444' : '#4ade80' }}
            />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
                {new Date(event.timestamp).toLocaleString()}
              </span>
              <div className="p-4 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                {event.type === 'audit' ? (
                  <div>
                    <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>Admin Action: {event.action}</span>
                    <p className="text-xs mt-1" style={{ color: 'var(--foreground)' }}>User {event.user_email} performed action on {event.target || 'system'}</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold" style={{ color: event.level === 'error' ? '#ef4444' : '#4ade80' }}>
                      System Event: {event.category}
                    </span>
                    <p className="text-xs mt-1" style={{ color: 'var(--foreground)' }}>[{event.source}] {event.message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
