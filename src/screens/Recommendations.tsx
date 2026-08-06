import { useState } from 'react'
import { Check, Clock } from 'lucide-react'
import { useApp } from '../lib/store'
import { HEUTE, TRAININGS_OPTIONEN } from '../lib/mockData'
import type { TrainingsOption } from '../lib/types'
import { BelastungBadge, Button, Card, OverlayKopf, Sheet, cx } from '../components/ui'

export default function Recommendations() {
  const { state, status, dispatch, zurueck, zeigeToast } = useApp()
  const [details, setDetails] = useState<TrainingsOption | null>(null)
  const [vergleich, setVergleich] = useState(false)

  const empfohlenId = status.score < 50 ? 'regeneration' : 'technik'
  const sortiert = [
    ...TRAININGS_OPTIONEN.filter((o) => o.id === empfohlenId),
    ...TRAININGS_OPTIONEN.filter((o) => o.id !== empfohlenId),
  ]

  const waehlen = (option: TrainingsOption) => {
    const bestehend = state.plan.find((e) => e.tag === HEUTE.tag && e.vorschlag)
    const event = {
      id: bestehend?.id ?? `e-do-wahl`,
      tag: HEUTE.tag,
      titel: option.titel,
      art: option.art,
      dauerMin: option.dauerMin,
      intensitaet: option.intensitaet,
      zeit: '17:30',
      notiz: option.ziel,
      vorschlag: true,
    }
    if (bestehend) dispatch({ type: 'plan/aendern', id: bestehend.id, wert: event })
    else dispatch({ type: 'plan/hinzufuegen', wert: event })
    dispatch({ type: 'option/waehlen', id: option.id })
    dispatch({ type: 'overlay/clear' })
    dispatch({ type: 'tab', wert: 'heute' })
    zeigeToast(`Für heute übernommen: ${option.titel}`)
  }

  return (
    <div className="flex h-full flex-col bg-paper">
      <OverlayKopf titel="Empfehlungen" unterzeile="Du entscheidest, was passt" onZurueck={zurueck} />

      <div className="flex-1 space-y-4 overflow-y-auto px-4 pt-4 pb-8 cb-scroll">
        <Card className="p-4">
          <p className="text-[16px] leading-relaxed text-navy-800">
            Bei einem Tagesstatus von <span className="font-mono">{status.score}</span> ({status.label}) sind
            heute mehrere Wege sinnvoll. Du entscheidest, was zu deinem aktuellen Zustand passt.
          </p>
        </Card>

        {sortiert.map((option) => {
          const empfohlen = option.id === empfohlenId
          const gewaehlt = state.gewaehlteOptionId === option.id
          return (
            <Card
              key={option.id}
              className={cx('overflow-hidden', empfohlen && 'border-court-500/50 ring-1 ring-court-500/25')}
            >
              <div className="p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {empfohlen ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-court-600 px-2.5 py-1 text-[13px] font-medium text-white">
                      <Check size={13} strokeWidth={3} />
                      CourtBalance empfiehlt
                    </span>
                  ) : (
                    <span className="rounded-full bg-paper-2 px-2.5 py-1 text-[13px] text-ink-muted">
                      Eine mögliche Option
                    </span>
                  )}
                  {gewaehlt && (
                    <span className="rounded-full bg-navy-900 px-2.5 py-1 text-[13px] text-lime-accent">
                      für heute gewählt
                    </span>
                  )}
                </div>

                <h2 className="font-display text-[19px] leading-snug font-semibold text-navy-900">
                  {option.titel}
                </h2>

                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <BelastungBadge stufe={option.belastung} praefix="Belastung" />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2.5 py-1 text-[13px] text-ink-muted">
                    <Clock size={13} />
                    {option.dauer}
                  </span>
                </div>

                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{option.begruendung}</p>

                <div className="mt-4 flex gap-2">
                  <div className="flex-1">
                    <Button breit klein onClick={() => waehlen(option)}>
                      Für heute auswählen
                    </Button>
                  </div>
                  <Button klein variante="sekundaer" onClick={() => setDetails(option)}>
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}

        <Button breit variante="geist" onClick={() => setVergleich(true)}>
          Andere Entscheidung treffen
        </Button>
      </div>

      <Sheet offen={details !== null} onClose={() => setDetails(null)} titel={details?.titel ?? ''}>
        {details && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <BelastungBadge stufe={details.belastung} praefix="Belastung" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-2.5 py-1 text-[13px] text-ink-muted">
                <Clock size={13} />
                {details.dauer}
              </span>
            </div>
            <Liste titel="Inhalt" punkte={details.details} />
            <Liste titel="Vorbereitung" punkte={details.vorbereitung} />
            <Liste titel="Nachbereitung" punkte={details.nachbereitung} />
            <Button
              breit
              onClick={() => {
                const o = details
                setDetails(null)
                waehlen(o)
              }}
            >
              Für heute auswählen
            </Button>
          </div>
        )}
      </Sheet>

      <Sheet offen={vergleich} onClose={() => setVergleich(false)} titel="Andere Entscheidung treffen">
        <div className="space-y-4">
          <p className="text-[16px] leading-relaxed text-navy-800">
            Deine Körperwahrnehmung zählt. Vergleiche die Optionen noch einmal nebeneinander und entscheide
            selbst – oder verwerfe die Auswahl für heute.
          </p>
          <div className="overflow-hidden rounded-xl border border-hairline bg-white">
            {TRAININGS_OPTIONEN.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setVergleich(false)
                  waehlen(o)
                }}
                className="flex w-full items-center gap-3 border-b border-hairline px-4 py-3 text-left last:border-b-0 hover:bg-paper-2/60"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] text-navy-900">{o.titel}</p>
                  <p className="text-[14px] text-ink-muted">
                    {o.dauer} · Belastung {o.belastung}
                  </p>
                </div>
                <BelastungBadge stufe={o.belastung} />
              </button>
            ))}
          </div>
          <Button
            breit
            variante="sekundaer"
            onClick={() => {
              dispatch({ type: 'option/waehlen', id: null })
              const bestehend = state.plan.find((e) => e.tag === HEUTE.tag && e.vorschlag)
              if (bestehend) dispatch({ type: 'plan/entfernen', id: bestehend.id })
              setVergleich(false)
              zeigeToast('Auswahl für heute zurückgenommen.')
            }}
          >
            Auswahl für heute zurücknehmen
          </Button>
        </div>
      </Sheet>
    </div>
  )
}

function Liste({ titel, punkte }: { titel: string; punkte: string[] }) {
  return (
    <div>
      <p className="mb-2 font-display text-[13px] tracking-[0.14em] text-ink-muted uppercase">{titel}</p>
      <ul className="space-y-1.5">
        {punkte.map((p) => (
          <li key={p} className="flex gap-2 text-[16px] leading-snug text-navy-800">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-court-500" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}
