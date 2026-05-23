import { Check, X, Minus } from "lucide-react"

type CellValue = true | false | null | string

interface Row {
  feature: string
  calpro: CellValue
  calendlyFree: CellValue
  calendlyPro: CellValue
}

const rows: Row[] = [
  { feature: "Paiements intégrés",     calpro: true,    calendlyFree: false, calendlyPro: true  },
  { feature: "Formulaires custom",     calpro: true,    calendlyFree: false, calendlyPro: true  },
  { feature: "Membres d'équipe",       calpro: true,    calendlyFree: false, calendlyPro: true  },
  { feature: "Rappels SMS",            calpro: true,    calendlyFree: false, calendlyPro: false },
  { feature: "API & Webhooks",         calpro: true,    calendlyFree: false, calendlyPro: true  },
  { feature: "Analytics avancées",     calpro: true,    calendlyFree: false, calendlyPro: true  },
  { feature: "Support en français",    calpro: true,    calendlyFree: false, calendlyPro: false },
  { feature: "Prix mensuel",           calpro: "Gratuit", calendlyFree: "Gratuit", calendlyPro: "16€/mois" },
]

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (value === true)
    return <Check className={`w-5 h-5 mx-auto ${highlight ? "text-red-600" : "text-green-500"}`} />
  if (value === false)
    return <X className="w-5 h-5 mx-auto text-gray-300" />
  if (value === null)
    return <Minus className="w-5 h-5 mx-auto text-gray-300" />
  return (
    <span className={`text-sm font-semibold ${highlight ? "text-red-600" : "text-gray-700"}`}>
      {value}
    </span>
  )
}

export default function ComparisonTable() {
  return (
    <section className="px-4 py-20 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          Pourquoi Cal.pro ?
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Plus de fonctionnalités, moins cher. Sans compromis.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-4 border-b border-gray-100">
            <div className="px-6 py-4" />
            <div className="px-4 py-4 text-center border-l border-gray-100 bg-red-600 rounded-tl-none">
              <p className="text-sm font-bold text-white">Cal.pro</p>
              <p className="text-xs text-red-200 mt-0.5">Recommandé</p>
            </div>
            <div className="px-4 py-4 text-center border-l border-gray-100">
              <p className="text-sm font-semibold text-gray-600">Calendly Free</p>
            </div>
            <div className="px-4 py-4 text-center border-l border-gray-100">
              <p className="text-sm font-semibold text-gray-600">Calendly Pro</p>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4 border-b border-gray-100 last:border-0 ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <div className="px-6 py-3.5 flex items-center">
                <span className="text-sm text-gray-700 font-medium">{row.feature}</span>
              </div>
              <div className="px-4 py-3.5 flex items-center justify-center border-l border-gray-100 bg-red-50/60">
                <Cell value={row.calpro} highlight />
              </div>
              <div className="px-4 py-3.5 flex items-center justify-center border-l border-gray-100">
                <Cell value={row.calendlyFree} />
              </div>
              <div className="px-4 py-3.5 flex items-center justify-center border-l border-gray-100">
                <Cell value={row.calendlyPro} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
