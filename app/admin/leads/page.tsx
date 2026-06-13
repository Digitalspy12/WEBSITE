'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Inbox,
  RefreshCw,
  Loader2,
  CheckCheck,
  Archive,
  Trash2,
  Mail,
  Clock,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateLeadStatus, deleteLead } from '@/app/actions'

interface Lead {
  id: number
  created_at: string
  email: string
  status: 'new' | 'contacted' | 'archived'
}

export default function LeadsPage() {
  const supabase = createClient()
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'new' | 'contacted' | 'archived'>('all')
  const [saving, setSaving] = useState<string | null>(null)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showStatus = useCallback((type: 'success' | 'error', message: string) => {
    setStatusMsg({ type, message })
    setTimeout(() => {
      setStatusMsg(null)
    }, 4000)
  }, [])

  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true)
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (e: any) {
      showStatus('error', e.message || 'Failed to fetch leads.')
    } finally {
      setLeadsLoading(false)
    }
  }, [supabase, showStatus])

  const handleLeadStatusChange = async (id: number, newStatus: string) => {
    setSaving(`lead-${id}`)
    try {
      const res = await updateLeadStatus(id, newStatus)
      if (res.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus as any } : l)))
        showStatus('success', `Lead status updated to "${newStatus}".`)
      } else {
        throw new Error(res.error)
      }
    } catch (e: any) {
      showStatus('error', e.message || 'Failed to update lead.')
    } finally {
      setSaving(null)
    }
  }

  const handleDeleteLead = async (id: number) => {
    setSaving(`lead-${id}`)
    try {
      const res = await deleteLead(id)
      if (res.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id))
        showStatus('success', 'Lead deleted successfully.')
      } else {
        throw new Error(res.error)
      }
    } catch (e: any) {
      showStatus('error', e.message || 'Failed to delete lead.')
    } finally {
      setSaving(null)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 relative">
      {/* Floating Status Notification */}
      {statusMsg && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-xl border flex items-center gap-3 shadow-xl z-50 animate-fade-in ${
            statusMsg.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-500'
              : 'bg-red-500/10 border-red-500/30 text-red-500'
          }`}
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {statusMsg.type === 'success' ? <CheckCheck size={16} /> : <AlertTriangle size={16} />}
          <p className="text-xs font-bold">{statusMsg.message}</p>
        </div>
      )}

      {/* Leads Header */}
      <div
        className="p-6 rounded-2xl border flex flex-col gap-5"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Inbox size={18} style={{ color: 'var(--primary)' }} />
              Project Leads
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Emails submitted via the contact form.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLeads}
              disabled={leadsLoading}
              className="flex items-center gap-1.5 px-3 py-2 border rounded-full text-xs font-semibold cursor-pointer hover:bg-white/5 transition-all disabled:opacity-50"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              <RefreshCw size={12} className={leadsLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div
              className="px-3 py-2 rounded-full text-xs font-bold"
              style={{ background: 'rgba(255,107,43,0.12)', color: 'var(--primary)' }}
            >
              {leads.length} Total
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          {(['all', 'new', 'contacted', 'archived'] as const).map((filter) => {
            const count = filter === 'all' ? leads.length : leads.filter((l) => l.status === filter).length
            return (
              <button
                key={filter}
                onClick={() => setLeadsFilter(filter)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all capitalize"
                style={{
                  background: leadsFilter === filter ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                  color: leadsFilter === filter ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  border: leadsFilter === filter ? '1px solid var(--primary)' : '1px solid var(--border)',
                }}
              >
                {filter} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Leads List */}
      {leadsLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 min-h-[200px]">
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Loading leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div
          className="p-12 rounded-2xl border text-center flex flex-col items-center gap-4"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,107,43,0.08)' }}
          >
            <Inbox size={28} style={{ color: 'var(--primary)', opacity: 0.6 }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
              No leads yet
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              When visitors submit their email on your website, they&apos;ll appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leads
            .filter((l) => leadsFilter === 'all' || l.status === leadsFilter)
            .map((lead) => {
              const statusColors: Record<string, { bg: string; border: string; text: string; icon: any }> = {
                new: { bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)', text: '#38bdf8', icon: Clock },
                contacted: { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', text: '#4ade80', icon: CheckCheck },
                archived: { bg: 'rgba(107,107,107,0.08)', border: 'rgba(107,107,107,0.2)', text: '#6b6b6b', icon: Archive },
              }
              const sc = statusColors[lead.status] || statusColors.new
              const StatusIcon = sc.icon
              const isProcessing = saving === `lead-${lead.id}`

              return (
                <div
                  key={lead.id}
                  className="p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[rgba(255,107,43,0.15)]"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  {/* Lead Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(255,107,43,0.08)' }}
                    >
                      <Mail size={16} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                        {lead.email}
                      </p>
                      <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {new Date(lead.created_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge + Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Status Badge */}
                    <span
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}
                    >
                      <StatusIcon size={10} />
                      {lead.status}
                    </span>

                    {/* Status Change Actions */}
                    {lead.status !== 'contacted' && (
                      <button
                        onClick={() => handleLeadStatusChange(lead.id, 'contacted')}
                        disabled={isProcessing}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all hover:bg-green-500/10 disabled:opacity-50"
                        style={{ border: '1px solid rgba(74,222,128,0.15)', color: '#4ade80' }}
                        title="Mark as Contacted"
                      >
                        {isProcessing ? <Loader2 size={10} className="animate-spin" /> : <CheckCheck size={10} />}
                        Contacted
                      </button>
                    )}
                    {lead.status !== 'archived' && (
                      <button
                        onClick={() => handleLeadStatusChange(lead.id, 'archived')}
                        disabled={isProcessing}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all hover:bg-white/5 disabled:opacity-50"
                        style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
                        title="Archive Lead"
                      >
                        {isProcessing ? <Loader2 size={10} className="animate-spin" /> : <Archive size={10} />}
                        Archive
                      </button>
                    )}
                    {lead.status === 'archived' && (
                      <button
                        onClick={() => handleLeadStatusChange(lead.id, 'new')}
                        disabled={isProcessing}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all hover:bg-blue-500/10 disabled:opacity-50"
                        style={{ border: '1px solid rgba(56,189,248,0.15)', color: '#38bdf8' }}
                        title="Restore Lead"
                      >
                        {isProcessing ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                        Restore
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      disabled={isProcessing}
                      className="p-1.5 border border-red-500/20 text-red-500 rounded-lg bg-red-500/5 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                      title="Delete permanently"
                    >
                      {isProcessing ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  </div>
                </div>
              )
            })}
          {leads.filter((l) => leadsFilter === 'all' || l.status === leadsFilter).length === 0 && (
            <div
              className="p-8 rounded-xl border text-center"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                No leads with status &ldquo;{leadsFilter}&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AlertTriangle({ size, style }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}
