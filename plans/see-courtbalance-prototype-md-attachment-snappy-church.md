# CourtBalance — klickbarer Mobile-Prototyp

## Context

`src/imports/pasted_text/courtbalance-prototype.md` ist eine verbindliche, vollständige Spezifikation für einen deutschsprachigen, testbaren Design-Thinking-Prototypen („CourtBalance"). Die beigelegte Seminararbeit (`src/imports/Thomann_Seminararbeit.pdf`, Kap. 3.1–3.3) bestätigt den fachlichen Rahmen: integriertes Unterstützungssystem aus geringer Datenerfassung, Belastungsanalyse, flexibler Trainingsplanung, Regeneration und unaufdringlicher Nutzerinteraktion — Empfehlungen statt Vorgaben, Eigenverantwortung bleibt beim Spieler. Keine Fließtexte/Quellen aus der PDF in die UI.

Das Repo enthält bisher nur den Vite-Scaffold; `src/App.tsx` ist ein Platzhalter-Demo (Dot-Grid) ohne App-Struktur. Er wird durch die App ersetzt — es gibt keine bestehende Anwendung zu erhalten.

Ergebnis: ein vollständig durchklickbarer Prototyp (393 × 852 px), lokaler State, keine Backends, alle 6 Testaufgaben und 17 Abnahmekriterien erfüllt.

## Vorarbeiten

- `Skill('make:aesthetic-stance')` + `create_make_theme` (Brief: ruhige, sportlich-vertrauenswürdige Tennis-App, dunkles Navy, gedecktes Court-Grün, Limette nur als Akzent).
- `Skill('dataviz')` vor den Verlauf-Charts.
- Abhängigkeit installieren: `lucide-react`. Charts als handgezeichnete SVG (Linie/Fläche/Balken) — keine Chart-Bibliothek nötig bei dieser Größe.
- Fonts: eine klare Google-Sans (z. B. Inter/Plus Jakarta/Manrope, laut Theme) via `@import` **als erste Zeile** in `src/index.css`, davor nichts außer Kommentaren; `@import 'tailwindcss';` danach. Tokens (Navy, Court-Grün, Limette, Status Grün/Gelb/Rot, Neutrals, Radien) als `@theme`-Variablen in `src/index.css`.

## Struktur

```
src/App.tsx                 Shell: Variantenwahl → AppFrame (393×852, safe area) → Screens
src/lib/types.ts            CheckIn, DayEntry, PlanEvent, TrainingOption, Session…
src/lib/mockData.ts         Ausgangszustand (Jürgen, Do. als heutiger Tag, Woche Mo–So, 12-Wochen-Historie)
src/lib/scoring.ts          transparente Demo-Logik: Score 0–100, Ampel, Faktoren, Begründungen
src/lib/store.tsx           AppStateProvider (useReducer + Context): variant, checkIn, score,
                            plan, chosenOption, sessions, history, notifications, resetDemo()
src/components/ui/          Button, Card, Chip, Scale1to5, StatusBadge, Sheet, Toast, ProgressBar,
                            Stepper, SectionHeader, Sparkline/BarChart/AreaChart
src/components/nav/BottomNav.tsx   5 Einträge, „Check-in" als erhöhte Mittelaktion, Icon + Label
src/screens/VariantGate.tsx        Teststart A/B
src/screens/Today.tsx              + TodayVariantA.tsx / TodayVariantB.tsx
src/screens/CheckIn.tsx            5 Schritte + Zusammenfassung
src/screens/Recommendations.tsx    3 gleichwertige Optionen
src/screens/Plan.tsx               Wochenansicht Mo–So + EventSheet
src/screens/TrainingPrep.tsx       Vorbereitung → TrainingSession.tsx (ruhiger Modus) → TrainingDebrief.tsx
src/screens/History.tsx            7 T / 4 W / 3 M + Musteranalyse + PatternDetail
src/screens/Profile.tsx            Daten, Benachrichtigungen, Variante wechseln, Demo zurücksetzen
```

Navigation: eigener State im Store (`tab` + `overlayRoute`-Stack) statt Router — Overlays (Check-in, Empfehlungen, Training, Debrief, Details) legen sich über die Tabs, jeder hat einen funktionierenden Zurück-Button.

## Kernlogik (`src/lib/scoring.ts`)

Eine reine Funktion `computeStatus(checkIn, context) → { score, ampel, label, empfehlung, faktoren[] }`:
- gewichtete Beiträge aus Energie, Schlafdauer + -qualität, Muskelkater/Beschwerden, Stress/mentale Verfassung, Wochenbelastung aus dem Plan, bevorstehender Wettkampf, Wetter (29 °C).
- Ausgangszustand liefert exakt **64/100, Gelb, „Angepasst trainieren"** mit der spezifizierten Empfehlung — Startwerte werden gegen diese Zahl kalibriert.
- Jeder Faktor trägt Label + Kurzerklärung (für die antippbaren Faktor-Sheets und Testaufgabe 6).
- Keine Risikoprozente, keine Diagnosen. Sprache: „CourtBalance empfiehlt …", „Eine mögliche Option ist …", „Du entscheidest …".
- Änderungen an Check-in, gewählter Option, Plan-Events und Trainingsnachbereitung laufen alle durch dieselbe Funktion, damit Dashboard, Plan und Verlauf konsistent aktualisieren.

## Umsetzungsschritte

1. Tokens + Font in `src/index.css`; `AppFrame` mit fixem 393×852-Rahmen (auf kleinen Screens fluid, 360–430 px), scrollbarem Content, `padding-bottom` > BottomNav-Höhe.
2. `types.ts`, `mockData.ts`, `scoring.ts`, `store.tsx` inkl. `resetDemo()` (Reducer-Reset auf tief kopierte Mockdaten).
3. UI-Primitives (Touch-Ziele ≥ 44 px, sichtbare focus/hover/selected/disabled-States, Status immer Farbe **+** Text **+** Icon).
4. `VariantGate` → Variante im Store; Profil kann dorthin zurück.
5. Heute-Dashboard, beide Varianten teilen Daten/Aktionen, unterscheiden nur Reihenfolge/Betonung (A: große Ampelfläche zuerst; B: Zahl 0–100 + Sparkline + Faktoren zuerst, Empfehlung darunter). Faktorzeilen öffnen Erklärungs-Sheets. Medizin-Hinweis-Zeile unten auf Heute und im Profil.
6. Check-in als 5-Schritt-Flow mit Fortschrittsindikator, Zurück/Weiter, Zusammenfassung, Speichern → Score neu, Toast „Dein Tagesstatus wurde aktualisiert.", zurück auf Heute.
7. Empfehlungen: 3 Optionen (Techniktraining 45–60 min empfohlen, Mobility 30 min, Regenerationstag) mit Belastung/Dauer/Begründung/Vor- und Nachbereitung; „Für heute auswählen" schreibt in den Donnerstag des Plans + Toast; „Details" öffnet Sheet; „Andere Entscheidung treffen" führt zum Vergleich zurück.
8. Plan: Mo–So mit den Beispieldaten, farb- *und* icon-/label-codierte Typen (eigenes Training, Wettkampf, Trainertätigkeit, Regeneration, Arbeit, Privat), pro Tag Gesamtbelastung + Regenerationsstatus. Event-Sheet: verschieben (Tageswahl), Intensität ändern, entfernen, Alternative wählen; zusätzlich „Belastung ergänzen" (beruflich/privat) → Neuberechnung + Hinweis „Dein Plan wurde an die neue Belastung angepasst."
9. Trainingsvorbereitung → „Training starten" (ruhiger Timer, nur verstrichene Zeit + „Training beenden", keinerlei Pop-ups/Warnungen) → Nachbereitung (Dauer, RPE 1–10, Gefühl, Beschwerden, Trinkmenge, Notiz) → Speichern aktualisiert Tages-/Wochenbelastung und Verlauf + Regenerationshinweis.
10. Verlauf: Zeitraum-Umschalter, Charts für Belastung/Regeneration, Verhältnis, Häufigkeit, Beschwerden, Schlaf, mentale Belastung; Musterkarte („beobachtetes Muster, keine Diagnose") mit Orientierungstext und Detailansicht der zugrunde liegenden Einträge.
11. Profil: Persona, Datenquellen/Kalender/Wearable (Demo-Toggles), 4 Benachrichtigungs-Toggles, Grundsatz-Text zur Nicht-Unterbrechung, Datenschutzhinweis, Variante wechseln, Demo zurücksetzen (mit Bestätigung).

## Grenzen

Keine Login-, Social-, Chatbot-, Coach-, Kalorien-, Abo- oder Echtzeitwarn-Funktionen; keine Stockfotos (nur abstrakte Court-Linien/Ball-Icons); nur die spezifizierten Features.

## Verifikation

- `pnpm build` (bzw. `npx tsc --noEmit`) für Typ-/Build-Fehler.
- Im Preview bei 393 × 852 die sechs Testaufgaben durchspielen: Check-in verändert sichtbar den Status; Option wird in den Plan übernommen; ergänzter Arbeitstermin verändert Wochenbelastung/Empfehlung; Training starten → beenden → dokumentieren; Verlauf zeigt Muster; Faktor-Sheets erklären die Empfehlung.
- Jeden Zurück-Button und jede Hauptaktion einmal antippen (keine Sackgassen), horizontales Überlaufen prüfen, „Demo zurücksetzen" muss auf 64/100 zurückführen.
