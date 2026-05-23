"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

const services = [
  {
    number: "01",
    title: "Custom Web Apps",
    desc: "Full-stack applications built for your exact workflow. Scalable, owned by you, shipped in weeks.",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
  },
  {
    number: "02",
    title: "AI & Automation",
    desc: "Voice agents, workflow automation, and AI-driven systems that replace hours of manual work.",
    tags: ["LLMs", "Voice AI", "Zapier Killers"],
  },
  {
    number: "03",
    title: "Enterprise Data Systems",
    desc: "Secure, high-throughput data protocols and CRM systems engineered for zero data loss.",
    tags: ["Big Data", "Security", "CRM"],
  },
  {
    number: "04",
    title: "Life-Critical Infrastructure",
    desc: "Mission-critical platforms — emergency dispatch, health logistics, supply chain systems.",
    tags: ["Real-time", "Reliability", "Scale"],
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

export function ServicesSection({ content }: { content?: any }) {
  const sectionBadge = content?.['services.section_badge'] || "What We Build"
  const titleLead = content?.['services.title_lead'] || "We sell outcomes,"
  const titleGlow = content?.['services.title_glow'] || "not hours."
  const description = content?.['services.description'] || "Most agencies sell you time. We take your bottleneck, architect the solution, and hand you the keys to a system you fully own."
  const servicesList = content?.['services.list'] || services

  return (
    <section id="services" className="py-24 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="flex flex-col gap-3">
            <span
              className="text-xs font-mono font-semibold tracking-widest uppercase"
              style={{ color: "var(--primary)" }}
            >
              {sectionBadge}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance" style={{ color: "var(--foreground)" }}>
              {titleLead}
              <br />
              <span style={{ color: "var(--muted-foreground)" }}>{titleGlow}</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            {description}
          </p>
        </div>

        <div className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
          {servicesList.map((svc: any, i: number) => (
            <ServiceRow key={svc.number || i} service={svc} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceRow({
  service,
  delay,
}: {
  service: {
    number: string
    title: string
    desc: string
    tags: string[]
  }
  delay: number
}) {
  const { ref, inView } = useInView()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      className="group flex flex-col md:flex-row md:items-center gap-4 py-7 cursor-default"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        borderColor: "var(--border)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="text-sm font-mono w-8 shrink-0 transition-colors duration-200"
        style={{ color: hovered ? "var(--primary)" : "var(--muted-foreground)" }}
      >
        {service.number}
      </span>

      <h3
        className="text-xl md:text-2xl font-bold md:w-64 shrink-0 transition-colors duration-200"
        style={{ color: hovered ? "var(--primary)" : "var(--foreground)" }}
      >
        {service.title}
      </h3>

      <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--muted-foreground)" }}>
        {service.desc}
      </p>

      <div className="flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full text-xs"
            style={{
              background: hovered ? "rgba(255,107,43,0.12)" : "rgba(255,255,255,0.04)",
              color: hovered ? "var(--primary)" : "var(--muted-foreground)",
              border: hovered ? "1px solid rgba(255,107,43,0.2)" : "1px solid rgba(255,255,255,0.06)",
              transition: "all 0.2s ease",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <ArrowUpRight
        size={18}
        className="shrink-0 transition-all duration-200"
        style={{
          color: hovered ? "var(--primary)" : "var(--muted-foreground)",
          transform: hovered ? "translate(2px,-2px)" : "translate(0,0)",
        }}
      />
    </div>
  )
}
