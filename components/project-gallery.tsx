"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

/* ─── Default Static fallback data ─────────────────────────── */
const defaultProjects = [
  {
    id: 1,
    img: "/projects/trackshift.jpg",
    title: "Trackshift Emergency Dispatch",
    category: "Civic Tech",
    tag: "Award Winner",
    tagColor: "#f59e0b",
    tagBg: "rgba(245,158,11,0.12)",
    stat: "−60% response time",
    year: "Nov 2025",
    desc: "Zero-latency ambulance routing system. Deployed across pilot regions within 6 weeks of kickoff.",
  },
  {
    id: 2,
    img: "/projects/ai-detector.jpg",
    title: "Multi-Modal Fake News Detector",
    category: "AI / ML",
    tag: "91% Accuracy",
    tagColor: "#a78bfa",
    tagBg: "rgba(167,139,250,0.15)",
    stat: "2M+ articles trained",
    year: "Dec 2025",
    desc: "Production-grade misinformation detection pipeline — text, image, and source cross-validation.",
  },
  {
    id: 3,
    img: "/projects/foodbridge.jpg",
    title: "Foodbridge Supply Chain",
    category: "AgriTech",
    tag: "35% Waste Reduced",
    tagColor: "#4ade80",
    tagBg: "rgba(74,222,128,0.12)",
    stat: "200+ farmers connected",
    year: "Jan 2026",
    desc: "Farm-to-distributor logistics platform cutting food waste by connecting rural producers to urban demand.",
  },
  {
    id: 4,
    img: "/projects/crm.jpg",
    title: "Orbinex Enterprise CRM",
    category: "SaaS / Enterprise",
    tag: "500+ Users",
    tagColor: "#38bdf8",
    tagBg: "rgba(56,189,248,0.12)",
    stat: "8-week build",
    year: "Feb 2026",
    desc: "Role-based scheduling, automated workflows, and ops management for a 500-person enterprise team.",
  },
  {
    id: 5,
    img: "/projects/logistics.jpg",
    title: "Zero-Loss Data Protocol",
    category: "Infrastructure",
    tag: "0 Packet Loss",
    tagColor: "#ff6b2b",
    tagBg: "rgba(255,107,43,0.12)",
    stat: "500GB transferred",
    year: "Mar 2026",
    desc: "Custom secure file-transfer protocol for enterprise logistics — designed for unstable network conditions.",
  },
]

/* ─── Hook: InView ─────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)
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

/* ─── ProjectCard ──────────────────────────────────────────── */
function ProjectCard({
  project,
  isActive,
  index,
  inView,
}: {
  project: (typeof defaultProjects)[0]
  isActive: boolean
  index: number
  inView: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative shrink-0 rounded-2xl overflow-hidden flex flex-col"
      style={{
        width: isActive ? "420px" : "300px",
        height: "480px",
        border: isActive
          ? "1px solid rgba(255,107,43,0.5)"
          : hovered
          ? "1px solid rgba(255,107,43,0.25)"
          : "1px solid rgba(255,255,255,0.07)",
        transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: isActive ? "0 0 50px rgba(255,107,43,0.18)" : hovered ? "0 0 30px rgba(255,107,43,0.09)" : "none",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        background: "var(--surface)",
        cursor: "default",
        /* Stagger reveal */
        transitionProperty: "width, border-color, box-shadow, opacity, transform",
        transitionDuration: `0.5s, 0.3s, 0.3s, 0.6s, 0.6s`,
        transitionDelay: `0s, 0s, 0s, ${index * 80}ms, ${index * 80}ms`,
      }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ height: isActive ? "240px" : "200px", transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)", flexShrink: 0 }}>
        <Image
          src={project.img}
          alt={project.title}
          fill
          className="object-cover object-center"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.6s ease" }}
          draggable={false}
          crossOrigin="anonymous"
        />
        {/* Image gradient */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 50%, var(--surface) 100%)" }}
        />
        {/* Year badge */}
        <div
          className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-mono font-bold"
          style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
        >
          {project.year}
        </div>
        {/* Category badge */}
        <div
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-mono font-semibold"
          style={{ background: project.tagBg || 'rgba(255,107,43,0.12)', color: project.tagColor || 'var(--primary)', border: `1px solid ${project.tagColor || 'var(--primary)'}44` }}
        >
          {project.tag}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span
          className="text-xs font-mono font-semibold tracking-wider uppercase mb-2"
          style={{ color: "var(--muted-foreground)" }}
        >
          {project.category}
        </span>
        <h3
          className="font-bold leading-tight text-balance"
          style={{
            color: "var(--foreground)",
            fontSize: isActive ? "1.1rem" : "0.95rem",
            transition: "font-size 0.4s ease",
          }}
        >
          {project.title}
        </h3>

        {/* Expanded desc on active */}
        <p
          className="text-xs leading-relaxed mt-2"
          style={{
            color: "var(--muted-foreground)",
            opacity: isActive || hovered ? 1 : 0,
            maxHeight: isActive || hovered ? "80px" : "0",
            overflow: "hidden",
            transition: "opacity 0.4s ease, max-height 0.4s ease",
          }}
        >
          {project.desc}
        </p>

        {/* Stat + CTA */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-full"
            style={{ background: "var(--surface-raised)", color: "var(--primary)", border: "1px solid rgba(255,107,43,0.2)" }}
          >
            {project.stat}
          </span>
          {isActive && (
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity duration-200 hover:opacity-75 cursor-pointer"
              style={{ background: "rgba(255,107,43,0.15)", color: "var(--primary)", border: "1px solid rgba(255,107,43,0.3)" }}
              aria-label={`View ${project.title}`}
            >
              <ExternalLink size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Main component with auto-scroll ───────────────────────────────────────── */
export function ProjectGallery({ content }: { content?: any }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { ref: secRef, inView } = useInView(0.08) as { ref: React.RefObject<HTMLElement>; inView: boolean }
  const [activeIdx, setActiveIdx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const dragStartX = useRef(0)
  const scrollStart = useRef(0)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)
  const dragDirectionRef = useRef<"left" | "right" | null>(null)

  // Map database elements with static fallbacks
  const sectionBadge = content?.['projects.section_badge'] || "Work"
  const titleLead = content?.['projects.title_lead'] || "Projects "
  const titleGlow = content?.['projects.title_glow'] || "We've Shipped"
  const subtitle = content?.['projects.subtitle'] || "Auto-scrolling showcase. Drag left to pause, or use arrows to browse. Every card is a live production system."
  const projects = content?.['projects.list'] || defaultProjects

  /* Start auto-scroll when not hovering/dragging */
  const startAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    if (isHovering || isDragging) return

    autoScrollRef.current = setInterval(() => {
      const el = trackRef.current
      if (!el) return
      
      // Check if we're at the end
      const maxScroll = el.scrollWidth - el.clientWidth
      if (el.scrollLeft >= maxScroll) {
        // Loop back to start
        el.scrollLeft = 0
      } else {
        // Scroll forward
        el.scrollLeft += 8
      }
    }, 30)
  }

  const stopAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    autoScrollRef.current = null
  }

  /* Mouse drag scroll with direction detection */
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
    scrollStart.current = trackRef.current?.scrollLeft ?? 0
    dragDirectionRef.current = null
    stopAutoScroll()
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return
    const delta = dragStartX.current - e.clientX
    
    // Detect drag direction
    if (delta > 0) dragDirectionRef.current = "left"
    else if (delta < 0) dragDirectionRef.current = "right"
    
    trackRef.current.scrollLeft = scrollStart.current + delta
  }

  const stopDrag = () => {
    setIsDragging(false)
    dragDirectionRef.current = null
    // Resume auto-scroll only if moving forward (right); if dragged backward (left), pause
    if (dragDirectionRef.current !== "left") {
      startAutoScroll()
    }
  }

  /* Button navigation */
  const CARD_W = 332
  const scrollTo = (idx: number) => {
    const el = trackRef.current
    if (!el) return
    const target = Math.max(0, Math.min(idx, projects.length - 1))
    setActiveIdx(target)
    el.scrollTo({ left: target * CARD_W, behavior: "smooth" })
    stopAutoScroll()
  }

  /* Track scroll → update active index */
  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / CARD_W)
    setActiveIdx(Math.max(0, Math.min(idx, projects.length - 1)))
  }

  /* Hover controls */
  const onMouseEnterTrack = () => {
    setIsHovering(true)
    stopAutoScroll()
  }

  const onMouseLeaveTrack = () => {
    setIsHovering(false)
    startAutoScroll()
  }

  /* Auto-start on mount */
  useEffect(() => {
    startAutoScroll()
    return () => stopAutoScroll()
  }, [projects.length])

  /* Resume auto-scroll when hover/dragging stops */
  useEffect(() => {
    if (!isHovering && !isDragging) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }
  }, [isHovering, isDragging])

  return (
    <section
      id="work"
      ref={secRef as React.RefObject<HTMLDivElement>}
      className="py-24 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: 0, top: "50%", transform: "translateY(-50%)",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(255,107,43,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Header row */}
      <div
        className="px-4 sm:px-6 mb-10 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div>
          <span
            className="text-xs font-mono font-semibold tracking-widest uppercase"
            style={{ color: "var(--primary)" }}
          >
            {sectionBadge}
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-balance mt-3"
            style={{ color: "var(--foreground)" }}
          >
            {titleLead}{" "}
            <span style={{ color: "var(--primary)" }} className="glow-text">
              {titleGlow}
            </span>
          </h2>
          <p
            className="mt-3 text-sm leading-relaxed max-w-md"
            style={{ color: "var(--muted-foreground)" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Arrow controls */}
        <div className="flex items-center gap-3">
          {/* Dot indicators */}
          <div className="flex gap-1.5 mr-2">
            {projects.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeIdx === i ? "20px" : "6px",
                  height: "6px",
                  background: activeIdx === i ? "var(--primary)" : "rgba(255,255,255,0.2)",
                }}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => scrollTo(activeIdx - 1)}
            disabled={activeIdx === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-30"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--surface-border)",
            }}
            aria-label="Previous project"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollTo(activeIdx + 1)}
            disabled={activeIdx === projects.length - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-30"
            style={{
              background: "rgba(255,107,43,0.15)",
              color: "var(--primary)",
              border: "1px solid rgba(255,107,43,0.3)",
            }}
            aria-label="Next project"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal scroll track with auto-scroll */}
      <div
        ref={trackRef}
        className="flex gap-4 pl-4 sm:pl-6 pr-24"
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          paddingBottom: "12px",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onMouseEnter={onMouseEnterTrack}
        onMouseOver={onMouseEnterTrack}
        onScroll={onScroll}
      >
        {projects.map((p: any, i: number) => (
          <ProjectCard
            key={p.id || i}
            project={p}
            isActive={activeIdx === i}
            index={i}
            inView={inView}
          />
        ))}
        {/* View all CTA card */}
        <div
          className="shrink-0 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors duration-200"
          style={{
            width: "200px",
            height: "480px",
            border: "1px dashed rgba(255,107,43,0.25)",
            background: "rgba(255,107,43,0.03)",
          }}
          onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,107,43,0.12)", color: "var(--primary)" }}
          >
            <ArrowRight size={20} />
          </div>
          <p className="text-xs font-semibold text-center px-4" style={{ color: "var(--muted-foreground)" }}>
            Start your project with us
          </p>
        </div>
      </div>

      {/* Drag hint */}
      <div className="px-4 sm:px-6 mt-6 flex items-center gap-2 max-w-7xl mx-auto">
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 7h6M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Carousel auto-scrolls • Drag left to pause • Hover to stop
        </div>
      </div>
    </section>
  )
}
