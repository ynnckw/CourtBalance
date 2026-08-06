import { useEffect, useRef, useState } from 'react'
import { Droplets, Sun, Target, Timer } from 'lucide-react'
import { useApp } from '../lib/store'
import { HEUTE, HINWEIS } from '../lib/mockData'
import { Button, Card, Chip, MedizinHinweis, OverlayKopf, SectionTitle, Skala } from '../components/ui'
import type { Einheit } from '../lib/types'

/* ---------- Vorbereitung ---------- */

export function TrainingPrep({ eventId }: { eventId: string }) {
  const { state, status, dispatch, zurueck, zeigeToast } = useApp()
  const event = state.plan.find((e) => e.id === eventId)

  if (!event) {
    return (
      <div className="flex h-full flex-col bg-paper">
        <OverlayKopf titel="Trainingsvorbereitung" onZurueck={zurueck} />
        <div className="p-5">
          <Card className="p-4">
            <p className="text-[16px] text-navy-800">Diese Einheit ist nicht mehr im Plan.</p>
          </Card>
          <div className="mt-4">
            <Button breit onClick={zurueck}>
              Zurück
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const hinweise = [
    `Plane bei ${HEUTE.temperatur} °C zusätzliche Trinkpausen ein.`,
    'Beginne mit einem verlängerten Aufwärmprogramm.',
    state.checkIn.beschwerden
      ? `Reduziere laufintensive Übungen, falls ${state.checkIn.regionen[0] ?? 'die betroffene Region'} stärker reagiert.`
      : 'Steigere die Intensität in den ersten 10 Minuten langsam.',
  ]

  return (
    <div className="flex h-full flex-col bg-paper">
      <OverlayKopf titel="Trainingsvorbereitung" unterzeile={event.titel} onZurueck={zurueck} />

      <div className="flex-1 space-y-5 overflow-y-auto px-4 pt-4 pb-8 cb-scroll">
        <Card className="p-4">
          <h2 className="font-display text-[20px] leading-snug font-semibold text-navy-900">{event.titel}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Kennzahl label="Geplante Dauer" wert={`${event.dauerMin} Min.`} />
            <Kennzahl label="Geplante Intensität" wert={event.intensitaet} />
            <Kennzahl label="Temperatur" wert={`${HEUTE.temperatur} °C`} />
            <Kennzahl label="Tagesstatus" wert={`${status.score} / 100`} />
          </div>
          <div className="mt-3 flex items-start gap-2 border-t border-hairline pt-3">
            <Target size={17} className="mt-0.5 shrink-0 text-court-600" />
            <p className="text-[15px] text-navy-800">{event.notiz ?? 'Kontrollierte Ausführung im Vordergrund.'}</p>
          </div>
        </Card>

        <section>
          <SectionTitle>Relevante Tagesfaktoren</SectionTitle>
          <Card className="divide-y divide-hairline">
            {status.faktoren.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-[15px] text-navy-900">{f.label}</span>
                <span className="text-[15px] text-ink-muted">{f.wert}</span>
              </div>
            ))}
          </Card>
        </section>

        <section>
          <SectionTitle>Empfohlene Vorbereitung</SectionTitle>
          <Card className="space-y-2.5 p-4">
            {hinweise.map((h, i) => (
              <p key={h} className="flex gap-2.5 text-[16px] leading-snug text-navy-800">
                <span className="mt-0.5 shrink-0 text-court-600">
                  {i === 0 ? <Droplets size={17} /> : i === 1 ? <Timer size={17} /> : <Sun size={17} />}
                </span>
                {h}
              </p>
            ))}
          </Card>
        </section>

        <MedizinHinweis text={HINWEIS} />
      </div>

      <div className="shrink-0 space-y-2.5 border-t border-hairline bg-paper px-4 pt-3 pb-4">
        <Button breit onClick={() => dispatch({ type: 'overlay/replace', wert: { name: 'training', eventId } })}>
          Training starten
        </Button>
        <div className="flex gap-2.5">
          <div className="flex-1">
            <Button
              breit
              variante="sekundaer"
              onClick={() => {
                dispatch({ type: 'overlay/clear' })
                dispatch({ type: 'tab', wert: 'plan' })
              }}
            >
              Plan anpassen
            </Button>
          </div>
          <div className="flex-1">
            <Button
              breit
              variante="gefahr"
              onClick={() => {
                dispatch({ type: 'plan/entfernen', id: eventId })
                if (event.vorschlag) dispatch({ type: 'option/waehlen', id: null })
                dispatch({ type: 'overlay/clear' })
                zeigeToast('Training abgesagt. Dein Plan wurde angepasst.')
              }}
            >
              Training absagen
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Kennzahl({ label, wert }: { label: string; wert: string }) {
  return (
    <div className="rounded-xl bg-paper px-3 py-2.5">
      <p className="text-[13px] text-ink-muted">{label}</p>
      <p className="mt-0.5 font-mono text-[17px] text-navy-900">{wert}</p>
    </div>
  )
}

/* ---------- Ruhiger Trainingsmodus ---------- */

export function TrainingSession({ eventId }: { eventId: string }) {
  const { state, dispatch } = useApp()
  const event = state.plan.find((e) => e.id === eventId)
  const [sekunden, setSekunden] = useState(0)
  const start = useRef(Date.now())

  useEffect(() => {
    const t = setInterval(() => setSekunden(Math.floor((Date.now() - start.current) / 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(sekunden / 60)).padStart(2, '0')
  const ss = String(sekunden % 60).padStart(2, '0')

  return (
    <div className="relative flex h-full flex-col bg-navy-950 text-white">
      <div aria-hidden className="cb-court-lines pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-[15px] tracking-[0.18em] text-white/45 uppercase">Training läuft</p>
        <p className="mt-3 text-[18px] text-white/70">{event?.titel ?? 'Einheit'}</p>
        <p className="mt-10 font-mono text-[72px] leading-none text-white tabular-nums">
          {mm}:{ss}
        </p>
        <p className="mt-4 text-[15px] text-white/45">verstrichene Zeit</p>
      </div>
      <div className="relative shrink-0 px-6 pb-10">
        <button
          type="button"
          onClick={() => dispatch({ type: 'overlay/replace', wert: { name: 'nachbereitung', eventId } })}
          className="min-h-14 w-full rounded-2xl border border-white/25 bg-white/10 text-[17px] font-medium text-white transition-colors hover:bg-white/15"
        >
          Training beenden
        </button>
        <p className="mt-4 text-center text-[13px] text-white/35">
          CourtBalance unterbricht dich während des Trainings nicht.
        </p>
      </div>
    </div>
  )
}

/* ---------- Nachbereitung ---------- */

const GEFUEHLE = ['frisch', 'okay', 'müde', 'erschöpft']

export function TrainingDebrief({ eventId }: { eventId: string }) {
  const { state, dispatch, zurueck, zeigeToast } = useApp()
  const event = state.plan.find((e) => e.id === eventId)
  const [dauer, setDauer] = useState(event?.dauerMin ?? 60)
  const [rpe, setRpe] = useState(6)
  const [gefuehl, setGefuehl] = useState('okay')
  const [beschwerden, setBeschwerden] = useState<Einheit['beschwerden']>('keine')
  const [trinken, setTrinken] = useState<Einheit['trinken']>('ausreichend')
  const [notiz, setNotiz] = useState('')
  const [ergebnis, setErgebnis] = useState<string | null>(null)

  const speichern = () => {
    const belastung = Math.min(96, Math.round((dauer / 60) * rpe * 9))
    const regeneration = Math.max(20, Math.min(92, 74 - rpe * 4 - (beschwerden === 'stärker' ? 10 : beschwerden === 'leichter' ? 4 : 0)))
    dispatch({
      type: 'einheit/speichern',
      einheit: {
        id: `s-${Date.now()}`,
        datum: HEUTE.datum,
        art: event?.titel ?? 'Trainingseinheit',
        dauerMin: dauer,
        rpe,
        gefuehl,
        beschwerden,
        trinken,
        notiz,
      },
      belastung,
      regeneration,
    })
    if (event) dispatch({ type: 'plan/aendern', id: event.id, wert: { erledigt: true, dauerMin: dauer } })

    const stufe = rpe <= 4 ? 'locker' : rpe <= 7 ? 'moderat' : 'deutlich'
    setErgebnis(
      stufe === 'locker'
        ? 'Die Einheit war locker. Du kannst morgen wie geplant weitermachen und den Fokus auf Qualität legen.'
        : stufe === 'moderat'
          ? 'Die Einheit war moderat belastend. Plane heute Abend leichte Mobility und ausreichend Erholung ein.'
          : 'Die Einheit war deutlich belastend. Eine mögliche Option ist ein ruhiger Abend mit früherer Schlafenszeit.',
    )
  }

  if (ergebnis) {
    return (
      <div className="flex h-full flex-col bg-paper">
        <OverlayKopf titel="Einheit gespeichert" onZurueck={() => dispatch({ type: 'overlay/clear' })} />
        <div className="flex-1 space-y-4 overflow-y-auto px-4 pt-5 pb-8 cb-scroll">
          <Card className="p-5">
            <p className="font-display text-[20px] leading-snug font-semibold text-navy-900">
              Deine Einheit ist erfasst
            </p>
            <p className="mt-2 text-[16px] leading-relaxed text-navy-800">{ergebnis}</p>
          </Card>
          <Card className="divide-y divide-hairline">
            <Zeile label="Dauer" wert={`${dauer} Min.`} />
            <Zeile label="Wahrgenommene Intensität" wert={`${rpe} / 10`} />
            <Zeile label="Körperliches Gefühl" wert={gefuehl} />
            <Zeile label="Beschwerden" wert={beschwerden} />
            <Zeile label="Flüssigkeitsaufnahme" wert={trinken} />
            {notiz && <Zeile label="Notiz" wert={notiz} />}
          </Card>
          <MedizinHinweis text={HINWEIS} />
        </div>
        <div className="shrink-0 space-y-2.5 border-t border-hairline bg-paper px-4 pt-3 pb-4">
          <Button
            breit
            onClick={() => {
              dispatch({ type: 'overlay/clear' })
              dispatch({ type: 'tab', wert: 'verlauf' })
              zeigeToast('Verlauf und Wochenbelastung wurden aktualisiert.')
            }}
          >
            Verlauf ansehen
          </Button>
          <Button
            breit
            variante="sekundaer"
            onClick={() => {
              dispatch({ type: 'overlay/clear' })
              dispatch({ type: 'tab', wert: 'heute' })
            }}
          >
            Zurück zum Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-paper">
      <OverlayKopf titel="Nachbereitung" unterzeile={event?.titel} onZurueck={zurueck} />

      <div className="flex-1 space-y-6 overflow-y-auto px-4 pt-5 pb-8 cb-scroll">
        <Feld label="Tatsächliche Dauer">
          <div className="flex flex-wrap gap-2">
            {[20, 30, 45, 60, 75, 90, 120].map((d) => (
              <Chip key={d} aktiv={dauer === d} onClick={() => setDauer(d)}>
                {d} Min.
              </Chip>
            ))}
          </div>
        </Feld>

        <Feld label="Wahrgenommene Intensität (1 bis 10)">
          <Skala wert={rpe} onChange={setRpe} min={1} max={10} legendeMin="1 = sehr leicht" legendeMax="10 = maximal" />
        </Feld>

        <Feld label="Körperliches Gefühl danach">
          <div className="flex flex-wrap gap-2">
            {GEFUEHLE.map((g) => (
              <Chip key={g} aktiv={gefuehl === g} onClick={() => setGefuehl(g)}>
                {g}
              </Chip>
            ))}
          </div>
        </Feld>

        <Feld label="Beschwerden">
          <div className="flex flex-wrap gap-2">
            {(['keine', 'leichter', 'stärker'] as Einheit['beschwerden'][]).map((b) => (
              <Chip key={b} aktiv={beschwerden === b} onClick={() => setBeschwerden(b)}>
                {b}
              </Chip>
            ))}
          </div>
        </Feld>

        <Feld label="Flüssigkeitsaufnahme">
          <div className="flex flex-wrap gap-2">
            {(['wenig', 'ausreichend', 'viel'] as Einheit['trinken'][]).map((t) => (
              <Chip key={t} aktiv={trinken === t} onClick={() => setTrinken(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </Feld>

        <Feld label="Notiz (optional)">
          <textarea
            value={notiz}
            onChange={(e) => setNotiz(e.target.value)}
            rows={3}
            placeholder="Zum Beispiel: Wade war beim Aufschlag ruhig."
            className="w-full resize-none rounded-xl border border-hairline bg-white px-3.5 py-3 text-[16px] text-navy-900 placeholder:text-ink-muted/70"
          />
        </Feld>
      </div>

      <div className="shrink-0 border-t border-hairline bg-paper px-4 pt-3 pb-4">
        <Button breit onClick={speichern}>
          Einheit speichern
        </Button>
      </div>
    </div>
  )
}

function Feld({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-[17px] font-semibold text-navy-900">{label}</h2>
      {children}
    </section>
  )
}

function Zeile({ label, wert }: { label: string; wert: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="text-[15px] text-ink-muted">{label}</span>
      <span className="text-right text-[15px] text-navy-900">{wert}</span>
    </div>
  )
}
