"use client"

const items = [
  "Custom Web Apps",
  "AI Automation",
  "Voice Agents",
  "Data Pipelines",
  "CRM Systems",
  "Emergency Tech",
  "Secure Protocols",
  "Trackshift Winner",
  "Done-For-You",
  "No Monthly Rent",
]

export function Ticker() {
  const doubled = [...items, ...items]

  return (
    <div
      className="w-full overflow-hidden py-4 border-y"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="marquee-track flex gap-12 w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-sm font-medium whitespace-nowrap select-none"
            style={{ color: "var(--muted-foreground)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "var(--primary)" }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
