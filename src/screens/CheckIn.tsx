import { useMemo, useState } from 'react'
import { useApp } from '../lib/store'
import { HEUTE, KOERPERREGIONEN, KONTEXT_OPTIONEN } from '../lib/mockData'
import { computeStatus } from '../lib/scoring'
import type { BeschwerdeStufe, CheckIn as CheckInDaten } from '../lib/types'
import { Button, Card, Chip, Fortschritt, OverlayKopf, SectionTitle, Skala, cx } from '../components/ui'

const ENERGIE_LABEL = ['sehr erschöpft', 'wenig Energie', 'durchschnittlich', 'gut erholt', 'sehr energiegeladen']
const QUALITAET_LABEL = ['sehr schlecht', 'schlecht', 'mittel', 'gut', 'sehr gut']
const MUSKEL_LABEL = ['keiner', 'leicht', 'spürbar', 'deutlich', 'stark']
const STRESS_LABEL = ['sehr entspannt', 'entspannt', 'mittel', 'angespannt', 'stark belastet']
const MENTAL_LABEL = ['sehr angeschlagen', 'wenig belastbar', 'mittel', 'gut', 'sehr klar']

const SCHRITTE = ['Energie', 'Schlaf', 'Körper', 'Mentale Belastung', 'Kontext', 'Zusammenfassung']

export default function CheckIn() {
  const { state, dispatch, zurueck, zeigeToast } = useApp()
  const [schritt, setSchritt] = useState(0)
  const [daten, setDaten] = useState<CheckInDaten>({
    ...state.checkIn,
    regionen: [...state.checkIn.regionen],
    kontext: [...state.checkIn.kontext],
  })

  const setzen = (teil: Partial<CheckInDaten>) => setDaten((d) => ({ ...d, ...teil }))

  const vorschau = useMemo(
    () =>
      computeStatus(daten, {
        plan: state.plan,
        temperatur: HEUTE.temperatur,
        wettkampfInTagen: HEUTE.wettkampfInTagen,
      }),
    [daten, state.plan],
  )

  const speichern = () => {
    dispatch({ type: 'checkin/speichern', wert: daten })
    dispatch({ type: 'overlay/clear' })
    dispatch({ type: 'tab', wert: 'heute' })
    zeigeToast('Dein Tagesstatus wurde aktualisiert.')
  }

  const weiter = () => (schritt < SCHRITTE.length - 1 ? setSchritt(schritt + 1) : speichern())
  const zurueckSchritt = () => (schritt === 0 ? zurueck() : setSchritt(schritt - 1))

  return (
    <div className="flex h-full flex-col bg-paper">
      <OverlayKopf
        titel="Tages-Check-in"
        unterzeile={`Schritt ${schritt + 1} von ${SCHRITTE.length} · ${SCHRITTE[schritt]}`}
        onZurueck={zurueckSchritt}
      />

      <div className="px-4 pt-3">
        <Fortschritt schritt={schritt + 1} gesamt={SCHRITTE.length} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-6 cb-scroll">
        {schritt === 0 && (
          <Block frage="Wie energiegeladen fühlst du dich heute?">
            <Skala
              wert={daten.energie}
              onChange={(w) => setzen({ energie: w })}
              legendeMin="1 = sehr erschöpft"
              legendeMax="5 = sehr energiegeladen"
            />
            <Auswertung text={ENERGIE_LABEL[daten.energie - 1]} />
          </Block>
        )}

        {schritt === 1 && (
          <div className="space-y-6">
            <Block frage="Wie lange hast du geschlafen?">
              <div className="flex items-center gap-3">
                <ZahlFeld
                  label="Stunden"
                  wert={daten.schlafStunden}
                  min={3}
                  max={12}
                  onChange={(w) => setzen({ schlafStunden: w })}
                />
                <ZahlFeld
                  label="Minuten"
                  wert={daten.schlafMinuten}
                  min={0}
                  max={45}
                  schritt={15}
                  onChange={(w) => setzen({ schlafMinuten: w })}
                />
              </div>
            </Block>
            <Block frage="Wie war deine Schlafqualität?">
              <Skala
                wert={daten.schlafQualitaet}
                onChange={(w) => setzen({ schlafQualitaet: w })}
                legendeMin="1 = sehr schlecht"
                legendeMax="5 = sehr gut"
              />
              <Auswertung text={QUALITAET_LABEL[daten.schlafQualitaet - 1]} />
            </Block>
          </div>
        )}

        {schritt === 2 && (
          <div className="space-y-6">
            <Block frage="Wie stark ist dein Muskelkater?">
              <Skala
                wert={daten.muskelkater}
                onChange={(w) => setzen({ muskelkater: w })}
                legendeMin="1 = keiner"
                legendeMax="5 = stark"
              />
              <Auswertung text={MUSKEL_LABEL[daten.muskelkater - 1]} />
            </Block>

            <Block frage="Hast du aktuell Beschwerden?">
              <div className="flex gap-2">
                <Chip aktiv={!daten.beschwerden} onClick={() => setzen({ beschwerden: false, regionen: [] })}>
                  Nein
                </Chip>
                <Chip aktiv={daten.beschwerden} onClick={() => setzen({ beschwerden: true })}>
                  Ja
                </Chip>
              </div>
            </Block>

            {daten.beschwerden && (
              <>
                <Block frage="Welche Körperregion?">
                  <div className="flex flex-wrap gap-2">
                    {KOERPERREGIONEN.map((r) => (
                      <Chip
                        key={r}
                        aktiv={daten.regionen.includes(r)}
                        onClick={() =>
                          setzen({
                            regionen: daten.regionen.includes(r)
                              ? daten.regionen.filter((x) => x !== r)
                              : [...daten.regionen, r],
                          })
                        }
                      >
                        {r}
                      </Chip>
                    ))}
                  </div>
                </Block>
                <Block frage="Wie stark sind die Beschwerden?">
                  <div className="flex gap-2">
                    {(['leicht', 'mittel', 'stark'] as BeschwerdeStufe[]).map((s) => (
                      <Chip
                        key={s}
                        aktiv={daten.beschwerdeIntensitaet === s}
                        onClick={() => setzen({ beschwerdeIntensitaet: s })}
                      >
                        {s}
                      </Chip>
                    ))}
                  </div>
                </Block>
              </>
            )}
          </div>
        )}

        {schritt === 3 && (
          <div className="space-y-6">
            <Block frage="Wie hoch ist dein Stresslevel?">
              <Skala
                wert={daten.stress}
                onChange={(w) => setzen({ stress: w })}
                legendeMin="1 = sehr entspannt"
                legendeMax="5 = stark belastet"
              />
              <Auswertung text={STRESS_LABEL[daten.stress - 1]} />
            </Block>
            <Block frage="Wie ist deine mentale Verfassung?">
              <Skala
                wert={daten.mental}
                onChange={(w) => setzen({ mental: w })}
                legendeMin="1 = sehr angeschlagen"
                legendeMax="5 = sehr klar"
              />
              <Auswertung text={MENTAL_LABEL[daten.mental - 1]} />
            </Block>
          </div>
        )}

        {schritt === 4 && (
          <Block frage="Was steht heute an?" hinweis="Mehrfachauswahl möglich">
            <div className="flex flex-wrap gap-2">
              {KONTEXT_OPTIONEN.map((k) => (
                <Chip
                  key={k}
                  aktiv={daten.kontext.includes(k)}
                  onClick={() =>
                    setzen({
                      kontext: daten.kontext.includes(k)
                        ? daten.kontext.filter((x) => x !== k)
                        : [...daten.kontext, k],
                    })
                  }
                >
                  {k}
                </Chip>
              ))}
            </div>
          </Block>
        )}

        {schritt === 5 && (
          <div className="space-y-5">
            <div>
              <SectionTitle>Zusammenfassung</SectionTitle>
              <Card className="divide-y divide-hairline">
                <Zeile label="Energie" wert={`${daten.energie}/5 · ${ENERGIE_LABEL[daten.energie - 1]}`} />
                <Zeile
                  label="Schlaf"
                  wert={`${daten.schlafStunden} h ${String(daten.schlafMinuten).padStart(2, '0')} min · Qualität ${daten.schlafQualitaet}/5`}
                />
                <Zeile label="Muskelkater" wert={`${daten.muskelkater}/5`} />
                <Zeile
                  label="Beschwerden"
                  wert={
                    daten.beschwerden
                      ? `${daten.regionen.join(', ') || 'keine Region gewählt'} (${daten.beschwerdeIntensitaet})`
                      : 'keine'
                  }
                />
                <Zeile label="Stress" wert={`${daten.stress}/5`} />
                <Zeile label="Mentale Verfassung" wert={`${daten.mental}/5`} />
                <Zeile label="Kontext" wert={daten.kontext.join(', ') || 'keine Angabe'} />
              </Card>
            </div>

            <Card className="p-4">
              <p className="text-[14px] tracking-[0.12em] text-ink-muted uppercase">Vorschau Tagesstatus</p>
              <div className="mt-2 flex items-end gap-3">
                <span className="font-mono text-[38px] leading-none text-navy-900">{vorschau.score}</span>
                <span className="pb-1 text-[16px] text-ink-muted">/ 100 · {vorschau.label}</span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-navy-800">{vorschau.empfehlung}</p>
            </Card>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-hairline bg-paper px-4 pt-3 pb-4">
        <div className="flex gap-3">
          <Button variante="sekundaer" onClick={zurueckSchritt}>
            {schritt === 0 ? 'Abbrechen' : 'Zurück'}
          </Button>
          <div className="flex-1">
            <Button breit onClick={weiter}>
              {schritt === SCHRITTE.length - 1 ? 'Check-in speichern' : 'Weiter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Block({
  frage,
  hinweis,
  children,
}: {
  frage: string
  hinweis?: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="font-display text-[20px] leading-snug font-semibold text-navy-900">{frage}</h2>
      {hinweis && <p className="mt-1 text-[14px] text-ink-muted">{hinweis}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Auswertung({ text }: { text: string }) {
  return <p className="mt-3 text-[15px] text-navy-800">Deine Angabe: {text}</p>
}

function Zeile({ label, wert }: { label: string; wert: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="text-[15px] text-ink-muted">{label}</span>
      <span className="text-right text-[15px] text-navy-900">{wert}</span>
    </div>
  )
}

function ZahlFeld({
  label,
  wert,
  min,
  max,
  schritt = 1,
  onChange,
}: {
  label: string
  wert: number
  min: number
  max: number
  schritt?: number
  onChange: (w: number) => void
}) {
  return (
    <div className="flex-1">
      <p className="mb-1.5 text-[14px] text-ink-muted">{label}</p>
      <div className="flex items-center gap-2 rounded-xl border border-hairline bg-white p-1.5">
        <Knopf zeichen="−" onClick={() => onChange(Math.max(min, wert - schritt))} disabled={wert <= min} />
        <span className="flex-1 text-center font-mono text-[20px] text-navy-900">{wert}</span>
        <Knopf zeichen="+" onClick={() => onChange(Math.min(max, wert + schritt))} disabled={wert >= max} />
      </div>
    </div>
  )
}

function Knopf({
  zeichen,
  onClick,
  disabled,
}: {
  zeichen: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={zeichen === '+' ? 'erhöhen' : 'verringern'}
      className={cx(
        'flex h-11 w-11 items-center justify-center rounded-lg text-[20px] transition-colors',
        disabled ? 'text-hairline' : 'bg-paper-2 text-navy-900 hover:bg-hairline',
      )}
    >
      {zeichen}
    </button>
  )
}
