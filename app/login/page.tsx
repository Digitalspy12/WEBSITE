'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Lock, Mail, ShieldAlert } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
      } else {
        router.refresh()
        // Delay slightly for cookies to settle before client-side redirecting
        setTimeout(() => {
          router.push('/admin')
        }, 150)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign-in.')
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: 'var(--background)' }}
    >
      {/* Background grain + subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle,rgba(255,107,43,0.06) 0%,transparent 70%)',
        }}
      />

      {/* Login Card */}
      <div
        className="w-full max-w-md p-8 rounded-2xl relative z-10"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--surface-border)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black mb-2"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            AK
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            AK 0121 Agency Admin
          </h1>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Authentication credentials required to access CMS dashboard
          </p>
        </div>

        {errorMsg && (
          <div
            className="flex items-start gap-3 p-4 rounded-xl text-xs mb-6"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.18)',
              color: 'var(--destructive)',
            }}
          >
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication Failed</p>
              <p className="opacity-90 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-mono font-medium tracking-wide uppercase"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-4 top-3.5"
                style={{ color: 'var(--muted-foreground)' }}
              />
              <input
                id="email"
                type="email"
                required
                placeholder="admin@ak0121.agency"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-5 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--foreground)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-mono font-medium tracking-wide uppercase"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-4 top-3.5"
                style={{ color: 'var(--muted-foreground)' }}
              />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-5 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--foreground)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 mt-2 disabled:opacity-50"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to CMS <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
          To establish credentials, configure accounts directly inside the Supabase Console.
          Public registration is disabled on this platform.
        </div>
      </div>
    </main>
  )
}
