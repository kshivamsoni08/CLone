"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { X, ArrowRight, Check, Play, Terminal, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ModalType =
  | { type: "signin" }
  | { type: "signup"; plan?: string }
  | { type: "demo" }
  | { type: "sales" }
  | { type: "compare" }
  | { type: "info"; title: string; subtitle: string; badge: string; content: string[] }
  | null

interface ActionModalContextType {
  openModal: (modal: ModalType) => void
  closeModal: () => void
}

const ActionModalContext = createContext<ActionModalContextType>({
  openModal: () => {},
  closeModal: () => {},
})

export function useActionModal() {
  return useContext(ActionModalContext)
}

const COMPARISON_ROWS = [
  { feature: "Projects", starter: "Up to 3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Storage", starter: "1GB", pro: "100GB", enterprise: "Unlimited" },
  { feature: "Edge Locations", starter: "3 regions", pro: "All 17 regions", enterprise: "All 17 + Custom" },
  { feature: "Analytics", starter: "Basic", pro: "Advanced real-time", enterprise: "Custom BI export" },
  { feature: "Custom Domains", starter: "—", pro: "Unlimited", enterprise: "Unlimited + Wildcard" },
  { feature: "Team Collaboration", starter: "Solo", pro: "Up to 25 seats", enterprise: "Unlimited seats" },
  { feature: "Support", starter: "Community", pro: "24/5 Priority", enterprise: "24/7 Dedicated SLA" },
  { feature: "Compliance & Security", starter: "HTTPS + DDoS", pro: "SOC 2 Type II", enterprise: "HIPAA, GDPR, Custom Audit" },
]

export function ActionModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalType>(null)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [demoStep, setDemoStep] = useState(0)

  useEffect(() => {
    setSubmitted(false)
    setEmail("")
    setName("")
    setCompany("")
    setDemoStep(0)
  }, [modal])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null)
    }
    if (modal) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [modal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <ActionModalContext.Provider value={{ openModal: setModal, closeModal: () => setModal(null) }}>
      {children}
      {modal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200"
          onClick={() => setModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-lg bg-background border border-foreground text-foreground p-8 lg:p-10 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModal(null)}
              className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {(modal.type === "signin" || modal.type === "signup") && (
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                  <span className="w-6 h-px bg-foreground/30" />
                  {modal.type === "signin" ? "Authentication" : modal.plan ? `${modal.plan} Plan` : "Get Started"}
                </span>
                <h3 className="text-3xl lg:text-4xl font-display tracking-tight mb-2">
                  {modal.type === "signin" ? "Welcome back." : "Start creating with Optimus."}
                </h3>
                <p className="text-sm text-muted-foreground mb-8">
                  {modal.type === "signin"
                    ? "Sign in to your Optimus workspace to manage deployments and workflows."
                    : "Deploy your first edge application in under 30 seconds. No credit card required."}
                </p>

                {submitted ? (
                  <div className="p-6 border border-foreground/15 bg-foreground/[0.02]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="font-medium">
                        {modal.type === "signin" ? "Magic link sent!" : "Workspace initialized!"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      We&apos;ve sent a verification link to <span className="font-mono text-foreground">{email || "your email"}</span>.
                    </p>
                    <Button
                      onClick={() => setModal(null)}
                      className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-11"
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {modal.type === "signup" && (
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ada Lovelace"
                          className="w-full px-4 py-3 border border-foreground/20 bg-background text-sm focus:border-foreground outline-none transition-colors"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 border border-foreground/20 bg-background text-sm focus:border-foreground outline-none transition-colors"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-12 text-sm font-medium mt-2 group"
                    >
                      {modal.type === "signin" ? "Continue with Email" : "Create free account"}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <div className="pt-4 border-t border-foreground/10 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {modal.type === "signin" ? "Don't have an account?" : "Already have an account?"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setModal({ type: modal.type === "signin" ? "signup" : "signin" })}
                        className="text-foreground underline underline-offset-4 font-medium"
                      >
                        {modal.type === "signin" ? "Start free trial" : "Sign in"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {modal.type === "sales" && (
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                  <span className="w-6 h-px bg-foreground/30" />
                  Enterprise Sales
                </span>
                <h3 className="text-3xl lg:text-4xl font-display tracking-tight mb-2">
                  Talk to our architecture team.
                </h3>
                <p className="text-sm text-muted-foreground mb-8">
                  Get custom volume pricing, dedicated SLA guarantees, and on-premise deployment support.
                </p>

                {submitted ? (
                  <div className="p-6 border border-foreground/15 bg-foreground/[0.02]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Request received</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      An Optimus solutions architect will reach out to <span className="font-mono text-foreground">{email}</span> within 2 hours.
                    </p>
                    <Button
                      onClick={() => setModal(null)}
                      className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-11"
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sarah Chen"
                        className="w-full px-4 py-3 border border-foreground/20 bg-background text-sm focus:border-foreground outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@meridianlabs.io"
                        className="w-full px-4 py-3 border border-foreground/20 bg-background text-sm focus:border-foreground outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                        Company & Team Size
                      </label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Meridian Labs (100+ engineers)"
                        className="w-full px-4 py-3 border border-foreground/20 bg-background text-sm focus:border-foreground outline-none transition-colors"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-12 text-sm font-medium mt-2 group"
                    >
                      Request Enterprise Demo
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </form>
                )}
              </div>
            )}

            {modal.type === "demo" && (
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                  <span className="w-6 h-px bg-foreground/30" />
                  Interactive Tour
                </span>
                <h3 className="text-3xl font-display tracking-tight mb-2">
                  Optimus Platform Walkthrough
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  See how teams go from repository push to global 17-region edge deployment in 2.4 seconds.
                </p>

                <div className="border border-foreground bg-foreground text-background p-6 font-mono text-xs mb-6">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-background/15">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-background/60" />
                      <span>optimus-cli — deploy --prod</span>
                    </div>
                    <span className="text-green-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <div className="space-y-2 leading-relaxed">
                    <div className="text-background/60">$ optimus deploy --regions=auto</div>
                    <div>✓ Connected to 4 data sources (PostgreSQL, Redis, Stripe, OpenAI)</div>
                    <div>✓ Built TypeScript edge bundle (11.8 KB gzipped) in 420ms</div>
                    {demoStep >= 1 && (
                      <div className="text-green-400">
                        ✓ Propagated to 17 global edge nodes (avg latency: 18ms)
                      </div>
                    )}
                    {demoStep >= 2 && (
                      <div className="pt-2 text-background font-semibold">
                        → Production live at https://app.optimus.dev
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    onClick={() => setDemoStep((s) => (s < 2 ? s + 1 : 0))}
                    variant="outline"
                    className="flex-1 rounded-full h-11 border-foreground/20"
                  >
                    <Play className="w-3.5 h-3.5 mr-2" />
                    {demoStep < 2 ? "Simulate Next Step" : "Replay Simulation"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setModal({ type: "signup" })}
                    className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-full h-11"
                  >
                    Try it yourself
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {modal.type === "compare" && (
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                  <span className="w-6 h-px bg-foreground/30" />
                  Plan Specifications
                </span>
                <h3 className="text-3xl font-display tracking-tight mb-6">
                  Compare all features
                </h3>
                <div className="border border-foreground/10 divide-y divide-foreground/10 text-sm mb-6">
                  <div className="grid grid-cols-4 gap-2 p-3 font-mono text-xs text-muted-foreground bg-foreground/[0.02]">
                    <span>Feature</span>
                    <span>Starter</span>
                    <span className="text-foreground font-semibold">Pro</span>
                    <span>Enterprise</span>
                  </div>
                  {COMPARISON_ROWS.map((row) => (
                    <div key={row.feature} className="grid grid-cols-4 gap-2 p-3 items-center">
                      <span className="font-medium text-xs">{row.feature}</span>
                      <span className="text-xs text-muted-foreground">{row.starter}</span>
                      <span className="text-xs font-medium">{row.pro}</span>
                      <span className="text-xs text-muted-foreground">{row.enterprise}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setModal({ type: "signup", plan: "Pro" })}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-11"
                >
                  Start 14-day Pro Trial
                </Button>
              </div>
            )}

            {modal.type === "info" && (
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                  <span className="w-6 h-px bg-foreground/30" />
                  {modal.badge}
                </span>
                <h3 className="text-3xl font-display tracking-tight mb-2">{modal.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{modal.subtitle}</p>
                <div className="space-y-3 border-t border-foreground/10 pt-6 mb-8">
                  {modal.content.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Sparkles className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setModal(null)}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-11"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </ActionModalContext.Provider>
  )
}
