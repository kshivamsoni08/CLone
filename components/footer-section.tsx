"use client"

import { useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { useActionModal } from "@/components/action-modal"

function AsciiWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const chars = "·∘○◯◌●◉"
    let time = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)

    const render = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      ctx.font = "14px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const cols = Math.floor(rect.width / 20)
      const rows = Math.floor(rect.height / 20)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col + 0.5) * (rect.width / cols)
          const y = (row + 0.5) * (rect.height / rows)

          const wave =
            ((Math.sin(col * 0.2 + time * 2) * Math.cos(row * 0.15 + time) +
              Math.sin((col + row) * 0.1 + time * 1.5) +
              Math.cos(col * 0.1 - row * 0.1 + time * 0.8)) /
              3 +
              1) /
            2

          const charIndex = Math.floor(wave * (chars.length - 1))
          const alpha = 0.15 + wave * 0.5

          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
          ctx.fillText(chars[charIndex], x, y)
        }
      }

      time += 0.03
      frameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  )
}

const footerLinks: Record<
  string,
  { name: string; href: string; badge?: string }[]
> = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Integrations", href: "#integrations" },
  ],
  Developers: [
    { name: "Documentation", href: "#developers" },
    { name: "API Reference", href: "#developers" },
    { name: "SDK", href: "#developers" },
    { name: "Status", href: "#studio" },
  ],
  Company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers", badge: "Hiring" },
    { name: "Contact", href: "#contact" },
  ],
  Legal: [
    { name: "Privacy", href: "#privacy" },
    { name: "Terms", href: "#terms" },
    { name: "Security", href: "#security" },
  ],
}

const socialLinks = [
  { name: "Twitter", href: "#twitter" },
  { name: "GitHub", href: "#github" },
  { name: "LinkedIn", href: "#linkedin" },
]

export function FooterSection() {
  const { openModal } = useActionModal()

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    name: string,
    href: string
  ) => {
    if (
      href.startsWith("#") &&
      ![
        "#features",
        "#how-it-works",
        "#pricing",
        "#integrations",
        "#developers",
        "#studio",
        "#security",
      ].includes(href)
    ) {
      e.preventDefault()
      if (name === "Contact") {
        openModal({ type: "sales" })
        return
      }
      openModal({
        type: "info",
        badge: "Optimus",
        title: name,
        subtitle: `Explore Optimus ${name.toLowerCase()} resources and updates.`,
        content: [
          "Optimus empowers engineering teams globally across 17 edge locations.",
          "99.99% uptime SLA backed by enterprise-grade SOC 2 Type II infrastructure.",
          "Connect with our distributed team in San Francisco, London, and Tokyo.",
        ],
      })
    }
  }

  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated ASCII Wave */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AsciiWave />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display">Optimus</span>
                <span className="text-xs text-muted-foreground font-mono">
                  TM
                </span>
              </a>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                The platform for teams who ship. Build, deploy, and scale with
                unprecedented velocity.
              </p>
              <div className="flex gap-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    onClick={(e) => handleLinkClick(e, social.name, social.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {social.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-sm font-medium mb-6">{category}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.name, link.href)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                        {"badge" in link && link.badge && (
                          <span className="text-xs px-2 py-0.5 bg-foreground text-background rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2025 Optimus. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
