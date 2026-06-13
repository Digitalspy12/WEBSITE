"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, Zap, Code2, Cpu, Globe, Terminal, Sparkles } from "lucide-react"

const DEFAULT_SHIP_IMG =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-e5T5H20ObPFIi41vN1rPtbalJqBHNn.png"

const defaultWords = ["Web Apps", "AI Automation", "CRM Systems", "Data Pipelines", "Voice Agents"]
const defaultTags = [
  "AI Voice Agents", "CRM Systems", "Web Platforms", "Data Pipelines",
  "Automation Bots", "API Integrations", "Mobile Apps", "Emergency Systems",
]

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function BentoCell({
  children,
  className = "",
  style = {},
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={`bento-card overflow-hidden ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms, border-color 0.3s, box-shadow 0.3s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function TypeLine({ text }: { text: string }) {
  const [shown, setShown] = useState("")
  const { ref, inView } = useInView(0.3)
  useEffect(() => {
    if (!inView) return
    let i = 0
    const t = setInterval(() => {
      i++
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(t)
    }, 38)
    return () => clearInterval(t)
  }, [inView, text])
  return (
    <span ref={ref} className="font-mono text-xs" style={{ color: "#4ade80" }}>
      {shown}
      <span
        className="inline-block w-1.5 h-3 align-middle ml-0.5 animate-pulse"
        style={{ background: "var(--primary)", borderRadius: "1px" }}
      />
    </span>
  )
}

export function HeroSection({ content }: { content?: any }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  // Map dynamic configs from fetched Supabase content with local overrides
  const badge = content?.['hero.badge'] || "AK 0121 — Done-For-You Tech Agency"
  const titleStart = content?.['hero.title_start'] || "You run the "
  const titleGlow = content?.['hero.title_glow'] || "business."
  const titleBreak = content?.['hero.title_break'] || "We build "
  const words = content?.['hero.words'] || defaultWords
  const description = content?.['hero.description'] || "Stop fighting DIY AI tools. We build custom web apps, mission-critical systems, and AI-driven automation in weeks, not months."
  const ctaPrimary = content?.['hero.cta_primary'] || "Start Your Project"
  const ctaSecondary = content?.['hero.cta_secondary'] || "View Our Work"
  const shipImg = content?.['hero.ship_img'] || DEFAULT_SHIP_IMG
  const statShippedCount = content?.['hero.stat_shipped_count'] || "20+"
  const statShippedLabel = content?.['hero.stat_shipped_label'] || "Projects Shipped"
  const statOwnershipCount = content?.['hero.stat_ownership_count'] || "100%"
  const statOwnershipLabel = content?.['hero.stat_ownership_label'] || "Client Ownership"
  const statDomainsCount = content?.['hero.stat_domains_count'] || "6+"
  const statDomainsLabel = content?.['hero.stat_domains_label'] || "Industry Domains"
  const terminalCommand = content?.['hero.terminal_command'] || "ak0121 --deploy"
  const terminalTypewriter = content?.['hero.terminal_typewriter'] || "✓ Shipped to production"
  const tagsCloud = content?.['hero.tags_cloud'] || defaultTags

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % words.length)
        setVisible(true)
      }, 300)
    }, 2600)
    return () => clearInterval(id)
  }, [words.length])

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden pt-20"
      style={{ background: "var(--background)" }}
    >
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%", right: "-8%",
          width: "700px", height: "700px",
          background: "radial-gradient(circle,rgba(255,107,43,0.08) 0%,transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* ── BENTO GRID: 12 cols ── */}
        <div className="grid grid-cols-12 gap-3">

          {/* A: Main headline — 8 cols */}
          <BentoCell
            className="col-span-12 lg:col-span-8 p-7 md:p-9 flex flex-col justify-between gap-6"
            delay={0}
            style={{
              background: "var(--card)",
              border: "1px solid rgba(0,0,0,0.1)",
              minHeight: "220px",
            }}
          >
            <div
              className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(255,107,43,0.12)",
                border: "1px solid rgba(255,107,43,0.25)",
                color: "var(--primary)",
              }}
            >
              <Zap size={11} />
              <span>{badge}</span>
            </div>

            <div className="flex flex-col gap-3">
              <h1
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.06] tracking-tight text-balance"
                style={{ color: "var(--foreground)" }}
              >
                {titleStart}
                <span className="glow-text" style={{ color: "var(--primary)" }}>{titleGlow}</span>
                <br />
                {titleBreak}
                <span
                  className="inline-block transition-all duration-300"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(10px)",
                    color: "var(--foreground)",
                    textDecoration: "underline",
                    textDecorationColor: "var(--primary)",
                    textUnderlineOffset: "6px",
                  }}
                >
                  {words[wordIdx]}
                </span>
                .
              </h1>
              <p
                className="text-base md:text-lg leading-relaxed max-w-xl"
                style={{ color: "var(--muted-foreground)" }}
              >
                {description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  {ctaPrimary} <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border cursor-pointer transition-all duration-200"
                  style={{ color: "var(--foreground)", borderColor: "var(--border)", background: "transparent" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,107,43,0.4)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
                >
                  {ctaSecondary}
                </button>
              </div>
            </div>
          </BentoCell>

          {/* B: SHIP + 20+ Projects — 4 cols stacked */}
          <BentoCell
            className="col-span-6 lg:col-span-4 flex flex-col overflow-hidden"
            delay={80}
            style={{
              minHeight: "320px",
              background: "var(--card)",
              border: "1px solid rgba(0,0,0,0.1)",
              padding: 0,
            }}
          >
            {/* Ship image — top portion */}
            <div className="relative w-full flex-1" style={{ minHeight: "200px" }}>
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom,transparent 50%,var(--card) 100%)",
                }}
              />
              <Image
                src={shipImg}
                alt="Illustrative dynamic asset for AK 0121 shipped metrics statistics representation"
                fill
                className="object-cover object-center"
                crossOrigin="anonymous"
                priority
              />
            </div>
            {/* Stat text — bottom portion */}
            <div className="px-6 pb-6 flex flex-col gap-1 relative z-20">
              <Code2 size={18} style={{ color: "var(--primary)", marginBottom: "4px" }} />
              <div className="text-4xl font-bold font-mono" style={{ color: "var(--foreground)" }}>
                {statShippedCount}
              </div>
              <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {statShippedLabel}
              </div>
            </div>
          </BentoCell>

          {/* C: Interactive 3D Keyboard canvas placeholder / elements */}
          {/* D: 100% Ownership — 3 cols */}
          <BentoCell
            className="col-span-6 lg:col-span-3 p-6 flex flex-col justify-between"
            delay={150}
            style={{ minHeight: "140px" }}
          >
            <Cpu size={20} style={{ color: "var(--primary)" }} />
            <div>
              <div className="text-4xl font-bold font-mono" style={{ color: "var(--foreground)" }}>{statOwnershipCount}</div>
              <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{statOwnershipLabel}</div>
            </div>
          </BentoCell>

          {/* E: Terminal — 3 cols */}
          <BentoCell
            className="col-span-6 lg:col-span-3 p-5 flex flex-col justify-between"
            delay={180}
            style={{ background: "var(--card)", border: "1px solid rgba(0,0,0,0.1)", minHeight: "140px" }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <Terminal size={12} className="ml-2" style={{ color: "var(--muted-foreground)" }} />
            </div>
            <div className="flex flex-col gap-1 font-mono text-xs leading-5">
              <span style={{ color: "var(--muted-foreground)" }}>
                <span style={{ color: "var(--primary)" }}>$ </span>{terminalCommand}
              </span>
              <TypeLine text={terminalTypewriter} />
            </div>
          </BentoCell>

          {/* F: 6+ Domains — 3 cols */}
          <BentoCell
            className="col-span-6 lg:col-span-3 p-6 flex flex-col justify-between"
            delay={200}
            style={{ minHeight: "130px" }}
          >
            <Globe size={20} style={{ color: "var(--primary)" }} />
            <div>
              <div className="text-4xl font-bold font-mono" style={{ color: "var(--foreground)" }}>{statDomainsCount}</div>
              <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{statDomainsLabel}</div>
            </div>
          </BentoCell>

          {/* H: Philosophy block — 3 cols, spans 2 rows on large screens */}
          <BentoCell
            className="col-span-12 lg:col-span-3 lg:row-span-2 p-6 flex flex-col justify-between gap-4"
            delay={210}
            style={{
              background: "var(--card)",
              border: "1px solid rgba(0,0,0,0.1)",
              minHeight: "280px",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-mono font-semibold tracking-widest uppercase"
                style={{ color: "var(--primary)" }}
              >
                Philosophy
              </span>
              <Sparkles size={14} style={{ color: "var(--primary)", opacity: 0.8 }} />
            </div>
            
            <div className="flex-1 flex flex-col justify-center my-3">
              <p
                className="text-lg font-medium leading-relaxed italic text-balance"
                style={{ color: "var(--foreground)", textShadow: "0 0 30px rgba(255,107,43,0.1)" }}
              >
                "AI tools want you to do it yourself. We do it for you."
              </p>
            </div>

            <div
              className="text-xs font-mono tracking-wide"
              style={{ color: "var(--muted-foreground)" }}
            >
              — The AK 0121 Philosophy
            </div>
          </BentoCell>

          {/* G: Tag cloud — 9 cols */}
          <BentoCell
            className="col-span-12 lg:col-span-9 p-6 flex flex-col items-center justify-center gap-4 text-center"
            delay={220}
            style={{ minHeight: "130px" }}
          >
            <span
              className="text-xs font-mono font-semibold tracking-widest uppercase"
              style={{ color: "var(--muted-foreground)" }}
            >
              What We Deliver
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {tagsCloud.map((tag: string, i: number) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: i % 3 === 0 ? "rgba(255,107,43,0.12)" : "rgba(255,255,255,0.05)",
                    border: i % 3 === 0 ? "1px solid rgba(255,107,43,0.22)" : "1px solid rgba(255,255,255,0.08)",
                    color: i % 3 === 0 ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </BentoCell>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8 pt-2">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Scroll</span>
          <div className="w-px h-7" style={{ background: "var(--border)" }} />
        </div>
      </div>
    </section>
  )
}
