import { useState } from 'react'
import { BellOff, CalendarDays, RotateCcw, Shield, Watch, Wind } from 'lucide-react'
import { useApp } from '../lib/store'
import { HINWEIS, PERSONA } from '../lib/mockData'
import { Button, Card, MedizinHinweis, Schalter, SectionTitle, Sheet } from '../components/ui'

const BENACHRICHTIGUNGEN: Array<{ id: 'vorbereitung' | 'nachbereitung' | 'wochenuebersicht' | 'regeneration'; label: string; text: string }> = [
  { id: 'vorbereitung', label: 'Trainingsvorbereitung', text: 'Hinweis vor einer geplanten Einheit' },
  { id: 'nachbereitung', label: 'Trainingsnachbereitung', text: 'Erinnerung zur kurzen Dokumentation' },
  { id: 'wochenuebersicht', label: 'Wochenübersicht', text: 'Zusammenfassung am Sonntagabend' },
  { id: 'regeneration', label: 'Regenerationserinnerung', text: 'Hinweis auf Mobility und Erholung' },
]

export default function Profile() {
  const { state, dispatch, zeigeToast } = useApp()
  const [datenschutz, setDatenschutz] = useState(false)
  const [reset, setReset] = useState(false)

  return (
    <div className="flex h-full flex-col bg-paper">
      <header className="shrink-0 bg-navy-900 px-4 pt-6 pb-6 text-white">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 font-display text-[22px] font-bold text-lime-accent">
            {PERSONA.name.charAt(0)}
          </span>
          <div>
            <h1 className="font-display text-[22px] font-bold">
              {PERSONA.name}, {PERSONA.alter}
            </h1>
            <p className="text-[15px] text-white/65">
              {PERSONA.lk} · {PERSONA.rolle}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 pt-4 pb-8 cb-scroll">
        <section>
          <SectionTitle>Profil</SectionTitle>
          <Card className="divide-y divide-hairline">
            <Zeile label="Beruf" wert={PERSONA.beruf} />
            <Zeile label="Trainingsziele" wert={PERSONA.ziele.join(' · ')} />
            <Zeile label="Bevorzugte Trainingsarten" wert={PERSONA.trainingsarten.join(' · ')} />
            <Zeile label="Rolle im Verein" wert="Erste Herrenmannschaft und Jugendtrainer" />
          </Card>
        </section>

        <section>
          <SectionTitle>Datenquellen</SectionTitle>
          <Card className="divide-y divide-hairline">
            <SchalterZeile
              icon={<CalendarDays size={18} />}
              label="Kalender"
              text="Berufliche und private Termine übernehmen"
              an={state.datenquellen.kalender}
              onChange={() => dispatch({ type: 'datenquelle', schluessel: 'kalender' })}
            />
            <SchalterZeile
              icon={<Watch size={18} />}
              label="Wearable (Demo-Verbindung)"
              text="Keine echte Kopplung, nur für den Prototypen"
              an={state.datenquellen.wearable}
              onChange={() => dispatch({ type: 'datenquelle', schluessel: 'wearable' })}
            />
            <SchalterZeile
              icon={<Wind size={18} />}
              label="Wetterdaten"
              text="Temperatur für Trinkpausen und Aufwärmen"
              an={state.datenquellen.wetter}
              onChange={() => dispatch({ type: 'datenquelle', schluessel: 'wetter' })}
            />
          </Card>
        </section>

        <section>
          <SectionTitle>Benachrichtigungen</SectionTitle>
          <Card className="divide-y divide-hairline">
            {BENACHRICHTIGUNGEN.map((b) => (
              <SchalterZeile
                key={b.id}
                label={b.label}
                text={b.text}
                an={state.benachrichtigungen[b.id]}
                onChange={() => dispatch({ type: 'benachrichtigung', schluessel: b.id })}
              />
            ))}
            <SchalterZeile
              icon={<BellOff size={18} />}
              label="Stille während Training und Wettkampf"
              text="Standardmäßig aktiv"
              an={state.benachrichtigungen.stilleWaehrendBelastung}
              onChange={() => dispatch({ type: 'benachrichtigung', schluessel: 'stilleWaehrendBelastung' })}
            />
          </Card>
          <Card className="mt-3 border-court-500/40 bg-court-100/60 p-4">
            <p className="text-[16px] leading-relaxed font-medium text-court-700">
              CourtBalance unterbricht dich während Training und Wettkampf nicht.
            </p>
          </Card>
        </section>

        <section>
          <SectionTitle>Datenschutz</SectionTitle>
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <Shield size={18} className="mt-0.5 shrink-0 text-navy-700" />
              <p className="text-[15px] leading-relaxed text-navy-800">
                Alle Angaben in diesem Prototyp sind Demo-Daten und bleiben nur in der aktuellen Sitzung
                erhalten.
              </p>
            </div>
            <div className="mt-3">
              <Button breit variante="sekundaer" klein onClick={() => setDatenschutz(true)}>
                Datenschutzhinweise lesen
              </Button>
            </div>
          </Card>
        </section>

        <section className="space-y-2.5">
          <SectionTitle>Test und Demo</SectionTitle>
          <Card className="p-4">
            <p className="text-[15px] text-ink-muted">
              Aktive Testvariante:{' '}
              <span className="font-medium text-navy-900">Variante {state.variante ?? 'A'}</span>
            </p>
            <div className="mt-3 space-y-2.5">
              <Button breit variante="sekundaer" onClick={() => dispatch({ type: 'variante', wert: null })}>
                Testvariante wechseln
              </Button>
              <Button
                breit
                variante="gefahr"
                icon={<RotateCcw size={17} />}
                onClick={() => setReset(true)}
              >
                Demo zurücksetzen
              </Button>
            </div>
          </Card>
        </section>

        <MedizinHinweis text={HINWEIS} />
      </div>

      <Sheet offen={datenschutz} onClose={() => setDatenschutz(false)} titel="Datenschutzhinweise">
        <div className="space-y-3 text-[16px] leading-relaxed text-navy-800">
          <p>
            CourtBalance ist ein Prototyp für einen Usability-Test. Es werden keine echten personenbezogenen
            Daten verarbeitet, gespeichert oder übertragen.
          </p>
          <p>
            Alle Eingaben verbleiben in der aktuellen Sitzung deines Browsers und gehen beim Zurücksetzen der
            Demo oder beim Schließen verloren.
          </p>
          <p>Es besteht keine Verbindung zu Kalendern, Wearables oder externen Diensten.</p>
          <Button breit variante="sekundaer" onClick={() => setDatenschutz(false)}>
            Schließen
          </Button>
        </div>
      </Sheet>

      <Sheet offen={reset} onClose={() => setReset(false)} titel="Demo zurücksetzen">
        <div className="space-y-4">
          <p className="text-[16px] leading-relaxed text-navy-800">
            Alle Eingaben, der Wochenplan, dokumentierte Einheiten und der Verlauf werden auf den
            Ausgangszustand zurückgesetzt. Die gewählte Testvariante bleibt erhalten.
          </p>
          <Button
            breit
            onClick={() => {
              dispatch({ type: 'reset' })
              setReset(false)
              zeigeToast('Demo wurde auf den Ausgangszustand zurückgesetzt.')
            }}
          >
            Jetzt zurücksetzen
          </Button>
          <Button breit variante="sekundaer" onClick={() => setReset(false)}>
            Abbrechen
          </Button>
        </div>
      </Sheet>
    </div>
  )
}

function Zeile({ label, wert }: { label: string; wert: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[14px] text-ink-muted">{label}</p>
      <p className="mt-0.5 text-[16px] text-navy-900">{wert}</p>
    </div>
  )
}

function SchalterZeile({
  icon,
  label,
  text,
  an,
  onChange,
}: {
  icon?: React.ReactNode
  label: string
  text: string
  an: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper text-navy-700">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[16px] text-navy-900">{label}</p>
        <p className="text-[14px] text-ink-muted">{text}</p>
      </div>
      <Schalter an={an} onChange={onChange} label={label} />
    </div>
  )
}
