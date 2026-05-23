"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2 } from "lucide-react"

const pillars = [
  {
    title: "Done-For-You",
    desc: "We don't teach you to build. We build it for you, end-to-end — from architecture to deployment.",
  },
  {
    title: "You Own Everything",
    desc: "No SaaS lock-in. No monthly rent. You receive full source code and infrastructure ownership.",
  },
  {
    title: "Outcomes Over Hours",
    desc: "Fixed-scope engagements tied to results. We ship production-ready systems, not Jira tickets.",
  },
  {
    title: "Weeks, Not Months",
    desc: "Lean, senior-only teams move fast. Most projects ship in 4–8 weeks from kickoff.",
  },
]

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, inView }
}

export function PhilosophySection() {
  const { ref, inView } = useInView()

  return (
    <section
      id="philosophy"
      className="py-24 px-6 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Orange glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-10%",
          top: "20%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(255,107,43,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div
            ref={ref}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span
              className="text-xs font-mono font-semibold tracking-widest uppercase"
              style={{ color: "var(--primary)" }}
            >
              Our Philosophy
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mt-3 leading-[1.1]" style={{ color: "var(--foreground)" }}>
              The Done-For-You
              <br />
              <span style={{ color: "var(--primary)" }}>Difference</span>
            </h2>
            <p className="text-base leading-relaxed mt-6 max-w-md" style={{ color: "var(--muted-foreground)" }}>
              Most agencies sell you hours. We sell you outcomes. We take your business bottleneck,
              architect a solution, and hand you the keys to a system you own entirely.
              No monthly rent. No technical headaches.
            </p>

            {/* CTA */}
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-8 px-7 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 cursor-pointer transition-opacity duration-200 hover:opacity-85"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                width: "fit-content",
              }}
            >
              Start Your Project
            </button>
          </div>

          {/* Right: pillars */}
          <div className="flex flex-col gap-4">
            {pillars.map((pillar, i) => (
              <PillarCard key={pillar.title} pillar={pillar} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PillarCard({
  pillar,
  delay,
}: {
  pillar: (typeof pillars)[0]
  delay: number
}) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className="bento-card p-5 flex items-start gap-4"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(20px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
    >
      <CheckCircle2
        size={18}
        className="shrink-0 mt-0.5"
        style={{ color: "var(--primary)" }}
      />
      <div>
        <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          {pillar.title}
        </h3>
        <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted-foreground)" }}>
          {pillar.desc}
        </p>
      </div>
    </div>
  )
}
