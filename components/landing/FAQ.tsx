"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Pourquoi choisir Cal.pro plutôt qu'un autre outil ?",
    a: "La plupart des outils de réservation te font payer séparément pour les paiements, les rappels SMS, et les formulaires. Cal.pro intègre tout nativement — Stripe, SMS/Email rappels, formulaires custom, API — dès le plan gratuit pour les essentiels. Tu ne paies pas 3 abonnements pour faire le travail d'un seul.",
  },
  {
    q: "Comment les paiements fonctionnent concrètement ?",
    a: "Tu connectes ton compte Stripe (gratuit, 10 minutes). Tu définis un prix sur ton type de RDV. Ton client paie au moment de réserver — carte bancaire, virement SEPA. L'argent arrive directement sur ton compte Stripe, sans intermédiaire. Cal.pro ne prend aucune commission sur tes paiements.",
  },
  {
    q: "Les rappels SMS marchent vraiment à −40% de no-shows ?",
    a: "C'est la moyenne observée sur nos utilisateurs actifs après 30 jours. Tes clients reçoivent un email 24h avant, puis un SMS 1h avant (plan Pro). La majorité des no-shows viennent d'un simple oubli — pas d'un désintérêt. Un rappel règle ça.",
  },
  {
    q: "Est-ce que je peux ajouter mon équipe ?",
    a: "Oui. Sur le plan Équipe (29€/mois), chaque membre a son propre lien de réservation et son calendrier. Toi tu gardes la vue globale. Aucun coût supplémentaire par membre ajouté — pendant que d'autres outils facturent 12 à 25€/utilisateur/mois.",
  },
  {
    q: "C'est vraiment gratuit pour commencer ?",
    a: "Oui, sans piège. Le plan gratuit inclut 1 type de RDV, 10 réservations/mois, les paiements Stripe et les formulaires custom. Pas de carte bancaire requise à l'inscription. Tu passes au plan Pro si tu as besoin de plus — quand tu es prêt.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "Toutes les données sont hébergées en Europe (UE), chiffrées en transit (TLS 1.3) et au repos (AES-256). Cal.pro est conforme RGPD. Support et équipe basés en France. Tu peux exporter ou supprimer tes données à tout moment.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="px-4 py-12 md:py-20 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2 md:mb-3">
          Les vraies questions.{" "}
          <span className="text-red-600">Les réponses directes.</span>
        </h2>
        <p className="text-center text-gray-500 text-sm md:text-base mb-10 md:mb-12">
          Pas de bullshit marketing. Juste ce que tu dois savoir avant de te lancer.
        </p>

        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 md:px-6 py-4 md:py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 md:px-6 pb-4 md:pb-5">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
