import { RefreshCw, Download, Ban, MessageCircle } from "lucide-react"

const guarantees = [
  {
    icon: RefreshCw,
    title: "Résiliable en 1 clic",
    desc: "Pas de période d'engagement, pas de préavis. Tu pars quand tu veux, sans justification.",
  },
  {
    icon: Download,
    title: "Tes données t'appartiennent",
    desc: "Export CSV de toutes tes réservations et contacts à tout moment. On ne retient rien en otage.",
  },
  {
    icon: Ban,
    title: "Zéro commission sur tes paiements",
    desc: "Cal.pro ne prend aucun pourcentage sur tes encaissements. Ce que Stripe te facture, c'est Stripe — pas nous.",
  },
  {
    icon: MessageCircle,
    title: "Support par email, réponse sous 24h",
    desc: "Une vraie personne te répond. Pas un chatbot, pas une FAQ circulaire. Si tu as un problème, on le règle.",
  },
]

export default function Guarantees() {
  return (
    <section className="px-4 py-12 md:py-20 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2 md:mb-3">
          Ce qu'on s'engage à tenir.
        </h2>
        <p className="text-center text-gray-500 text-sm md:text-base mb-10 md:mb-14 max-w-xl mx-auto">
          Pas de témoignages fabriqués. Pas de chiffres inventés. Juste ce qu'on garantit concrètement.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {guarantees.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-4 p-5 md:p-6 bg-white border border-gray-100 rounded-2xl hover:border-red-100 hover:shadow-sm transition-all"
            >
              <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
