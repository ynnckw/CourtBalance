import { useApp } from '../lib/store'
import { HINWEIS } from '../lib/mockData'
import { Button } from '../components/ui'

export default function VariantGate() {
  const { dispatch } = useApp()

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-navy-950 text-white cb-scroll">
      <div aria-hidden className="cb-court-lines pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-court-600/40 blur-3xl"
      />

      <div className="relative flex flex-1 flex-col justify-between px-6 py-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-[13px] tracking-wide text-lime-accent">
            <span className="h-2 w-2 rounded-full bg-lime-accent" />
            Nur für den Usability-Test
          </span>
          <h1 className="mt-6 font-display text-[34px] leading-[1.1] font-bold">
            CourtBalance
            <br />
            Prototypentest
          </h1>
          <p className="mt-4 max-w-[300px] text-[17px] text-white/70">
            Bitte wähle die dir zugewiesene Variante.
          </p>
        </div>

        <div className="my-10 space-y-3">
          <VariantenKarte
            titel="Variante A starten"
            beschreibung="Ampelsystem im Mittelpunkt, Handlungsempfehlung zuerst."
            onClick={() => dispatch({ type: 'variante', wert: 'A' })}
          />
          <VariantenKarte
            titel="Variante B starten"
            beschreibung="Tageswert 0 bis 100 mit Verlauf und Faktoren zuerst."
            onClick={() => dispatch({ type: 'variante', wert: 'B' })}
          />
        </div>

        <div className="space-y-4">
          <p className="text-[14px] leading-snug text-white/55">
            Beide Varianten nutzen dieselben Daten und Funktionen. Sie unterscheiden sich nur in der
            Darstellung des Heute-Dashboards.
          </p>
          <p className="text-[13px] leading-snug text-white/45">{HINWEIS}</p>
        </div>
      </div>
    </div>
  )
}

function VariantenKarte({
  titel,
  beschreibung,
  onClick,
}: {
  titel: string
  beschreibung: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-[18px] border border-white/15 bg-white/5 p-5 text-left transition-colors hover:border-lime-accent/60 hover:bg-white/10 active:bg-white/15"
    >
      <p className="font-display text-[19px] font-semibold text-white">{titel}</p>
      <p className="mt-1 text-[15px] text-white/60">{beschreibung}</p>
    </button>
  )
}

export function VariantenWechselButton() {
  const { dispatch } = useApp()
  return (
    <Button variante="sekundaer" breit onClick={() => dispatch({ type: 'variante', wert: null })}>
      Zur Variantenwahl zurück
    </Button>
  )
}
