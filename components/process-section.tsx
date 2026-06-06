"use client"

import { useEffect, useRef, useState } from "react"
import { FileText, Palette, Code2, Activity, ShieldCheck, Rocket } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Meeting",
    subtitle: "Planning & Documentation",
    desc: "We collaborate to align on scope, draft exhaustive technical requirements, and define exact project goals.",
    icon: FileText,
    iconBg: "rgba(255,107,43,0.08)",
    iconColor: "var(--primary)",
  },
  {
    number: "02",
    title: "Design Sample",
    subtitle: "Design Approved",
    desc: "We present high-fidelity interactive mockups and custom user flows, refining every detail until approved.",
    icon: Palette,
    iconBg: "rgba(167,139,250,0.08)",
    iconColor: "#a78bfa",
  },
  {
    number: "03",
    title: "Building",
    subtitle: "Full-Stack Development",
    desc: "Our senior developers craft custom full-stack solutions with ultra-fast, robust, and scalable architectures.",
    icon: Code2,
    iconBg: "rgba(56,189,248,0.08)",
    iconColor: "#38bdf8",
  },
  {
    number: "04",
    title: "Testing",
    subtitle: "All Functionality Tested",
    desc: "Rigorous automated and manual quality checks covering responsiveness, API routing, and complete user flows.",
    icon: Activity,
    iconBg: "rgba(74,222,128,0.08)",
    iconColor: "#4ade80",
  },
  {
    number: "05",
    title: "Security Test",
    subtitle: "Bulletproof Security Audit",
    desc: "End-to-end vulnerability scanning, secure API endpoint verification, and robust data protection audits.",
    icon: ShieldCheck,
    iconBg: "rgba(239,68,68,0.08)",
    iconColor: "#ef4444",
  },
  {
    number: "06",
    title: "Delivered",
    subtitle: "Delivery & Maintenance",
    desc: "We deploy production builds to your server, transfer full codebase ownership, and offer proactive maintenance.",
    icon: Rocket,
    iconBg: "rgba(255,107,43,0.08)",
    iconColor: "var(--primary)",
  },
]

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

export function ProcessSection() {
  const { ref, inView } = useInView(0.05)

  return (
    <section
      id="process"
      className="py-24 px-6 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Background soft orange glow in the center */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(255,107,43,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          ref={ref}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="flex flex-col gap-3">
            <span
              className="text-xs font-mono font-semibold tracking-widest uppercase"
              style={{ color: "var(--primary)" }}
            >
              Our Delivery Workflow
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-balance leading-[1.1]"
              style={{ color: "var(--foreground)" }}
            >
              The Process of How
              <br />
              Projects Get{" "}
              <span className="glow-text" style={{ color: "var(--primary)" }}>
                Delivered.
              </span>
            </h2>
          </div>
          <p
            className="max-w-md text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            We don't believe in infinite timelines or bloated scopes. We follow a highly optimized,
            milestone-based engineering path that goes from blank page to production in record time.
          </p>
        </div>

        {/* 6-Step Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <ProcessCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface StepType {
  number: string
  title: string
  subtitle: string
  desc: string
  icon: React.ComponentType<{ size: number; className?: string; style?: React.CSSProperties }>
  iconBg: string
  iconColor: string
}

function ProcessCard({ step, index }: { step: StepType; index: number }) {
  const { ref, inView } = useInView(0.1)
  const [hovered, setHovered] = useState(false)
  const Icon = step.icon

  return (
    <div
      ref={ref}
      className="bento-card p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Card Header (Icon + Step number) */}
        <div className="flex items-center justify-between">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: hovered ? `rgba(${step.iconColor === "var(--primary)" ? "255,107,43" : step.iconColor.startsWith("#") ? hexToRgb(step.iconColor) : "255,107,43"}, 0.15)` : step.iconBg,
              color: step.iconColor,
              boxShadow: hovered ? `0 0 15px ${step.iconColor}22` : "none",
            }}
          >
            <Icon size={20} />
          </div>
          <span
            className="text-xs font-mono font-bold tracking-wider transition-colors duration-200"
            style={{
              color: hovered ? "var(--primary)" : "var(--muted-foreground)",
            }}
          >
            STEP {step.number}
          </span>
        </div>

        {/* Card Titles */}
        <div>
          <h3
            className="text-lg font-bold transition-colors duration-200"
            style={{ color: hovered ? "var(--primary)" : "var(--foreground)" }}
          >
            {step.title}
          </h3>
          <span
            className="text-xs font-mono font-medium block mt-0.5"
            style={{ color: "var(--muted-foreground)" }}
          >
            {step.subtitle}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          {step.desc}
        </p>
      </div>
    </div>
  )
}

// Utility to convert hex to comma separated rgb for dynamically increasing opacity on hover
function hexToRgb(hex: string): string {
  // Simple check for hex
  if (hex.startsWith("#")) {
    const clean = hex.slice(1)
    const bigint = parseInt(clean, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `${r}, ${g}, ${b}`
  }
  return "255, 107, 43"
}
