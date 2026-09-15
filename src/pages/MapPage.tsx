import UiText from "../components/UiText"
import { useState, useEffect } from "react"
import { MapPin, ChevronRight, LocateFixed } from "../components/icons"
import LeafletMap from "../components/LeafletMap"
import { mapLocations } from "../data/dummy"
import { api, appMode } from "../lib/api"
import { useLocale } from "../context/LocaleContext"

interface Props {
  onNavigate: (page: string, param?: string) => void
}

// Match LeafletMap MARKER_COLORS: primary->primary, secondary->accent, alert->critical, peripheral->muted.
function locColor(type: string): string {
  if (type === "primary") return "var(--color-primary)"
  if (type === "secondary") return "var(--color-accent)"
  if (type === "alert") return "var(--color-alert-critical)"
  return "var(--color-text-muted)"
}

export default function MapPage({ onNavigate }: Props) {
  const [filter, setFilter] = useState("all")
  const { locale } = useLocale()
  const [locations, setLocations] = useState(mapLocations)
  const [error, setError] = useState("")
  useEffect(() => {
    if (appMode !== "full") return
    api
      .map("CASE-2026-017")
      .then((rows) =>
        setLocations(
          rows.map((row) => ({
            id: row.eventId,
            name: row.location.name,
            lat: row.location.lat,
            lng: row.location.lng,
            type: "primary",
            entity: row.entityIds[0],
            description: `${row.title} · ${row.evidenceIds.join(", ")}`,
          })),
        ),
      )
      .catch((e) => {
        setLocations([])
        setError(e.message)
      })
  }, [])

  const filteredLocations = locations.filter(
    (l) => filter === "all" || l.type === filter,
  )

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[var(--color-text-primary)] text-xl font-bold tracking-tight">
              {locale === "hi" ? "भौगोलिक जाँच" : "Geospatial Intelligence"}
            </h1>
            <p className="text-[var(--color-text-secondary)] text-[13px] mt-1">
              <UiText>
                Location analysis · Entity distribution · Movement patterns
              </UiText>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "primary", "secondary", "alert"].map((f) => (
              <button
                key={f}
                className={`gov-chip capitalize ${
                  filter === f ? "is-active" : ""
                }`}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                <UiText>{f}</UiText>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {error && (
          <p role="alert" className="gov-panel p-4 mb-4">
            {error}
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="gov-panel p-2 relative">
              <LeafletMap
                height={600}
                showConnections={appMode !== "full"}
                locations={filteredLocations}
              />
              <div className="absolute top-4 left-14 z-[400] bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-sm px-3 py-1.5 flex items-center gap-2 pointer-events-none">
                <LocateFixed
                  size={14}
                  className="text-[var(--color-primary)]"
                />
                <span className="text-[11px] font-medium text-[var(--color-text-primary)]">
                  <UiText>Restricted: India Region</UiText>
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-3 leading-relaxed">
              <UiText>
                Marker colours, layer toggles, and connection lines are
                controlled from the legend on the map. Use the filter above to
                narrow the location list on the right.
              </UiText>
            </p>
          </div>

          <aside className="gov-panel overflow-hidden flex flex-col lg:max-h-[650px]">
            <div className="flex items-center justify-between bg-[var(--color-surface)] px-4 py-3 border-b border-[var(--color-border-subtle)] shrink-0">
              <h3 className="font-bold text-[var(--color-text-primary)] text-[13px] uppercase tracking-wider">
                <UiText>Known Locations</UiText>
              </h3>
              <span className="text-[10px] bg-[var(--color-surface)] border border-[var(--color-border-strong)] px-2 py-0.5 rounded-sm text-[var(--color-text-secondary)]">
                {filteredLocations.length}
                <UiText> items</UiText>
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-hide divide-y divide-[var(--color-border-subtle)]">
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-4 group bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--color-surface-2)] rounded-sm border border-[var(--color-border-subtle)] flex-shrink-0">
                      <MapPin size={16} style={{ color: locColor(loc.type) }} />
                    </div>
                    <div>
                      <div className="font-bold text-[13px] text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors mb-0.5">
                        {loc.name}
                      </div>
                      <div className="text-[10px] font-mono text-[var(--color-text-muted)] mb-2">
                        {loc.id}
                      </div>
                      <div className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                        <UiText>{loc.description}</UiText>
                      </div>
                      <button
                        className="text-xs underline mt-2"
                        onClick={() => {
                          const cited =
                            loc.description.match(/EV-2026-\d+/)?.[0]
                          onNavigate(
                            cited ? "evidence-detail" : "evidence",
                            cited,
                          )
                        }}
                      >
                        <UiText>Open supporting evidence</UiText>
                      </button>
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-widest">
                          <UiText>Entity:</UiText>
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-sm border"
                          style={{
                            color: locColor(loc.type),
                            borderColor: locColor(loc.type),
                            background: "var(--color-surface-2)",
                          }}
                        >
                          {loc.entity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredLocations.length === 0 && (
                <div className="text-center py-10 text-[12px] text-[var(--color-text-muted)]">
                  <UiText>No locations match the current filter.</UiText>
                </div>
              )}
            </div>

            <button
              className="w-full p-4 text-left flex items-center gap-3 group bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border-t border-[var(--color-border-strong)] transition-colors shrink-0"
              onClick={() => onNavigate("timeline")}
            >
              <div className="p-2 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm text-[var(--color-primary)]">
                <ChevronRight size={16} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                  <UiText>Timeline View</UiText>
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                  <UiText>See events at these locations</UiText>
                </div>
              </div>
            </button>
          </aside>
        </div>
      </div>
    </div>
  )
}
