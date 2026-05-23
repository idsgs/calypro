"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Save, ExternalLink } from "lucide-react"

export default function Settings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [timezone, setTimezone] = useState("Europe/Paris")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin")
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch("/api/user")
      .then((r) => r.json())
      .then((u) => {
        setName(u.name || "")
        setUsername(u.username || "")
        setTimezone(u.timezone || "Europe/Paris")
      })
  }, [session])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, timezone }),
    })
    if (res.ok) {
      router.push("/dashboard")
    } else {
      const data = await res.json()
      setError(data.error || "Erreur lors de la sauvegarde")
      setSaving(false)
    }
  }

  if (!session) return null

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres du profil</h1>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
            <span className="px-3 py-3 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">
              calpro.fr/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="votre-nom"
              className="flex-1 px-3 py-3 text-sm focus:outline-none"
            />
          </div>
          {username && (
            <a
              href={`/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-red-600 mt-1 hover:underline"
            >
              Voir ma page <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fuseau horaire</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Europe/Paris">Europe/Paris (UTC+1/+2)</option>
            <option value="Europe/London">Europe/London (UTC+0/+1)</option>
            <option value="America/New_York">America/New_York (UTC-5/-4)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (UTC-8/-7)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-full text-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Sauvegarde…" : "Sauvegarder"}
        </button>
      </form>
    </div>
  )
}
