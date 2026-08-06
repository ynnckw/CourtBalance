export type Variant = 'A' | 'B'

export type Ampel = 'gruen' | 'gelb' | 'rot'

export type Intensitaet = 'niedrig' | 'mittel' | 'hoch'

export type BeschwerdeStufe = 'leicht' | 'mittel' | 'stark'

export type EventArt =
  | 'training'
  | 'wettkampf'
  | 'trainer'
  | 'regeneration'
  | 'arbeit'
  | 'privat'

export type Tag = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa' | 'So'

export const TAGE: Tag[] = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

export const TAG_LANG: Record<Tag, string> = {
  Mo: 'Montag',
  Di: 'Dienstag',
  Mi: 'Mittwoch',
  Do: 'Donnerstag',
  Fr: 'Freitag',
  Sa: 'Samstag',
  So: 'Sonntag',
}

export interface PlanEvent {
  id: string
  tag: Tag
  titel: string
  art: EventArt
  dauerMin: number
  intensitaet: Intensitaet
  zeit: string
  notiz?: string
  /** true, wenn der Eintrag aus einer selbst gewählten Empfehlung entstanden ist */
  vorschlag?: boolean
  erledigt?: boolean
}

export interface CheckIn {
  energie: number
  schlafStunden: number
  schlafMinuten: number
  schlafQualitaet: number
  muskelkater: number
  beschwerden: boolean
  regionen: string[]
  beschwerdeIntensitaet: BeschwerdeStufe
  stress: number
  mental: number
  kontext: string[]
}

export interface Einheit {
  id: string
  datum: string
  art: string
  dauerMin: number
  rpe: number
  gefuehl: string
  beschwerden: 'keine' | 'leichter' | 'stärker'
  trinken: 'wenig' | 'ausreichend' | 'viel'
  notiz: string
}

export interface VerlaufTag {
  /** Tage zurück, 0 = heute */
  offset: number
  datum: string
  belastung: number
  regeneration: number
  schlafStunden: number
  mental: number
  beschwerden: number
  trainiert: boolean
}

export interface Faktor {
  id: string
  label: string
  wert: string
  ton: 'gut' | 'neutral' | 'achtung'
  erklaerung: string
  beitrag: number
}

export interface Status {
  score: number
  ampel: Ampel
  label: string
  empfehlung: string
  faktoren: Faktor[]
  wochenbelastung: Intensitaet
  wochenMinuten: number
}

export interface TrainingsOption {
  id: string
  titel: string
  dauer: string
  dauerMin: number
  belastung: Intensitaet
  begruendung: string
  details: string[]
  vorbereitung: string[]
  nachbereitung: string[]
  art: EventArt
  intensitaet: Intensitaet
  ziel: string
}
