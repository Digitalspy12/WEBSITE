"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  avatar: string
  rating: number
  date: string
  text: string
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Edward Alexander",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop",
    rating: 4.9,
    date: "29 Aug, 2017",
    text: "The entire process was seamless. They understood my technical requirements instantly and built a custom dashboard in 4 weeks. Their code ownership model gives me total peace of mind."
  },
  {
    id: 2,
    name: "Diana Johnston",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop",
    rating: 4.9,
    date: "29 Aug, 2017",
    text: "Overall pleasurable experience.Pay a little first and Pay a little during the development of the app as milestones are achieved, which made me feel very confident and comfortable.Seamless and Easy process."
  },
  {
    id: 3,
    name: "Lauren Contreras",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&fit=crop",
    rating: 4.9,
    date: "29 Aug, 2017",
    text: "I was skeptical about a 'done-for-you' tech agency, but AK 0121 exceeded all expectations. They built our automated supply chain dashboard in record time. Absolute senior engineering caliber."
  }
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

export function TestimonialSection({ content }: { content?: any }) {
  const { ref: sectionRef, inView } = useInView(0.15)
  const [activeId, setActiveId] = useState<number>(2) // Diana Johnston active by default
  const [fadeState, setFadeState] = useState<"in" | "out">("in")

  // Extract from dynamic content or fallback
  const badge = content?.['testimonials.section_badge'] || "Reviews"
  const title = content?.['testimonials.title_lead'] || "Customer Reviews"
  const list: Testimonial[] = content?.['testimonials.list'] || DEFAULT_TESTIMONIALS

  const activeTestimonial = list.find((t) => t.id === activeId) || list[0] || DEFAULT_TESTIMONIALS[1]

  const handleReviewerClick = (id: number) => {
    if (id === activeId) return
    setFadeState("out")
    setTimeout(() => {
      setActiveId(id)
      setFadeState("in")
    }, 200)
  }

  // Position coordinates along the arc (Desktop only)
  // Edward Alexander (top), Diana Johnston (middle), Lauren Contreras (bottom)
  const arcPositions = [
    { top: "5%", left: "40px" },
    { top: "45%", left: "140px" },
    { top: "85%", left: "40px" }
  ]

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{
        background: "var(--background)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {/* Background circular grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 50%, rgba(34,197,94,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Accent Bar & Header */}
        <div className="flex flex-col items-start mb-12 lg:mb-16">
          <div className="w-12 h-1.5 rounded-full mb-5" style={{ background: "#22c55e" }} />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            {title}
          </h2>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[420px]">
          
          {/* LEFT COLUMN: Arc Reviewers selection (lg:col-span-5) */}
          <div className="col-span-1 lg:col-span-5 flex justify-center items-center relative h-[380px] w-full max-w-[420px] mx-auto select-none">
            
            {/* Desktop-only vertical Circular Arc SVG */}
            <div className="absolute inset-0 hidden lg:block">
              <svg className="w-full h-full pointer-events-none" viewBox="0 0 380 380" fill="none">
                <path
                  d="M 60,20 Q 220,190 60,360"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1.5"
                />
                {/* Accent glow line inside arc */}
                <path
                  d="M 60,20 Q 220,190 60,360"
                  stroke="url(#arcGlowGradient)"
                  strokeWidth="1.5"
                  className="opacity-40"
                />
                <defs>
                  <linearGradient id="arcGlowGradient" x1="0%" y1="0%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                    <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Desktop circular arc items */}
            <div className="absolute inset-0 hidden lg:block">
              {list.map((reviewer, idx) => {
                const isActive = reviewer.id === activeId
                const pos = arcPositions[idx] || arcPositions[0]
                
                return (
                  <div
                    key={reviewer.id}
                    onClick={() => handleReviewerClick(reviewer.id)}
                    className="absolute cursor-pointer flex items-center gap-4 group transition-all duration-300"
                    style={{
                      top: pos.top,
                      left: pos.left,
                    }}
                  >
                    {/* Avatar circle */}
                    <div
                      className={`relative rounded-full overflow-hidden transition-all duration-300 select-none ${
                        isActive
                          ? "w-20 h-20 ring-4 ring-green-500/20 scale-105"
                          : "w-14 h-14 ring-1 ring-white/10 opacity-70 group-hover:opacity-100 group-hover:scale-105"
                      }`}
                    >
                      <Image
                        src={reviewer.avatar}
                        alt={reviewer.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50px, 80px"
                      />
                    </div>

                    {/* Metadata text label */}
                    <div className="flex flex-col justify-center">
                      <h4
                        className={`font-semibold transition-all duration-300 leading-snug ${
                          isActive
                            ? "text-base font-bold scale-105 text-[var(--foreground)]"
                            : "text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                        }`}
                      >
                        {reviewer.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-[var(--muted-foreground)] opacity-90">
                        <Star size={11} className="fill-green-500 stroke-green-500 shrink-0" />
                        <span>
                          <strong className="text-green-500 font-medium">{reviewer.rating}</strong> on {reviewer.date}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mobile/Tablet Touch-friendly Layout (Alternative to Arc layout) */}
            <div className="lg:hidden flex flex-row gap-4 justify-center items-center w-full px-2">
              {list.map((reviewer) => {
                const isActive = reviewer.id === activeId
                return (
                  <button
                    key={reviewer.id}
                    onClick={() => handleReviewerClick(reviewer.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 w-1/3 min-w-[95px] max-w-[120px] ${
                      isActive
                        ? "bg-white/[0.03] border-green-500/30 scale-105"
                        : "bg-transparent border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <Image
                        src={reviewer.avatar}
                        alt={reviewer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-center truncate w-full" style={{ color: "var(--foreground)" }}>
                      {reviewer.name.split(" ")[0]}
                    </span>
                    <div className="flex items-center gap-0.5 text-[9px] text-[var(--muted-foreground)] mt-0.5">
                      <Star size={8} className="fill-green-500 stroke-green-500 shrink-0" />
                      <span>{reviewer.rating}</span>
                    </div>
                  </button>
                )
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Review Text (lg:col-span-7) */}
          <div
            className={`col-span-1 lg:col-span-7 flex flex-col justify-center relative min-h-[220px] lg:pl-12 transition-all duration-300 ${
              fadeState === "in" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            {/* Elegant Double Quote mark */}
            <span
              className="text-[120px] font-serif leading-none absolute -left-4 -top-16 select-none pointer-events-none opacity-[0.08]"
              style={{ color: "var(--foreground)" }}
            >
              “
            </span>

            {/* Review Statement body with drop-cap italic serif styling */}
            <blockquote className="relative z-10 flex flex-col gap-6">
              <p
                className="text-lg sm:text-xl md:text-2xl leading-relaxed text-balance text-left font-serif italic font-light tracking-wide text-neutral-300"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', Times, serif"
                }}
              >
                {/* Beautiful Serif Italic drop-cap style letter */}
                <span className="text-4xl sm:text-5xl md:text-6xl font-serif italic mr-1 text-green-500 float-left leading-[0.75] font-normal select-none">
                  {activeTestimonial.text.charAt(0)}
                </span>
                {activeTestimonial.text.slice(1)}
              </p>

              {/* Mobile details badge showing name/date */}
              <div className="flex flex-col mt-2 lg:hidden border-t pt-4 border-white/5">
                <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  {activeTestimonial.name}
                </span>
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  ★ {activeTestimonial.rating} on {activeTestimonial.date}
                </span>
              </div>
            </blockquote>

          </div>

        </div>

      </div>
    </section>
  )
}
