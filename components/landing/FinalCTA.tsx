import Link from "next/link"

export default function FinalCTA() {
  return (
    <section className="px-4 py-12 md:py-20 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
          Pendant que tu lis ça...
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
          Un de tes concurrents vient de perdre un RDV
          <span className="text-red-600"> à cause d'un no-show.</span>
        </h2>
        <p className="text-gray-500 text-sm md:text-base mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed">
          Toi, tu peux t'y mettre maintenant.{" "}
          <span className="font-medium text-gray-700">
            Gratuit. Sans carte bancaire. Sans engagement.
          </span>{" "}
          Ton premier lien de réservation avec paiement intégré, en moins de 5 minutes.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold text-sm md:text-base px-8 md:px-10 py-3 md:py-4 rounded-xl transition-colors w-full sm:w-auto"
        >
          Créer mon compte gratuit
        </Link>
        <p className="text-gray-400 text-xs mt-4">
          Made in France · Support en français · Données hébergées en Europe
        </p>
      </div>
    </section>
  )
}
