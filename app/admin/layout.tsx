'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Inbox,
  LogOut,
  Activity,
  BarChart3,
  AlertTriangle,
  Shield,
  Mail,
  FileEdit,
  Clock,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV_ITEMS = [
  { href: '/admin', label: 'System Health', Icon: Activity, description: 'Status & uptime' },
  { href: '/admin/resources', label: 'Resources', Icon: BarChart3, description: 'Usage metrics' },
  { href: '/admin/errors', label: 'Errors', Icon: AlertTriangle, description: 'Error console' },
  { href: '/admin/security', label: 'Security', Icon: Shield, description: 'Auth & access logs' },
  { href: '/admin/leads', label: 'Leads', Icon: Inbox, description: 'Project inquiries' },
  { href: '/admin/cms', label: 'CMS', Icon: FileEdit, description: 'Content editor' },
  { href: '/admin/timeline', label: 'Timeline', Icon: Clock, description: 'Incident history' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Top Header */}
      <header
        className="px-4 md:px-6 py-3 flex items-center justify-between border-b sticky top-0 z-50 backdrop-blur-xl"
        style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            AK
          </div>
          <div>
            <h1 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
              AK 0121 Admin
            </h1>
            <p className="text-[10px] hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>
              Diagnostic Command Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-semibold cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all duration-200"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — Desktop */}
        <aside
          className="hidden md:flex w-56 shrink-0 flex-col border-r p-3 gap-1 overflow-y-auto"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          {NAV_ITEMS.map(({ href, label, Icon, description }) => {
            const active = isActive(href)
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 group"
                style={{
                  background: active ? 'rgba(255,107,43,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(255,107,43,0.15)' : '1px solid transparent',
                }}
              >
                <Icon
                  size={15}
                  style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}
                  className="shrink-0"
                />
                <div className="min-w-0">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[10px] truncate"
                    style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}
                  >
                    {description}
                  </p>
                </div>
                {active && (
                  <ChevronRight size={12} style={{ color: 'var(--primary)' }} className="ml-auto shrink-0" />
                )}
              </button>
            )
          })}
        </aside>

        {/* Mobile Nav Overlay */}
        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 flex"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <aside
              className="relative w-64 flex flex-col border-r p-3 gap-1 overflow-y-auto"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--background)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_ITEMS.map(({ href, label, Icon, description }) => {
                const active = isActive(href)
                return (
                  <button
                    key={href}
                    onClick={() => {
                      router.push(href)
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-left cursor-pointer transition-all duration-200"
                    style={{
                      background: active ? 'rgba(255,107,43,0.08)' : 'transparent',
                      border: active ? '1px solid rgba(255,107,43,0.15)' : '1px solid transparent',
                    }}
                  >
                    <Icon
                      size={15}
                      style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}
                    />
                    <div>
                      <p
                        className="text-xs font-semibold"
                        style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                      >
                        {label}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
                        {description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
