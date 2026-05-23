"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  Zap,
  Brain,
  Shield,
  Globe,
  Database,
  Users,
  Award,
  ArrowRight,
  Terminal,
  Cpu,
} from "lucide-react"

const SHIP_IMG =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-e5T5H20ObPFIi41vN1rPtbalJqBHNn.png"

const defaultAiTags = ["Voice Agents", "NLP", "Real-time AI"]
const defaultCliLines = ["✓ Schema designed", "✓ Backend architected", "✓ Shipped to client ←"]

function useInView(threshold = 0.15) {
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

function BentoCard({
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
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Animated counter
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const { ref, inView } = useInView(0.3)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 50
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setVal(target)
        clearInterval(timer)
      } else {
        setVal(Math.floor(start))
      }
    }, 24)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {val}{suffix}
    </span>
  )
}

export function BentoGrid({ content }: { content?: any }) {
  // Extract configurations with fallbacks
  const sectionBadge = content?.['bento.section_badge'] || "Our Track Record"
  const titleLead = content?.['bento.title_lead'] || "20+ High-Impact Projects."
  const titleMuted = content?.['bento.title_muted'] || "Real problems. Real solutions."
  const cardAiTitle = content?.['bento.card_ai_title'] || "AI & Autonomous Intelligence"
  const cardAiDesc = content?.['bento.card_ai_desc'] || "Custom-engineered voice agents for automated sales and 24/7 support. Advanced fake news detection analyzing linguistic patterns and metadata at scale."
  const cardAiTags = content?.['bento.card_ai_tags'] || defaultAiTags
  const cardTrackshiftTitle = content?.['bento.card_trackshift_title'] || "Trackshift Winner"
  const cardTrackshiftDesc = content?.['bento.card_trackshift_desc'] || "Award-winning engineering"
  const cardProtocolTitle = content?.['bento.card_protocol_title'] || "500GB Secure Protocol"
  const cardProtocolDesc = content?.['bento.card_protocol_desc'] || "Zero data loss during massive transfers over unstable networks. Built for reliability."
  const cardCliTitle = content?.['bento.card_cli_title'] || "ak0121.sh"
  const cardCliCommand = content?.['bento.card_cli_command'] || "forge --type ai-agent --deploy production"
  const cardCliLines = content?.['bento.card_cli_lines'] || defaultCliLines
  const cardFoodbridgeTitle = content?.['bento.card_foodbridge_title'] || "Foodbridge & Agri"
  const cardFoodbridgeDesc = content?.['bento.card_foodbridge_desc'] || "Connecting farmers to distributors. Eliminating middle-men. Reducing urban food waste."
  const cardCrmTitle = content?.['bento.card_crm_title'] || "Orbinex & PASS CRM"
  const cardCrmDesc = content?.['bento.card_crm_desc'] || "Role-based scheduling and internal workflow automation for enterprise teams."
  const cardQuoteText = content?.['bento.card_quote_text'] || "AI tools want you to do it yourself. We do it for you."
  const cardQuoteAuthor = content?.['bento.card_quote_author'] || "— The AK 0121 Philosophy"

  // Dynamically count total projects from DB list when available
  const projectsList = content?.['projects.list'] || []
  const projectsCount = projectsList.length > 0 ? projectsList.length : 20
  
  // Extract top-level numbers safely
  const ownershipVal = content?.['hero.stat_ownership_count'] ? parseInt(content['hero.stat_ownership_count']) : 100
  const domainsVal = content?.['hero.stat_domains_count'] ? parseInt(content['hero.stat_domains_count']) : 6
  const shipImg = content?.['hero.ship_img'] || SHIP_IMG

  return (
    <section id="work" className="py-24 px-6" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col gap-3 mb-12">
          <span
            className="text-xs font-mono font-semibold tracking-widest uppercase"
            style={{ color: "var(--primary)" }}
          >
            {sectionBadge}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance" style={{ color: "var(--foreground)" }}>
            {titleLead}
            <br />
            <span style={{ color: "var(--muted-foreground)" }}>{titleMuted}</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-auto">

          {/* Card 1 — large hero card (spans 2 cols 2 rows) */}
          <BentoCard
            className="md:col-span-2 md:row-span-2 p-8 flex flex-col justify-between min-h-[300px]"
            delay={0}
            style={{
              background: "linear-gradient(135deg, #161616 0%, #1a1208 100%)",
              border: "1px solid rgba(255,107,43,0.15)",
            }}
          >
            <div className="flex flex-col gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,107,43,0.15)", color: "var(--primary)" }}
              >
                <Brain size={24} />
              </div>
              <h3 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                {cardAiTitle}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {cardAiDesc}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {cardAiTags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(255,107,43,0.12)",
                    color: "var(--primary)",
                    border: "1px solid rgba(255,107,43,0.2)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </BentoCard>

          {/* Card 2 — Projects shipped metric with ship image above */}
          <BentoCard
            className="flex flex-col overflow-hidden min-h-[220px]"
            delay={80}
            style={{
              background: "#0f0f0f",
              border: "1px solid rgba(255,107,43,0.15)",
              padding: 0,
            }}
          >
            {/* Ship image */}
            <div className="relative w-full" style={{ height: "130px" }}>
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ background: "linear-gradient(to bottom,transparent 40%,#0f0f0f 100%)" }}
              />
              <Image
                src={shipImg}
                alt="Ship representing dynamic shipped count illustration"
                fill
                className="object-cover object-center"
                crossOrigin="anonymous"
              />
            </div>
            {/* Stat */}
            <div className="px-5 pb-5 pt-1 relative z-20">
              <Award size={16} style={{ color: "var(--primary)", marginBottom: "6px" }} />
              <div className="text-4xl font-bold font-mono" style={{ color: "var(--foreground)" }}>
                <Counter target={projectsCount} suffix="+" />
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                Projects Delivered
              </div>
            </div>
          </BentoCard>

          {/* Card 3 — Trackshift badge */}
          <BentoCard
            className="p-6 flex flex-col gap-3 justify-center items-start min-h-[140px]"
            delay={130}
            style={{
              background: "linear-gradient(135deg, #161616, #111820)",
              border: "1px solid rgba(68,136,255,0.15)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(68,136,255,0.12)", color: "#4488ff" }}
            >
              <Award size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{cardTrackshiftTitle}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{cardTrackshiftDesc}</div>
            </div>
          </BentoCard>

          {/* Card 5 — Data Protocol */}
          <BentoCard
            className="p-6 flex flex-col gap-4 min-h-[180px]"
            delay={200}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,107,43,0.1)", color: "var(--primary)" }}
            >
              <Database size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{cardProtocolTitle}</div>
              <div className="text-xs leading-relaxed mt-1" style={{ color: "var(--muted-foreground)" }}>
                {cardProtocolDesc}
              </div>
            </div>
          </BentoCard>

          {/* Card 6 — Terminal prompt card (col span 2) */}
          <BentoCard
            className="md:col-span-2 p-6 min-h-[160px] flex flex-col justify-between"
            delay={240}
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={14} style={{ color: "var(--primary)" }} />
              <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{cardCliTitle}</span>
            </div>
            <div className="font-mono text-xs leading-6" style={{ color: "var(--muted-foreground)" }}>
              <span style={{ color: "var(--primary)" }}>$ </span>
              <span style={{ color: "#4ade80" }}>forge</span>{" "}
              <span>{cardCliCommand}</span>
              <br />
              {cardCliLines.slice(0, 2).map((l: string) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
              <span style={{ color: "#4ade80" }}>{cardCliLines[2]}</span>
              <span
                className="inline-block w-1.5 h-4 align-middle animate-pulse"
                style={{ background: "var(--primary)", borderRadius: "1px" }}
              />
            </div>
          </BentoCard>

          {/* Card 7 — Agriculture/Foodbridge */}
          <BentoCard
            className="p-6 flex flex-col gap-4 min-h-[160px]"
            delay={280}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}
            >
              <Globe size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{cardFoodbridgeTitle}</div>
              <div className="text-xs leading-relaxed mt-1" style={{ color: "var(--muted-foreground)" }}>
                {cardFoodbridgeDesc}
              </div>
            </div>
          </BentoCard>

          {/* Card 8 — CRM */}
          <BentoCard
            className="p-6 flex flex-col gap-4 min-h-[160px]"
            delay={310}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,107,43,0.1)", color: "var(--primary)" }}
            >
              <Users size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{cardCrmTitle}</div>
              <div className="text-xs leading-relaxed mt-1" style={{ color: "var(--muted-foreground)" }}>
                {cardCrmDesc}
              </div>
            </div>
          </BentoCard>

          {/* Card 9 — Philosophy quote (col span 2) */}
          <BentoCard
            className="md:col-span-2 p-8 flex flex-col justify-center min-h-[140px]"
            delay={350}
            style={{
              background: "linear-gradient(135deg, #161616 0%, #1a1208 100%)",
              border: "1px solid rgba(255,107,43,0.15)",
            }}
          >
            <blockquote className="text-lg md:text-xl font-semibold leading-relaxed" style={{ color: "var(--foreground)" }}>
              &ldquo;{cardQuoteText.split("do it yourself")[0]}
              <span style={{ color: "var(--primary)" }}>do it yourself</span>
              {cardQuoteText.split("do it yourself")[1]?.split("do it for you")[0]}
              <span
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "var(--primary)",
                  textUnderlineOffset: "4px",
                }}
              >
                do it for you
              </span>
              {cardQuoteText.split("do it for you")[1] || "."}&rdquo;
            </blockquote>
            <span className="text-xs mt-3" style={{ color: "var(--muted-foreground)" }}>
              {cardQuoteAuthor}
            </span>
          </BentoCard>

          {/* Card 10 — Ownership */}
          <BentoCard
            className="p-6 flex flex-col justify-between min-h-[140px]"
            delay={390}
          >
            <Cpu size={20} style={{ color: "var(--primary)" }} />
            <div>
              <div className="text-4xl font-bold font-mono" style={{ color: "var(--foreground)" }}>
                <Counter target={ownershipVal} suffix="%" />
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                Client Ownership
              </div>
            </div>
          </BentoCard>

          {/* Card 11 — Domains */}
          <BentoCard
            className="p-6 flex flex-col justify-between min-h-[140px]"
            delay={420}
          >
            <Shield size={20} style={{ color: "var(--primary)" }} />
            <div>
              <div className="text-4xl font-bold font-mono" style={{ color: "var(--foreground)" }}>
                <Counter target={domainsVal} suffix="+" />
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                Industry Domains
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  )
}
