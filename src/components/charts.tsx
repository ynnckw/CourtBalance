import { useState, type PointerEvent } from 'react'

const W = 320
const PAD_L = 4
const PAD_R = 4

export interface Serie {
  id: string
  label: string
  farbe: string
  werte: number[]
  flaeche?: boolean
}

function pfad(werte: number[], hoehe: number, max: number, min: number) {
  const n = werte.length
  const spanne = Math.max(1, max - min)
  const breite = W - PAD_L - PAD_R
  return werte
    .map((w, i) => {
      const x = PAD_L + (n === 1 ? breite / 2 : (i / (n - 1)) * breite)
      const y = hoehe - 8 - ((w - min) / spanne) * (hoehe - 20)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function punkt(i: number, wert: number, n: number, hoehe: number, max: number, min: number) {
  const spanne = Math.max(1, max - min)
  const breite = W - PAD_L - PAD_R
  return {
    x: PAD_L + (n === 1 ? breite / 2 : (i / (n - 1)) * breite),
    y: hoehe - 8 - ((wert - min) / spanne) * (hoehe - 20),
  }
}

/** Linien-/Flächendiagramm mit Crosshair und Tooltip. Eine Achse, keine zweite Skala. */
export function Verlaufsdiagramm({
  serien,
  labels,
  hoehe = 132,
  einheit = '',
  max,
  min = 0,
}: {
  serien: Serie[]
  labels: string[]
  hoehe?: number
  einheit?: string
  max?: number
  min?: number
}) {
  const [aktiv, setAktiv] = useState<number | null>(null)
  const n = serien[0]?.werte.length ?? 0
  const alleWerte = serien.flatMap((s) => s.werte)
  const oben = max ?? Math.max(...alleWerte, 1) * 1.08
  const unten = min

  const bewegen = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const rel = (e.clientX - rect.left) / rect.width
    const i = Math.round(rel * (n - 1))
    setAktiv(Math.max(0, Math.min(n - 1, i)))
  }

  const aktivX = aktiv === null ? 0 : punkt(aktiv, 0, n, hoehe, oben, unten).x

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${hoehe}`}
        className="w-full touch-none"
        style={{ height: hoehe }}
        onPointerMove={bewegen}
        onPointerLeave={() => setAktiv(null)}
        role="img"
        aria-label={`Diagramm: ${serien.map((s) => s.label).join(' und ')}`}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PAD_L}
            x2={W - PAD_R}
            y1={hoehe - 8 - f * (hoehe - 20)}
            y2={hoehe - 8 - f * (hoehe - 20)}
            stroke="#d9dfd9"
            strokeWidth="1"
          />
        ))}
        {serien.map((s) =>
          s.flaeche ? (
            <path
              key={`f-${s.id}`}
              d={`${pfad(s.werte, hoehe, oben, unten)} L${W - PAD_R},${hoehe - 8} L${PAD_L},${hoehe - 8} Z`}
              fill={s.farbe}
              opacity="0.12"
            />
          ) : null,
        )}
        {serien.map((s) => (
          <path
            key={s.id}
            d={pfad(s.werte, hoehe, oben, unten)}
            fill="none"
            stroke={s.farbe}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {aktiv !== null && (
          <>
            <line x1={aktivX} x2={aktivX} y1={6} y2={hoehe - 8} stroke="#0e1c2b" strokeWidth="1" opacity="0.35" />
            {serien.map((s) => {
              const p = punkt(aktiv, s.werte[aktiv], n, hoehe, oben, unten)
              return (
                <circle
                  key={`p-${s.id}`}
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill={s.farbe}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )
            })}
          </>
        )}
      </svg>
      {aktiv !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 min-w-[132px] rounded-lg border border-hairline bg-white px-3 py-2 text-[13px] shadow-md"
          style={{
            left: `${Math.min(70, Math.max(0, (aktivX / W) * 100))}%`,
          }}
        >
          <p className="mb-1 font-medium text-navy-900">{labels[aktiv]}</p>
          {serien.map((s) => (
            <p key={s.id} className="flex items-center gap-1.5 text-ink-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: s.farbe }} />
              {s.label}
              <span className="ml-auto font-mono text-navy-900">
                {Math.round(s.werte[aktiv] * 10) / 10}
                {einheit}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export function Legende({ serien }: { serien: Serie[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink-muted">
      {serien.map((s) => (
        <span key={s.id} className="inline-flex items-center gap-1.5">
          <span className="h-[3px] w-4 rounded-full" style={{ background: s.farbe }} />
          {s.label}
        </span>
      ))}
    </div>
  )
}

/** Balkendiagramm mit einer Serie und Hover-Tooltip. */
export function Balkendiagramm({
  werte,
  labels,
  farbe = 'var(--color-chart-load)',
  hoehe = 110,
  einheit = '',
  hervorheben,
}: {
  werte: number[]
  labels: string[]
  farbe?: string
  hoehe?: number
  einheit?: string
  hervorheben?: (i: number) => boolean
}) {
  const [aktiv, setAktiv] = useState<number | null>(null)
  const max = Math.max(...werte, 1)
  return (
    <div className="relative">
      <div className="flex items-end gap-[2px]" style={{ height: hoehe }}>
        {werte.map((w, i) => (
          <button
            key={i}
            type="button"
            onPointerEnter={() => setAktiv(i)}
            onPointerLeave={() => setAktiv(null)}
            onClick={() => setAktiv(aktiv === i ? null : i)}
            aria-label={`${labels[i]}: ${w}${einheit}`}
            className="flex h-full flex-1 items-end"
          >
            <span
              className="w-full rounded-t-[4px] transition-opacity"
              style={{
                height: `${Math.max(3, (w / max) * 100)}%`,
                background: hervorheben?.(i) ? 'var(--color-status-amber)' : farbe,
                opacity: aktiv === null || aktiv === i ? 1 : 0.45,
              }}
            />
          </button>
        ))}
      </div>
      {aktiv !== null && (
        <div className="mt-2 rounded-lg border border-hairline bg-white px-3 py-1.5 text-[13px] text-ink-muted">
          <span className="font-medium text-navy-900">{labels[aktiv]}</span>
          <span className="ml-2 font-mono text-navy-900">
            {werte[aktiv]}
            {einheit}
          </span>
        </div>
      )}
    </div>
  )
}

/** Kompakte Miniaturlinie ohne Interaktion, für das Dashboard. */
export function Sparkline({ werte, farbe = 'var(--color-chart-load)' }: { werte: number[]; farbe?: string }) {
  const max = Math.max(...werte)
  const min = Math.min(...werte)
  return (
    <svg viewBox={`0 0 ${W} 44`} className="h-11 w-full" aria-hidden>
      <path
        d={`${pfad(werte, 44, max + 4, Math.max(0, min - 4))} L${W - PAD_R},44 L${PAD_L},44 Z`}
        fill={farbe}
        opacity="0.14"
      />
      <path d={pfad(werte, 44, max + 4, Math.max(0, min - 4))} fill="none" stroke={farbe} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
