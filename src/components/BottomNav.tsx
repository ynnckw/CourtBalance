import { CalendarDays, ClipboardCheck, Home, LineChart, User } from 'lucide-react'
import { useApp, type TabId } from '../lib/store'
import { cx } from './ui'

const EINTRAEGE: Array<{ id: TabId; label: string; Icon: typeof Home }> = [
  { id: 'heute', label: 'Heute', Icon: Home },
  { id: 'plan', label: 'Plan', Icon: CalendarDays },
  { id: 'checkin', label: 'Check-in', Icon: ClipboardCheck },
  { id: 'verlauf', label: 'Verlauf', Icon: LineChart },
  { id: 'profil', label: 'Profil', Icon: User },
]

export default function BottomNav() {
  const { state, dispatch, oeffne } = useApp()

  return (
    <nav
      aria-label="Hauptnavigation"
      className="relative z-30 shrink-0 border-t border-hairline bg-white/95 px-2 pt-2 pb-3 backdrop-blur"
    >
      <ul className="flex items-end justify-between">
        {EINTRAEGE.map(({ id, label, Icon }) => {
          const aktiv = state.tab === id
          if (id === 'checkin') {
            return (
              <li key={id} className="flex-1">
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'tab', wert: 'heute' })
                    oeffne({ name: 'checkin' })
                  }}
                  className="mx-auto -mt-6 flex w-full flex-col items-center gap-1"
                >
                  <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-navy-900 text-lime-accent shadow-[0_6px_16px_rgba(14,28,43,0.28)] transition-transform hover:-translate-y-0.5 active:translate-y-0">
                    <Icon size={24} strokeWidth={2} />
                  </span>
                  <span className="text-[12px] font-semibold text-navy-900">{label}</span>
                </button>
              </li>
            )
          }
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => dispatch({ type: 'tab', wert: id })}
                aria-current={aktiv ? 'page' : undefined}
                className={cx(
                  'flex min-h-12 w-full flex-col items-center gap-1 rounded-xl py-1 transition-colors',
                  aktiv ? 'text-navy-900' : 'text-ink-muted hover:text-navy-800',
                )}
              >
                <Icon size={22} strokeWidth={aktiv ? 2.4 : 1.8} />
                <span className={cx('text-[12px]', aktiv ? 'font-semibold' : 'font-normal')}>{label}</span>
                <span
                  aria-hidden
                  className={cx('h-[3px] w-6 rounded-full', aktiv ? 'bg-lime-accent' : 'bg-transparent')}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
