"use client"

import { useState } from "react"
import { ArrowRight, Mail, Github, Twitter, Linkedin } from "lucide-react"

// Social icon mapping index
const iconMap: { [key: string]: any } = {
  Twitter: Twitter,
  Github: Github,
  Linkedin: Linkedin,
  Mail: Mail,
}

const defaultSocials = [
  { label: "Twitter", href: "https://twitter.com/ak0121", icon: "Twitter" },
  { label: "GitHub", href: "https://github.com/ak0121", icon: "Github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/ak0121", icon: "Linkedin" },
  { label: "Email", href: "mailto:hello@ak0121.agency", icon: "Mail" },
]

const defaultLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Achievements", href: "#achievements" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Contact", href: "#contact" },
]

// ── Email CTA + Contact ────────────────────────────────────────────
function ContactSection({ content }: { content?: any }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  // Map dynamic configs with fallbacks
  const sectionBadge = content?.['contact.section_badge'] || "Get In Touch"
  const titleLead = content?.['contact.title_lead'] || "Ready to stop doing it "
  const titleGlow = content?.['contact.title_glow'] || "yourself?"
  const description = content?.['contact.description'] || "Tell us your biggest bottleneck. We'll come back with an architecture and timeline — no fluff, no sales pitch."
  const btnText = content?.['contact.btn_text'] || "Start Project"
  const placeholder = content?.['contact.placeholder'] || "your@email.com"
  const successMessage = content?.['contact.success_message'] || "We'll reach out within 24 hours. Let's build."
  const disclaimer = content?.['contact.disclaimer'] || "No commitment required. Response within 24 hours."

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section
      id="contact"
      className="py-28 px-6 relative overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          right: "10%", bottom: "10%",
          width: "400px", height: "400px",
          background: "radial-gradient(circle,rgba(255,107,43,0.08) 0%,transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10 text-center flex flex-col items-center gap-8">
        <div className="flex flex-col gap-3">
          <span
            className="text-xs font-mono font-semibold tracking-widest uppercase"
            style={{ color: "var(--primary)" }}
          >
            {sectionBadge}
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-[1.08]"
            style={{ color: "var(--foreground)" }}
          >
            {titleLead}
            <span style={{ color: "var(--primary)" }} className="glow-text">{titleGlow}</span>
          </h2>
          <p
            className="text-base leading-relaxed max-w-md mx-auto"
            style={{ color: "var(--muted-foreground)" }}
          >
            {description}
          </p>
        </div>

        {submitted ? (
          <div
            className="flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-medium"
            style={{
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.2)",
              color: "#4ade80",
            }}
          >
            <span className="text-lg">&#10003;</span>
            {successMessage}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-md"
          >
            <input
              type="email"
              required
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--foreground)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)" }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" }}
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold cursor-pointer transition-opacity hover:opacity-85 shrink-0"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {btnText}
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {disclaimer}
        </p>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────
function Footer({ content }: { content?: any }) {
  // Map dynamic configs with fallbacks
  const brandShort = content?.['navbar.brand_short'] || "AK"
  const brandFull = content?.['navbar.brand_full'] || "AK 0121"
  const footerDesc = content?.['footer.desc'] || "The Done-For-You tech partner for founders who want to scale without the headaches."
  const socialUrls = content?.['footer.social_urls'] || defaultSocials
  const copyright = content?.['footer.copyright'] || "© 2026 AK 0121 Agency. All rights reserved."
  const statsSummary = content?.['footer.stats_summary'] || "Trackshift Winner · 20+ Projects Shipped · 6+ Industries"
  const links = content?.['navbar.links'] || defaultLinks

  return (
    <footer
      className="px-6 py-10 border-t"
      style={{ borderColor: "var(--border)", background: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <a href="#" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {brandShort}
            </div>
            <span className="font-mono font-bold text-sm" style={{ color: "var(--foreground)" }}>
              {brandFull.split(' ')[0]} <span style={{ color: "var(--primary)" }}>{brandFull.split(' ').slice(1).join(' ')}</span>
            </span>
          </a>
          <p
            className="text-xs max-w-[220px] text-center md:text-left leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            {footerDesc}
          </p>
        </div>

        {/* Nav */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2">
          {links.map((link: any) => (
            <button
              key={link.href}
              onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" })}
              className="text-xs transition-colors duration-200 cursor-pointer"
              style={{ color: "var(--muted-foreground)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--foreground)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted-foreground)" }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Social */}
        <div className="flex items-center gap-3">
          {socialUrls.map(({ label, href, icon }: any) => {
            const Icon = iconMap[icon || "Mail"] || Mail
            return (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.05)", color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,107,43,0.12)"
                  e.currentTarget.style.color = "var(--primary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                  e.currentTarget.style.color = "var(--muted-foreground)"
                }}
              >
                <Icon size={14} />
              </a>
            )
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {copyright}
        </p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {statsSummary}
        </p>
      </div>
    </footer>
  )
}

// ── Main export ────────────────────────────────────────────────────
export function ContactFooter({ content }: { content?: any }) {
  return (
    <>
      <ContactSection content={content} />
      <Footer content={content} />
    </>
  )
}
