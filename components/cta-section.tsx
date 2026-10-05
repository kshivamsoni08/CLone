"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useActionModal } from "@/components/action-modal"

function AsciiTetrahedron() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const chars = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯"
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

    const vertices = [
      { x: 0, y: 1, z: 0 },
      { x: -0.943, y: -0.333, z: -0.5 },
      { x: 0.943, y: -0.333, z: -0.5 },
      { x: 0, y: -0.333, z: 1 },
    ]

    const edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [2, 3],
      [3, 1],
    ]

    const faces = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 1],
      [1, 3, 2],
    ]

    const rotateY = (
      p: { x: number; y: number; z: number },
      angle: number
    ) => ({
      x: p.x * Math.cos(angle) - p.z * Math.sin(angle),
      y: p.y,
      z: p.x * Math.sin(angle) + p.z * Math.cos(angle),
    })

    const rotateX = (
      p: { x: number; y: number; z: number },
      angle: number
    ) => ({
      x: p.x,
      y: p.y * Math.cos(angle) - p.z * Math.sin(angle),
      z: p.y * Math.sin(angle) + p.z * Math.cos(angle),
    })

    const rotateZ = (
      p: { x: number; y: number; z: number },
      angle: number
    ) => ({
      x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
      y: p.x * Math.sin(angle) + p.y * Math.cos(angle),
      z: p.z,
    })

    const render = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const scale = Math.min(rect.width, rect.height) * 0.7

      ctx.font = "18px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const points: { x: number; y: number; z: number; char: string }[] = []

      edges.forEach(([i, j]) => {
        const v1 = vertices[i]
        const v2 = vertices[j]
        for (let t = 0; t <= 1; t += 0.05) {
          let p = {
            x: v1.x + (v2.x - v1.x) * t,
            y: v1.y + (v2.y - v1.y) * t,
            z: v1.z + (v2.z - v1.z) * t,
          }
          p = rotateY(p, time * 0.4)
          p = rotateX(p, time * 0.3)
          p = rotateZ(p, time * 0.2)
          const charIndex = Math.floor(((p.z + 1.5) / 3) * (chars.length - 1))
          points.push({
            x: centerX + p.x * scale,
            y: centerY - p.y * scale,
            z: p.z,
            char: chars[Math.min(charIndex, chars.length - 1)],
          })
        }
      })

      faces.forEach(([i, j, k]) => {
        const v1 = vertices[i]
        const v2 = vertices[j]
        const v3 = vertices[k]
        for (let u = 0; u <= 1; u += 0.12) {
          for (let v = 0; v <= 1 - u; v += 0.12) {
            const w = 1 - u - v
            let p = {
              x: v1.x * u + v2.x * v + v3.x * w,
              y: v1.y * u + v2.y * v + v3.y * w,
              z: v1.z * u + v2.z * v + v3.z * w,
            }
            p = rotateY(p, time * 0.4)
            p = rotateX(p, time * 0.3)
            p = rotateZ(p, time * 0.2)
            const charIndex = Math.floor(((p.z + 1.5) / 3) * (chars.length - 1))
            points.push({
              x: centerX + p.x * scale,
              y: centerY - p.y * scale,
              z: p.z,
              char: chars[Math.min(charIndex, chars.length - 1)],
            })
          }
        }
      })

      points.sort((a, b) => a.z - b.z)

      points.forEach((point) => {
        const alpha = 0.15 + (point.z + 1.5) * 0.25
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(alpha, 0.9)})`
        ctx.fillText(point.char, point.x, point.y)
      })

      time += 0.015
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

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { openModal } = useActionModal()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setMousePosition({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            })
          }}
        >
          {/* Mouse follow spotlight */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.15), transparent 40%)`,
            }}
          />

          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]">
                  Ready to build
                  <br />
                  something great?
                </h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  Join thousands of teams shipping faster with Optimus. Start
                  free, scale infinitely.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button
                    size="lg"
                    onClick={() => openModal({ type: "signup" })}
                    className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group"
                  >
                    Start building free
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => openModal({ type: "sales" })}
                    className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5"
                  >
                    Talk to sales
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-8 font-mono">
                  No credit card required
                </p>
              </div>

              <div className="hidden lg:flex items-center justify-center w-[500px] h-[500px] -mr-16">
                <AsciiTetrahedron />
              </div>
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  )
}
