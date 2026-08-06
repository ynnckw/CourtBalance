import type { CheckIn, Einheit, PlanEvent, TrainingsOption, VerlaufTag } from './types'

export const PERSONA = {
  name: 'Jürgen',
  alter: 28,
  lk: 'LK 7',
  rolle: 'Mannschaftsspieler & Jugendtrainer',
  beruf: 'IT-Projektkoordinator, Vollzeit',
  ziele: ['Leistungsklasse verbessern', 'Überlastungen vermeiden', 'konstant spielfähig bleiben'],
  trainingsarten: ['Techniktraining', 'Matchtraining', 'Mobility', 'Krafttraining'],
}

export const HEUTE = {
  datum: 'Donnerstag, 6. August',
  tag: 'Do' as const,
  temperatur: 29,
  naechsterTermin: 'Mannschaftsspiel am Sonntag',
  wettkampfInTagen: 3,
}

export const HINWEIS =
  'CourtBalance bietet Orientierung für die Trainingsplanung und ersetzt keine medizinische Beratung oder die eigene Körperwahrnehmung.'

export const KOERPERREGIONEN = [
  'Wade rechts',
  'Wade links',
  'Oberschenkel',
  'Knie',
  'Sprunggelenk',
  'Rücken',
  'Schulter',
  'Ellenbogen',
  'Handgelenk',
]

export const KONTEXT_OPTIONEN = [
  'normaler Arbeitstag',
  'intensiver Arbeitstag',
  'private Verpflichtungen',
  'Training geplant',
  'Wettkampf geplant',
  'Reise oder längere Anfahrt',
]

export const START_CHECKIN: CheckIn = {
  energie: 3,
  schlafStunden: 6,
  schlafMinuten: 15,
  schlafQualitaet: 3,
  muskelkater: 2,
  beschwerden: true,
  regionen: ['Wade rechts'],
  beschwerdeIntensitaet: 'leicht',
  stress: 4,
  mental: 3,
  kontext: ['intensiver Arbeitstag', 'Training geplant'],
}

export const START_PLAN: PlanEvent[] = [
  {
    id: 'e-mo-1',
    tag: 'Mo',
    titel: 'Eigenes Tennistraining',
    art: 'training',
    dauerMin: 90,
    intensitaet: 'hoch',
    zeit: '18:00',
    notiz: 'Matchtraining mit Aufschlagserien',
    erledigt: true,
  },
  {
    id: 'e-di-1',
    tag: 'Di',
    titel: 'Intensiver Projekttermin',
    art: 'arbeit',
    dauerMin: 240,
    intensitaet: 'hoch',
    zeit: '09:00',
    notiz: 'Steuerungskreis, Vorbereitung am Vorabend',
    erledigt: true,
  },
  {
    id: 'e-di-2',
    tag: 'Di',
    titel: 'Mobility',
    art: 'regeneration',
    dauerMin: 30,
    intensitaet: 'niedrig',
    zeit: '20:00',
    erledigt: true,
  },
  {
    id: 'e-mi-1',
    tag: 'Mi',
    titel: 'Jugendtraining (Trainertätigkeit)',
    art: 'trainer',
    dauerMin: 120,
    intensitaet: 'mittel',
    zeit: '16:00',
    notiz: 'Zwei Gruppen, viel Stehen und Zuspiel',
    erledigt: true,
  },
  {
    id: 'e-fr-1',
    tag: 'Fr',
    titel: 'Mannschaftstraining',
    art: 'training',
    dauerMin: 90,
    intensitaet: 'mittel',
    zeit: '18:30',
    notiz: 'Vorbereitung auf das Mannschaftsspiel',
  },
  {
    id: 'e-sa-1',
    tag: 'Sa',
    titel: 'Private Verpflichtung',
    art: 'privat',
    dauerMin: 180,
    intensitaet: 'mittel',
    zeit: '11:00',
    notiz: 'Familienfeier',
  },
  {
    id: 'e-sa-2',
    tag: 'Sa',
    titel: 'Leichte Aktivierung',
    art: 'regeneration',
    dauerMin: 20,
    intensitaet: 'niedrig',
    zeit: '08:30',
  },
  {
    id: 'e-so-1',
    tag: 'So',
    titel: 'Mannschaftsspiel mit Anfahrt',
    art: 'wettkampf',
    dauerMin: 180,
    intensitaet: 'hoch',
    zeit: '10:00',
    notiz: '70 km Anfahrt, Einzel und Doppel möglich',
  },
]

export const TRAININGS_OPTIONEN: TrainingsOption[] = [
  {
    id: 'technik',
    titel: '45–60 Minuten Techniktraining',
    dauer: '45–60 Min.',
    dauerMin: 55,
    belastung: 'mittel',
    art: 'training',
    intensitaet: 'mittel',
    ziel: 'Schlagqualität sichern, ohne die Wade zu belasten',
    begruendung:
      'Dein Status liegt im mittleren Bereich. Technikarbeit hält die Schlagqualität hoch und belastet die Wade weniger als laufintensive Einheiten.',
    details: [
      'moderate Intensität',
      'Schwerpunkt Aufschlag und kontrollierte Grundschläge',
      'laufintensive Übungen reduzieren',
      'ausreichende Pausen',
      'Wade beobachten',
    ],
    vorbereitung: [
      'Verlängertes Aufwärmen von 12 bis 15 Minuten',
      'Wade gezielt mobilisieren und antesten',
      'Bei 29 °C zusätzliche Trinkpausen einplanen',
    ],
    nachbereitung: [
      'Lockeres Ausradeln oder Gehen von 8 Minuten',
      'Wade dehnen und Reaktion notieren',
      'Abends früher zur Ruhe kommen',
    ],
  },
  {
    id: 'mobility',
    titel: '30 Minuten Mobility und leichtes Ausdauertraining',
    dauer: '30 Min.',
    dauerMin: 30,
    belastung: 'niedrig',
    art: 'regeneration',
    intensitaet: 'niedrig',
    ziel: 'Regeneration fördern und Beweglichkeit erhalten',
    begruendung:
      'Eine mögliche Option, wenn sich die Wade heute deutlicher meldet oder der Arbeitstag länger wird als geplant.',
    details: [
      'niedrige Intensität',
      'Mobility für Sprunggelenk, Wade und Hüfte',
      '15 Minuten lockeres Radfahren oder zügiges Gehen',
      'keine Sprünge und keine Richtungswechsel',
    ],
    vorbereitung: ['Ruhigen Zeitpunkt wählen', 'Ausreichend trinken', 'Bequeme Umgebung ohne Zeitdruck'],
    nachbereitung: ['Kurze Atemübung zum Herunterfahren', 'Beschwerden im Check-in vermerken'],
  },
  {
    id: 'regeneration',
    titel: 'Regenerationstag',
    dauer: '0 Min. Training',
    dauerMin: 0,
    belastung: 'niedrig',
    art: 'regeneration',
    intensitaet: 'niedrig',
    ziel: 'Vollständige Erholung vor dem Mannschaftsspiel',
    begruendung:
      'Sinnvoll, wenn du die Woche bewusst auf das Mannschaftsspiel am Sonntag ausrichten möchtest und der Schlaf kurz bleibt.',
    details: [
      'kein Tennistraining',
      'Spaziergang oder lockere Bewegung nach Gefühl',
      'Schlafdauer bewusst verlängern',
      'Wade schonen und beobachten',
    ],
    vorbereitung: ['Termine am Abend reduzieren', 'Frühere Abendroutine planen'],
    nachbereitung: ['Morgen erneut einchecken', 'Freitag entscheidet über die Intensität'],
  },
]

export const START_EINHEITEN: Einheit[] = [
  {
    id: 's-1',
    datum: 'Montag, 3. August',
    art: 'Eigenes Tennistraining',
    dauerMin: 90,
    rpe: 8,
    gefuehl: 'erschöpft',
    beschwerden: 'leichter',
    trinken: 'wenig',
    notiz: 'Viele Sprints im Matchtraining, Wade am Ende spürbar.',
  },
  {
    id: 's-2',
    datum: 'Mittwoch, 5. August',
    art: 'Jugendtraining',
    dauerMin: 120,
    rpe: 5,
    gefuehl: 'okay',
    beschwerden: 'keine',
    trinken: 'ausreichend',
    notiz: 'Viel Zuspiel im Stehen.',
  },
]

/** Deterministische Demo-Historie: 90 Tage, mit erkennbarem Muster in den letzten drei Wochen. */
function baueVerlauf(): VerlaufTag[] {
  const tage: VerlaufTag[] = []
  const namen = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  for (let offset = 89; offset >= 0; offset--) {
    const wochentag = (6 - (offset % 7) + 7) % 7
    const welle = Math.sin(offset / 3.1)
    const welle2 = Math.cos(offset / 6.7)
    const letzteDreiWochen = offset < 21

    let schlaf = 7.2 + welle2 * 0.7 - (wochentag === 2 || wochentag === 4 ? 0.5 : 0)
    if (letzteDreiWochen && (offset % 7 === 1 || offset % 7 === 4)) schlaf = 5.8 + welle * 0.2
    schlaf = Math.round(Math.max(4.9, Math.min(8.6, schlaf)) * 10) / 10

    const trainingstag = wochentag !== 0 && (wochentag % 2 === 1 || wochentag === 6 || wochentag === 0)
    let belastung = trainingstag ? 58 + welle * 14 : 26 + welle2 * 8
    if (wochentag === 0) belastung = 82 + welle * 6
    if (letzteDreiWochen && schlaf < 6.4) belastung += 18
    belastung = Math.round(Math.max(8, Math.min(96, belastung)))

    const regeneration = Math.round(
      Math.max(18, Math.min(94, 46 + (schlaf - 6.5) * 17 - (belastung - 50) * 0.28 + welle2 * 5)),
    )
    const mental = Math.round(Math.max(1, Math.min(5, 3 + (letzteDreiWochen ? 0.7 : 0) + welle * 0.9)))
    const beschwerden = Math.round(Math.max(0, Math.min(3, (letzteDreiWochen ? 1.1 : 0.4) + welle * 0.8)))

    tage.push({
      offset,
      datum: `${namen[wochentag]}, Tag −${offset}`,
      belastung,
      regeneration,
      schlafStunden: schlaf,
      mental,
      beschwerden,
      trainiert: belastung > 40,
    })
  }
  return tage
}

export const START_VERLAUF: VerlaufTag[] = baueVerlauf()

export const START_BENACHRICHTIGUNGEN = {
  vorbereitung: true,
  nachbereitung: true,
  wochenuebersicht: true,
  regeneration: false,
  stilleWaehrendBelastung: true,
}

export const START_DATENQUELLEN = {
  kalender: true,
  wearable: false,
  wetter: true,
}
