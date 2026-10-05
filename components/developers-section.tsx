"use client"

import { useEffect, useRef, useState } from "react"
import { Copy, Check } from "lucide-react"
import { useActionModal } from "@/components/action-modal"

const codeExamples = [
  {
    label: "Install",
    code: `npm install @optimus/sdk

# or
yarn add @optimus/sdk
pnpm add @optimus/sdk`,
  },
  {
    label: "Initialize",
    code: `import { Optimus } from '@optimus/sdk'

const optimus = new Optimus({
  apiKey: process.env.OPTIMUS_KEY
})`,
  },
  {
    label: "Deploy",
    code: `const app = await optimus.deploy({
  name: 'my-app',
  region: 'auto',
  scaling: {
    min: 1,
    max: 100
  }
})

console.log('Live at:', app.url)`,
  },
]

const features = [
  {
    title: "TypeScript native",
    description: "Full type safety with auto-generated types.",
  },
  {
    title: "Zero config",
    description: "Sensible defaults that just work.",
  },
  {
    title: "Edge-ready",
    description: "Runs anywhere: Node, Deno, Bun, browsers.",
  },
  {
    title: "12KB gzipped",
    description: "Lightweight with zero dependencies.",
  },
]

export function DevelopersSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { openModal } = useActionModal()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="developers"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              For developers
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              Built by devs.
              <br />
              <span className="text-muted-foreground">For devs.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              A thoughtfully designed SDK that gets out of your way. Ship faster
              with intuitive APIs and exceptional documentation.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 50 + 200}ms` }}
                >
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Code Block */}
          <div
            className={`lg:sticky lg:top-32 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10">
              {/* Tabs */}
              <div className="flex items-center border-b border-foreground/10">
                {codeExamples.map((example, idx) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`px-6 py-4 text-sm font-mono transition-colors relative ${
                      activeTab === idx
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {example.label}
                    {activeTab === idx && (
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
                    )}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-4 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Code Content */}
              <div className="p-8 font-mono text-sm bg-foreground/[0.01] min-h-[220px]">
                <pre className="text-foreground/80">
                  {codeExamples[activeTab].code
                    .split("\n")
                    .map((line, lineIndex) => (
                      <div
                        key={`${activeTab}-${lineIndex}`}
                        className="leading-loose dev-code-line"
                        style={{ animationDelay: `${lineIndex * 80}ms` }}
                      >
                        <span className="inline-flex">
                          {line.split("").map((char, charIndex) => (
                            <span
                              key={`${activeTab}-${lineIndex}-${charIndex}`}
                              className="dev-code-char"
                              style={{
                                animationDelay: `${lineIndex * 80 + charIndex * 15}ms`,
                              }}
                            >
                              {char === " " ? "\u00A0" : char}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                </pre>
              </div>
            </div>

            {/* Links */}
            <div className="mt-6 flex items-center gap-6 text-sm">
              <a
                href="#docs"
                onClick={(e) => {
                  e.preventDefault()
                  openModal({
                    type: "info",
                    badge: "SDK Documentation",
                    title: "@optimus/sdk v2.4",
                    subtitle:
                      "Complete TypeScript reference for edge deployments, workflows, and real-time data streams.",
                    content: [
                      "Zero-config initialization with automatic environment detection (Node, Bun, Deno, Edge).",
                      "Built-in type generation from your connected PostgreSQL, MongoDB, or Redis schemas.",
                      "Sub-50ms global edge routing with automatic failover across 17 data centers.",
                      "Streaming AI inference helpers compatible with OpenAI, Anthropic, and custom models.",
                    ],
                  })
                }}
                className="text-foreground hover:underline underline-offset-4"
              >
                Read the docs
              </a>
              <span className="text-foreground/20">|</span>
              <a
                href="#github"
                onClick={(e) => {
                  e.preventDefault()
                  openModal({
                    type: "info",
                    badge: "Open Source",
                    title: "optimus-labs / optimus-sdk",
                    subtitle:
                      "MIT Licensed • 14.2k Stars • 12KB gzipped with zero external dependencies.",
                    content: [
                      "Full source code, issue tracker, and community RFCs available in our repository.",
                      "Automated CI/CD benchmarks verifying <12KB bundle size on every commit.",
                      "Over 200+ community-contributed connectors and starter templates.",
                    ],
                  })
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
