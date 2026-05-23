"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  Trophy,
  Star,
  Zap,
  Shield,
  Globe,
  Users,
  Rocket,
  Brain,
  CheckCircle2,
  ArrowRight,
  Flag,
  Handshake,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

/* ─── Shared hooks ─────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useCounter(target: number, active: boolean, decimals = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let v = 0
    const step = target / 55
    const t = setInterval(() => {
      v += step
      if (v >= target) { setVal(target); clearInterval(t) }
      else setVal(parseFloat(v.toFixed(decimals)))
    }, 18)
    return () => clearInterval(t)
  }, [active, target, decimals])
  return val
}

/* ─── Journey timeline data — starts Nov 2025 ─────────────── */
const milestones = [
  {
    date: "Nov 2025",
    icon: Flag,
    color: "#ff6b2b",
    bg: "rgba(255,107,43,0.12)",
    border: "rgba(255,107,43,0.28)",
    headline: "Win Trackshift 2025 — AK 0121 Is Born",
    body:
      "November 2025. Two builders enter the Trackshift national production-systems challenge — and walk out champions. The win isn't just a trophy; it's a mandate. Arihant and Kundan incorporate AK 0121 the same week, channelling the Trackshift energy into the foundation of a done-for-you tech agency. The clock starts ticking.",
    tag: "Origin",
  },
  {
    date: "Dec 2025",
    icon: Handshake,
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.2)",
    headline: "First Client Secured",
    body:
      "December 2025. The ink is barely dry on the agency when AK 0121 lands its first paying client — a civic-tech operator needing an emergency ambulance dispatch system. Within six weeks of kickoff the platform is live, cutting median response time by 60% in pilot regions. First client. First production deployment. First proof.",
    tag: "First Client",
  },
  {
    date: "Feb 2026",
    icon: Zap,
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.2)",
    headline: "15 Projects Surpassed",
    body:
      "February 2026. Three months into operations AK 0121 clears 15 production deployments. The portfolio spans AI fake-news detection (91% accuracy across 2M+ articles), the Foodbridge supply-chain platform connecting 200+ farmers, and a 500 GB zero-loss secure-transfer logistics protocol. The pipeline is full. The agency is real.",
    tag: "Milestone",
  },
  {
    date: "Mar 2026",
    icon: Rocket,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.22)",
    headline: "20+ Projects — Still Counting",
    body:
      "March 2026. AK 0121 crosses 20 live deployments. Enterprise CRM suites (Orbinex, PASS) serving 500+ daily users, a multi-modal AI pipeline, and a growing waitlist of clients. 100% retention rate. Zero failed launches. The Done-For-You model is validated at scale — and the agency is only getting started.",
    tag: "20+ Projects",
    isCurrent: true,
  },
]

/* ─── Horizontal photo gallery data ───────────────────────── */
const galleryPhotos = [
  { src: "/gallery/photo-1.jpg", caption: "The Team", sub: "Building in the dark — literally and figuratively" },
  { src: "/gallery/photo-2.jpg", caption: "Deep Work", sub: "Every keystroke is intentional" },
  { src: "/gallery/photo-3.jpg", caption: "Trackshift Win", sub: "November 2025 — the moment it all began" },
  { src: "/gallery/photo-4.jpg", caption: "Deployment Night", sub: "No sleep until it's live" },
  { src: "/gallery/photo-5.jpg", caption: "Presentations", sub: "Demo Presentation for the clients" },
]

/* ─── Achievements data ────────────────────────────────────── */
const achievements = [
  {
    icon: Trophy,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.22)",
    title: "Trackshift Award 2025",
    desc: "Won the national production-systems challenge. The moment AK 0121 proved itself in front of an industry jury.",
    tag: "2025",
  },
  {
    icon: Shield,
    color: "#4488ff",
    bg: "rgba(68,136,255,0.12)",
    border: "rgba(68,136,255,0.18)",
    title: "Zero-Loss Data Transfer",
    desc: "500GB protocol for enterprise logistics — zero lost packets over unstable networks.",
    tag: "Infra",
  },
  {
    icon: Star,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.18)",
    title: "91% AI Accuracy",
    desc: "Fake news detection model — production-deployed, benchmarked against industry baselines.",
    tag: "AI",
  },
  {
    icon: CheckCircle2,
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.15)",
    title: "100% Client Retention",
    desc: "Every client we have worked with has either returned or referred us. No exceptions.",
    tag: "Trust",
  },
]

/* ─── BigStatCard ──────────────────────────────────────────── */
function BigStatCard({
  value, suffix, label, sub, delay,
}: {
  value: number; suffix: string; label: string; sub: string; delay: number
}) {
  const { ref, inView } = useInView(0.2)
  const count = useCounter(value, inView)
  return (
    <div
      ref={ref}
      className="bento-card p-6 flex flex-col justify-between"
      style={{
        background: "linear-gradient(135deg,#161616 0%,#1a1208 100%)",
        border: "1px solid rgba(255,107,43,0.18)",
        opacity: inView ? 1 : 0,
        transform: inView ? "scale(1)" : "scale(0.94)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        minHeight: "150px",
      }}
    >
      <div className="text-4xl font-black font-mono" style={{ color: "var(--primary)", lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div>
        <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{sub}</div>
      </div>
    </div>
  )
}

/* ─── AchievementBadge ─────────────────────────────────────── */
function AchievementBadge({
  icon: Icon, color, bg, border, title, desc, tag, delay,
}: {
  icon: React.ElementType; color: string; bg: string; border: string
  title: string; desc: string; tag: string; delay: number
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className="bento-card p-5 flex flex-col gap-3"
      style={{
        border: `1px solid ${border}`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: bg, color }}
        >
          <Icon size={18} />
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: bg, color, border: `1px solid ${color}44` }}
        >
          {tag}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{title}</h3>
        <p className="text-xs leading-relaxed mt-1" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
      </div>
    </div>
  )
}

/* ─── TimelineItem ─────────────────────────────────────────── */
function TimelineItem({
  milestone,
  index,
  isLast,
}: {
  milestone: (typeof milestones)[0]
  index: number
  isLast: boolean
}) {
  const { ref, inView } = useInView(0.15)
  const Icon = milestone.icon

  return (
    <div
      ref={ref}
      className="flex gap-6 relative"
      style={{
        paddingBottom: isLast ? "0" : "48px",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.65s ease ${index * 120}ms, transform 0.65s ease ${index * 120}ms`,
      }}
    >
      {/* Spine */}
      <div className="flex flex-col items-center" style={{ minWidth: "80px" }}>
        {/* Date label above dot */}
        <span
          className="text-xs font-mono font-bold mb-2 text-center leading-tight"
          style={{ color: milestone.color }}
        >
          {milestone.date}
        </span>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 z-10"
          style={{
            background: milestone.bg,
            border: `2px solid ${milestone.color}`,
            color: milestone.color,
            boxShadow: milestone.isCurrent ? `0 0 24px ${milestone.color}66` : "none",
          }}
        >
          <Icon size={18} />
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-3"
            style={{
              background: `linear-gradient(to bottom, ${milestone.color}88, ${milestone.color}11)`,
              minHeight: "40px",
            }}
          />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 pb-2 pt-7">
        <div
          className="bento-card p-6 relative overflow-hidden"
          style={{
            border: `1px solid ${milestone.border}`,
            background: milestone.isCurrent
              ? "linear-gradient(135deg,#161616 0%,#1a1208 100%)"
              : "var(--surface)",
          }}
        >
          {/* Subtle accent glow top-right */}
          <div
            className="absolute top-0 right-0 pointer-events-none"
            style={{
              width: "180px",
              height: "180px",
              background: `radial-gradient(circle at 100% 0%, ${milestone.bg} 0%, transparent 70%)`,
            }}
          />
          <div className="flex items-start justify-between gap-4 flex-wrap mb-3 relative z-10">
            <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
              {milestone.headline}
            </h3>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
              style={{
                background: milestone.bg,
                color: milestone.color,
                border: `1px solid ${milestone.color}44`,
              }}
            >
              {milestone.tag}
              {milestone.isCurrent && (
                <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full align-middle animate-pulse" style={{ background: milestone.color }} />
              )}
            </span>
          </div>
          <p className="text-sm leading-relaxed relative z-10" style={{ color: "var(--muted-foreground)" }}>
            {milestone.body}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Horizontal Photo Gallery (editorial style) ───────────── */
function PhotoGallery() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(0)
  const scrollStart = useRef(0)
  const { ref: sectionRef, inView } = useInView(0.1)

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir === "right" ? 360 : -360, behavior: "smooth" })
  }

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStart.current = e.clientX
    scrollStart.current = trackRef.current?.scrollLeft ?? 0
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return
    const dx = dragStart.current - e.clientX
    trackRef.current.scrollLeft = scrollStart.current + dx
  }

  const stopDrag = () => setIsDragging(false)

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#0d0d0d",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}
    >
      {/* Background blurred poster */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src={galleryPhotos[activeIdx].src}
          alt=""
          fill
          className="object-cover object-center"
          style={{ filter: "blur(32px) brightness(0.18) saturate(1.4)", transform: "scale(1.1)" }}
          crossOrigin="anonymous"
        />
      </div>

      {/* Corner crosshairs — reference design detail */}
      {[
        { top: "16px", left: "24px" },
        { top: "16px", right: "24px" },
        { bottom: "16px", left: "24px" },
        { bottom: "16px", right: "24px" },
      ].map((pos, i) => (
        <div key={i} className="absolute pointer-events-none z-20" style={pos}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="10" y1="0" x2="10" y2="8" stroke="rgba(255,107,43,0.7)" strokeWidth="1.5" />
            <line x1="0" y1="10" x2="8" y2="10" stroke="rgba(255,107,43,0.7)" strokeWidth="1.5" />
            {i % 2 === 1 && <line x1="12" y1="10" x2="20" y2="10" stroke="rgba(255,107,43,0.7)" strokeWidth="1.5" />}
            {i > 1 && <line x1="10" y1="12" x2="10" y2="20" stroke="rgba(255,107,43,0.7)" strokeWidth="1.5" />}
          </svg>
        </div>
      ))}

      {/* Section label top-left */}
      <div className="absolute top-7 left-8 z-20 flex items-center gap-2">
        <span
          className="text-xs font-mono font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
          style={{ background: "rgba(255,107,43,0.15)", color: "var(--primary)", border: "1px solid rgba(255,107,43,0.3)" }}
        >
          Photo Gallery
        </span>
      </div>

      {/* Nav arrows top-right */}
      <div className="absolute top-6 right-8 z-20 flex gap-2">
        <button
          onClick={() => scroll("left")}
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
          style={{ background: "rgba(255,255,255,0.08)", color: "var(--foreground)", border: "1px solid rgba(255,255,255,0.1)" }}
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
          style={{ background: "rgba(255,107,43,0.18)", color: "var(--primary)", border: "1px solid rgba(255,107,43,0.3)" }}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Big title — editorial style */}
      <div className="relative z-10 px-8 pt-20 pb-6 pointer-events-none select-none">
        <h2
          className="font-black uppercase tracking-tighter leading-none text-balance"
          style={{
            fontSize: "clamp(3rem, 9vw, 7rem)",
            color: "rgba(255,107,43,0.9)",
            textShadow: "0 0 60px rgba(255,107,43,0.4), 0 0 120px rgba(255,107,43,0.15)",
            fontFamily: "var(--font-sans)",
          }}
        >
          AK 0121
        </h2>
      </div>

      {/* Scrollable photo track */}
      <div
        ref={trackRef}
        className="relative z-10 flex gap-4 px-8 pb-8"
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onScroll={() => {
          const el = trackRef.current
          if (!el) return
          const idx = Math.round(el.scrollLeft / 360)
          setActiveIdx(Math.max(0, Math.min(idx, galleryPhotos.length - 1)))
        }}
      >
        <style>{`.photo-track::-webkit-scrollbar{display:none}`}</style>
        {galleryPhotos.map((photo, i) => (
          <div
            key={photo.src}
            onClick={() => setActiveIdx(i)}
            className="relative shrink-0 rounded-2xl overflow-hidden transition-transform duration-300"
            style={{
              width: i === 1 ? "340px" : "280px",
              height: i === 1 ? "300px" : "220px",
              alignSelf: i % 2 === 0 ? "flex-end" : "flex-start",
              border: activeIdx === i
                ? "2px solid rgba(255,107,43,0.7)"
                : "1px solid rgba(255,255,255,0.08)",
              transform: activeIdx === i ? "scale(1.03)" : "scale(1)",
              boxShadow: activeIdx === i ? "0 0 40px rgba(255,107,43,0.25)" : "none",
            }}
          >
            {/* Bracket overlay on feature cards — inspired by reference */}
            {(i === 1 || i === 3) && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 340 300" fill="none" preserveAspectRatio="none">
                  <path d="M20 20 Q20 8 32 8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
                  <path d="M308 8 Q320 8 320 20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
                  <path d="M320 280 Q320 292 308 292" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
                  <path d="M32 292 Q20 292 20 280" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            )}
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              className="object-cover object-center pointer-events-none"
              draggable={false}
              crossOrigin="anonymous"
            />
            {/* Caption overlay on hover */}
            <div
              className="absolute inset-x-0 bottom-0 z-20 px-4 py-3"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                opacity: activeIdx === i ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              <p className="text-xs font-bold text-white">{photo.caption}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{photo.sub}</p>
            </div>
          </div>
        ))}
        {/* Spacer */}
        <div className="shrink-0 w-6" />
      </div>

      {/* Caption tagline — reference style */}
      <div className="relative z-10 px-8 pb-10">
        <p
          className="font-bold uppercase tracking-widest text-balance"
          style={{
            fontSize: "clamp(0.65rem, 1.4vw, 0.9rem)",
            color: "rgba(255,107,43,0.6)",
            letterSpacing: "0.18em",
          }}
        >
          The atmosphere is focused and relentless — where builders of all disciplines ship{" "}
          <br className="hidden md:block" />
          things that matter, surrounded by like-minded practitioners.
        </p>
      </div>
    </div>
  )
}

/* ─── Founder card ─────────────────────────────────────────── */
function FounderCard({
  img, name, role, tagline, description, skills, accentColor, accentBg, delay,
}: {
  img: string; name: string; role: string; tagline: string
  description: string; skills: string[]; accentColor: string; accentBg: string; delay: number
}) {
  const { ref, inView } = useInView(0.15)
  const [showHover, setShowHover] = useState(false)

  return (
    <div
      ref={ref}
      className="bento-card flex flex-col overflow-hidden"
      style={{
        border: `1px solid ${accentBg.replace("0.12", "0.22")}`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {/* Image container with role text as background */}
      <div
        className="relative overflow-hidden group cursor-pointer"
        style={{ aspectRatio: "1 / 1", minHeight: "420px" }}
        onMouseEnter={() => setShowHover(true)}
        onMouseLeave={() => setShowHover(false)}
      >
        {/* Background role text (large, behind image) */}
        <div
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          style={{
            fontSize: "64px",
            fontWeight: "900",
            color: accentColor,
            opacity: 0.08,
            textTransform: "uppercase",
            letterSpacing: "-2px",
            lineHeight: "1",
            textAlign: "center",
            padding: "20px",
            wordBreak: "break-word",
          }}
        >
          {role}
        </div>

        {/* Radial glow background */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${accentBg} 0%, transparent 70%)` }}
        />

        {/* Image (in front) */}
        <Image
          src={img}
          alt={`Portrait of ${name}`}
          fill
          className="object-cover object-center relative z-[2]"
          crossOrigin="anonymous"
        />

        {/* Hover overlay with info */}
        <div
          className="absolute inset-0 z-[3] transition-opacity duration-300 flex flex-col items-center justify-center p-6 backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}11 100%)`,
            opacity: showHover ? 1 : 0,
            pointerEvents: showHover ? "auto" : "none",
          }}
        >
          <div className="text-center">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
              {role}
            </p>
            <h4 className="text-lg font-bold mb-3" style={{ color: "#fff" }}>
              {name}
            </h4>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
              {tagline}
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {skills.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-xs px-2 py-1 rounded-md font-mono"
                  style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient fade at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none"
          style={{ height: "100px", background: "linear-gradient(to bottom, transparent, rgba(17,17,17,0.8))" }}
        />

        {/* Name at bottom of image (in front) */}
        <div className="absolute bottom-4 left-4 right-4 z-[2]">
          <h3 className="text-xl font-bold tracking-tight" style={{ color: "#fff" }}>
            {name}
          </h3>
        </div>
      </div>

      {/* Bottom section with description and skills */}
      <div className="p-6 flex flex-col gap-4">
        <p className="text-sm font-medium" style={{ color: accentColor }}>
          {tagline}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {description}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {skills.map((s) => (
            <span
              key={s}
              className="text-xs px-2.5 py-1 rounded-md font-mono"
              style={{ background: "var(--surface-raised)", color: "var(--muted-foreground)", border: "1px solid var(--surface-border)" }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── FounderCTA ───────────────────────────────────────────── */
function FounderCTA() {
  const { ref, inView } = useInView(0.2)
  return (
    <div
      ref={ref}
      className="mt-12 bento-card p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      style={{
        background: "linear-gradient(135deg,#161616 0%,#1a1208 100%)",
        border: "1px solid rgba(255,107,43,0.22)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease 200ms, transform 0.6s ease 200ms",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,107,43,0.12)", color: "var(--primary)" }}
        >
          <Handshake size={22} />
        </div>
        <div>
          <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
            Want to work with the team?
          </h3>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Arihant handles the conversation. Kundan builds the solution. Together, we ship your vision.
          </p>
        </div>
      </div>
      <button
        onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
        className="px-7 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 cursor-pointer transition-opacity duration-200 hover:opacity-85 shrink-0"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        Start a Project
        <ArrowRight size={15} />
      </button>
    </div>
  )
}

/* ─── Main export ──────────────────────────────────────────── */
export function AchievementsSection() {
  const { ref: headRef, inView: headIn } = useInView(0.15)
  const { ref: journeyHeaderRef, inView: journeyHeaderIn } = useInView(0.08)
  const { ref: foundersRef, inView: foundersIn } = useInView(0.1)

  return (
    <>
      {/* ══════ SECTION 1 — Achievements ══════ */}
      <section
        id="achievements"
        className="py-24 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: "var(--surface)" }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            left: "50%", top: 0, transform: "translateX(-50%)",
            width: "800px", height: "400px",
            background: "radial-gradient(ellipse 60% 55% at 50% 0%, rgba(255,107,43,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div
            ref={headRef}
            className="mb-12"
            style={{
              opacity: headIn ? 1 : 0,
              transform: headIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span className="text-xs font-mono font-semibold tracking-widest uppercase" style={{ color: "var(--primary)" }}>
              Proven Results
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mt-3" style={{ color: "var(--foreground)" }}>
              Achievements of{" "}
              <span style={{ color: "var(--primary)" }} className="glow-text">Our Team</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed max-w-lg" style={{ color: "var(--muted-foreground)" }}>
              Every project is a milestone. Here are the moments that defined AK 0121 as an agency that ships things that matter.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <BigStatCard value={20} suffix="+" label="Projects Shipped" sub="Across 6+ industries" delay={0} />
            <BigStatCard value={8} suffix="wk" label="Avg. Delivery" sub="Kickoff to launch" delay={70} />
            <BigStatCard value={91} suffix="%" label="AI Accuracy" sub="Fake news detection" delay={140} />
            <BigStatCard value={60} suffix="%" label="Response Cut" sub="Emergency dispatch" delay={210} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {achievements.map((a, i) => (
              <AchievementBadge key={a.title} {...a} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SECTION 2 — Horizontal Photo Gallery ══════ */}
      <PhotoGallery />

      {/* ══════ SECTION 3 — Our Journey (timeline) ══════ */}
      <section
        id="journey"
        className="py-24 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-200px", top: "30%",
            width: "600px", height: "600px",
            background: "radial-gradient(circle, rgba(255,107,43,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div
            ref={journeyHeaderRef}
            className="mb-16"
            style={{
              opacity: journeyHeaderIn ? 1 : 0,
              transform: journeyHeaderIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span className="text-xs font-mono font-semibold tracking-widest uppercase" style={{ color: "var(--primary)" }}>
              Since November 2025
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mt-3" style={{ color: "var(--foreground)" }}>
              Our{" "}
              <span style={{ color: "var(--primary)" }} className="glow-text">Journey</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed max-w-xl" style={{ color: "var(--muted-foreground)" }}>
              From a single hackathon win in November 2025 to a fully operational agency with 20+ live deployments — this is the story of how AK 0121 went from an idea to a track record in under six months.
            </p>
          </div>

          {/* Vertical timeline */}
          <div className="flex flex-col gap-0">
            {milestones.map((m, i) => (
              <TimelineItem
                key={m.date + m.headline}
                milestone={m}
                index={i}
                isLast={i === milestones.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SECTION 4 — Meet the Founders ══════ */}
      <section
        id="team"
        className="py-24 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: "var(--surface)" }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            right: "-200px", top: "20%",
            width: "600px", height: "600px",
            background: "radial-gradient(circle, rgba(255,107,43,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div
            ref={foundersRef}
            className="mb-14"
            style={{
              opacity: foundersIn ? 1 : 0,
              transform: foundersIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span className="text-xs font-mono font-semibold tracking-widest uppercase" style={{ color: "var(--primary)" }}>
              The People Behind AK 0121
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mt-3" style={{ color: "var(--foreground)" }}>
              Meet Our Founder{" "}
              <span style={{ color: "var(--primary)" }} className="glow-text">&amp; Co-Founder</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed max-w-xl" style={{ color: "var(--muted-foreground)" }}>
              Two builders. One agency. A deal-maker who sees opportunity and a systems-hacker who builds the backbone everything runs on.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FounderCard
              img="/founder-arihant.jpg"
              name="Arihant Bulbulsingh Yadav"
              role="Founder"
              tagline="Manager. Deal Maker. Visionary."
              description="Arihant is the front-facing force behind AK 0121. He spots market gaps before they become obvious, closes the deals that matter, and keeps every client engagement running at pace. His ability to translate complex technical work into clear business value has been the agency's single biggest growth lever."
              skills={["Client Strategy", "Business Development", "Project Management", "Vision"]}
              accentColor="#ff6b2b"
              accentBg="rgba(255,107,43,0.12)"
              delay={0}
            />
            <FounderCard
              img="/founder-kundan.jpg"
              name="Kundan K Khuntia"
              role="Co-Founder"
              tagline="Strategist. Hacker. Backbone Builder."
              description="Kundan is the technical soul of AK 0121. He architected every core system the agency has shipped — from the emergency dispatch protocol to the multi-modal AI pipeline to the enterprise CRMs. His approach is ruthlessly pragmatic: the cleanest solution that survives production."
              skills={["System Architecture", "AI/ML Engineering", "Backend Infrastructure", "Security"]}
              accentColor="#a78bfa"
              accentBg="rgba(167,139,250,0.12)"
              delay={120}
            />
          </div>
          <FounderCTA />
        </div>
      </section>
    </>
  )
}
