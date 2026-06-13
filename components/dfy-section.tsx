"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react"

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

const comparisons = [
  {
    topic: "Time to launch",
    dfy: "4–8 weeks to a working system",
    diy: "3–12 months of iteration",
  },
  {
    topic: "Technical expertise needed",
    dfy: "Zero — we handle every layer",
    diy: "Requires a full in-house team",
  },
  {
    topic: "Monthly costs",
    dfy: "Fixed scope, one-time engagement",
    diy: "Ongoing SaaS subscriptions + salaries",
  },
  {
    topic: "Code & infrastructure ownership",
    dfy: "100% yours — no lock-in ever",
    diy: "Vendor-dependent, often locked in",
  },
  {
    topic: "Maintenance headaches",
    dfy: "Architecture built for longevity",
    diy: "You're debugging at 2 AM",
  },
  {
    topic: "Quality & reliability",
    dfy: "Senior-only team, production-grade",
    diy: "Varies wildly — often brittle",
  },
]

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let v = 0
    const step = target / 45
    const t = setInterval(() => {
      v += step
      if (v >= target) { setVal(target); clearInterval(t) }
      else setVal(Math.floor(v))
    }, 20)
    return () => clearInterval(t)
  }, [active, target])
  return val
}

function StatBubble({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { ref, inView } = useInView(0.2)
  const count = useCounter(value, inView)
  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl text-center"
      style={{
        background: "rgba(255,107,43,0.08)",
        border: "1px solid rgba(255,107,43,0.18)",
        opacity: inView ? 1 : 0,
        transform: inView ? "scale(1)" : "scale(0.88)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <span className="text-3xl font-bold font-mono" style={{ color: "var(--primary)" }}>
        {count}{suffix}
      </span>
      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
    </div>
  )
}

export function DfySection() {
  const { ref: headingRef, inView: headingIn } = useInView(0.15)

  return (
    <section
      id="dfy"
      className="py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Ambient gradient */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "400px",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,107,43,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          ref={headingRef}
          className="text-center mb-14"
          style={{
            opacity: headingIn ? 1 : 0,
            transform: headingIn ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span
            className="text-xs font-mono font-semibold tracking-widest uppercase"
            style={{ color: "var(--primary)" }}
          >
            Why AK 0121
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-balance mt-3"
            style={{ color: "var(--foreground)" }}
          >
            Done-For-You vs.{" "}
            <span style={{ color: "var(--muted-foreground)", fontWeight: 400 }}>
              Build on Your Own
            </span>
          </h2>
          <p
            className="mt-4 text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "var(--muted-foreground)" }}
          >
            Most founders waste months wrestling with tools and hiring headaches.
            Here&apos;s why our clients choose the DFY path.
          </p>
        </div>

        {/* Comparison table-style bento */}
        <div className="grid grid-cols-1 gap-5 md:gap-2 mb-12">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 px-2 mb-1 hidden md:grid">
            <div className="col-span-4" />
            <div
              className="col-span-4 text-center text-xs font-semibold tracking-wider uppercase py-2 rounded-xl"
              style={{
                color: "var(--primary)",
                background: "rgba(255,107,43,0.08)",
                border: "1px solid rgba(255,107,43,0.2)",
              }}
            >
              AK 0121 DFY
            </div>
            <div
              className="col-span-4 text-center text-xs font-semibold tracking-wider uppercase py-2 rounded-xl"
              style={{
                color: "var(--muted-foreground)",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              Build on Your Own
            </div>
          </div>

          {comparisons.map((row, i) => (
            <ComparisonRow key={row.topic} row={row} index={i} />
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          <StatBubble value={20} suffix="+" label="Projects Delivered" delay={0} />
          <StatBubble value={8} suffix="wk" label="Avg. Time to Ship" delay={80} />
          <StatBubble value={100} suffix="%" label="Code Ownership" delay={160} />
          <StatBubble value={6} suffix="+" label="Industries Served" delay={240} />
        </div>

        {/* CTA */}
        <CtaRow />
      </div>
    </section>
  )
}

function ComparisonRow({
  row,
  index,
}: {
  row: (typeof comparisons)[0]
  index: number
}) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className="flex flex-col p-5 md:p-0 rounded-2xl md:rounded-none border border-white/[0.04] md:border-0 bg-white/[0.01] md:bg-transparent gap-3 md:grid md:grid-cols-12 md:gap-2 md:items-stretch"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${index * 70}ms, transform 0.5s ease ${index * 70}ms`,
      }}
    >
      {/* Topic */}
      <div
        className="md:col-span-4 px-0 py-0 md:px-5 md:py-4 rounded-xl flex items-center bg-transparent md:bg-white/[0.03] border-0 md:border md:border-white/[0.07]"
      >
        <span
          className="text-base font-semibold md:text-sm md:font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {row.topic}
        </span>
      </div>

      {/* DFY */}
      <div
        className="md:col-span-4 px-4 py-3.5 md:px-5 md:py-4 rounded-xl flex flex-col items-start gap-1.5 md:gap-0"
        style={{
          background: "rgba(255,107,43,0.07)",
          border: "1px solid rgba(255,107,43,0.18)",
        }}
      >
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--primary)] mb-0.5 md:hidden">
          AK 0121 DFY
        </span>
        <div className="flex items-center gap-2.5 md:gap-3 w-full">
          <CheckCircle2
            size={16}
            className="shrink-0"
            style={{ color: "var(--primary)" }}
          />
          <span className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
            {row.dfy}
          </span>
        </div>
      </div>

      {/* DIY */}
      <div
        className="md:col-span-4 px-4 py-3.5 md:px-5 md:py-4 rounded-xl flex flex-col items-start gap-1.5 md:gap-0"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70 mb-0.5 md:hidden">
          Build on Your Own
        </span>
        <div className="flex items-center gap-2.5 md:gap-3 w-full">
          <XCircle
            size={16}
            className="shrink-0"
            style={{ color: "rgba(239,68,68,0.7)" }}
          />
          <span className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            {row.diy}
          </span>
        </div>
      </div>
    </div>
  )
}

function CtaRow() {
  const { ref, inView } = useInView(0.2)
  return (
    <div
      ref={ref}
      className="bento-card p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
      style={{
        background: "var(--card)",
        border: "1px solid rgba(0,0,0,0.1)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <div className="flex flex-col gap-2">
        <h3
          className="text-2xl md:text-3xl font-bold text-balance"
          style={{ color: "var(--foreground)" }}
        >
          Ready to stop doing it the hard way?
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Tell us what you need built. We&apos;ll scope it, architect it, and ship it.
        </p>
      </div>
      <button
        onClick={() =>
          document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
        }
        className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-85"
        style={{
          background: "var(--primary)",
          color: "var(--primary-foreground)",
        }}
      >
        Start Your Project
        <ArrowRight size={14} />
      </button>
    </div>
  )
}
