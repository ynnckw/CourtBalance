import type { Ampel, CheckIn, Faktor, Intensitaet, PlanEvent, Status } from './types'

/**
 * Transparente Demo-Logik: jeder Einflussfaktor zieht nachvollziehbare Punkte von 100 ab.
 * Bewusst keine medizinische Bewertung und keine Risikowahrscheinlichkeit.
 */

const INTENSITAET_FAKTOR: Record<Intensitaet, number> = { niedrig: 0.5, mittel: 1, hoch: 1.5 }

export function wochenMinuten(plan: PlanEvent[]): number {
  return Math.round(
    plan.reduce((summe, e) => {
      if (e.art === 'arbeit' || e.art === 'privat') return summe
      const artFaktor = e.art === 'trainer' ? 0.7 : e.art === 'regeneration' ? 0.3 : 1
      return summe + e.dauerMin * INTENSITAET_FAKTOR[e.intensitaet] * artFaktor
    }, 0),
  )
}

export function wochenbelastungStufe(minuten: number): Intensitaet {
  if (minuten < 320) return 'niedrig'
  if (minuten < 680) return 'mittel'
  return 'hoch'
}

export function alltagsBelastung(plan: PlanEvent[]): Intensitaet {
  const anzahl = plan.filter((e) => e.art === 'arbeit' || e.art === 'privat').length
  if (anzahl <= 2) return 'niedrig'
  if (anzahl <= 4) return 'mittel'
  return 'hoch'
}

export interface StatusKontext {
  plan: PlanEvent[]
  temperatur: number
  wettkampfInTagen: number | null
}

function stufe(wert: number, grenzen: [number, number]): 'gut' | 'neutral' | 'achtung' {
  if (wert <= grenzen[0]) return 'gut'
  if (wert <= grenzen[1]) return 'neutral'
  return 'achtung'
}

export function computeStatus(checkIn: CheckIn, ctx: StatusKontext): Status {
  const schlafDauer = checkIn.schlafStunden + checkIn.schlafMinuten / 60

  const pEnergie = (5 - checkIn.energie) * 3
  const pSchlafDauer = Math.max(0, Math.min(20, (7.5 - schlafDauer) * 4))
  const pSchlafQualitaet = (5 - checkIn.schlafQualitaet) * 2
  const pMuskelkater = (checkIn.muskelkater - 1) * 1.5
  const pBeschwerden = checkIn.beschwerden
    ? { leicht: 3.5, mittel: 9, stark: 15 }[checkIn.beschwerdeIntensitaet]
    : 0
  const pStress = (checkIn.stress - 1) * 2
  const pMental = (5 - checkIn.mental) * 1.5

  const kontextGewicht: Record<string, number> = {
    'normaler Arbeitstag': 0.5,
    'intensiver Arbeitstag': 3,
    'private Verpflichtungen': 1,
    'Training geplant': 0,
    'Wettkampf geplant': 1,
    'Reise oder längere Anfahrt': 2,
  }
  const pKontext = checkIn.kontext.reduce((s, k) => s + (kontextGewicht[k] ?? 0), 0)

  const minuten = wochenMinuten(ctx.plan)
  const wochenStufe = wochenbelastungStufe(minuten)
  const pWoche = { niedrig: 0, mittel: 3, hoch: 8 }[wochenStufe]

  const alltag = alltagsBelastung(ctx.plan)
  const pAlltag = { niedrig: 0, mittel: 2, hoch: 4 }[alltag]

  const pHitze = ctx.temperatur >= 27 ? 1 : 0

  const abzug =
    pEnergie +
    pSchlafDauer +
    pSchlafQualitaet +
    pMuskelkater +
    pBeschwerden +
    pStress +
    pMental +
    pKontext +
    pWoche +
    pAlltag +
    pHitze

  const score = Math.max(5, Math.min(100, Math.round(100 - abzug)))

  let ampel: Ampel = 'gelb'
  let label = 'Angepasst trainieren'
  let empfehlung =
    'Heute ist moderates Training möglich. Reduziere laufintensive Belastungen und lege den Schwerpunkt auf Technik.'

  if (score >= 75) {
    ampel = 'gruen'
    label = 'Training wie geplant möglich'
    empfehlung =
      'Deine Werte sprechen für eine normale Belastung. Du kannst dein geplantes Training in gewohnter Intensität umsetzen.'
  } else if (score < 50) {
    ampel = 'rot'
    label = 'Erholung in den Vordergrund stellen'
    empfehlung =
      'Mehrere Faktoren sprechen heute für Zurückhaltung. Eine mögliche Option ist eine deutlich reduzierte Einheit oder ein Regenerationstag.'
  }

  const pSchlaf = pSchlafDauer + pSchlafQualitaet
  const pKopf = pStress + pMental + pKontext + pAlltag
  const pKoerper = pBeschwerden + pMuskelkater + pEnergie

  const schlafText = `${checkIn.schlafStunden} h ${String(checkIn.schlafMinuten).padStart(2, '0')} min, Qualität ${checkIn.schlafQualitaet}/5`

  const faktoren: Faktor[] = [
    {
      id: 'schlaf',
      label: 'Schlaf',
      wert: pSchlaf <= 3 ? 'gut' : pSchlaf <= 10 ? 'ausbaufähig' : 'deutlich zu kurz',
      ton: stufe(pSchlaf, [3, 10]),
      beitrag: pSchlaf,
      erklaerung: `Erfasst: ${schlafText}. Kürzere Nächte und eine niedrigere Schlafqualität verringern den Erholungsspielraum für intensive Einheiten. CourtBalance senkt den Tagesstatus deshalb um ${Math.round(pSchlaf)} Punkte.`,
    },
    {
      id: 'mental',
      label: 'mentale Belastung',
      wert: pKopf <= 5 ? 'niedrig' : pKopf <= 13 ? 'erhöht' : 'hoch',
      ton: stufe(pKopf, [5, 13]),
      beitrag: pKopf,
      erklaerung: `Stress ${checkIn.stress}/5, mentale Verfassung ${checkIn.mental}/5, dazu deine Angaben zum Tageskontext sowie berufliche und private Termine der Woche. Mentale Belastung wirkt auf die Erholung und wird mit ${Math.round(pKopf)} Punkten berücksichtigt.`,
    },
    {
      id: 'koerper',
      label: 'körperliche Beschwerden',
      wert: !checkIn.beschwerden
        ? 'keine'
        : checkIn.beschwerdeIntensitaet === 'leicht'
          ? 'leicht'
          : checkIn.beschwerdeIntensitaet === 'mittel'
            ? 'spürbar'
            : 'deutlich',
      ton: stufe(pKoerper, [6, 13]),
      beitrag: pKoerper,
      erklaerung: checkIn.beschwerden
        ? `Angegeben: ${checkIn.regionen.join(', ') || 'keine Region gewählt'} (${checkIn.beschwerdeIntensitaet}), Muskelkater ${checkIn.muskelkater}/5, Energie ${checkIn.energie}/5. Beschwerden verändern die Belastbarkeit und beeinflussen vor allem die Auswahl der Übungsformen.`
        : `Keine Beschwerden angegeben. Muskelkater ${checkIn.muskelkater}/5 und Energie ${checkIn.energie}/5 fließen in die Bewertung ein.`,
    },
    {
      id: 'woche',
      label: 'sportliche Wochenbelastung',
      wert: wochenStufe,
      ton: wochenStufe === 'niedrig' ? 'gut' : wochenStufe === 'mittel' ? 'neutral' : 'achtung',
      beitrag: pWoche,
      erklaerung: `Aus deinem Wochenplan ergibt sich eine gewichtete Belastung von ${minuten} Punkten aus Training, Wettkampf und Trainertätigkeit. Trainertätigkeit wird geringer gewichtet als eigenes Training, Regeneration nur anteilig.`,
    },
    {
      id: 'wettkampf',
      label: 'bevorstehender Wettkampf',
      wert: ctx.wettkampfInTagen === null ? 'kein Wettkampf geplant' : 'berücksichtigen',
      ton: ctx.wettkampfInTagen === null ? 'gut' : 'neutral',
      beitrag: 0,
      erklaerung:
        ctx.wettkampfInTagen === null
          ? 'In den nächsten Tagen ist kein Wettkampf eingetragen. Die Trainingspriorität kann frei gewählt werden.'
          : `In ${ctx.wettkampfInTagen} Tagen steht ein Mannschaftsspiel an. Der Wettkampf verändert nicht den Punktwert, verschiebt aber die Priorität in Richtung Spielfähigkeit am Sonntag.`,
    },
  ]

  return { score, ampel, label, empfehlung, faktoren, wochenbelastung: wochenStufe, wochenMinuten: minuten }
}

export function tagesBelastung(plan: PlanEvent[], tag: string): number {
  const eintraege = plan.filter((e) => e.tag === tag)
  const wert = eintraege.reduce((s, e) => {
    const artFaktor = e.art === 'trainer' ? 0.7 : e.art === 'regeneration' ? 0.3 : e.art === 'arbeit' || e.art === 'privat' ? 0.25 : 1
    return s + e.dauerMin * INTENSITAET_FAKTOR[e.intensitaet] * artFaktor
  }, 0)
  return Math.round(wert)
}

export function tagesStufe(wert: number): Intensitaet {
  if (wert < 60) return 'niedrig'
  if (wert < 150) return 'mittel'
  return 'hoch'
}

export function regenerationsStatus(wert: number): string {
  const stufeWert = tagesStufe(wert)
  if (stufeWert === 'hoch') return 'Erholung eingeplant lassen'
  if (stufeWert === 'mittel') return 'Erholung ausreichend'
  return 'gute Erholung möglich'
}
