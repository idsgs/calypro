"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, CreditCard, User, ArrowRight } from "lucide-react"

interface EventType {
  id: string
  name: string
  slug: string
  description: string | null
  duration: number
  price: number | null
  color: string
}

interface Profile {
  name: string | null
  image: string | null
  timezone: string
  username: string
  eventTypes: EventType[]
}

const COLOR_BG: Record<string, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
}

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/public/${username}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setProfile)
      .finally(() => setLoading(false))
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
          <p className="text-gray-500 text-sm">Ce profil n'existe pas ou a été désactivé.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-red-600 hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header profil */}
        <div className="text-center mb-8">
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.name || ""}
              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-red-600" />
            </div>
          )}
          <h1 className="text-xl font-bold text-gray-900">{profile.name || username}</h1>
          <p className="text-sm text-gray-400 mt-1">Choisissez un type de rendez-vous</p>
        </div>

        {/* Liste des événements */}
        {profile.eventTypes.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-gray-400 text-sm">Aucun événement disponible pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.eventTypes.map((et) => (
              <Link
                key={et.id}
                href={`/${username}/${et.slug}`}
                className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-red-100 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${COLOR_BG[et.color] || "bg-gray-400"}`} />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-gray-900 mb-1">{et.name}</h2>
                    {et.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{et.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {et.duration} min
                      </span>
                      {et.price && et.price > 0 ? (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <CreditCard className="w-3 h-3" />
                          {(et.price / 100).toFixed(0)}€
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">Gratuit</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition-colors flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-300 mt-8">
          Propulsé par <Link href="/" className="hover:text-gray-400">Cal.pro</Link>
        </p>
      </div>
    </div>
  )
}
