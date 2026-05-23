import { CreditCard, Bell, ClipboardList, Calendar, Users, BarChart2 } from "lucide-react"

const features = [
  { icon: CreditCard, label: "Paiements Stripe", sub: "Encaisse avant le RDV" },
  { icon: Bell, label: "Rappels SMS + Email", sub: "−40% de no-shows" },
  { icon: ClipboardList, label: "Formulaires custom", sub: "Qualifie tes prospects" },
  { icon: Calendar, label: "Sync Google Calendar", sub: "Disponibilités en temps réel" },
  { icon: Users, label: "Equipe collaborative", sub: "Gratuit jusqu'à 5 membres" },
  { icon: BarChart2, label: "Analytics complet", sub: "Conversions · Revenue · No-shows" },
]

export default function SocialProof() {
  return (
    <section className="px-4 py-8 md:py-10 bg-white border-y border-gray-100">
      <p className="text-center text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6 md:mb-8">
        Tout inclus dès le plan gratuit
      </p>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 lg:gap-12">
        {features.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mb-1">
              <Icon className="w-4 h-4 text-red-600" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-semibold text-gray-700 leading-tight">{label}</span>
            <span className="text-xs text-gray-400 leading-tight">{sub}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
