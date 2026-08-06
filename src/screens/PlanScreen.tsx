import { useState } from 'react'
import { Briefcase, Dumbbell, HeartPulse, Plus, Trophy, Users, UserRound } from 'lucide-react'
import { useApp } from '../lib/store'
import { HEUTE } from '../lib/mockData'
import { regenerationsStatus, tagesBelastung, tagesStufe } from '../lib/scoring'
import { TAGE, TAG_LANG, type EventArt, type Intensitaet, type PlanEvent, type Tag } from '../lib/types'
import { BelastungBadge, Button, Card, Chip, SectionTitle, Sheet, cx } from '../components/ui'

const ART_INFO: Record<EventArt, { label: string; Icon: typeof Dumbbell; farbe: string; punkt: string }> = {
  training: { label: 'Eigenes Training', Icon: Dumbbell, farbe: 'bg-court-100 text-court-700', punkt: 'bg-court-600' },
  wettkampf: { label: 'Wettkampf', Icon: Trophy, farbe: 'bg-navy-900 text-lime-accent', punkt: 'bg-navy-900' },
  trainer: { label: 'Trainertätigkeit', Icon: Users, farbe: 'bg-lime-soft text-court-700', punkt: 'bg-lime-accent' },
  regeneration: { label: 'Regeneration', Icon: HeartPulse, farbe: 'bg-status-green-bg text-status-green', punkt: 'bg-status-green' },
  arbeit: { label: 'Arbeit', Icon: Briefcase, farbe: 'bg-paper-2 text-navy-700', punkt: 'bg-navy-500' },
  privat: { label: 'Privater Termin', Icon: UserRound, farbe: 'bg-status-amber-bg text-status-amber', punkt: 'bg-status-amber' },
}

export default function PlanScreen() {
  const { state, status, dispatch, zeigeToast, oeffne } = useApp()
  const [offenerEvent, setOffenerEvent] = useState<string | null>(null)
  const [ergaenzen, setErgaenzen] = useState(false)

  const event = state.plan.find((e) => e.id === offenerEvent) ?? null

  return (
    <div className="flex h-full flex-col bg-paper">
      <header className="shrink-0 bg-navy-900 px-4 pt-6 pb-5 text-white">
        <p className="text-[15px] text-white/60">Kalenderwoche 32</p>
        <h1 className="mt-0.5 font-display text-[24px] font-bold">Wochenplan</h1>
        <div className="mt-3 flex items-center gap-2 text-[14px] text-white/75">
          <span>Sportliche Wochenbelastung:</span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono">{status.wochenMinuten}</span>
          <span>({status.wochenbelastung})</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 cb-scroll">
        <div className="mb-4">
          <Button breit variante="sekundaer" icon={<Plus size={18} />} onClick={() => setErgaenzen(true)}>
            Kurzfristige Belastung ergänzen
          </Button>
        </div>

        <div className="space-y-3">
          {TAGE.map((tag) => (
            <TagesKarte key={tag} tag={tag} onEvent={setOffenerEvent} />
          ))}
        </div>

        <div className="mt-5">
          <SectionTitle>Legende</SectionTitle>
          <Card className="flex flex-wrap gap-x-4 gap-y-2 p-4">
            {(Object.keys(ART_INFO) as EventArt[]).map((art) => {
              const { label, Icon, punkt } = ART_INFO[art]
              return (
                <span key={art} className="inline-flex items-center gap-2 text-[14px] text-navy-800">
                  <span className={cx('h-2.5 w-2.5 rounded-full', punkt)} aria-hidden />
                  <Icon size={14} className="text-ink-muted" aria-hidden />
                  {label}
                </span>
              )
            })}
          </Card>
        </div>
      </div>

      <EventSheet
        event={event}
        onClose={() => setOffenerEvent(null)}
        onAlternative={() => {
          setOffenerEvent(null)
          oeffne({ name: 'empfehlungen' })
        }}
        onVorbereitung={(id) => {
          setOffenerEvent(null)
          oeffne({ name: 'vorbereitung', eventId: id })
        }}
      />

      <Sheet offen={ergaenzen} onClose={() => setErgaenzen(false)} titel="Kurzfristige Belastung ergänzen">
        <ErgaenzenFormular
          onSpeichern={(neu) => {
            dispatch({ type: 'plan/hinzufuegen', wert: neu })
            setErgaenzen(false)
            zeigeToast('Dein Plan wurde an die neue Belastung angepasst.')
          }}
        />
      </Sheet>
    </div>
  )
}

function TagesKarte({ tag, onEvent }: { tag: Tag; onEvent: (id: string) => void }) {
  const { state } = useApp()
  const eintraege = state.plan.filter((e) => e.tag === tag)
  const belastung = tagesBelastung(state.plan, tag)
  const stufe = tagesStufe(belastung)
  const istHeute = tag === HEUTE.tag

  return (
    <Card className={cx('overflow-hidden', istHeute && 'border-navy-900/40 ring-1 ring-navy-900/15')}>
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3">
        <div className="flex items-baseline gap-2">
          <h3 className="font-display text-[17px] font-semibold text-navy-900">{TAG_LANG[tag]}</h3>
          {istHeute && (
            <span className="rounded-full bg-navy-900 px-2 py-0.5 text-[12px] text-lime-accent">heute</span>
          )}
        </div>
        <BelastungBadge stufe={stufe} />
      </div>

      <div className="divide-y divide-hairline">
        {eintraege.length === 0 ? (
          <p className="px-4 py-3 text-[15px] text-ink-muted">Keine Einträge · freier Tag</p>
        ) : (
          eintraege.map((e) => {
            const { Icon, farbe, label } = ART_INFO[e.art]
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => onEvent(e.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-paper-2/60 active:bg-paper-2"
              >
                <span className={cx('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', farbe)}>
                  <Icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] text-navy-900">{e.titel}</span>
                  <span className="block text-[14px] text-ink-muted">
                    {e.zeit} · {e.dauerMin} Min. · {label}
                  </span>
                </span>
                <BelastungBadge stufe={e.intensitaet} />
              </button>
            )
          })
        )}
      </div>

      <div className="flex items-center justify-between gap-3 bg-paper/70 px-4 py-2.5 text-[14px] text-ink-muted">
        <span>Gesamtbelastung {belastung}</span>
        <span>{regenerationsStatus(belastung)}</span>
      </div>
    </Card>
  )
}

function EventSheet({
  event,
  onClose,
  onAlternative,
  onVorbereitung,
}: {
  event: PlanEvent | null
  onClose: () => void
  onAlternative: () => void
  onVorbereitung: (id: string) => void
}) {
  const { dispatch, zeigeToast } = useApp()
  if (!event) return null
  const info = ART_INFO[event.art]
  const sportlich = event.art === 'training' || event.art === 'wettkampf' || event.art === 'regeneration'

  const anpassen = (wert: Partial<PlanEvent>, meldung = 'Dein Plan wurde an die neue Belastung angepasst.') => {
    dispatch({ type: 'plan/aendern', id: event.id, wert })
    zeigeToast(meldung)
  }

  return (
    <Sheet offen onClose={onClose} titel={event.titel}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px]', info.farbe)}>
            <info.Icon size={13} />
            {info.label}
          </span>
          <span className="rounded-full border border-hairline bg-white px-2.5 py-1 text-[13px] text-ink-muted">
            {TAG_LANG[event.tag]}, {event.zeit}
          </span>
          <BelastungBadge stufe={event.intensitaet} praefix="Intensität" />
        </div>

        {event.notiz && <p className="text-[16px] leading-relaxed text-navy-800">{event.notiz}</p>}

        <div>
          <p className="mb-2 text-[14px] text-ink-muted">Auf einen anderen Tag verschieben</p>
          <div className="flex flex-wrap gap-2">
            {TAGE.map((t) => (
              <Chip
                key={t}
                aktiv={t === event.tag}
                onClick={() =>
                  t !== event.tag && anpassen({ tag: t }, `Verschoben auf ${TAG_LANG[t]}. Dein Plan wurde angepasst.`)
                }
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[14px] text-ink-muted">Intensität ändern</p>
          <div className="flex gap-2">
            {(['niedrig', 'mittel', 'hoch'] as Intensitaet[]).map((i) => (
              <Chip key={i} aktiv={event.intensitaet === i} onClick={() => anpassen({ intensitaet: i })}>
                {i}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[14px] text-ink-muted">Dauer ändern</p>
          <div className="flex gap-2">
            {[30, 60, 90, 120].map((d) => (
              <Chip key={d} aktiv={event.dauerMin === d} onClick={() => anpassen({ dauerMin: d })}>
                {d} Min.
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-2.5 border-t border-hairline pt-4">
          {sportlich && event.art !== 'wettkampf' && (
            <Button breit onClick={() => onVorbereitung(event.id)}>
              Trainingsvorbereitung öffnen
            </Button>
          )}
          {sportlich && (
            <Button breit variante="sekundaer" onClick={onAlternative}>
              Alternatives Training auswählen
            </Button>
          )}
          <Button
            breit
            variante="gefahr"
            onClick={() => {
              dispatch({ type: 'plan/entfernen', id: event.id })
              onClose()
              zeigeToast('Dein Plan wurde an die neue Belastung angepasst.')
            }}
          >
            Eintrag entfernen
          </Button>
          <Button breit variante="geist" onClick={onClose}>
            Schließen
          </Button>
        </div>
      </div>
    </Sheet>
  )
}

const VORLAGEN: Array<{ titel: string; art: EventArt; dauerMin: number; intensitaet: Intensitaet }> = [
  { titel: 'Kurzfristiger Projekttermin', art: 'arbeit', dauerMin: 180, intensitaet: 'hoch' },
  { titel: 'Zusätzliche Besprechung', art: 'arbeit', dauerMin: 90, intensitaet: 'mittel' },
  { titel: 'Private Verpflichtung', art: 'privat', dauerMin: 120, intensitaet: 'mittel' },
  { titel: 'Längere Anfahrt', art: 'privat', dauerMin: 120, intensitaet: 'niedrig' },
]

function ErgaenzenFormular({ onSpeichern }: { onSpeichern: (e: PlanEvent) => void }) {
  const [tag, setTag] = useState<Tag>(HEUTE.tag)
  const [vorlage, setVorlage] = useState(0)

  return (
    <div className="space-y-5">
      <p className="text-[16px] leading-relaxed text-navy-800">
        Trage kurzfristige berufliche oder private Belastungen ein. CourtBalance berücksichtigt sie in der
        Wochenübersicht und in den Empfehlungen.
      </p>

      <div>
        <p className="mb-2 text-[14px] text-ink-muted">Art der Belastung</p>
        <div className="flex flex-wrap gap-2">
          {VORLAGEN.map((v, i) => (
            <Chip key={v.titel} aktiv={vorlage === i} onClick={() => setVorlage(i)}>
              {v.titel}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[14px] text-ink-muted">Tag</p>
        <div className="flex flex-wrap gap-2">
          {TAGE.map((t) => (
            <Chip key={t} aktiv={t === tag} onClick={() => setTag(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <Button
        breit
        onClick={() =>
          onSpeichern({
            id: `e-neu-${Date.now()}`,
            tag,
            zeit: '09:00',
            ...VORLAGEN[vorlage],
          })
        }
      >
        Belastung eintragen
      </Button>
    </div>
  )
}
