"use client"

import { useEffect, useState } from "react"
import { Calendar, TrendingUp, Clock, DollarSign } from "lucide-react"

interface Stats {
  total: number
  upcoming: number
  thisMonth: number
  revenue: number
}

export default function StatsBar() {
  const [stats, setStats] = useState<Stats>({ total: 0, upcoming: 0, thisMonth: 0, revenue: 0 })

  useEffect(() => {
    async function load() {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const [all, upcoming, monthly] = await Promise.all([
        fetch("/api/bookings").then((r) => r.json()),
        fetch(`/api/bookings?from=${now.toISOString()}`).then((r) => r.json()),
        fetch(`/api/bookings?from=${monthStart}`).then((r) => r.json()),
      ])

      const revenue = (monthly as { payment?: { amount: number } }[])
        .filter((b) => b.payment)
        .reduce((sum, b) => sum + (b.payment?.amount ?? 0), 0)

      setStats({
        total: Array.isArray(all) ? all.length : 0,
        upcoming: Array.isArray(upcoming) ? upcoming.length : 0,
        thisMonth: Array.isArray(monthly) ? monthly.length : 0,
        revenue,
      })
    }
    load()
  }, [])

  const cards = [
    { icon: Calendar, label: "Total réservations", value: stats.total, color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Clock, label: "À venir", value: stats.upcoming, color: "text-purple-600", bg: "bg-purple-50" },
    { icon: TrendingUp, label: "Ce mois", value: stats.thisMonth, color: "text-green-600", bg: "bg-green-50" },
    {
      icon: DollarSign,
      label: "Revenus (mois)",
      value: `${(stats.revenue / 100).toFixed(0)}€`,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(({ icon: Icon, label, value, color, bg }) => (
        <div key={label} className="bg-white border border-gray-100 rounded-xl p-4">
          <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}
