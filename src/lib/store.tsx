import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import {
  HEUTE,
  START_BENACHRICHTIGUNGEN,
  START_CHECKIN,
  START_DATENQUELLEN,
  START_EINHEITEN,
  START_PLAN,
  START_VERLAUF,
} from './mockData'
import { computeStatus } from './scoring'
import type { CheckIn, Einheit, PlanEvent, Status, VerlaufTag, Variant } from './types'

export type TabId = 'heute' | 'plan' | 'checkin' | 'verlauf' | 'profil'

export type Overlay =
  | { name: 'checkin' }
  | { name: 'empfehlungen' }
  | { name: 'vorbereitung'; eventId: string }
  | { name: 'training'; eventId: string }
  | { name: 'nachbereitung'; eventId: string }
  | { name: 'muster' }

interface State {
  variante: Variant | null
  tab: TabId
  overlays: Overlay[]
  checkIn: CheckIn
  checkInErledigt: boolean
  plan: PlanEvent[]
  gewaehlteOptionId: string | null
  einheiten: Einheit[]
  verlauf: VerlaufTag[]
  benachrichtigungen: typeof START_BENACHRICHTIGUNGEN
  datenquellen: typeof START_DATENQUELLEN
  toast: string | null
  toastKey: number
}

type Action =
  | { type: 'variante'; wert: Variant | null }
  | { type: 'tab'; wert: TabId }
  | { type: 'overlay/push'; wert: Overlay }
  | { type: 'overlay/pop' }
  | { type: 'overlay/replace'; wert: Overlay }
  | { type: 'overlay/clear' }
  | { type: 'checkin/speichern'; wert: CheckIn }
  | { type: 'plan/hinzufuegen'; wert: PlanEvent }
  | { type: 'plan/aendern'; id: string; wert: Partial<PlanEvent> }
  | { type: 'plan/entfernen'; id: string }
  | { type: 'option/waehlen'; id: string | null }
  | { type: 'einheit/speichern'; einheit: Einheit; belastung: number; regeneration: number }
  | { type: 'benachrichtigung'; schluessel: keyof typeof START_BENACHRICHTIGUNGEN }
  | { type: 'datenquelle'; schluessel: keyof typeof START_DATENQUELLEN }
  | { type: 'toast'; wert: string | null }
  | { type: 'reset' }

function startZustand(): State {
  return {
    variante: null,
    tab: 'heute',
    overlays: [],
    checkIn: { ...START_CHECKIN, regionen: [...START_CHECKIN.regionen], kontext: [...START_CHECKIN.kontext] },
    checkInErledigt: false,
    plan: START_PLAN.map((e) => ({ ...e })),
    gewaehlteOptionId: null,
    einheiten: START_EINHEITEN.map((e) => ({ ...e })),
    verlauf: START_VERLAUF.map((t) => ({ ...t })),
    benachrichtigungen: { ...START_BENACHRICHTIGUNGEN },
    datenquellen: { ...START_DATENQUELLEN },
    toast: null,
    toastKey: 0,
  }
}

function mitToast(state: State, text: string): State {
  return { ...state, toast: text, toastKey: state.toastKey + 1 }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'variante':
      return { ...state, variante: action.wert, tab: 'heute', overlays: [] }
    case 'tab':
      return { ...state, tab: action.wert, overlays: [] }
    case 'overlay/push':
      return { ...state, overlays: [...state.overlays, action.wert] }
    case 'overlay/pop':
      return { ...state, overlays: state.overlays.slice(0, -1) }
    case 'overlay/replace':
      return { ...state, overlays: [...state.overlays.slice(0, -1), action.wert] }
    case 'overlay/clear':
      return { ...state, overlays: [] }
    case 'checkin/speichern':
      return { ...state, checkIn: action.wert, checkInErledigt: true }
    case 'plan/hinzufuegen':
      return { ...state, plan: [...state.plan, action.wert] }
    case 'plan/aendern':
      return {
        ...state,
        plan: state.plan.map((e) => (e.id === action.id ? { ...e, ...action.wert } : e)),
      }
    case 'plan/entfernen':
      return { ...state, plan: state.plan.filter((e) => e.id !== action.id) }
    case 'option/waehlen':
      return { ...state, gewaehlteOptionId: action.id }
    case 'einheit/speichern': {
      const verlauf = state.verlauf.map((t) =>
        t.offset === 0
          ? { ...t, belastung: action.belastung, regeneration: action.regeneration, trainiert: true }
          : t,
      )
      return { ...state, einheiten: [...state.einheiten, action.einheit], verlauf }
    }
    case 'benachrichtigung':
      return {
        ...state,
        benachrichtigungen: {
          ...state.benachrichtigungen,
          [action.schluessel]: !state.benachrichtigungen[action.schluessel],
        },
      }
    case 'datenquelle':
      return {
        ...state,
        datenquellen: { ...state.datenquellen, [action.schluessel]: !state.datenquellen[action.schluessel] },
      }
    case 'toast':
      return action.wert === null ? { ...state, toast: null } : mitToast(state, action.wert)
    case 'reset':
      return { ...startZustand(), variante: state.variante }
    default:
      return state
  }
}

interface Kontext {
  state: State
  dispatch: (a: Action) => void
  status: Status
  zeigeToast: (text: string) => void
  oeffne: (o: Overlay) => void
  zurueck: () => void
}

const AppContext = createContext<Kontext | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, startZustand)

  const status = useMemo(
    () =>
      computeStatus(state.checkIn, {
        plan: state.plan,
        temperatur: HEUTE.temperatur,
        wettkampfInTagen: state.plan.some((e) => e.art === 'wettkampf') ? HEUTE.wettkampfInTagen : null,
      }),
    [state.checkIn, state.plan],
  )

  const wert = useMemo<Kontext>(
    () => ({
      state,
      dispatch,
      status,
      zeigeToast: (text: string) => dispatch({ type: 'toast', wert: text }),
      oeffne: (o: Overlay) => dispatch({ type: 'overlay/push', wert: o }),
      zurueck: () => dispatch({ type: 'overlay/pop' }),
    }),
    [state, status],
  )

  return <AppContext.Provider value={wert}>{children}</AppContext.Provider>
}

export function useApp(): Kontext {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp muss innerhalb von AppProvider verwendet werden')
  return ctx
}
