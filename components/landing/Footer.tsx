import Link from "next/link"
import { Calendar } from "lucide-react"

const columns = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "/#fonctionnalites" },
      { label: "Tarifs", href: "/#tarifs" },
      { label: "Garanties", href: "/#temoignages" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Presse", href: "#" },
      { label: "Carrières", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Centre d'aide", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Statut du service", href: "#" },
      { label: "Signaler un bug", href: "#" },
      { label: "Communauté", href: "#" },
    ],
  },
  {
    title: "Réseaux",
    links: [
      { label: "Twitter / X", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "YouTube", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Newsletter", href: "#" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 px-4 pt-14 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-red-600" />
              <span className="font-bold text-lg text-gray-900">Cal.pro</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              L'alternative française à Calendly. Réservation, paiements et rappels en un seul outil.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Cal.pro. Tous droits réservés. Fait en France.
          </p>
          <div className="flex gap-5">
            {["Politique de confidentialité", "CGU", "Cookies"].map((label) => (
              <Link key={label} href="#" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
