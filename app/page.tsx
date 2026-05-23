"use client"

import Link from "next/link"
import { CreditCard, ClipboardList, Bell, Users, BarChart2, Plug, Check } from "lucide-react"
import { smoothScrollTo } from "@/lib/smoothScroll"
import SocialProof from "@/components/landing/SocialProof"
import StepsTimeline from "@/components/landing/StepsTimeline"
import Guarantees from "@/components/landing/Guarantees"
import FAQ from "@/components/landing/FAQ"
import FinalCTA from "@/components/landing/FinalCTA"
import Footer from "@/components/landing/Footer"

const features = [
  {
    icon: CreditCard,
    title: "Paiements intégrés",
    metric: "0% de commission Cal.pro",
    desc: "Stripe natif. Tes clients paient en réservant.",
  },
  {
    icon: ClipboardList,
    title: "Formulaires custom",
    metric: "Qualification avant le RDV",
    desc: "Qualifie tes prospects avant de leur consacrer 1h.",
  },
  {
    icon: Bell,
    title: "Rappels automatiques",
    metric: "−40% de no-shows",
    desc: "SMS + Email 24h avant et 1h avant. Sans rien faire.",
  },
  {
    icon: Users,
    title: "Equipe collaborative",
    metric: "Gratuit jusqu'à 5 membres",
    desc: "Chacun son lien, toi tu vois tout.",
  },
  {
    icon: BarChart2,
    title: "Analytics complet",
    metric: "Conversions · Revenue · No-shows",
    desc: "Les chiffres pour décider quoi optimiser.",
  },
  {
    icon: Plug,
    title: "API & Webhooks",
    metric: "Gratuit sur plan Equipe",
    desc: "Connecte Notion, Slack, ton CRM. Sans Zapier.",
  },
]

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    badge: "Pour tester sans risque",
    pitch: "Lance ton premier lien de réservation aujourd'hui. Paiements inclus. Pas de carte bancaire.",
    features: [
      "1 type de RDV",
      "10 réservations/mois",
      "Paiements Stripe intégrés",
      "Formulaires custom",
      "Lien public partageable",
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "9€",
    badge: "Le choix des indépendants",
    pitch: "Tout ce qu'il te faut pour professionnaliser ton activité. RDV illimités, rappels SMS, analytics.",
    features: [
      "RDV illimités",
      "Paiements Stripe intégrés",
      "Formulaires custom illimités",
      "SMS + Email rappels auto",
      "Sync Google Calendar",
      "Analytics complet",
    ],
    cta: "Démarrer en Pro",
    highlighted: true,
  },
  {
    name: "Equipe",
    price: "29€",
    badge: "Pour toi + tes collaborateurs",
    pitch: "Tous les membres dans le même outil. API gratuite. Branding à ton image.",
    features: [
      "Tout inclus dans Pro",
      "Membres illimités",
      "Calendriers d'équipe",
      "API + Webhooks gratuits",
      "Branding personnalisé",
      "Support prioritaire",
    ],
    cta: "Démarrer en Equipe",
    highlighted: false,
  },
]

export default function Home() {
  return (
    <main className="bg-white">

      {/* ── Hero — plein écran ── */}
      <section className="min-h-[calc(100dvh-56px)] flex flex-col md:justify-center px-4 md:py-12 text-center bg-white">
        {/* Mobile : flex-1 sépare contenu (haut) et CTAs (bas) */}
        <div className="flex-1 md:flex-none flex flex-col md:block max-w-3xl mx-auto w-full">

          {/* Badge + titre + sous-titre — haut sur mobile */}
          <div className="pt-12 md:pt-0">
            <div className="inline-block bg-red-50 text-red-600 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 rounded-full mb-5 border border-red-100 tracking-wide">
              Pour freelancers, coaches et consultants
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-5 leading-tight">
              Stop aux no-shows.{" "}
              <span className="text-red-600">Fais payer avant le RDV.</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 mb-0 md:mb-10 max-w-sm mx-auto">
              Réservation, paiement Stripe et rappels SMS — dans un seul lien.
            </p>
          </div>

          {/* Flow 4 étapes — Desktop uniquement */}
          <div className="hidden md:block mb-10">
            <div className="flex items-center justify-center gap-3">
              {[
                { step: "1", label: "Réserve" },
                { step: "2", label: "Paie" },
                { step: "3", label: "Reçoit un rappel" },
                { step: "4", label: "Arrive préparé" },
              ].map((item, i, arr) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                    <span className="text-xs text-gray-500 mt-1.5 font-medium">{item.label}</span>
                  </div>
                  {i < arr.length - 1 && <div className="w-12 h-px bg-gray-200 mb-4" />}
                </div>
              ))}
            </div>
          </div>

          {/* CTAs — bas sur mobile, centré sur desktop */}
          <div className="mt-6 md:mt-0 md:pb-0">
            <div className="flex flex-col gap-3 mx-auto max-w-[300px] md:max-w-none md:flex-row md:justify-center">
              <Link
                href="/auth/signin"
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-sm md:text-base px-8 py-3.5 rounded-full transition-colors"
              >
                Encaisser mon premier paiement
              </Link>
              <button
                onClick={() => smoothScrollTo("fonctionnalites")}
                className="w-full md:w-auto bg-white border border-gray-200 text-gray-700 font-semibold text-sm md:text-base px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                Voir comment ça marche
              </button>
            </div>
          </div>

        </div>
      </section>

      <StepsTimeline />

      <SocialProof />

      {/* ── Features — icônes + métriques, peu de texte ── */}
      <section id="fonctionnalites" className="px-4 py-12 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2 md:mb-3">
            Pas pour les grandes boîtes. Pour toi.
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10 md:mb-14">
            Tout ce qu'il te faut, dès le plan gratuit.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {features.map(({ icon: Icon, title, metric, desc }) => (
              <div
                key={title}
                className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:border-red-100 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-xs font-bold text-red-500 mb-1">{metric}</p>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-xs text-gray-400 leading-snug hidden md:block">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="tarifs" className="px-4 py-12 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2 md:mb-3">
            Transparent. Sans piège. Sans engagement.
          </h2>
          <p className="text-center text-gray-500 text-sm md:text-base mb-10 md:mb-12">
            Tu commences gratuitement, tu passes au plan supérieur quand tu es prêt. Résiliable en 1 clic.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:items-center">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 md:p-7 border flex flex-col ${
                  plan.highlighted
                    ? "bg-red-600 text-white border-red-600 shadow-xl md:scale-105"
                    : "bg-white text-gray-900 border-gray-200"
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${plan.highlighted ? "text-red-200" : "text-red-500"}`}>
                  {plan.badge}
                </p>
                <h3 className="text-lg md:text-xl font-bold mb-1">{plan.name}</h3>
                <p className={`text-3xl md:text-4xl font-bold mt-1 mb-3 ${plan.highlighted ? "" : "text-red-600"}`}>
                  {plan.price}
                  <span className={`text-sm font-normal ${plan.highlighted ? "text-red-200" : "text-gray-400"}`}>/mois</span>
                </p>
                <p className={`text-xs mb-5 leading-relaxed ${plan.highlighted ? "text-red-100" : "text-gray-500"}`}>
                  {plan.pitch}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs md:text-sm">
                      <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-red-200" : "text-red-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signin"
                  className={`block w-full text-center py-3.5 rounded-full text-sm font-bold transition-colors ${
                    plan.highlighted
                      ? "bg-white text-red-600 hover:bg-red-50"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="temoignages">
        <Guarantees />
      </div>

      <div id="faq">
        <FAQ />
      </div>

      <FinalCTA />
      <Footer />
    </main>
  )
}
