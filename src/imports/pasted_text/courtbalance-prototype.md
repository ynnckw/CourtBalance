Erstelle einen vollständig klickbaren und funktionalen Mobile-App-Prototypen mit dem Arbeitstitel „CourtBalance“.

Sofern die PDF „Thomann_Seminararbeit.pdf“ angehängt ist, verwende insbesondere die Kapitel 3.1 bis 3.3 als fachliche Anforderungsgrundlage. Übernimm keine wissenschaftlichen Fließtexte oder Quellenangaben in die Benutzeroberfläche. Die nachfolgende Spezifikation ist für die konkrete Umsetzung verbindlich.

========================================
1. PROJEKTZIEL
========================================

CourtBalance ist eine deutschsprachige Mobile-App für ambitionierte Mannschafts- und Turniertennisspieler. Sie soll Nutzer dabei unterstützen, sportliche und außersportliche Belastungen sowie ihren aktuellen Regenerationszustand mit geringem Aufwand zusammenzuführen und daraus flexible, verständliche und selbstbestimmte Trainingsentscheidungen abzuleiten.

Die App darf dem Nutzer keine verbindlichen Entscheidungen abnehmen. Sie soll mehrere nachvollziehbare Handlungsoptionen anbieten, die eigene Körperwahrnehmung ergänzen und die Eigenverantwortung ausdrücklich erhalten.

Es handelt sich um einen testbaren Design-Thinking-Prototypen und nicht um ein Medizinprodukt. Verwende daher keine Diagnosen, keine Verletzungswahrscheinlichkeiten und keine scheinmedizinisch exakten Risikoprognosen.

Zeige an geeigneter Stelle den Hinweis:

„CourtBalance bietet Orientierung für die Trainingsplanung und ersetzt keine medizinische Beratung oder die eigene Körperwahrnehmung.“

========================================
2. ZIELPERSONA
========================================

Verwende für den Demo-Prototypen folgende Persona:

Name: Jürgen
Alter: 28 Jahre
Leistungsklasse: LK 7
Beruf: IT-Projektkoordinator in Vollzeit
Sportliches Profil:
- Spieler der ersten Herrenmannschaft
- regelmäßige Teilnahme an Mannschaftsspielen und Turnieren
- zusätzlich Jugendtrainer im Tennisverein
- mehrere sportliche Termine pro Woche
- gelegentlich Kraft- und Mobilitätstraining

Jürgens Arbeitsbelastung schwankt durch Projekttermine, Besprechungen und kurzfristige Aufgaben. Sein Trainingsrhythmus ist daher nicht konstant.

Jürgen ist ehrgeizig und leistungsorientiert, möchte seine Leistungsklasse verbessern und gleichzeitig Überlastungen sowie längere Verletzungspausen vermeiden.

Er nutzt Smartphone, Kalender und Messenger regelmäßig. Eine Smartwatch verwendet er beim Tennis nur gelegentlich.

Er akzeptiert technische Unterstützung, wenn:
- der Nutzen unmittelbar erkennbar ist,
- nur wenige manuelle Eingaben notwendig sind,
- Informationen verständlich dargestellt werden,
- Empfehlungen konkrete Handlungsoptionen enthalten,
- die endgültige Entscheidung bei ihm bleibt.

Er lehnt ab:
- umfangreiche manuelle Dokumentation,
- unverständliche Datenmengen,
- häufige Benachrichtigungen,
- Warnungen während Training oder Wettkampf,
- starre Trainingsvorgaben.

Leitsatz der Persona:

„Ich möchte ambitioniert trainieren und mich verbessern, aber nicht erst am nächsten Tag merken, dass die Belastung zu hoch war.“

========================================
3. TECHNISCHER UND FUNKTIONALER RAHMEN
========================================

Erstelle einen funktionalen, responsiven Mobile-Web-Prototypen.

Primäres Testformat:
- Breite: 393 px
- Höhe: 852 px
- optimiert für Smartphones zwischen 360 und 430 px Breite
- vertikales Scrollen innerhalb der Screens
- feststehende Bottom-Navigation

Verwende:
- ausschließlich lokale Mock-Daten,
- lokalen Komponenten- beziehungsweise Session-State,
- keine echte Anmeldung,
- kein Backend,
- keine externen APIs,
- keine personenbezogenen Echtdaten,
- keine Kamera- oder Mikrofonfunktionen.

Alle wesentlichen Buttons müssen funktionieren. Es darf keine Sackgassen oder funktionslosen Hauptaktionen geben.

Füge im Bereich „Profil“ eine Funktion „Demo zurücksetzen“ hinzu, mit der alle Mock-Daten auf den Ausgangszustand zurückgesetzt werden.

========================================
4. NAVIGATIONSSTRUKTUR
========================================

Verwende eine feststehende Bottom-Navigation mit fünf Einträgen:

1. Heute
2. Plan
3. Check-in
4. Verlauf
5. Profil

„Check-in“ soll als visuell hervorgehobene mittlere Aktion gestaltet werden.

Verwende verständliche Icons und zusätzlich immer sichtbare Textbezeichnungen. Verlasse dich nicht ausschließlich auf Icons.

========================================
5. TESTSTART UND A/B-VARIANTEN
========================================

Erstelle vor dem eigentlichen App-Einstieg einen einfachen, nur für den Usability-Test bestimmten Auswahlbildschirm:

Überschrift:
„CourtBalance Prototypentest“

Text:
„Bitte wähle die dir zugewiesene Variante.“

Buttons:
- „Variante A starten“
- „Variante B starten“

Beide Varianten verwenden dieselben Daten und Funktionen. Sie unterscheiden sich nur in der Darstellung des Heute-Dashboards:

Variante A:
- Ampelsystem steht im Mittelpunkt
- große Statusfläche Grün, Gelb oder Rot
- Handlungsempfehlung wird zuerst angezeigt
- Detaildaten sind nachgeordnet

Variante B:
- numerischer Tagesstatus von 0 bis 100 steht im Mittelpunkt
- kleine Verlaufsgrafik und Faktorenübersicht werden zuerst angezeigt
- Handlungsempfehlung folgt darunter

Speichere die gewählte Variante während der aktuellen Sitzung. Füge im Profil eine Möglichkeit hinzu, zur Variantenwahl zurückzukehren.

========================================
6. SCREEN „HEUTE“ – DASHBOARD
========================================

Erstelle ein übersichtliches Tagesdashboard.

Begrüßung:
„Guten Morgen, Jürgen“

Zeige das aktuelle Demo-Datum und den nächsten wichtigen Termin:
„Mannschaftsspiel am Sonntag“

Ausgangsdaten:
- Schlafdauer: 6 h 15 min
- Schlafqualität: 3 von 5
- Energie: 3 von 5
- Stress: 4 von 5
- Muskelkater: 2 von 5
- leichte Beschwerden in der rechten Wade
- hohe berufliche Belastung
- Außentemperatur: 29 °C
- Tennisvorbereitung am Freitag
- Mannschaftsspiel am Sonntag

Ausgangsstatus:
- 64 von 100
- Statusfarbe Gelb
- Bezeichnung: „Angepasst trainieren“

Zentrale Empfehlung:
„Heute ist moderates Training möglich. Reduziere laufintensive Belastungen und lege den Schwerpunkt auf Technik.“

Zeige darunter die wichtigsten Einflussfaktoren:
- Schlaf: ausbaufähig
- mentale Belastung: erhöht
- körperliche Beschwerden: leicht
- sportliche Wochenbelastung: mittel
- bevorstehender Wettkampf: berücksichtigen

Jeder Faktor soll antippbar sein und eine kurze Erklärung öffnen.

Primäre Aktionen:
- „Tages-Check-in durchführen“
- „Empfehlungen ansehen“

Sekundäre Inhalte:
- nächster Termin
- Wochenbelastung
- kurze Regenerationsempfehlung
- Hinweis auf warme Wetterbedingungen

Die Darstellung soll ruhig, verständlich und nicht alarmistisch wirken.

========================================
7. SCHNELLER TAGES-CHECK-IN
========================================

Erstelle einen mehrstufigen Check-in, der in weniger als zwei Minuten abgeschlossen werden kann.

Zeige oben einen Fortschrittsindikator.

Schritt 1 – Energie:
Frage:
„Wie energiegeladen fühlst du dich heute?“

Auswahl 1 bis 5 mit verständlichen Bezeichnungen:
1 = sehr erschöpft
5 = sehr energiegeladen

Schritt 2 – Schlaf:
- Schlafdauer
- Schlafqualität von 1 bis 5

Schritt 3 – Körper:
- Muskelkater von 1 bis 5
- Frage: „Hast du aktuell Beschwerden?“
- Auswahl: Nein / Ja
- Bei Ja: Körperregion auswählbar
- Körperregionen als einfache Chips, keine komplexe anatomische Grafik
- Intensität: leicht / mittel / stark

Schritt 4 – mentale Belastung:
- Stress von 1 bis 5
- mentale Verfassung von 1 bis 5

Schritt 5 – heutiger Kontext:
Mehrfachauswahl:
- normaler Arbeitstag
- intensiver Arbeitstag
- private Verpflichtungen
- Training geplant
- Wettkampf geplant
- Reise oder längere Anfahrt

Abschluss:
- kompakte Zusammenfassung
- Button „Check-in speichern“

Nach dem Speichern:
- Tagesstatus neu berechnen
- Empfehlung sichtbar aktualisieren
- kurze Bestätigung anzeigen:
  „Dein Tagesstatus wurde aktualisiert.“

Die Berechnung muss als transparente Demo-Logik umgesetzt werden:
- niedrige Energie, schlechter Schlaf, hohe Beschwerden und hoher Stress reduzieren den Status,
- gute Regeneration und geringe Gesamtbelastung erhöhen den Status,
- bevorstehende Wettkämpfe beeinflussen die Trainingspriorität,
- zeige niemals eine medizinische Risikowahrscheinlichkeit.

========================================
8. SCREEN „EMPFEHLUNGEN“
========================================

Zeige keine einzelne starre Vorgabe, sondern drei gleichwertig zugängliche Handlungsoptionen.

Empfohlene Option:
„45–60 Minuten Techniktraining“

Details:
- moderate Intensität
- Schwerpunkt Aufschlag und kontrollierte Grundschläge
- laufintensive Übungen reduzieren
- ausreichende Pausen
- Wade beobachten

Alternative 1:
„30 Minuten Mobility und leichtes Ausdauertraining“

Alternative 2:
„Regenerationstag“

Für jede Option anzeigen:
- erwartete Belastung: niedrig / mittel / hoch
- geschätzte Dauer
- kurze Begründung
- passende Vor- und Nachbereitung

Buttons:
- „Für heute auswählen“
- „Details“
- „Andere Entscheidung treffen“

Wenn eine Option ausgewählt wird:
- in den Tagesplan übernehmen,
- Dashboard aktualisieren,
- Bestätigung als Toast anzeigen.

Verwende Formulierungen wie:
- „CourtBalance empfiehlt …“
- „Eine mögliche Option ist …“
- „Du entscheidest, was zu deinem aktuellen Zustand passt.“

Vermeide Formulierungen wie:
- „Du darfst nicht trainieren.“
- „Du musst pausieren.“
- „Verletzungsrisiko 74 %.“

========================================
9. SCREEN „PLAN“
========================================

Erstelle eine kombinierte Wochenansicht für sportliche und außersportliche Belastungen.

Zeige eine Kalenderwoche von Montag bis Sonntag.

Beispieldaten:
Montag:
- eigenes Tennistraining, 90 Minuten, hohe Intensität

Dienstag:
- intensiver Projekttermin
- 30 Minuten Mobility

Mittwoch:
- zwei Stunden Jugendtraining als Tennistrainer

Donnerstag:
- aktueller Tag
- vorgeschlagenes Techniktraining

Freitag:
- Mannschaftstraining

Samstag:
- private Verpflichtung
- leichte Aktivierung

Sonntag:
- Mannschaftsspiel mit Anfahrt

Unterscheide visuell:
- eigenes Training
- Wettkampf
- Trainertätigkeit
- Regeneration
- Arbeit
- private Termine

Zeige pro Tag:
- geschätzte Gesamtbelastung
- Regenerationsstatus
- geplante Aktivität

Interaktionen:
- Termin antippen und Details öffnen
- Aktivität verschieben
- Trainingsintensität ändern
- Training entfernen
- alternatives Training auswählen
- kurzfristige berufliche oder private Belastung ergänzen

Wenn ein Termin geändert wird:
- Wochenbelastung aktualisieren
- Empfehlungen neu berechnen
- kurze Rückmeldung anzeigen:
  „Dein Plan wurde an die neue Belastung angepasst.“

========================================
10. TRAININGSVORBEREITUNG
========================================

Erstelle für die ausgewählte Trainingseinheit einen Detailbildschirm.

Inhalte:
- Trainingsart
- geplante Dauer
- geplante Intensität
- Trainingsziel
- aktuelle Temperatur
- relevante Tagesfaktoren
- empfohlene Vorbereitung

Beispielhinweise:
- „Plane bei 29 °C zusätzliche Trinkpausen ein.“
- „Beginne mit einem verlängerten Aufwärmprogramm.“
- „Reduziere laufintensive Übungen, falls die Wade stärker reagiert.“

Buttons:
- „Training starten“
- „Plan anpassen“
- „Training absagen“

Während des simulierten Trainings darf die App keine Echtzeitwarnungen oder störenden Benachrichtigungen anzeigen.

Nach „Training starten“:
- ruhiger Trainingsmodus
- nur verstrichene Zeit und optionaler Button „Training beenden“
- keine Herzfrequenzwarnungen
- keine Leistungsalarme
- keine Pop-ups

========================================
11. NACHBEREITUNG EINER EINHEIT
========================================

Nach „Training beenden“ öffnet sich ein kurzer Nachbereitungsdialog.

Erfassung:
- tatsächliche Dauer
- wahrgenommene Intensität von 1 bis 10
- körperliches Gefühl danach
- Beschwerden: keine / leichter / stärker
- Flüssigkeitsaufnahme grob: wenig / ausreichend / viel
- optionales kurzes Notizfeld

Button:
„Einheit speichern“

Nach dem Speichern:
- Tages- und Wochenbelastung aktualisieren
- Verlauf aktualisieren
- passende Regenerationsempfehlung anzeigen

Beispiel:
„Die Einheit war moderat belastend. Plane heute Abend leichte Mobility und ausreichend Erholung ein.“

========================================
12. SCREEN „VERLAUF“
========================================

Erstelle einen verständlichen Analysebereich ohne überladene Sportwissenschafts-Darstellung.

Zeiträume:
- 7 Tage
- 4 Wochen
- 3 Monate

Inhalte:
- Belastungsverlauf
- Regenerationsverlauf
- Verhältnis Belastung und Erholung
- Trainingshäufigkeit
- Beschwerden
- Schlafentwicklung
- mentale Belastung

Verwende einfache Linien-, Balken- oder Flächendiagramme.

Zeige ein erkennbares Beispielmuster:
„In den vergangenen drei Wochen folgten hohe Belastungstage mehrfach auf kurze Nächte.“

Darunter konkrete Orientierung:
„Prüfe, ob du intensive Einheiten nach beruflich belastenden Tagen reduzieren oder verschieben kannst.“

Kennzeichne dieses Ergebnis als beobachtetes Muster und nicht als medizinische Diagnose.

Füge eine Detailansicht hinzu, in der Nutzer nachvollziehen können, welche Einträge zu einem dargestellten Muster geführt haben.

========================================
13. SCREEN „PROFIL“
========================================

Zeige:
- Jürgen, 28
- LK 7
- Trainingsziele
- bevorzugte Trainingsarten
- Mannschaftsspieler und Jugendtrainer

Bereiche:
- Datenquellen
- Kalender
- Wearable-Verbindung als nicht echte Demo-Verbindung
- Benachrichtigungseinstellungen
- Datenschutzhinweise
- Testvariante wechseln
- Demo zurücksetzen

Benachrichtigungseinstellungen:
- Trainingsvorbereitung
- Trainingsnachbereitung
- Wochenübersicht
- Regenerationserinnerung

Standardmäßig aktiv:
- keine Benachrichtigungen während Training und Wettkampf

Zeige diesen Grundsatz ausdrücklich:
„CourtBalance unterbricht dich während Training und Wettkampf nicht.“

========================================
14. DESIGN UND VISUELLES SYSTEM
========================================

Gestalte die App modern, sportlich, ruhig und vertrauenswürdig.

Verwende keine aggressive Fitnessstudio-Optik und keine übermäßige Gamification.

Farbwelt:
- dunkles Navy als Primärfarbe
- gedecktes Tennis- beziehungsweise Court-Grün
- helles Tennis-Limettengrün nur für Akzente
- helle neutrale Hintergründe
- Gelb, Grün und Rot ausschließlich für verständliche Statusinformationen

Achte darauf, dass Statusinformationen nie ausschließlich durch Farbe vermittelt werden. Ergänze immer Text und Icon.

Typografie:
- klare moderne Sans-Serif-Schrift
- gut erkennbare Hierarchie
- keine sehr kleinen Texte
- Fließtext mindestens 16 px

Layout:
- 8-Pixel-Raster
- konsistente Abstände
- Karten mit moderaten Rundungen
- zurückhaltende Schatten
- große Touch-Ziele von mindestens 44 × 44 px
- ausreichend Kontrast
- klare Fokus-, Hover-, Selected- und Disabled-Zustände

Verwende:
- konsistente Icons, vorzugsweise Lucide Icons
- wiederverwendbare Komponenten
- verständliche Karten
- Chips für schnelle Auswahl
- Bottom Sheets oder Modals nur, wenn sie den Ablauf vereinfachen

Verwende keine Stockfotos. Nutze bei Bedarf abstrakte Tennisplatzlinien, Ball- oder Schläger-Icons als zurückhaltende grafische Elemente.

========================================
15. INHALTLICHE GRENZEN
========================================

Füge keine der folgenden Funktionen hinzu:
- soziales Netzwerk
- öffentliche Ranglisten
- Chatbot
- Trainer-Dashboard
- medizinische Diagnose
- Verletzungsprognose in Prozent
- dauerhafte Live-Überwachung
- Echtzeitwarnungen während eines Spiels
- Kalorien- oder Gewichtsmanagement
- kostenpflichtige Abonnements
- Login- oder Registrierungsprozess
- komplexe Smartwatch-Oberfläche

Fokussiere ausschließlich auf:
- Belastung und Regeneration
- flexible Trainingsentscheidungen
- geringe manuelle Erfassung
- verständliche Empfehlungen
- Vor- und Nachbereitung
- selbstbestimmte Entscheidung des Spielers

========================================
16. FUNKTIONALE TESTAUFGABEN
========================================

Der Prototyp muss folgende Testaufgaben vollständig ermöglichen:

Testaufgabe 1:
Der Nutzer führt einen Tages-Check-in durch und erkennt anschließend, wie sich der Tagesstatus verändert hat.

Testaufgabe 2:
Der Nutzer vergleicht mehrere Trainingsoptionen, wählt selbst eine aus und übernimmt sie in den Tagesplan.

Testaufgabe 3:
Der Nutzer ergänzt einen kurzfristigen beruflichen Termin und erkennt, wie sich die Wochenplanung anpasst.

Testaufgabe 4:
Der Nutzer startet und beendet eine Trainingseinheit und dokumentiert sie anschließend mit wenigen Eingaben.

Testaufgabe 5:
Der Nutzer öffnet den Verlauf und kann ein ungünstiges Belastungs- und Regenerationsmuster erkennen.

Testaufgabe 6:
Der Nutzer kann erklären, warum CourtBalance eine bestimmte Empfehlung ausgesprochen hat.

========================================
17. ABNAHMEKRITERIEN
========================================

Die Umsetzung ist erst abgeschlossen, wenn:

- alle fünf Hauptnavigationselemente funktionieren,
- beide Dashboardvarianten auswählbar sind,
- der Tages-Check-in vollständig funktioniert,
- Eingaben den Tagesstatus sichtbar verändern,
- drei selbstbestimmte Trainingsoptionen vorhanden sind,
- eine Option in den Plan übernommen werden kann,
- Termine im Wochenplan geändert werden können,
- Training gestartet und beendet werden kann,
- die Nachbereitung funktioniert,
- der Verlauf aktualisiert wird,
- alle Zurück-Buttons funktionieren,
- es keine funktionslosen Hauptbuttons gibt,
- alle Inhalte auf Deutsch sind,
- die Mobile-Darstellung bei 393 × 852 px vollständig nutzbar ist,
- keine Inhalte horizontal abgeschnitten werden,
- wichtige Bedienelemente nicht von der Bottom-Navigation verdeckt werden,
- die Demo über das Profil zurückgesetzt werden kann.

Erstelle zunächst eine klare Komponenten- und Screenstruktur. Implementiere anschließend die beschriebenen Interaktionen und prüfe danach selbstständig den vollständigen End-to-End-Ablauf.

Füge keine nicht angeforderten Funktionen hinzu. Triff bei kleineren Gestaltungsdetails selbstständig sinnvolle Entscheidungen, ohne den beschriebenen Funktionsumfang zu verändern.