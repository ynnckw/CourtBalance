import { useEffect, type ReactNode } from 'react'
import { AlertTriangle, Check, CircleCheck, Info, X } from 'lucide-react'
import type { Ampel, Intensitaet } from '../lib/types'

export function cx(...teile: Array<string | false | null | undefined>) {
  return teile.filter(Boolean).join(' ')
}

/* ---------- Button ---------- */

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variante?: 'primaer' | 'sekundaer' | 'geist' | 'gefahr'
  breit?: boolean
  disabled?: boolean
  icon?: ReactNode
  klein?: boolean
}

export function Button({
  children,
  onClick,
  variante = 'primaer',
  breit,
  disabled,
  icon,
  klein,
}: ButtonProps) {
  const basis =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 select-none disabled:opacity-45 disabled:cursor-not-allowed'
  const groesse = klein ? 'min-h-11 px-3 text-[15px]' : 'min-h-12 px-5 text-[16px]'
  const stile: Record<string, string> = {
    primaer: 'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950',
    sekundaer: 'bg-white text-navy-900 border border-hairline hover:bg-paper-2 active:bg-paper-2',
    geist: 'bg-transparent text-navy-700 hover:bg-black/5 active:bg-black/10',
    gefahr: 'bg-white text-status-red border border-status-red/40 hover:bg-status-red-bg',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(basis, groesse, stile[variante], breit && 'w-full')}
    >
      {icon}
      {children}
    </button>
  )
}

/* ---------- Karte ---------- */

export function Card({
  children,
  className,
  onClick,
  ariaLabel,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  ariaLabel?: string
}) {
  const basis = 'rounded-[16px] bg-white border border-hairline shadow-[0_1px_2px_rgba(14,28,43,0.05)]'
  if (onClick) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className={cx(basis, 'w-full text-left transition-colors hover:bg-paper-2/60 active:bg-paper-2', className)}
      >
        {children}
      </button>
    )
  }
  return <div className={cx(basis, className)}>{children}</div>
}

export function SectionTitle({ children, aktion }: { children: ReactNode; aktion?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="font-display text-[13px] font-semibold tracking-[0.14em] text-ink-muted uppercase">
        {children}
      </h2>
      {aktion}
    </div>
  )
}

/* ---------- Chip ---------- */

export function Chip({
  children,
  aktiv,
  onClick,
  icon,
}: {
  children: ReactNode
  aktiv?: boolean
  onClick?: () => void
  icon?: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktiv}
      className={cx(
        'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[15px] transition-colors',
        aktiv
          ? 'border-navy-900 bg-navy-900 text-white'
          : 'border-hairline bg-white text-navy-800 hover:bg-paper-2',
      )}
    >
      {aktiv ? <Check size={16} strokeWidth={2.5} /> : icon}
      {children}
    </button>
  )
}

/* ---------- Skala 1–5 ---------- */

export function Skala({
  wert,
  onChange,
  min = 1,
  max = 5,
  legendeMin,
  legendeMax,
}: {
  wert: number
  onChange: (w: number) => void
  min?: number
  max?: number
  legendeMin?: string
  legendeMax?: string
}) {
  const werte = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  return (
    <div>
      <div className="flex gap-2">
        {werte.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => onChange(w)}
            aria-pressed={wert === w}
            className={cx(
              'flex h-12 flex-1 items-center justify-center rounded-xl border font-mono text-[17px] transition-colors',
              wert === w
                ? 'border-navy-900 bg-navy-900 text-lime-accent'
                : 'border-hairline bg-white text-navy-700 hover:bg-paper-2',
            )}
          >
            {w}
          </button>
        ))}
      </div>
      {(legendeMin || legendeMax) && (
        <div className="mt-2 flex justify-between text-[13px] text-ink-muted">
          <span>{legendeMin}</span>
          <span>{legendeMax}</span>
        </div>
      )}
    </div>
  )
}

/* ---------- Statusdarstellung ---------- */

export const AMPEL_TEXT: Record<Ampel, string> = {
  gruen: 'Grün',
  gelb: 'Gelb',
  rot: 'Rot',
}

export const AMPEL_STIL: Record<Ampel, { bg: string; text: string; rand: string }> = {
  gruen: { bg: 'bg-status-green-bg', text: 'text-status-green', rand: 'border-status-green/30' },
  gelb: { bg: 'bg-status-amber-bg', text: 'text-status-amber', rand: 'border-status-amber/30' },
  rot: { bg: 'bg-status-red-bg', text: 'text-status-red', rand: 'border-status-red/30' },
}

export function AmpelIcon({ ampel, size = 18 }: { ampel: Ampel; size?: number }) {
  if (ampel === 'gruen') return <CircleCheck size={size} strokeWidth={2.2} />
  if (ampel === 'gelb') return <Info size={size} strokeWidth={2.2} />
  return <AlertTriangle size={size} strokeWidth={2.2} />
}

export function StatusBadge({ ampel, text }: { ampel: Ampel; text: string }) {
  const stil = AMPEL_STIL[ampel]
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[14px] font-medium',
        stil.bg,
        stil.text,
        stil.rand,
      )}
    >
      <AmpelIcon ampel={ampel} size={15} />
      {text}
    </span>
  )
}

const BELASTUNG_STIL: Record<Intensitaet, string> = {
  niedrig: 'bg-status-green-bg text-status-green border-status-green/25',
  mittel: 'bg-status-amber-bg text-status-amber border-status-amber/25',
  hoch: 'bg-status-red-bg text-status-red border-status-red/25',
}

export function BelastungBadge({ stufe, praefix }: { stufe: Intensitaet; praefix?: string }) {
  const balken = stufe === 'niedrig' ? 1 : stufe === 'mittel' ? 2 : 3
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] font-medium',
        BELASTUNG_STIL[stufe],
      )}
    >
      <span aria-hidden className="flex items-end gap-[2px]">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cx('w-[3px] rounded-sm', i <= balken ? 'bg-current' : 'bg-current/25')}
            style={{ height: 4 + i * 3 }}
          />
        ))}
      </span>
      {praefix ? `${praefix} ${stufe}` : stufe}
    </span>
  )
}

/* ---------- Fortschritt ---------- */

export function Fortschritt({ schritt, gesamt }: { schritt: number; gesamt: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Schritt ${schritt} von ${gesamt}`}>
      {Array.from({ length: gesamt }, (_, i) => (
        <span
          key={i}
          className={cx(
            'h-1.5 flex-1 rounded-full transition-colors',
            i < schritt ? 'bg-navy-900' : 'bg-hairline',
          )}
        />
      ))}
    </div>
  )
}

/* ---------- Schalter ---------- */

export function Schalter({
  an,
  onChange,
  label,
}: {
  an: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={an}
      aria-label={label}
      onClick={onChange}
      className="flex min-h-11 min-w-11 items-center justify-end"
    >
      <span
        className={cx(
          'relative flex h-7 w-12 items-center rounded-full border transition-colors',
          an ? 'border-court-600 bg-court-600' : 'border-hairline bg-paper-2',
        )}
      >
        <span
          className={cx(
            'absolute flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-all',
            an ? 'left-6' : 'left-1',
          )}
        >
          {an && <Check size={12} strokeWidth={3} className="text-court-600" />}
        </span>
      </span>
    </button>
  )
}

/* ---------- Bottom Sheet ---------- */

export function Sheet({
  offen,
  onClose,
  titel,
  children,
}: {
  offen: boolean
  onClose: () => void
  titel: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!offen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [offen, onClose])

  if (!offen) return null
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Schließen"
        onClick={onClose}
        className="absolute inset-0 bg-navy-950/45"
      />
      <div className="cb-rise relative max-h-[78%] overflow-y-auto rounded-t-[22px] border-t border-hairline bg-paper cb-scroll">
        <div className="sticky top-0 flex items-start justify-between gap-3 bg-paper px-5 pt-4 pb-3">
          <h3 className="font-display text-[19px] leading-tight font-semibold text-navy-900">{titel}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="-mt-1 -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-black/5"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 pb-8">{children}</div>
      </div>
    </div>
  )
}

/* ---------- Toast ---------- */

export function Toast({ text, keyId, onEnde }: { text: string | null; keyId: number; onEnde: () => void }) {
  useEffect(() => {
    if (!text) return
    const t = setTimeout(onEnde, 3200)
    return () => clearTimeout(t)
  }, [text, keyId, onEnde])

  if (!text) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[92px] z-50 flex justify-center px-4">
      <div
        key={keyId}
        style={{ animation: 'cb-toast-in 220ms ease-out both' }}
        className="flex items-center gap-2.5 rounded-xl bg-navy-900 px-4 py-3 text-[15px] text-white shadow-lg"
      >
        <CircleCheck size={18} className="shrink-0 text-lime-accent" />
        <span>{text}</span>
      </div>
    </div>
  )
}

/* ---------- Hinweiszeile ---------- */

export function MedizinHinweis({ text }: { text: string }) {
  return (
    <p className="flex gap-2 px-1 text-[13px] leading-snug text-ink-muted">
      <Info size={15} className="mt-[2px] shrink-0" />
      <span>{text}</span>
    </p>
  )
}

/* ---------- Overlay-Kopf ---------- */

export function OverlayKopf({
  titel,
  unterzeile,
  onZurueck,
  rechts,
}: {
  titel: string
  unterzeile?: string
  onZurueck: () => void
  rechts?: ReactNode
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-hairline bg-paper/95 px-3 py-2 backdrop-blur">
      <button
        type="button"
        onClick={onZurueck}
        aria-label="Zurück"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-navy-800 hover:bg-black/5"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M12.5 16 6.5 10l6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[17px] font-semibold text-navy-900">{titel}</p>
        {unterzeile && <p className="truncate text-[13px] text-ink-muted">{unterzeile}</p>}
      </div>
      {rechts}
    </div>
  )
}
