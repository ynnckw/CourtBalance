import { AppProvider, useApp, type Overlay } from './lib/store'
import BottomNav from './components/BottomNav'
import { Toast } from './components/ui'
import VariantGate from './screens/VariantGate'
import Today from './screens/Today'
import PlanScreen from './screens/PlanScreen'
import History, { MusterDetail } from './screens/History'
import Profile from './screens/Profile'
import CheckIn from './screens/CheckIn'
import Recommendations from './screens/Recommendations'
import { TrainingDebrief, TrainingPrep, TrainingSession } from './screens/Training'

export default function App() {
  return (
    <AppProvider>
      <Rahmen />
    </AppProvider>
  )
}

function Rahmen() {
  const { state } = useApp()
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-navy-950 p-0 sm:p-6">
      <div className="relative flex h-[100dvh] w-full max-w-[393px] flex-col overflow-hidden bg-paper sm:h-[852px] sm:max-h-[calc(100dvh-48px)] sm:rounded-[28px] sm:shadow-2xl">
        {state.variante === null ? <VariantGate /> : <AppInhalt />}
      </div>
    </div>
  )
}

function AppInhalt() {
  const { state, dispatch } = useApp()
  const overlay = state.overlays[state.overlays.length - 1] ?? null

  return (
    <>
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0">{tabInhalt(state.tab)}</div>
        {overlay && (
          <div className="cb-rise absolute inset-0 z-20 bg-paper">{overlayInhalt(overlay)}</div>
        )}
      </div>

      <BottomNav />

      <Toast
        text={state.toast}
        keyId={state.toastKey}
        onEnde={() => dispatch({ type: 'toast', wert: null })}
      />
    </>
  )
}

function tabInhalt(tab: string) {
  switch (tab) {
    case 'plan':
      return <PlanScreen />
    case 'verlauf':
      return <History />
    case 'profil':
      return <Profile />
    default:
      return <Today />
  }
}

function overlayInhalt(overlay: Overlay) {
  switch (overlay.name) {
    case 'checkin':
      return <CheckIn />
    case 'empfehlungen':
      return <Recommendations />
    case 'vorbereitung':
      return <TrainingPrep eventId={overlay.eventId} />
    case 'training':
      return <TrainingSession eventId={overlay.eventId} />
    case 'nachbereitung':
      return <TrainingDebrief eventId={overlay.eventId} />
    case 'muster':
      return <MusterDetail />
    default:
      return null
  }
}
