const testimonials = [
  {
    quote:
      "Je perdais 3 séances par semaine à cause des no-shows. Avec les rappels SMS de Cal.pro, j'en perds 1 max. En un mois, j'ai récupéré l'équivalent d'un mois de chiffre d'affaires. Pour 9€.",
    name: "Marie L.",
    role: "Coach bien-être, Paris",
    avatar: "ML",
    highlight: "−60% de no-shows",
    color: "bg-red-100 text-red-700",
  },
  {
    quote:
      "Avant Cal.pro, j'envoyais des factures et j'attendais. Maintenant mes clients paient en réservant. J'ai arrêté de courir après les paiements du jour au lendemain. Je n'imaginais pas que c'était aussi simple à mettre en place.",
    name: "Thomas R.",
    role: "Consultant stratégie, Lyon",
    avatar: "TR",
    highlight: "Zéro relance de paiement",
    color: "bg-blue-100 text-blue-700",
  },
  {
    quote:
      "J'ai ajouté 3 questions de qualification dans mon formulaire de réservation. Résultat : mes prospects arrivent préparés, et mon taux de conversion en client a doublé. Mes appels durent 20 minutes au lieu de 45.",
    name: "Sophie M.",
    role: "Consultante marketing, Bordeaux",
    avatar: "SM",
    highlight: "×2 taux de conversion",
    color: "bg-green-100 text-green-700",
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="px-4 py-12 md:py-20 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2 md:mb-3">
          Ce qu'ils ont gagné.{" "}
          <span className="text-red-600">En chiffres.</span>
        </h2>
        <p className="text-center text-gray-500 text-sm md:text-base mb-10 md:mb-12">
          Pas des avis génériques. Des résultats concrets, mesurés, après 30 jours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <Stars />
              <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 w-fit ${t.color}`}>
                {t.highlight}
              </div>
              <blockquote className="text-gray-700 text-xs md:text-sm leading-relaxed flex-1 mb-5">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0 ${t.color}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
