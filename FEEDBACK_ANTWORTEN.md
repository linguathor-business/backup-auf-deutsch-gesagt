# Antworten auf Robin Meinerts Feedback (Anmerkungen V1)

## Zusammenfassung der umgesetzten Änderungen

### ✅ 1. Name & Branding
- **App-Name** überall auf „Auf Deutsch gesagt!" (mit Ausrufezeichen) korrigiert — im Titel, in der Navbar, auf der Landing Page, Login, Register und Footer.
- **Logo** (`ADG! Logo_transparent.png`) in Hero-Bereich, Login und Register integriert.
- **Icon** (`ADG!_Icon_transparent.png`) als Navbar-Icon und Favicon gesetzt.

### ✅ 2. Fortschrittsanzeige (Progress Bar)
- `getCompletionPercent()` zählt jetzt **alle 72 Checkpoints** (12 Module × 6 Abschnitte: Geschichte, Vokabeln, Lesen, Hören, Sprechen, Schreiben) statt nur vollständig abgeschlossene Module. So steigt der Fortschritt ab der ersten erledigten Aufgabe.

### ✅ 3. E-Mail-Erinnerungen
- Auf dem Dashboard gibt es jetzt eine **Toggle-Karte** für E-Mail-Erinnerungen bei 3 Tagen Inaktivität. Aktuell ist es ein UI-Platzhalter — die tatsächliche E-Mail-Funktion benötigt ein Backend (z.B. mit Resend, SendGrid oder einer Cloud Function). Die UI ist aber schon mal vorbereitet.

### ✅ 4. Story-Header-Bilder
- Das `StoryPlayer`-Komponent zeigt jetzt **ein Header-Bild** über jeder Geschichte an, wenn `headerImage` im Modul-Datensatz gesetzt ist. Falls kein Bild vorhanden ist, wird ein dekorativer Gradient mit 📖-Emoji angezeigt.
- Um passende Bilder einzufügen, einfach `headerImage: "/images/story-1.jpg"` in `data/modules.ts` setzen und die Bilder in `/public/images/` ablegen.
- **Empfehlung**: Lizenzfreie Landschafts-/Stadtbilder von Unsplash nehmen, die thematisch passen (keine Menschen).

### ✅ 5. Vokabeln: Deutsch-Deutsch statt Deutsch-Englisch
- Englische Übersetzungen entfernt. Stattdessen werden **deutsche Definitionen** gezeigt (z.B. „bedeutet: sehr angespannt und nervös sein").
- Alle Vokabeln in Modul 1 (11 Kernverben + 14 Redewendungen) und Modul 2 (9 Kernverben + 2 Redewendungen) haben jetzt eine deutsche `definition`.

### ✅ 6. Text-to-Speech (TTS) / Audio
- **Neues TTS-Modul** (`src/lib/tts.ts`) mit `speakGerman()` — nutzt die Web Speech API mit deutscher Stimme.
- **VocabularyLab**: Jedes Vokabelwort hat einen 🔊-Button, und Beispielsätze sind per Klick hörbar.
- **StoryPlayer**: Klick auf einen Satz spricht ihn jetzt über TTS vor.
- **Übungen (Hören)**: Lückentexte und Zuordnungsübungen haben 🔊-Buttons, um die deutschen Sätze vorzulesen.
- **Schreiben**: Musterlösung ist per Klick hörbar.
- **Sprechen**: Musterlösung ist per Klick hörbar.

### ✅ 7. Erfolgsfeier bei richtigen Antworten
- Nach vollständig richtig beantworteten Übungen erscheint eine **Erfolgsmeldung** mit ⭐-Icon und motivierendem Satz auf Deutsch (z.B. „Super gemacht! Weiter so! 🌟" oder „Perfekt! Du bist auf dem richtigen Weg! 💪").
- Animation: sanftes Einblenden (fade-in).

### ✅ 8. Antworten bleiben sichtbar
- Nach dem Überprüfen bleiben die Antworten sichtbar (Buttons werden deaktiviert). Es gibt einen **„Nochmal"-Button**, um die Übung manuell zurückzusetzen.

### ✅ 9. Sprechen-Übung (Web Speech API)
- Komplett neu mit **Spracherkennung** (Web Speech API SpeechRecognition) implementiert:
  - Mikrofon-Button zum Starten/Stoppen der Aufnahme (mit Puls-Animation)
  - Echtzeit-Transkript-Anzeige
  - Feedback-Panel: Zeigt an, welche Schlüsselwörter erkannt wurden
  - Hinweis bei Browsern, die die API nicht unterstützen
  - Musterlösung hörbar per TTS

### ✅ 10. Schreiben-Übung: Feedback
- Nach Absenden wird ein **Feedback-Bereich** angezeigt mit:
  - Textlänge (Wörter + Sätze)
  - Erkannte Vokabeln aus der Aufgabe
  - Tipp: „Vergleiche deinen Text mit der Musterlösung"
  - „Nochmal schreiben"-Button

---

## Robins Fragen — Antworten

### „Was ergibt die Overall Progress Bar? Füllt sich ja nicht"
**Antwort**: Die Progress Bar hat jetzt eine neue Berechnungslogik. Vorher wurde nur gezählt, wie viele der 12 Module *vollständig* abgeschlossen waren (also erst bei 100% eines gesamten Moduls gab es Fortschritt). Jetzt wird jeder einzelne der 72 Checkpoints (12 Module × 6 Bereiche) gezählt. Das heißt: Sobald du z.B. die Geschichte von Modul 1 liest, steigt der Gesamtfortschritt um ca. 1.4%.

### „Ergibt das Ergebnis einer einzelnen Aufgabe oder das Ergebnis aller Aufgaben kombiniert?"
**Antwort**: Das Ergebnis ergibt sich aus **allen Aufgaben kombiniert** über alle Module hinweg. Jedes Modul hat 6 Checkpoints (Geschichte lesen, Vokabeln lernen, Lesen-Übung, Hören-Übung, Sprechen-Übung, Schreiben-Übung). Der Gesamtfortschritt ist der Anteil aller erledigten Checkpoints an den insgesamt 72 möglichen.

### „Kann man eine E-Mail-Erinnerung einbauen, wenn der User z.B. 3 Tage nicht auf der App war?"
**Antwort**: Die UI dafür ist jetzt auf dem Dashboard als Toggle-Karte vorhanden. Für die tatsächliche E-Mail-Funktion bräuchte man ein Backend — z.B. eine Cron-Job-Cloud-Function (Vercel Cron + Resend API), die `lastAccessed`-Timestamps prüft und bei >3 Tagen Inaktivität eine E-Mail sendet. Das Frontend ist vorbereitet, das Backend müsste separat aufgesetzt werden.

### „Noch ein passendes Foto als Header über jeder Geschichte wäre cool. Es sollten keine Menschen darauf zu sehen sein, aber es sollte thematisch zur Geschichte passen."
**Antwort**: Die Komponente unterstützt jetzt `headerImage`. Um Bilder hinzuzufügen:
1. Passende lizenzfreie Bilder finden (z.B. bei Unsplash, Pexels — Landschaften, Stadtszenen, abstrakte Motive)
2. In `/public/images/` ablegen
3. In `src/data/modules.ts` bei der Story das Feld `headerImage: "/images/dateiname.jpg"` setzen

**Empfehlungen für Modul-Header-Bilder**:
- Modul 1 „Unter Strom": Bild einer belebten Großstadt bei Nacht (Berlin Skyline o.ä.)
- Modul 2 „In der Schwebe": Wolken/Nebel über einer Landschaft
- Modul 3 „Auf Augenhöhe": Zwei leere Stühle an einem Tisch (Gesprächssituation)

### „Technisch funktionieren die Sprechen-Aufgaben derzeit nicht"
**Antwort**: Jetzt implementiert mit der **Web Speech API** (SpeechRecognition). Die Spracherkennung funktioniert in Chrome, Edge und den meisten Chromium-Browsern. Firefox und Safari haben eingeschränkte Unterstützung — dafür wird ein Hinweis angezeigt. Der User kann auf den Mikrofon-Button klicken, sprechen, und bekommt Echtzeit-Feedback, welche Wörter erkannt wurden.

---

## Empfehlungen für die Weiterentwicklung

1. **Backend für E-Mail-Erinnerungen**: Vercel Cron Jobs + Resend API wäre die einfachste Lösung. Man bräuchte eine Datenbank (z.B. Supabase/PlanetScale) für User-Daten und Timestamps.

2. **Echte Audio-Dateien**: Die Web Speech API TTS ist gut als Fallback, aber für konsistente Qualität wären vorproduzierte MP3s ideal (z.B. mit ElevenLabs oder Amazon Polly generiert).

3. **Module 3–12 ausbauen**: Aktuell sind Module 3–12 Platzhalter. Die Vokabel-Definitionen und Übungsinhalte sollten dort nach dem gleichen Muster wie Modul 1 & 2 ergänzt werden.

4. **Spracherkennung-Fallback**: Für Safari/Firefox könnte man alternativ eine Audio-Aufnahme anbieten, die serverseitig transkribiert wird (z.B. via Whisper API).

5. **Dark/Light Mode**: Das Design ist komplett Dark Mode — ein Light-Mode-Toggle wäre für manche User angenehmer.

6. **Offline-Fähigkeit**: Mit einem Service Worker könnten die TTS-Stimmen und Übungsdaten gecacht werden, damit die App auch offline nutzbar ist.
