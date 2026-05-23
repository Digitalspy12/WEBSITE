"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const defaultLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Journey", href: "#journey" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
]

export function Navbar({ content }: { content?: any }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Hydrate configurations with DB values, falling back to static code defaults
  const links = content?.['navbar.links'] || defaultLinks
  const brandShort = content?.['navbar.brand_short'] || "AK"
  const brandFull = content?.['navbar.brand_full'] || "AK 0121"
  const ctaText = content?.['navbar.cta'] || "Start Project"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleNav = (href: string) => {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(10,10,10,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black tracking-tighter"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {brandShort}
            </div>
            <span
              className="font-mono font-bold text-sm tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              {brandFull.split(' ')[0]} <span style={{ color: "var(--primary)" }}>{brandFull.split(' ').slice(1).join(' ')}</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {links.map((link: any) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="text-sm transition-colors duration-200 cursor-pointer"
                  style={{ color: "var(--muted-foreground)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNav("#contact")}
              className="text-sm px-5 py-2 rounded-full font-semibold transition-all duration-200 cursor-pointer"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85" }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
            >
              {ctaText}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            style={{ color: "var(--foreground)" }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-20 px-6 pb-10 gap-5 md:hidden"
          style={{ background: "var(--background)" }}
        >
          {links.map((link: any) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-2xl font-semibold text-left w-full py-3 border-b cursor-pointer"
              style={{ color: "var(--foreground)", borderColor: "var(--border)" }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("#contact")}
            className="mt-4 px-6 py-3 rounded-full font-semibold text-base"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {ctaText}
          </button>
        </div>
      )}
    </>
  )
}
