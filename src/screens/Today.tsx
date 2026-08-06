import { useState } from 'react'
import { CalendarClock, ChevronRight, Dumbbell, HeartPulse, Moon, Sun, Waves } from 'lucide-react'
import { useApp } from '../lib/store'
import { HEUTE, HINWEIS, PERSONA, TRAININGS_OPTIONEN } from '../lib/mockData'
import { tagesBelastung } from '../lib/scoring'
import type { Faktor } from '../lib/types'
import {
  AMPEL_STIL,
  AmpelIcon,
  BelastungBadge,
  Button,
  Card,
  MedizinHinweis,
  SectionTitle,
  Sheet,
  StatusBadge,
  cx,
} from '../components/ui'
import { Sparkline } from '../components/charts'

export default function Today() {
  const { state, status, oeffne } = useApp()
  const [faktor, setFaktor] = useState<Faktor | null>(null)

  const variante = state.variante ?? 'A'
  const gewaehlterEvent = state.plan.find((e) => e.tag === HEUTE.tag && e.vorschlag) ?? null
  const gewaehlteOption = TRAININGS_OPTIONEN.find((o) => o.id === state.gewaehlteOptionId) ?? null
  const tagesplan = gewaehlterEvent && gewaehlteOption ? { event: gewaehlterEvent, option: gewaehlteOption } : null
  const verlaufWerte = [...state.verlauf.slice(-7).map((t) => t.regeneration).slice(0, 6), status.score]

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto cb-scroll">
        <Kopf />

        <div className="space-y-6 px-4 pt-4 pb-8">
          {variante === 'A' ? (
            <>
              <AmpelBlock onFaktor={setFaktor} />
              <Aktionen />
              <FaktorenListe onFaktor={setFaktor} kompakt />
            </>
          ) : (
            <>
              <ZahlenBlock verlaufWerte={verlaufWerte} />
              <FaktorenListe onFaktor={setFaktor} />
              <EmpfehlungsBlock />
              <Aktionen />
            </>
          )}

          {tagesplan && (
            <section>
              <SectionTitle>Dein Tagesplan</SectionTitle>
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-court-100 text-court-700">
                    {tagesplan.option.dauerMin === 0 ? <HeartPulse size={20} /> : <Dumbbell size={20} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[17px] font-semibold text-navy-900">{tagesplan.option.titel}</p>
                    <p className="mt-0.5 text-[15px] text-ink-muted">
                      Heute, {tagesplan.option.dauer} · von dir ausgewählt
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  {tagesplan.option.dauerMin === 0 ? (
                    <Button breit variante="sekundaer" onClick={() => oeffne({ name: 'empfehlungen' })}>
                      Entscheidung anpassen
                    </Button>
                  ) : (
                    <Button
                      breit
                      variante="sekundaer"
                      onClick={() => oeffne({ name: 'vorbereitung', eventId: tagesplan.event.id })}
                    >
                      Trainingsvorbereitung öffnen
                    </Button>
                  )}
                </div>
              </Card>
            </section>
          )}

          <SekundaereInhalte />

          <MedizinHinweis text={HINWEIS} />
        </div>
      </div>

      <Sheet offen={faktor !== null} onClose={() => setFaktor(null)} titel={faktor?.label ?? ''}>
        {faktor && (
          <div className="space-y-4">
            <p className="text-[15px] text-ink-muted">
              Aktuelle Einschätzung: <span className="font-medium text-navy-900">{faktor.wert}</span>
            </p>
            <p className="text-[16px] leading-relaxed text-navy-800">{faktor.erklaerung}</p>
            <div className="rounded-xl bg-white p-4 text-[15px] text-ink-muted">
              Wirkung auf den Tagesstatus:{' '}
              <span className="font-mono text-navy-900">
                {faktor.beitrag > 0 ? `−${Math.round(faktor.beitrag)}` : '±0'} Punkte
              </span>
            </div>
            <Button breit variante="sekundaer" onClick={() => setFaktor(null)}>
              Schließen
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  )
}

function Kopf() {
  const { state } = useApp()
  return (
    <header className="relative overflow-hidden bg-navy-900 px-4 pt-6 pb-7 text-white">
      <div aria-hidden className="cb-court-lines pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative">
        <p className="text-[15px] text-white/60">{HEUTE.datum}</p>
        <h1 className="mt-1 font-display text-[26px] font-bold">Guten Morgen, {PERSONA.name}</h1>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[14px] text-white/85">
          <CalendarClock size={15} className="text-lime-accent" />
          {HEUTE.naechsterTermin}
        </p>
        {state.checkInErledigt && (
          <p className="mt-2 text-[13px] text-lime-accent/90">Check-in von heute berücksichtigt</p>
        )}
      </div>
    </header>
  )
}

/* ---------- Variante A ---------- */

function AmpelBlock({ onFaktor }: { onFaktor: (f: Faktor) => void }) {
  const { status } = useApp()
  const stil = AMPEL_STIL[status.ampel]
  return (
    <section className="-mt-11">
      <div className={cx('rounded-[20px] border p-5 shadow-sm', stil.bg, stil.rand)}>
        <div className={cx('flex items-center gap-2 text-[15px] font-semibold', stil.text)}>
          <AmpelIcon ampel={status.ampel} size={20} />
          Tagesstatus: {status.label}
        </div>
        <p className="mt-4 font-display text-[22px] leading-snug font-semibold text-navy-900">
          CourtBalance empfiehlt
        </p>
        <p className="mt-1.5 text-[17px] leading-relaxed text-navy-800">{status.empfehlung}</p>
        <div className="mt-4 flex items-center gap-3 border-t border-black/10 pt-3">
          <span className="font-mono text-[15px] text-navy-800">{status.score} / 100</span>
          <span className="text-[14px] text-ink-muted">Detailwert, nachgeordnet</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onFaktor(status.faktoren[0])}
        className="mt-2 flex w-full items-center justify-center gap-1 py-1 text-[14px] text-ink-muted hover:text-navy-800"
      >
        Warum diese Einschätzung? <ChevronRight size={15} />
      </button>
    </section>
  )
}

/* ---------- Variante B ---------- */

function ZahlenBlock({ verlaufWerte }: { verlaufWerte: number[] }) {
  const { status } = useApp()
  return (
    <section className="-mt-11">
      <Card className="p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[14px] tracking-[0.12em] text-ink-muted uppercase">Tagesstatus</p>
            <p className="mt-1 flex items-baseline gap-1 font-mono text-[52px] leading-none font-medium text-navy-900">
              {status.score}
              <span className="text-[20px] text-ink-muted">/100</span>
            </p>
          </div>
          <StatusBadge ampel={status.ampel} text={status.label} />
        </div>
        <div className="mt-4">
          <Sparkline werte={verlaufWerte} />
          <p className="mt-1 text-[13px] text-ink-muted">Letzte 7 Tage</p>
        </div>
      </Card>
    </section>
  )
}

function EmpfehlungsBlock() {
  const { status } = useApp()
  return (
    <section>
      <SectionTitle>Handlungsempfehlung</SectionTitle>
      <Card className="p-5">
        <p className="font-display text-[19px] leading-snug font-semibold text-navy-900">
          CourtBalance empfiehlt
        </p>
        <p className="mt-1.5 text-[17px] leading-relaxed text-navy-800">{status.empfehlung}</p>
      </Card>
    </section>
  )
}

/* ---------- Gemeinsam ---------- */

const TON_PUNKT: Record<Faktor['ton'], string> = {
  gut: 'bg-status-green',
  neutral: 'bg-status-amber',
  achtung: 'bg-status-red',
}

function FaktorenListe({ onFaktor, kompakt }: { onFaktor: (f: Faktor) => void; kompakt?: boolean }) {
  const { status } = useApp()
  return (
    <section>
      <SectionTitle>{kompakt ? 'Einflussfaktoren' : 'Wichtigste Einflussfaktoren'}</SectionTitle>
      <Card className="divide-y divide-hairline overflow-hidden">
        {status.faktoren.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onFaktor(f)}
            className="flex min-h-13 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-paper-2/60 active:bg-paper-2"
          >
            <span className={cx('h-2.5 w-2.5 shrink-0 rounded-full', TON_PUNKT[f.ton])} aria-hidden />
            <span className="min-w-0 flex-1 text-[16px] text-navy-900">{f.label}</span>
            <span className="text-[15px] text-ink-muted">{f.wert}</span>
            <ChevronRight size={17} className="shrink-0 text-ink-muted" />
          </button>
        ))}
      </Card>
      <p className="mt-2 px-1 text-[13px] text-ink-muted">
        Tippe einen Faktor an, um die Einschätzung nachzuvollziehen.
      </p>
    </section>
  )
}

function Aktionen() {
  const { oeffne } = useApp()
  return (
    <section className="space-y-3">
      <Button breit onClick={() => oeffne({ name: 'checkin' })}>
        Tages-Check-in durchführen
      </Button>
      <Button breit variante="sekundaer" onClick={() => oeffne({ name: 'empfehlungen' })}>
        Empfehlungen ansehen
      </Button>
    </section>
  )
}

function SekundaereInhalte() {
  const { state, status } = useApp()
  const heuteBelastung = tagesBelastung(state.plan, HEUTE.tag)

  return (
    <section className="space-y-3">
      <SectionTitle>Rund um den Tag</SectionTitle>

      <Card className="flex items-start gap-3 p-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5 text-navy-800">
          <CalendarClock size={18} />
        </span>
        <div>
          <p className="text-[16px] font-medium text-navy-900">Nächster Termin</p>
          <p className="text-[15px] text-ink-muted">
            {HEUTE.naechsterTermin} · Anfahrt einplanen
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[16px] font-medium text-navy-900">Wochenbelastung</p>
            <p className="text-[15px] text-ink-muted">
              Heute {heuteBelastung} Punkte · Woche {status.wochenMinuten} Punkte
            </p>
          </div>
          <BelastungBadge stufe={status.wochenbelastung} />
        </div>
      </Card>

      <Card className="flex items-start gap-3 p-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-court-100 text-court-700">
          <Moon size={18} />
        </span>
        <div>
          <p className="text-[16px] font-medium text-navy-900">Regeneration</p>
          <p className="text-[15px] text-ink-muted">
            Eine mögliche Option ist heute Abend leichte Mobility und eine frühere Schlafenszeit.
          </p>
        </div>
      </Card>

      <Card className="flex items-start gap-3 p-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-status-amber-bg text-status-amber">
          <Sun size={18} />
        </span>
        <div>
          <p className="text-[16px] font-medium text-navy-900">Warme Bedingungen</p>
          <p className="text-[15px] text-ink-muted">
            {HEUTE.temperatur} °C: zusätzliche Trinkpausen und eine längere Aufwärmphase einplanen.
          </p>
        </div>
      </Card>

      <Card className="flex items-start gap-3 p-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5 text-navy-800">
          <Waves size={18} />
        </span>
        <div>
          <p className="text-[16px] font-medium text-navy-900">Beschwerden im Blick</p>
          <p className="text-[15px] text-ink-muted">
            {state.checkIn.beschwerden
              ? `${state.checkIn.regionen.join(', ')} (${state.checkIn.beschwerdeIntensitaet}) – Reaktion während der Einheit beobachten.`
              : 'Aktuell keine Beschwerden eingetragen.'}
          </p>
        </div>
      </Card>
    </section>
  )
}
