"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Calendar, Settings, Copy, Check, Trash2, ExternalLink, Pencil } from "lucide-react"
import type { EventType } from "@/app/dashboard/page"
import CreateEventTypeModal from "@/components/dashboard/CreateEventTypeModal"
import EditEventTypeModal from "@/components/dashboard/EditEventTypeModal"

interface Props {
  eventTypes: EventType[]
  username: string | null
  onEventTypesChange: (types: EventType[]) => void
}

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
}

export default function Sidebar({ eventTypes, username, onEventTypesChange }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [editingType, setEditingType] = useState<EventType | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  function copyLink(slug: string) {
    if (!username) return
    const url = `${window.location.origin}/${username}/${slug}`
    navigator.clipboard.writeText(url)
    setCopied(slug)
    setTimeout(() => setCopied(null), 1500)
  }

  async function deleteEventType(id: string) {
    if (!confirm("Supprimer ce type d'événement ?")) return
    await fetch(`/api/event-types/${id}`, { method: "DELETE" })
    onEventTypesChange(eventTypes.filter((e) => e.id !== id))
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvel événement
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 py-2">
            Mes événements
          </p>

          {eventTypes.length === 0 && (
            <p className="text-sm text-gray-400 px-2 py-4 text-center">
              Aucun événement.
              <br />
              Créez-en un ci-dessus.
            </p>
          )}

          {eventTypes.map((et) => (
            <div
              key={et.id}
              className="group flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50"
            >
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${COLOR_MAP[et.color] || "bg-gray-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{et.name}</p>
                <p className="text-xs text-gray-400">
                  {et.duration} min{et.price ? ` · ${(et.price / 100).toFixed(0)}€` : " · Gratuit"}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingType(et)} title="Modifier" className="p-1 rounded hover:bg-gray-100">
                  <Pencil className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {username && (
                  <>
                    <button onClick={() => copyLink(et.slug)} title="Copier le lien" className="p-1 rounded hover:bg-gray-100">
                      {copied === et.slug ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                    <a href={`/${username}/${et.slug}`} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-gray-100">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </a>
                  </>
                )}
                <button onClick={() => deleteEventType(et.id)} className="p-1 rounded hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <Settings className="w-4 h-4" />
            Paramètres
          </Link>
        </div>
      </aside>

      {showModal && (
        <CreateEventTypeModal
          onClose={() => setShowModal(false)}
          onCreated={(newType) => {
            onEventTypesChange([newType, ...eventTypes])
            setShowModal(false)
          }}
        />
      )}

      {editingType && (
        <EditEventTypeModal
          eventType={editingType}
          onClose={() => setEditingType(null)}
          onUpdated={(updated) => {
            onEventTypesChange(eventTypes.map((et) => (et.id === updated.id ? updated : et)))
            setEditingType(null)
          }}
        />
      )}
    </>
  )
}
