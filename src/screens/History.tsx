import { useMemo, useState } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import { useApp } from '../lib/store'
import { HINWEIS } from '../lib/mockData'
import { Button, Card, MedizinHinweis, OverlayKopf, SectionTitle, cx } from '../components/ui'
import { Balkendiagramm, Legende, Verlaufsdiagramm, type Serie } from '../components/charts'

const ZEITRAEUME = [
  { id: '7', label: '7 Tage', tage: 7 },
  { id: '28', label: '4 Wochen', tage: 28 },
  { id: '90', label: '3 Monate', tage: 90 },
] as const

const LOAD = 'var(--color-chart-load)'
const RECOVERY = 'var(--color-chart-recovery)'

export default function History() {
  const { state, oeffne } = useApp()
  const [zeitraum, setZeitraum] = useState<(typeof ZEITRAEUME)[number]['id']>('28')
  const tage = ZEITRAEUME.find((z) => z.id === zeitraum)!.tage

  const daten = useMemo(() => state.verlauf.slice(-tage), [state.verlauf, tage])

  /** Bei langen Zeiträumen zu Wochenmitteln zusammenfassen, damit die Linie lesbar bleibt. */
  const reihe = useMemo(() => {
    if (tage <= 28) return daten.map((t, i) => ({ ...t, label: labelFuer(t.offset, i, daten.length) }))
    const wochen: Array<{ belastung: number; regeneration: number; schlafStunden: number; mental: number; beschwerden: number; trainiert: boolean; label: string }> = []
    for (let i = 0; i < daten.length; i += 7) {
      const block = daten.slice(i, i + 7)
      const mittel = (f: (t: (typeof block)[number]) => number) =>
        Math.round((block.reduce((s, t) => s + f(t), 0) / block.length) * 10) / 10
      wochen.push({
        belastung: mittel((t) => t.belastung),
        regeneration: mittel((t) => t.regeneration),
        schlafStunden: mittel((t) => t.schlafStunden),
        mental: mittel((t) => t.mental),
        beschwerden: mittel((t) => t.beschwerden),
        trainiert: block.filter((t) => t.trainiert).length > 3,
        label: `Woche ${Math.floor(i / 7) + 1}`,
      })
    }
    return wochen
  }, [daten, tage])

  const labels = reihe.map((r) => r.label)
  const belastungSerie: Serie = { id: 'belastung', label: 'Belastung', farbe: LOAD, werte: reihe.map((r) => r.belastung), flaeche: true }
  const regenerationSerie: Serie = { id: 'regeneration', label: 'Regeneration', farbe: RECOVERY, werte: reihe.map((r) => r.regeneration), flaeche: true }

  const trainings = daten.filter((t) => t.trainiert).length
  const schnittBelastung = Math.round(daten.reduce((s, t) => s + t.belastung, 0) / daten.length)
  const schnittRegeneration = Math.round(daten.reduce((s, t) => s + t.regeneration, 0) / daten.length)
  const schnittSchlaf = Math.round((daten.reduce((s, t) => s + t.schlafStunden, 0) / daten.length) * 10) / 10

  return (
    <div className="flex h-full flex-col bg-paper">
      <header className="shrink-0 bg-navy-900 px-4 pt-6 pb-5 text-white">
        <h1 className="font-display text-[24px] font-bold">Verlauf</h1>
        <p className="mt-0.5 text-[15px] text-white/60">Belastung und Erholung im Zeitverlauf</p>
        <div className="mt-4 flex gap-2" role="tablist" aria-label="Zeitraum">
          {ZEITRAEUME.map((z) => (
            <button
              key={z.id}
              type="button"
              role="tab"
              aria-selected={zeitraum === z.id}
              onClick={() => setZeitraum(z.id)}
              className={cx(
                'min-h-11 flex-1 rounded-xl px-3 text-[15px] transition-colors',
                zeitraum === z.id ? 'bg-white text-navy-900' : 'bg-white/10 text-white/75 hover:bg-white/15',
              )}
            >
              {z.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 pt-4 pb-8 cb-scroll">
        <div className="grid grid-cols-3 gap-2.5">
          <Kachel label="Ø Belastung" wert={String(schnittBelastung)} />
          <Kachel label="Ø Erholung" wert={String(schnittRegeneration)} />
          <Kachel label="Einheiten" wert={String(trainings)} />
        </div>

        <section>
          <SectionTitle>Belastung und Erholung</SectionTitle>
          <Card className="p-4">
            <Verlaufsdiagramm serien={[belastungSerie, regenerationSerie]} labels={labels} max={100} />
            <Legende serien={[belastungSerie, regenerationSerie]} />
            <p className="mt-3 border-t border-hairline pt-3 text-[15px] text-ink-muted">
              Verhältnis im Zeitraum:{' '}
              <span className="font-mono text-navy-900">
                {(schnittBelastung / Math.max(1, schnittRegeneration)).toFixed(2)}
              </span>{' '}
              Belastung je Punkt Erholung
            </p>
          </Card>
        </section>

        <section>
          <SectionTitle>Trainingshäufigkeit</SectionTitle>
          <Card className="p-4">
            <Balkendiagramm
              werte={reihe.map((r) => Math.round(r.belastung))}
              labels={labels}
              einheit=" Punkte"
              hervorheben={(i) => reihe[i].belastung > 75}
            />
            <p className="mt-3 text-[14px] text-ink-muted">
              Hervorgehoben: Tage beziehungsweise Wochen mit besonders hoher Belastung.
            </p>
          </Card>
        </section>

        <section>
          <SectionTitle>Schlafentwicklung</SectionTitle>
          <Card className="p-4">
            <Verlaufsdiagramm
              serien={[{ id: 'schlaf', label: 'Schlafdauer', farbe: RECOVERY, werte: reihe.map((r) => r.schlafStunden), flaeche: true }]}
              labels={labels}
              einheit=" h"
              min={4}
              max={10}
              hoehe={110}
            />
            <p className="mt-2 text-[15px] text-ink-muted">
              Durchschnitt: <span className="font-mono text-navy-900">{schnittSchlaf} h</span>
            </p>
          </Card>
        </section>

        <section>
          <SectionTitle>Mentale Belastung und Beschwerden</SectionTitle>
          <Card className="p-4">
            <Verlaufsdiagramm
              serien={[
                { id: 'mental', label: 'Mentale Belastung (1–5)', farbe: LOAD, werte: reihe.map((r) => r.mental) },
                { id: 'beschwerden', label: 'Beschwerden (0–3)', farbe: RECOVERY, werte: reihe.map((r) => r.beschwerden) },
              ]}
              labels={labels}
              min={0}
              max={5}
              hoehe={110}
            />
            <Legende
              serien={[
                { id: 'mental', label: 'Mentale Belastung (1–5)', farbe: LOAD, werte: [] },
                { id: 'beschwerden', label: 'Beschwerden (0–3)', farbe: RECOVERY, werte: [] },
              ]}
            />
          </Card>
        </section>

        <section>
          <SectionTitle>Beobachtetes Muster</SectionTitle>
          <Card className="border-status-amber/30 bg-status-amber-bg/60 p-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[13px] text-status-amber">
              <Search size={13} />
              Beobachtetes Muster, keine medizinische Diagnose
            </span>
            <p className="mt-3 text-[17px] leading-relaxed font-medium text-navy-900">
              In den vergangenen drei Wochen folgten hohe Belastungstage mehrfach auf kurze Nächte.
            </p>
            <p className="mt-2 text-[16px] leading-relaxed text-navy-800">
              Prüfe, ob du intensive Einheiten nach beruflich belastenden Tagen reduzieren oder verschieben
              kannst.
            </p>
            <div className="mt-4">
              <Button breit variante="sekundaer" onClick={() => oeffne({ name: 'muster' })}>
                Zugrunde liegende Einträge ansehen
              </Button>
            </div>
          </Card>
        </section>

        {state.einheiten.length > 0 && (
          <section>
            <SectionTitle>Dokumentierte Einheiten</SectionTitle>
            <Card className="divide-y divide-hairline">
              {[...state.einheiten].reverse().map((e) => (
                <div key={e.id} className="px-4 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[16px] text-navy-900">{e.art}</p>
                    <p className="font-mono text-[14px] text-ink-muted">{e.dauerMin} Min.</p>
                  </div>
                  <p className="mt-0.5 text-[14px] text-ink-muted">
                    {e.datum} · Intensität {e.rpe}/10 · {e.gefuehl} · Beschwerden {e.beschwerden}
                  </p>
                  {e.notiz && <p className="mt-1 text-[14px] text-navy-800 italic">„{e.notiz}"</p>}
                </div>
              ))}
            </Card>
          </section>
        )}

        <MedizinHinweis text={HINWEIS} />
      </div>
    </div>
  )
}

function labelFuer(offset: number, i: number, gesamt: number) {
  if (offset === 0) return 'Heute'
  if (offset === 1) return 'Gestern'
  return `vor ${offset} Tagen${i === gesamt - 1 ? '' : ''}`
}

function Kachel({ label, wert }: { label: string; wert: string }) {
  return (
    <Card className="px-3 py-3">
      <p className="text-[13px] leading-tight text-ink-muted">{label}</p>
      <p className="mt-1 font-mono text-[24px] leading-none text-navy-900">{wert}</p>
    </Card>
  )
}

/* ---------- Detailansicht zum Muster ---------- */

export function MusterDetail() {
  const { state, zurueck } = useApp()

  const treffer = useMemo(() => {
    const letzte = state.verlauf.slice(-21)
    return letzte
      .map((t, i) => ({ tag: t, vortag: letzte[i - 1] }))
      .filter((p) => p.vortag && p.vortag.schlafStunden < 6.5 && p.tag.belastung > 70)
      .slice(-8)
      .reverse()
  }, [state.verlauf])

  return (
    <div className="flex h-full flex-col bg-paper">
      <OverlayKopf
        titel="Grundlage des Musters"
        unterzeile="Letzte drei Wochen"
        onZurueck={zurueck}
      />
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pt-4 pb-8 cb-scroll">
        <Card className="p-4">
          <p className="text-[16px] leading-relaxed text-navy-800">
            CourtBalance hat Tage gesucht, an denen auf eine Nacht unter 6,5 Stunden eine Belastung über 70
            Punkten folgte. Gefunden: <span className="font-mono">{treffer.length}</span> Einträge.
          </p>
        </Card>

        <Card className="divide-y divide-hairline">
          {treffer.map(({ tag, vortag }) => (
            <div key={tag.offset} className="flex items-center gap-3 px-4 py-3">
              <ChevronRight size={16} className="shrink-0 text-ink-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-[16px] text-navy-900">{tag.datum}</p>
                <p className="text-[14px] text-ink-muted">
                  Vortag: {vortag!.schlafStunden} h Schlaf · Belastung an diesem Tag {tag.belastung} Punkte
                </p>
              </div>
            </div>
          ))}
          {treffer.length === 0 && (
            <p className="px-4 py-4 text-[15px] text-ink-muted">
              Aktuell keine Einträge, die diesem Muster entsprechen.
            </p>
          )}
        </Card>

        <MedizinHinweis text="Dies ist eine Beobachtung aus deinen eigenen Einträgen und keine medizinische Bewertung." />
      </div>
      <div className="shrink-0 border-t border-hairline bg-paper px-4 pt-3 pb-4">
        <Button breit variante="sekundaer" onClick={zurueck}>
          Zurück zum Verlauf
        </Button>
      </div>
    </div>
  )
}
