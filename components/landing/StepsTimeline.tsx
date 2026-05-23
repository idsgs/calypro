"use client"

import { useEffect, useRef, useState } from "react"

const steps = [
  { num: "01", label: "Ton client réserve" },
  { num: "02", label: "Il paie en ligne" },
  { num: "03", label: "Reçoit un rappel" },
  { num: "04", label: "Arrive préparé" },
]

export default function StepsTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="md:hidden px-8 pt-6 pb-8 bg-white border-t border-gray-100">
      <div className="relative max-w-[260px] mx-auto">

        {/* Ligne verticale — toujours visible, animation en bonus */}
        <div
          className="absolute left-5 top-5 w-px bg-gradient-to-b from-red-300 via-red-200 to-transparent"
          style={{
            height: "calc(100% - 20px)",
            opacity: animated ? 1 : 0.3,
            transition: "opacity 0.6s ease-out",
          }}
        />

        <div className="space-y-7">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="flex items-center gap-5 relative"
              style={
                animated
                  ? {
                      opacity: 1,
                      transform: "translateX(0)",
                      transition: `opacity 0.4s ease-out ${i * 0.12}s, transform 0.4s ease-out ${i * 0.12}s`,
                    }
                  : { opacity: 1, transform: "translateX(0)" }
              }
            >
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 shadow-sm shadow-red-200">
                {step.num}
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-snug">{step.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
