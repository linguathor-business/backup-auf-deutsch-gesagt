import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', 'src', 'data', 'modules.ts');

const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

// ── helpers ──────────────────────────────────────────────────
function exercisesToString(exercises) {
  const json = JSON.stringify(exercises, null, 2);
  // indent every line by 4 spaces (to match `  "exercises": [ ... ]` nesting)
  return json.split('\n').map((l, i) => {
    if (i === 0) return '  "exercises": ' + l;
    return '    ' + l;
  }).join('\n').replace(/\n    \]$/, '\n  ]');
}

// ── exercise definitions ─────────────────────────────────────

const allExercises = {};

// ========== MODULE 2: bringen ==========
allExercises[2] = [
  {
    id: "m2-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Alex bringt zuerst ein paar Unterlagen zu Frau Krüger rüber.", correct: true },
      { statement: "Die Torte wird direkt ins Büro geliefert.", correct: false },
      { statement: "Nora ist eine Kollegin von Alex.", correct: false },
      { statement: "Der Lieferant versucht mehrfach, sich herauszureden.", correct: true },
      { statement: "Jule ist über die Geburtstagsüberraschung verärgert.", correct: false }
    ]
  },
  {
    id: "m2-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form. Achte auf die Verbform.",
    sentences: [
      { text: "Wir müssen ihm das sanft ___.", answer: "beibringen" },
      { text: "Mehmet hat die Kerzen ___.", answer: "mitgebracht" },
      { text: "Ich muss die Torte so schnell wie möglich ___.", answer: "herbringen" },
      { text: "Wir versuchen, die Torte im Kühlschrank ___.", answer: "unterzubringen" },
      { text: "Alex ___ dem Lieferanten die Infos so ruhig wie möglich.", answer: "überbringt" },
      { text: "Danach ___ ich den Müll ___.", answer: "bringe ... raus" }
    ]
  },
  {
    id: "m2-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die bringen-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "Transport (A → B)", items: ["rüberbringen", "mitbringen", "herbringen", "wegbringen"] },
      { name: "Einordnung & Platzierung", items: ["unterbringen", "reinbringen", "rausbringen", "zurückbringen"] },
      { name: "Übertragene Bedeutung", items: ["beibringen", "überbringen", "einbringen"] }
    ]
  },
  {
    id: "m2-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["mitgebracht", "hergebracht", "untergebracht", "rausgebracht", "zurückgebracht", "eingebracht"],
    sentences: [
      { text: "Mehmet hat die Kerzen ___.", answer: "mitgebracht" },
      { text: "Alex hat die Torte so schnell wie möglich ins Büro ___.", answer: "hergebracht" },
      { text: "Die Torte wurde im Kühlschrank ___.", answer: "untergebracht" },
      { text: "Am Ende hat Alex den Müll ___.", answer: "rausgebracht" },
      { text: "Mehmet hat die Teller in den Schrank ___.", answer: "zurückgebracht" },
      { text: "Die Kollegen haben sich alle irgendwie ___.", answer: "eingebracht" }
    ]
  },
  {
    id: "m2-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Jemand plant heimlich eine Überraschung.", right: "etwas im Schilde führen" },
      { left: "Die falsche Lieferung hat den Plan durchkreuzt.", right: "einen Strich durch die Rechnung machen" },
      { left: "Frau Krüger sagt: Bitte diplomatisch bleiben.", right: "den Ball flach halten" },
      { left: "Mehmet benutzt LED-Teelichter statt echten Kerzen.", right: "auf Nummer sicher gehen" },
      { left: "Der Lieferant sucht Ausreden.", right: "sich herausreden" },
      { left: "Die Feier soll klein bleiben – nicht übertrieben.", right: "keinen Wirbel machen" }
    ]
  },
  {
    id: "m2-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Du siehst aus, als wäre dir eine Laus über die ___ gelaufen.", modelAnswer: "Leber" },
      { prompt: "Das macht uns jetzt einen Strich durch die ___.", modelAnswer: "Rechnung" },
      { prompt: "Bitte den Ball flach ___.", modelAnswer: "halten" },
      { prompt: "Was führt ihr denn im ___?", modelAnswer: "Schilde" },
      { prompt: "Wir bleiben einfach bei den ___.", modelAnswer: "Fakten" },
      { prompt: "Die Feier war toll – und das ohne großen ___.", modelAnswer: "Aufriss" }
    ]
  },
  {
    id: "m2-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Ich bringe die Unterlagen zu Frau Krüger mit.", correct: "Ich bringe die Unterlagen zu Frau Krüger rüber.", explanation: "rüberbringen = etwas hinüberbringen. mitbringen = etwas dabei haben." },
      { incorrect: "Wir müssen ihm das sanft herbringen.", correct: "Wir müssen ihm das sanft beibringen.", explanation: "beibringen = jemandem etwas vorsichtig erklären. herbringen = etwas transportieren." },
      { incorrect: "Die Torte war so groß, wir konnten sie nicht einbringen.", correct: "Die Torte war so groß, wir konnten sie nicht unterbringen.", explanation: "unterbringen = verstauen. einbringen = sich beteiligen." },
      { incorrect: "Alex überbringt den Müll nach der Feier.", correct: "Alex bringt den Müll nach der Feier raus.", explanation: "rausbringen = nach draußen bringen. überbringen = formell Informationen weitergeben." },
      { incorrect: "Alle haben sich irgendwie mitgebracht.", correct: "Alle haben sich irgendwie eingebracht.", explanation: "einbringen = sich mit Ideen oder Hilfe beteiligen. mitbringen = etwas dabei haben." }
    ]
  },
  {
    id: "m2-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden bringen-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese bringen-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- mitbringen\n- beibringen\n- unterbringen\n- herbringen\n- einbringen\n- rüberbringen",
    mustUseWords: ["mitbringen", "beibringen", "unterbringen", "herbringen", "einbringen", "rüberbringen"],
    modelAnswer: "Mitbringen bedeutet, etwas dabei zu haben und mitzunehmen. Beibringen heißt, jemandem etwas vorsichtig erklären oder lehren. Unterbringen bedeutet, etwas irgendwo passend verstauen. Herbringen heißt, etwas an den eigenen Standort bringen. Einbringen bedeutet, sich mit Ideen oder Hilfe beteiligen. Rüberbringen heißt, etwas zu einer anderen Person hinüberbringen."
  },
  {
    id: "m2-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele bringen-Verben haben mehr als eine Bedeutung!",
    content: "Viele bringen-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "beibringen", meanings: [
        { label: "Im Text", example: "Wir müssen ihm das sanft beibringen. (vorsichtig erklären)" },
        { label: "Weitere Bedeutung", example: "Kannst du mir Gitarre beibringen? (jemandem etwas lehren)" }
      ]},
      { verb: "einbringen", meanings: [
        { label: "Im Text", example: "Wir haben uns alle irgendwie eingebracht. (sich beteiligen)" },
        { label: "Weitere Bedeutung", example: "Die Investition hat viel Gewinn eingebracht. (Ertrag erzielen)" }
      ]},
      { verb: "unterbringen", meanings: [
        { label: "Im Text", example: "Die Torte im Kühlschrank unterbringen. (verstauen)" },
        { label: "Weitere Bedeutung", example: "Der Gast wurde im Hotel untergebracht. (Unterkunft geben)" }
      ]},
      { verb: "rüberbringen", meanings: [
        { label: "Im Text", example: "Unterlagen zu Frau Krüger rüberbringen. (transportieren)" },
        { label: "Weitere Bedeutung", example: "Er bringt seine Ideen gut rüber. (verständlich vermitteln)" }
      ]}
    ]
  },
  {
    id: "m2-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Kannst du mir bitte Schach beibringen?\" – Was bedeutet beibringen hier?", options: ["jemandem etwas vorsichtig erklären", "jemandem etwas lehren", "etwas transportieren"], correctIndex: 1 },
      { question: "\"Die Firma hat letztes Jahr viel Gewinn eingebracht.\" – Was bedeutet einbringen hier?", options: ["sich beteiligen", "Ertrag erzielen", "etwas hineintragen"], correctIndex: 1 },
      { question: "\"Im Hotel wurde der Gast im dritten Stock untergebracht.\" – Was bedeutet unterbringen hier?", options: ["verstauen", "jemandem eine Unterkunft geben", "verstecken"], correctIndex: 1 },
      { question: "\"Er bringt seine Argumente gut rüber.\" – Was bedeutet rüberbringen hier?", options: ["etwas transportieren", "verständlich vermitteln", "etwas zurückbringen"], correctIndex: 1 },
      { question: "\"Der Botschafter hat die Nachricht offiziell überbracht.\" – Was bedeutet überbringen hier?", options: ["etwas transportieren", "etwas lehren", "formell eine Information weitergeben"], correctIndex: 2 }
    ]
  }
];

// ========== MODULE 3: nehmen ==========
allExercises[3] = [
  {
    id: "m3-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Alex organisiert einen Spieleabend bei sich zu Hause.", correct: true },
      { statement: "Ben bringt wie versprochen Wein und ein Spiel mit.", correct: false },
      { statement: "Nora wird von Alex spontan zum Spieleabend eingeladen.", correct: true },
      { statement: "Mehmet spielt von Anfang an begeistert mit.", correct: false },
      { statement: "Am Ende gewinnt Mehmet überraschend die zweite Runde.", correct: true }
    ]
  },
  {
    id: "m3-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form.",
    sentences: [
      { text: "Ich ___ ein Paket für Nora ___.", answer: "nehme ... an" },
      { text: "Dem Rezept ___ ich: erst die Zwiebeln anbraten.", answer: "entnehme" },
      { text: "Plötzlich ___ ich einen verbrannten Geruch ___.", answer: "nehme ... wahr" },
      { text: "Ben ___ die Jacke ___.", answer: "nimmt ... ab" },
      { text: "Jule ___ mir den Kochlöffel aus der Hand.", answer: "nimmt" },
      { text: "Wir ___ die Plätze am Tisch ___.", answer: "nehmen ... ein" }
    ]
  },
  {
    id: "m3-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die nehmen-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "Greifen & Verwenden", items: ["nehmen", "mitnehmen", "dazunehmen", "abnehmen"] },
      { name: "Sinne & Information", items: ["wahrnehmen", "entnehmen", "annehmen"] },
      { name: "Rolle & Beteiligung", items: ["übernehmen", "einnehmen", "teilnehmen"] }
    ]
  },
  {
    id: "m3-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["angenommen", "entnommen", "wahrgenommen", "mitgenommen", "übernommen", "teilgenommen"],
    sentences: [
      { text: "Alex hat das Paket für Nora ___.", answer: "angenommen" },
      { text: "Dem Rezept hat Jule die Anweisungen ___.", answer: "entnommen" },
      { text: "Alex hat plötzlich einen verbrannten Geruch ___.", answer: "wahrgenommen" },
      { text: "Ben hat die Tasche leider nicht aus dem Bus ___.", answer: "mitgenommen" },
      { text: "Jule hat die Rettung des Essens ___.", answer: "übernommen" },
      { text: "Mehmet hat überraschend an der zweiten Runde ___.", answer: "teilgenommen" }
    ]
  },
  {
    id: "m3-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Alles läuft von allein ohne Probleme.", right: "ein Selbstläufer" },
      { left: "Jemand sagt plötzlich etwas Ungeplantes.", right: "Aus jemandem platzt es heraus." },
      { left: "In der Hektik passiert ein Fehler.", right: "im Eifer des Gefechts" },
      { left: "Man weiß genau, wie bestimmte Leute ticken.", right: "seine Pappenheimer kennen" },
      { left: "Die Zeit vergeht, ohne dass man es bemerkt.", right: "das Zeitgefühl verlieren" },
      { left: "Man ändert seine Meinung noch einmal.", right: "es sich anders überlegen" }
    ]
  },
  {
    id: "m3-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Ben hat die Tasche im Eifer des ___ stehen lassen.", modelAnswer: "Gefechts" },
      { prompt: "Ich kenne doch meine ___.", modelAnswer: "Pappenheimer" },
      { prompt: "Am Spieleabend haben wir das Zeitgefühl komplett ___.", modelAnswer: "verloren" },
      { prompt: "Eigentlich war der Abend ein ___.", modelAnswer: "Selbstläufer" },
      { prompt: "Mehmet hat die Stimmung ___.", modelAnswer: "gerettet" },
      { prompt: "Mach mich jetzt bitte nicht ___.", modelAnswer: "fertig" }
    ]
  },
  {
    id: "m3-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Ich nehme ein Paket für meine Nachbarin wahr.", correct: "Ich nehme ein Paket für meine Nachbarin an.", explanation: "annehmen = entgegennehmen. wahrnehmen = bemerken." },
      { incorrect: "Ben nimmt die Jacke ein.", correct: "Ben nimmt die Jacke ab.", explanation: "abnehmen = Kleidung ablegen. einnehmen = einen Platz besetzen." },
      { incorrect: "Wir entnehmen an der zweiten Runde.", correct: "Wir nehmen an der zweiten Runde teil.", explanation: "teilnehmen = mitmachen. entnehmen = herauslesen." },
      { incorrect: "Plötzlich habe ich einen Geruch angenommen.", correct: "Plötzlich habe ich einen Geruch wahrgenommen.", explanation: "wahrnehmen = bemerken. annehmen = entgegennehmen." },
      { incorrect: "Jule hat die Aufgabe eingenommen.", correct: "Jule hat die Aufgabe übernommen.", explanation: "übernehmen = Verantwortung an sich nehmen. einnehmen = Platz besetzen." }
    ]
  },
  {
    id: "m3-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden nehmen-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese nehmen-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- annehmen\n- wahrnehmen\n- teilnehmen\n- übernehmen\n- einnehmen\n- mitnehmen",
    mustUseWords: ["annehmen", "wahrnehmen", "teilnehmen", "übernehmen", "einnehmen", "mitnehmen"],
    modelAnswer: "Annehmen bedeutet, etwas entgegenzunehmen, z. B. ein Paket. Wahrnehmen heißt, etwas bemerken oder registrieren, z. B. einen Geruch. Teilnehmen bedeutet, bei etwas mitzumachen. Übernehmen heißt, eine Aufgabe oder Verantwortung an sich zu nehmen. Einnehmen bedeutet, einen Platz zu besetzen. Mitnehmen heißt, etwas dabei zu haben."
  },
  {
    id: "m3-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele nehmen-Verben haben mehr als eine Bedeutung!",
    content: "Viele nehmen-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "annehmen", meanings: [
        { label: "Im Text", example: "Ich nehme das Paket für Nora an. (entgegennehmen)" },
        { label: "Weitere Bedeutung", example: "Ich nehme an, dass er bald kommt. (vermuten)" }
      ]},
      { verb: "einnehmen", meanings: [
        { label: "Im Text", example: "Wir nehmen die Plätze am Tisch ein. (einen Platz besetzen)" },
        { label: "Weitere Bedeutung", example: "Er nimmt dreimal täglich Tabletten ein. (Medizin schlucken)" }
      ]},
      { verb: "abnehmen", meanings: [
        { label: "Im Text", example: "Er nimmt die Jacke ab. (Kleidung ablegen)" },
        { label: "Weitere Bedeutung", example: "Sie hat fünf Kilo abgenommen. (Gewicht verlieren)" }
      ]},
      { verb: "übernehmen", meanings: [
        { label: "Im Text", example: "Jule übernimmt die Rettung. (eine Aufgabe an sich nehmen)" },
        { label: "Weitere Bedeutung", example: "Er hat sich auf der Arbeit übernommen. (sich zu viel zumuten)" }
      ]}
    ]
  },
  {
    id: "m3-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Ich nehme an, dass morgen schönes Wetter wird.\" – Was bedeutet annehmen hier?", options: ["ein Paket entgegennehmen", "vermuten", "akzeptieren"], correctIndex: 1 },
      { question: "\"Er nimmt dreimal täglich seine Tabletten ein.\" – Was bedeutet einnehmen hier?", options: ["einen Platz besetzen", "etwas kaufen", "Medizin schlucken"], correctIndex: 2 },
      { question: "\"Nach dem Sport hat sie fünf Kilo abgenommen.\" – Was bedeutet abnehmen hier?", options: ["Kleidung ablegen", "etwas wegnehmen", "Gewicht verlieren"], correctIndex: 2 },
      { question: "\"Er hat sich bei dem Projekt völlig übernommen.\" – Was bedeutet sich übernehmen hier?", options: ["eine Aufgabe erledigen", "etwas transportieren", "sich zu viel zumuten"], correctIndex: 2 },
      { question: "\"An dem Kurs haben zwanzig Personen teilgenommen.\" – Was bedeutet teilnehmen hier?", options: ["etwas aufteilen", "mitmachen", "etwas bemerken"], correctIndex: 1 }
    ]
  }
];

// ========== MODULE 4: stellen ==========
allExercises[4] = [
  {
    id: "m4-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Frau Krüger hat die neue Büroeinrichtung bestellt.", correct: true },
      { statement: "Der erste Tisch steht sofort perfekt an seinem Platz.", correct: false },
      { statement: "Die neuen Stühle haben ungefähr zwölf Hebel.", correct: true },
      { statement: "Der höhenverstellbare Tisch funktioniert von Anfang an problemlos.", correct: false },
      { statement: "Am Ende springt der neue Drucker auf Störung.", correct: true }
    ]
  },
  {
    id: "m4-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form.",
    sentences: [
      { text: "Frau Krüger will, dass heute alles an Ort und Stelle ___.", answer: "steht" },
      { text: "Zuerst ___ wir die Tische ___.", answer: "stellen ... auf" },
      { text: "Danach müssen die Stühle richtig ___ werden.", answer: "eingestellt" },
      { text: "Der Monteur hat den Hubwagen direkt vor der Tür ___.", answer: "abgestellt" },
      { text: "Ich ___ meinen Rucksack unter die Fensterbank.", answer: "stelle" },
      { text: "Am Ende ___ ich ___: Die Technik ist empfindlich.", answer: "stelle ... fest" }
    ]
  },
  {
    id: "m4-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die stellen-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "Position & Platzierung", items: ["stellen", "abstellen", "aufstellen", "hinstellen"] },
      { name: "Veränderung & Anpassung", items: ["einstellen", "umstellen", "bereitstellen"] },
      { name: "Übertragene Bedeutung", items: ["feststellen", "bestellen", "sich anstellen"] }
    ]
  },
  {
    id: "m4-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["abgestellt", "aufgestellt", "eingestellt", "umgestellt", "bereitgestellt", "festgestellt"],
    sentences: [
      { text: "Die Tische wurden im Büro ___.", answer: "aufgestellt" },
      { text: "Die Stühle wurden passend ___.", answer: "eingestellt" },
      { text: "Der Hubwagen wurde vor der Tür ___.", answer: "abgestellt" },
      { text: "Die Möbel mussten wegen der Bodendose ___ werden.", answer: "umgestellt" },
      { text: "Die Monitore wurden auf den Tischen ___.", answer: "bereitgestellt" },
      { text: "Am Ende wurde ein Fehler am Drucker ___.", answer: "festgestellt" }
    ]
  },
  {
    id: "m4-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Alles ist genau dort, wo es gebraucht wird.", right: "an Ort und Stelle" },
      { left: "Man schafft eine schwierige Aufgabe trotz Stress.", right: "etwas gewuppt kriegen" },
      { left: "Jemand tut etwas ganz ungeniert.", right: "ohne jede Scham" },
      { left: "Das Projekt fängt gleich mit Problemen an.", right: "Das geht ja gut los." },
      { left: "Etwas blockiert den Durchgang.", right: "im Weg stehen" },
      { left: "Am Ende war alles gar nicht so schlimm.", right: "halb so wild" }
    ]
  },
  {
    id: "m4-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Die neue Einrichtung soll heute an Ort und ___ stehen.", modelAnswer: "Stelle" },
      { prompt: "Das kriegen wir neben dem Tagesgeschäft auch noch ___.", modelAnswer: "gewuppt" },
      { prompt: "Jule zeigt ohne jede ___ auf mich.", modelAnswer: "Scham" },
      { prompt: "Das geht ja gut ___!", modelAnswer: "los" },
      { prompt: "Bitte den Drucker nicht so ___, dass er im Weg steht.", modelAnswer: "hinstellen" },
      { prompt: "Am Ende war alles halb so ___.", modelAnswer: "wild" }
    ]
  },
  {
    id: "m4-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Ich habe den Fehler eingestellt.", correct: "Ich habe den Fehler festgestellt.", explanation: "feststellen = erkennen/bemerken. einstellen = justieren." },
      { incorrect: "Alex stellt die Monitore fest.", correct: "Alex stellt die Monitore bereit.", explanation: "bereitstellen = vorbereiten. feststellen = erkennen." },
      { incorrect: "Frau Krüger hat die Möbel aufgestellt.", correct: "Frau Krüger hat die Möbel bestellt.", explanation: "bestellen = ordern. aufstellen = an Platz stellen." },
      { incorrect: "Jetzt stell dich mal nicht so bereit.", correct: "Jetzt stell dich mal nicht so an.", explanation: "sich anstellen = sich empfindlich verhalten. bereitstellen = vorbereiten." },
      { incorrect: "Wir müssen den Drucker feststellen, damit er nicht im Weg steht.", correct: "Wir müssen den Drucker umstellen, damit er nicht im Weg steht.", explanation: "umstellen = Anordnung ändern. feststellen = erkennen." }
    ]
  },
  {
    id: "m4-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden stellen-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese stellen-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- aufstellen\n- einstellen\n- umstellen\n- feststellen\n- bereitstellen\n- sich anstellen",
    mustUseWords: ["aufstellen", "einstellen", "umstellen", "feststellen", "bereitstellen", "anstellen"],
    modelAnswer: "Aufstellen bedeutet, Möbel an ihren vorgesehenen Platz zu stellen. Einstellen heißt, etwas passend justieren, z. B. einen Stuhl. Umstellen bedeutet, die Anordnung von etwas zu verändern. Feststellen heißt, etwas bemerken oder erkennen. Bereitstellen bedeutet, etwas so vorzubereiten, dass es sofort benutzt werden kann. Sich anstellen heißt, sich unnötig empfindlich oder kompliziert zu verhalten."
  },
  {
    id: "m4-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele stellen-Verben haben mehr als eine Bedeutung!",
    content: "Viele stellen-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "einstellen", meanings: [
        { label: "Im Text", example: "Die Stühle müssen richtig eingestellt werden. (justieren)" },
        { label: "Weitere Bedeutung", example: "Die Firma hat neue Mitarbeiter eingestellt. (anstellen, beschäftigen)" }
      ]},
      { verb: "umstellen", meanings: [
        { label: "Im Text", example: "Die Möbel müssen umgestellt werden. (Anordnung ändern)" },
        { label: "Weitere Bedeutung", example: "Er muss sich auf die neue Situation umstellen. (sich anpassen)" }
      ]},
      { verb: "bestellen", meanings: [
        { label: "Im Text", example: "Frau Krüger hat die Möbel bestellt. (kaufen, ordern)" },
        { label: "Weitere Bedeutung", example: "Der Arzt hat ihn für Montag bestellt. (zu einem Termin einladen)" }
      ]},
      { verb: "abstellen", meanings: [
        { label: "Im Text", example: "Der Hubwagen wurde vor der Tür abgestellt. (hinstellen)" },
        { label: "Weitere Bedeutung", example: "Diese Störung muss abgestellt werden. (beenden, beseitigen)" }
      ]}
    ]
  },
  {
    id: "m4-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Die Firma hat drei neue Mitarbeiter eingestellt.\" – Was bedeutet einstellen hier?", options: ["etwas justieren", "jemanden beschäftigen", "etwas beenden"], correctIndex: 1 },
      { question: "\"Er muss sich auf die neue Situation umstellen.\" – Was bedeutet umstellen hier?", options: ["Möbel verrücken", "sich anpassen", "etwas bestellen"], correctIndex: 1 },
      { question: "\"Der Arzt hat mich für 14 Uhr bestellt.\" – Was bedeutet bestellen hier?", options: ["etwas kaufen", "etwas hinstellen", "jemanden zu einem Termin einladen"], correctIndex: 2 },
      { question: "\"Diese Störung muss sofort abgestellt werden.\" – Was bedeutet abstellen hier?", options: ["etwas hinstellen", "ein Problem beenden", "etwas vorbereiten"], correctIndex: 1 },
      { question: "\"Stell dich nicht so an – das ist nicht schlimm.\" – Was bedeutet sich anstellen hier?", options: ["in einer Schlange warten", "sich empfindlich verhalten", "etwas aufstellen"], correctIndex: 1 }
    ]
  }
];

// ========== MODULE 5: stehen ==========
allExercises[5] = [
  {
    id: "m5-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Alex und Ben treffen sich in einem Restaurant.", correct: false },
      { statement: "Ben hat vergessen, dass er heute eine Präsentation hat.", correct: true },
      { statement: "Ben kommt gut mit seinem Teamleiter klar.", correct: false },
      { statement: "Alex rät Ben, auf Fakten statt auf Gefühle zu setzen.", correct: true },
      { statement: "Am Ende fühlt sich Ben weniger zuversichtlich als vorher.", correct: false }
    ]
  },
  {
    id: "m5-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form.",
    sentences: [
      { text: "Alex muss erst mal an der Theke ___.", answer: "anstehen" },
      { text: "Für Ben ___ heute Nachmittag ein wichtiger Termin ___.", answer: "steht ... an" },
      { text: "Für Ben ___ ___, dass die Deadline nicht realistisch ist.", answer: "steht fest" },
      { text: "Manchmal kann Ben seinen Teamleiter nicht ___.", answer: "ausstehen" },
      { text: "Er muss den Termin irgendwie ___.", answer: "überstehen" },
      { text: "Alex sagt: Dir ___ jetzt eine ruhige Minute ___.", answer: "steht ... zu" }
    ]
  },
  {
    id: "m5-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die stehen-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "Warten & Planen", items: ["anstehen", "bevorstehen", "dastehen"] },
      { name: "Haltung & Meinung", items: ["einstehen", "feststehen", "bestehen", "drüberstehen", "zusammenstehen"] },
      { name: "Emotion & Belastung", items: ["ausstehen", "überstehen", "zustehen", "verstehen"] }
    ]
  },
  {
    id: "m5-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["anstehen", "bevorstehen", "feststehen", "überstehen", "ausstehen", "drüberstehen"],
    sentences: [
      { text: "An der Theke muss man meistens ___.", answer: "anstehen" },
      { text: "Dir wird ein schwieriger Termin ___.", answer: "bevorstehen" },
      { text: "Das Ergebnis wird bald ___.", answer: "feststehen" },
      { text: "Ben muss die Präsentation irgendwie ___.", answer: "überstehen" },
      { text: "Ben kann seinen Teamleiter manchmal nicht ___.", answer: "ausstehen" },
      { text: "Man soll über Kritik einfach ___.", answer: "drüberstehen" }
    ]
  },
  {
    id: "m5-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Jemand hat an etwas nicht gedacht.", right: "etwas nicht auf dem Schirm haben" },
      { left: "Eine schwierige Situation trotzdem meistern.", right: "das Kind schon schaukeln" },
      { left: "Plötzlich wird die Atmosphäre negativ.", right: "Die Stimmung kippt." },
      { left: "Etwas lässt sich gar nicht diskutieren.", right: "Das steht außer Frage." },
      { left: "Jemand redet unklar und weicht aus.", right: "rumdrucksen" },
      { left: "Jemanden unfreundlich behandeln.", right: "jemanden blöd anmachen" }
    ]
  },
  {
    id: "m5-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Ich hatte gar nicht auf dem ___, dass das heute ist.", modelAnswer: "Schirm" },
      { prompt: "Keine Sorge – du wirst das Kind schon ___.", modelAnswer: "schaukeln" },
      { prompt: "Ein Satz ist mir im Kopf ___.", modelAnswer: "hängengeblieben" },
      { prompt: "Lass dich nicht provozieren – steh einfach ___.", modelAnswer: "drüber" },
      { prompt: "Ich will niemandem auf die Füße ___.", modelAnswer: "treten" },
      { prompt: "Diese Sache steht außer ___.", modelAnswer: "Frage" }
    ]
  },
  {
    id: "m5-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Mir besteht morgen ein wichtiger Termin.", correct: "Mir steht morgen ein wichtiger Termin bevor.", explanation: "bevorstehen = bald passieren. bestehen = beharren auf." },
      { incorrect: "Ich kann diesen Typen nicht überstehen.", correct: "Ich kann diesen Typen nicht ausstehen.", explanation: "ausstehen = nicht mögen. überstehen = eine schwierige Situation schaffen." },
      { incorrect: "Für mich besteht, dass die Deadline zu eng ist.", correct: "Für mich steht fest, dass die Deadline zu eng ist.", explanation: "feststehen = sicher sein. bestehen = beharren oder vorhanden sein." },
      { incorrect: "Ben muss für seine Meinung bestehen.", correct: "Ben muss für seine Meinung einstehen.", explanation: "einstehen für = sich behaupten. bestehen auf = beharren." },
      { incorrect: "Lass dich nicht provozieren – steh einfach drauf.", correct: "Lass dich nicht provozieren – steh einfach drüber.", explanation: "drüberstehen = sich nicht provozieren lassen." }
    ]
  },
  {
    id: "m5-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden stehen-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese stehen-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- anstehen\n- bevorstehen\n- ausstehen\n- überstehen\n- einstehen\n- drüberstehen",
    mustUseWords: ["anstehen", "bevorstehen", "ausstehen", "überstehen", "einstehen", "drüberstehen"],
    modelAnswer: "Anstehen bedeutet, in einer Schlange zu warten. Bevorstehen heißt, dass etwas bald passiert. Ausstehen bedeutet, jemanden nicht mögen oder nicht ertragen können. Überstehen heißt, eine schwierige Situation zu schaffen. Einstehen bedeutet, für sich selbst einzutreten. Drüberstehen heißt, sich nicht provozieren zu lassen."
  },
  {
    id: "m5-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele stehen-Verben haben mehr als eine Bedeutung!",
    content: "Viele stehen-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "anstehen", meanings: [
        { label: "Im Text", example: "Er muss an der Theke anstehen. (in einer Schlange warten)" },
        { label: "Weitere Bedeutung", example: "Was steht als Nächstes an? (als Nächstes anliegen)" }
      ]},
      { verb: "bestehen", meanings: [
        { label: "Im Text", example: "Er besteht auf Fakten. (beharren)" },
        { label: "Weitere Bedeutung", example: "Die Prüfung besteht aus drei Teilen. (sich zusammensetzen)" }
      ]},
      { verb: "einstehen", meanings: [
        { label: "Im Text", example: "Er will stärker für sich einstehen. (sich behaupten)" },
        { label: "Weitere Bedeutung", example: "Er stand für den Schaden ein. (Verantwortung übernehmen)" }
      ]},
      { verb: "stehen", meanings: [
        { label: "Im Text", example: "Er steht an der Theke. (physisch stehen)" },
        { label: "Weitere Bedeutung", example: "Das steht außer Frage. (ist sicher/klar)" }
      ]}
    ]
  },
  {
    id: "m5-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Was steht als Nächstes an?\" – Was bedeutet anstehen hier?", options: ["in einer Schlange warten", "als Nächstes anliegen", "stillstehen"], correctIndex: 1 },
      { question: "\"Die Prüfung besteht aus drei Teilen.\" – Was bedeutet bestehen hier?", options: ["beharren", "sich zusammensetzen aus", "eine Prüfung schaffen"], correctIndex: 1 },
      { question: "\"Er stand für den Schaden ein.\" – Was bedeutet einstehen hier?", options: ["sich behaupten", "Verantwortung übernehmen", "aufstehen"], correctIndex: 1 },
      { question: "\"Nach dem Sturm steht das Haus noch.\" – Was bedeutet stehen hier?", options: ["existieren, überdauert haben", "in einer Schlange warten", "klar sein"], correctIndex: 0 },
      { question: "\"Wie stehst du zu diesem Thema?\" – Was bedeutet stehen hier?", options: ["physisch stehen", "welche Meinung man hat", "beharren"], correctIndex: 1 }
    ]
  }
];

// ========== MODULE 6: geben ==========
allExercises[6] = [
  {
    id: "m6-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Der Kunde hat die falschen Filter bekommen.", correct: true },
      { statement: "Alex kann das Problem im Portal nicht lösen.", correct: false },
      { statement: "Der Fahrer holt die falschen Filter ab und bringt die richtigen mit.", correct: true },
      { statement: "Alex will nach der Arbeit ein Paket abholen.", correct: false },
      { statement: "Der Kunde bleibt am Ende des Tages immer noch verärgert.", correct: false }
    ]
  },
  {
    id: "m6-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form.",
    sentences: [
      { text: "Der Kunde möchte die falsche Ware ___.", answer: "zurückgeben" },
      { text: "Können Sie mir Ihre Kundennummer ___?", answer: "angeben" },
      { text: "Ich ___ Ihnen direkt ein Abholzeitfenster.", answer: "vergebe" },
      { text: "Bitte ___ Sie die Info an Mehmet ___.", answer: "geben ... weiter" },
      { text: "Nach Feierabend will ich ein Paket ___.", answer: "aufgeben" },
      { text: "Ich muss ___, unser Portal ist nicht intuitiv.", answer: "zugeben" }
    ]
  },
  {
    id: "m6-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die geben-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "Daten & Information", items: ["angeben", "eingeben", "weitergeben", "zugeben"] },
      { name: "Ware & Handel", items: ["zurückgeben", "rausgeben", "mitgeben", "übergeben"] },
      { name: "Persönlich & abstrakt", items: ["vergeben", "ausgeben", "aufgeben", "hergeben"] }
    ]
  },
  {
    id: "m6-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["zurückgegeben", "angegeben", "eingegeben", "weitergegeben", "übergeben", "aufgegeben"],
    sentences: [
      { text: "Die falsche Ware wurde ___.", answer: "zurückgegeben" },
      { text: "Der Kunde hat seine Kundennummer ___.", answer: "angegeben" },
      { text: "Die E-Mail-Adresse wurde ins System ___.", answer: "eingegeben" },
      { text: "Alex hat die Info an Mehmet ___.", answer: "weitergegeben" },
      { text: "Alex hat Mehmet den Ausdruck ___.", answer: "übergeben" },
      { text: "Das Paket wurde bei der Post ___.", answer: "aufgegeben" }
    ]
  },
  {
    id: "m6-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Jemand ist sehr gestresst und genervt.", right: "am Rad drehen" },
      { left: "Ein Problem bleibt bei einem hängen.", right: "auf etwas sitzenbleiben" },
      { left: "Aufhören, Fragen zu stellen.", right: "Ruhe geben" },
      { left: "Man fragt, was es Neues gibt.", right: "Was liegt an?" },
      { left: "Man schafft eine Aufgabe erfolgreich.", right: "etwas hinkriegen" },
      { left: "Man hat sich den Feierabend verdient.", right: "wohlverdienter Feierabend" }
    ]
  },
  {
    id: "m6-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Ehrlich gesagt, ich drehe langsam am ___.", modelAnswer: "Rad" },
      { prompt: "Wir wollen nicht auf der falschen Ware ___.", modelAnswer: "sitzenbleiben" },
      { prompt: "Der Kunde sagte: Dann gebe ich jetzt auch mal ___.", modelAnswer: "Ruhe" },
      { prompt: "Was ___ heute an?", modelAnswer: "liegt" },
      { prompt: "Das ___ wir schon hin.", modelAnswer: "kriegen" },
      { prompt: "Nach dem Tag freut sich Alex auf seinen wohlverdienten ___.", modelAnswer: "Feierabend" }
    ]
  },
  {
    id: "m6-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Können Sie mir Ihre Kundennummer hergeben?", correct: "Können Sie mir Ihre Kundennummer angeben?", explanation: "angeben = Daten nennen. hergeben = etwas aus der Hand geben." },
      { incorrect: "Ich übergebe Ihnen ein Abholzeitfenster.", correct: "Ich vergebe Ihnen ein Abholzeitfenster.", explanation: "vergeben = zuteilen. übergeben = direkt aushändigen." },
      { incorrect: "Bitte geben Sie die Info an Mehmet zurück.", correct: "Bitte geben Sie die Info an Mehmet weiter.", explanation: "weitergeben = übermitteln. zurückgeben = etwas retournieren." },
      { incorrect: "Nach Feierabend will ich ein Paket ausgeben.", correct: "Nach Feierabend will ich ein Paket aufgeben.", explanation: "aufgeben = bei der Post einliefern. ausgeben = Geld bezahlen." },
      { incorrect: "Ich muss eingeben, das Portal ist nicht intuitiv.", correct: "Ich muss zugeben, das Portal ist nicht intuitiv.", explanation: "zugeben = eingestehen. eingeben = Daten tippen." }
    ]
  },
  {
    id: "m6-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden geben-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese geben-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- zurückgeben\n- angeben\n- vergeben\n- weitergeben\n- aufgeben\n- ausgeben",
    mustUseWords: ["zurückgeben", "angeben", "vergeben", "weitergeben", "aufgeben", "ausgeben"],
    modelAnswer: "Zurückgeben bedeutet, etwas an den Absender oder Verkäufer zurückschicken. Angeben heißt, Daten wie eine Kundennummer nennen. Vergeben bedeutet, ein Zeitfenster oder einen Termin zuteilen. Weitergeben heißt, eine Information an eine andere Person übermitteln. Aufgeben bedeutet, ein Paket bei der Post einliefern. Ausgeben heißt, Geld für etwas bezahlen."
  },
  {
    id: "m6-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele geben-Verben haben mehr als eine Bedeutung!",
    content: "Viele geben-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "aufgeben", meanings: [
        { label: "Im Text", example: "Ich will ein Paket aufgeben. (bei der Post einliefern)" },
        { label: "Weitere Bedeutung", example: "Er hat seinen Traum aufgegeben. (nicht mehr verfolgen)" }
      ]},
      { verb: "ausgeben", meanings: [
        { label: "Im Text", example: "Er will weniger Geld ausgeben. (Geld bezahlen)" },
        { label: "Weitere Bedeutung", example: "Er gibt sich als Experte aus. (sich als jemand anderes darstellen)" }
      ]},
      { verb: "vergeben", meanings: [
        { label: "Im Text", example: "Ich vergebe ein Abholzeitfenster. (zuteilen)" },
        { label: "Weitere Bedeutung", example: "Sie hat ihm vergeben. (verzeihen)" }
      ]},
      { verb: "angeben", meanings: [
        { label: "Im Text", example: "Können Sie Ihre Nummer angeben? (Daten nennen)" },
        { label: "Weitere Bedeutung", example: "Er gibt beim Sport immer so an. (prahlen)" }
      ]}
    ]
  },
  {
    id: "m6-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Er hat seinen Traum nie aufgegeben.\" – Was bedeutet aufgeben hier?", options: ["bei der Post einliefern", "nicht mehr verfolgen", "eine Aufgabe stellen"], correctIndex: 1 },
      { question: "\"Er gibt sich als Spezialist aus.\" – Was bedeutet sich ausgeben hier?", options: ["Geld bezahlen", "sich als jemand anderes darstellen", "etwas verteilen"], correctIndex: 1 },
      { question: "\"Sie hat ihm den Fehler schon längst vergeben.\" – Was bedeutet vergeben hier?", options: ["zuteilen", "verzeihen", "weitergeben"], correctIndex: 1 },
      { question: "\"Er gibt beim Sport immer an.\" – Was bedeutet angeben hier?", options: ["Daten nennen", "etwas zugeben", "prahlen"], correctIndex: 2 },
      { question: "\"Die Firma gibt viel Geld für Werbung aus.\" – Was bedeutet ausgeben hier?", options: ["Geld bezahlen", "sich als jemand darstellen", "etwas verteilen"], correctIndex: 0 }
    ]
  }
];

// ========== MODULE 7: setzen ==========
allExercises[7] = [
  {
    id: "m7-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Alex wollte am Samstagabend eigentlich seine Ruhe haben.", correct: true },
      { statement: "Ben hat das Kneipenquiz langfristig geplant.", correct: false },
      { statement: "Der Wirt erlaubt dem Team, am reservierten Tisch sitzen zu bleiben.", correct: false },
      { statement: "Tobi notiert am Ende die richtigen Antworten.", correct: true },
      { statement: "Am Ende wird das Team Erste im Quiz.", correct: false }
    ]
  },
  {
    id: "m7-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form.",
    sentences: [
      { text: "Kaum bin ich an der Ecke, ___ auch noch Regen ___.", answer: "setzt ... ein" },
      { text: "Fast alle Tische sind schon ___.", answer: "besetzt" },
      { text: "Ich ___ mich zu Ben.", answer: "setze" },
      { text: "Ben ___ ein völlig unschuldiges Gesicht ___.", answer: "setzt ... auf" },
      { text: "Die Plätze sind reserviert – ihr müsst euch ___.", answer: "umsetzen" },
      { text: "In dieser Kneipe werden Regeln konsequent ___.", answer: "durchgesetzt" }
    ]
  },
  {
    id: "m7-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die setzen-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "Sitzen & Position", items: ["sich hinsetzen", "sich zu jemandem setzen", "absetzen"] },
      { name: "Veränderung & Aktion", items: ["umsetzen", "einsetzen", "fortsetzen"] },
      { name: "Kontrolle & Regeln", items: ["durchsetzen", "besetzen", "aufsetzen", "aussetzen"] }
    ]
  },
  {
    id: "m7-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["eingesetzt", "besetzt", "aufgesetzt", "durchgesetzt", "fortgesetzt", "ausgesetzt"],
    sentences: [
      { text: "Der Regen hat plötzlich ___.", answer: "eingesetzt" },
      { text: "Alle Tische im Lokal waren ___.", answer: "besetzt" },
      { text: "Ben hat ein unschuldiges Gesicht ___.", answer: "aufgesetzt" },
      { text: "Die Regeln werden in der Kneipe ___.", answer: "durchgesetzt" },
      { text: "Nach der Pause wird das Quiz ___.", answer: "fortgesetzt" },
      { text: "Alex wollte eigentlich eine Runde ___.", answer: "ausgesetzt" }
    ]
  },
  {
    id: "m7-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Man kann einer unangenehmen Situation nicht entkommen.", right: "aus der Nummer nicht rauskommen" },
      { left: "Man braucht gerade genau das nicht.", right: "das Letzte, was man jetzt braucht" },
      { left: "Man soll kein großes Drama machen.", right: "kein Fass aufmachen" },
      { left: "Ohne Hilfe nicht weiterwissen.", right: "aufgeschmissen sein" },
      { left: "Etwas nervt oder stört.", right: "auf die Nerven gehen" },
      { left: "Es war zwar nicht perfekt, aber akzeptabel.", right: "kein kompletter Reinfall" }
    ]
  },
  {
    id: "m7-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Aus dieser ___ komme ich nicht mehr raus.", modelAnswer: "Nummer" },
      { prompt: "Mach jetzt kein ___ auf.", modelAnswer: "Fass" },
      { prompt: "Besser wird's ___.", modelAnswer: "nicht" },
      { prompt: "Die ganze Sache geht mir auf die ___.", modelAnswer: "Nerven" },
      { prompt: "Ohne dich wäre ich völlig ___ gewesen.", modelAnswer: "aufgeschmissen" },
      { prompt: "Am Ende war es kein kompletter ___.", modelAnswer: "Reinfall" }
    ]
  },
  {
    id: "m7-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Der Regen hat plötzlich abgesetzt.", correct: "Der Regen hat plötzlich eingesetzt.", explanation: "einsetzen = beginnen. absetzen = abstellen." },
      { incorrect: "Ben setzt ein unschuldiges Gesicht ein.", correct: "Ben setzt ein unschuldiges Gesicht auf.", explanation: "aufsetzen = demonstrativ zeigen. einsetzen = verwenden." },
      { incorrect: "Die Regeln werden in der Kneipe eingesetzt.", correct: "Die Regeln werden in der Kneipe durchgesetzt.", explanation: "durchsetzen = erreichen, dass Regeln befolgt werden. einsetzen = verwenden." },
      { incorrect: "Alex wollte eine Runde absetzen.", correct: "Alex wollte eine Runde aussetzen.", explanation: "aussetzen = pausieren. absetzen = abstellen." },
      { incorrect: "Das Quiz wird nach der Pause eingesetzt.", correct: "Das Quiz wird nach der Pause fortgesetzt.", explanation: "fortsetzen = weitermachen. einsetzen = beginnen." }
    ]
  },
  {
    id: "m7-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden setzen-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese setzen-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- einsetzen\n- aufsetzen\n- umsetzen\n- durchsetzen\n- fortsetzen\n- aussetzen",
    mustUseWords: ["einsetzen", "aufsetzen", "umsetzen", "durchsetzen", "fortsetzen", "aussetzen"],
    modelAnswer: "Einsetzen bedeutet, dass etwas beginnt, z. B. der Regen. Aufsetzen heißt, etwas demonstrativ auf das Gesicht oder den Kopf zu setzen. Umsetzen bedeutet, den Platz zu wechseln oder eine Idee zu realisieren. Durchsetzen heißt, dafür zu sorgen, dass eine Regel befolgt wird. Fortsetzen bedeutet, mit etwas weiterzumachen. Aussetzen heißt, eine Runde zu pausieren."
  },
  {
    id: "m7-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele setzen-Verben haben mehr als eine Bedeutung!",
    content: "Viele setzen-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "einsetzen", meanings: [
        { label: "Im Text", example: "Der Regen setzt ein. (beginnen)" },
        { label: "Weitere Bedeutung", example: "Die Firma setzt neue Technologie ein. (verwenden)" }
      ]},
      { verb: "aufsetzen", meanings: [
        { label: "Im Text", example: "Er setzt ein unschuldiges Gesicht auf. (demonstrativ zeigen)" },
        { label: "Weitere Bedeutung", example: "Sie setzt einen Vertrag auf. (schriftlich formulieren)" }
      ]},
      { verb: "umsetzen", meanings: [
        { label: "Im Text", example: "Wir müssen uns umsetzen. (Platz wechseln)" },
        { label: "Weitere Bedeutung", example: "Wir setzen die Idee um. (praktisch realisieren)" }
      ]},
      { verb: "absetzen", meanings: [
        { label: "Im Text", example: "Ich setze mein Glas ab. (abstellen)" },
        { label: "Weitere Bedeutung", example: "Der Trainer wurde abgesetzt. (von seiner Position entfernen)" }
      ]}
    ]
  },
  {
    id: "m7-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Die Firma setzt neue Software ein.\" – Was bedeutet einsetzen hier?", options: ["beginnen", "verwenden", "besetzen"], correctIndex: 1 },
      { question: "\"Sie setzt einen Vertrag auf.\" – Was bedeutet aufsetzen hier?", options: ["etwas auf den Kopf setzen", "schriftlich formulieren", "demonstrativ zeigen"], correctIndex: 1 },
      { question: "\"Wir setzen die Idee nächste Woche um.\" – Was bedeutet umsetzen hier?", options: ["den Platz wechseln", "praktisch realisieren", "etwas verkaufen"], correctIndex: 1 },
      { question: "\"Das Produkt wurde gut abgesetzt.\" – Was bedeutet absetzen hier?", options: ["abstellen", "verkaufen", "von einer Position entfernen"], correctIndex: 1 },
      { question: "\"Der Trainer wurde nach der Niederlage abgesetzt.\" – Was bedeutet absetzen hier?", options: ["verkaufen", "abstellen", "von seiner Position entfernen"], correctIndex: 2 }
    ]
  }
];

// ========== MODULE 8: legen ==========
allExercises[8] = [
  {
    id: "m8-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Die Messe ist perfekt vorbereitet und nichts ist improvisiert.", correct: false },
      { statement: "Frau Krüger will, dass Alex eine vollständige Mappe für Nordtech zurücklegt.", correct: true },
      { statement: "Die neuen Produktblätter waren die ganze Zeit hinter dem Monitor.", correct: true },
      { statement: "Frau Weber von Nordtech kommt wie geplant um elf Uhr.", correct: false },
      { statement: "Alex kann die Frage zur Lieferzeit souverän beantworten.", correct: true }
    ]
  },
  {
    id: "m8-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form.",
    sentences: [
      { text: "Die Broschüren sind ordentlich am Stand ___.", answer: "ausgelegt" },
      { text: "Jule hat die Kugelschreiber akkurat ___.", answer: "hingelegt" },
      { text: "Gleich wird sicher eine neue Aufgabe ___ .", answer: "festgelegt" },
      { text: "Bitte ___ eine vollständige Mappe für Nordtech ___.", answer: "leg ... zurück" },
      { text: "Bitte nichts Falsches ___.", answer: "beilegen" },
      { text: "Die Datenblätter wurden tatsächlich ___.", answer: "verlegt" }
    ]
  },
  {
    id: "m8-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die legen-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "Physisch platzieren", items: ["auslegen", "hinlegen", "beilegen", "ablegen"] },
      { name: "Organisation & Planung", items: ["festlegen", "zurücklegen", "verlegen"] },
      { name: "Kommunikation & Nachweis", items: ["belegen", "darlegen"] }
    ]
  },
  {
    id: "m8-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["ausgelegt", "hingelegt", "festgelegt", "beigelegt", "verlegt", "dargelegt"],
    sentences: [
      { text: "Die Broschüren wurden ordentlich ___.", answer: "ausgelegt" },
      { text: "Jule hat die Kugelschreiber akkurat ___.", answer: "hingelegt" },
      { text: "Die Aufgabe wurde verbindlich ___.", answer: "festgelegt" },
      { text: "Alex hat der Mappe die Referenzen ___.", answer: "beigelegt" },
      { text: "Die Datenblätter wurden versehentlich ___.", answer: "verlegt" },
      { text: "Alex hat die Lieferzeiten klar ___.", answer: "dargelegt" }
    ]
  },
  {
    id: "m8-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Alles passiert im allerletzten Moment.", right: "auf den letzten Drücker" },
      { left: "Ruhig bleiben und sich nichts anmerken lassen.", right: "die Fassung bewahren" },
      { left: "Sich besserwisserisch verhalten.", right: "den Klugscheißer spielen" },
      { left: "Gereizt oder unfair mit jemandem reden.", right: "jemanden blöd anmachen" },
      { left: "Eine Situation kontrollieren.", right: "etwas im Griff haben" },
      { left: "Etwas scheitert oder verschlechtert sich stark.", right: "den Bach runtergehen" }
    ]
  },
  {
    id: "m8-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Alles passierte wieder auf den letzten ___.", modelAnswer: "Drücker" },
      { prompt: "Ich versuche, die ___ zu bewahren.", modelAnswer: "Fassung" },
      { prompt: "Du musst jetzt nicht den ___ spielen.", modelAnswer: "Klugscheißer" },
      { prompt: "Von außen sieht es aus, als hätten wir alles im ___.", modelAnswer: "Griff" },
      { prompt: "Hier geht alles den Bach ___, wenn man nicht aufpasst.", modelAnswer: "runter" },
      { prompt: "Frau Krüger hatte keine Zeit für ___.", modelAnswer: "Höflichkeiten" }
    ]
  },
  {
    id: "m8-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Die Broschüren wurden am Stand hingelegt.", correct: "Die Broschüren wurden am Stand ausgelegt.", explanation: "auslegen = sichtbar verteilen. hinlegen = an einen bestimmten Platz legen." },
      { incorrect: "Bitte legen Sie die Referenzen fest.", correct: "Bitte legen Sie die Referenzen bei.", explanation: "beilegen = hinzufügen. festlegen = verbindlich bestimmen." },
      { incorrect: "Kannst du das mit Zahlen darlegen?", correct: "Kannst du das mit Zahlen belegen?", explanation: "belegen = nachweisen. darlegen = erklären." },
      { incorrect: "Die Produktblätter wurden leider abgelegt.", correct: "Die Produktblätter wurden leider verlegt.", explanation: "verlegen = an den falschen Ort legen. ablegen = geordnet aufbewahren." },
      { incorrect: "Die Mappe wurde für den Kunden ausgelegt.", correct: "Die Mappe wurde für den Kunden zurückgelegt.", explanation: "zurücklegen = reservieren. auslegen = sichtbar verteilen." }
    ]
  },
  {
    id: "m8-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden legen-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese legen-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- auslegen\n- verlegen\n- beilegen\n- belegen\n- darlegen\n- zurücklegen",
    mustUseWords: ["auslegen", "verlegen", "beilegen", "belegen", "darlegen", "zurücklegen"],
    modelAnswer: "Auslegen bedeutet, Materialien sichtbar zu verteilen. Verlegen heißt, etwas an den falschen Ort zu legen und nicht mehr zu finden. Beilegen bedeutet, Unterlagen zu einer Mappe hinzuzufügen. Belegen heißt, eine Aussage mit Beweisen zu unterstützen. Darlegen bedeutet, etwas klar und sachlich zu erklären. Zurücklegen heißt, etwas für jemanden zu reservieren."
  },
  {
    id: "m8-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele legen-Verben haben mehr als eine Bedeutung!",
    content: "Viele legen-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "verlegen", meanings: [
        { label: "Im Text", example: "Die Datenblätter wurden verlegt. (an den falschen Ort gelegt)" },
        { label: "Weitere Bedeutung", example: "Der Termin wurde auf nächste Woche verlegt. (zeitlich verschieben)" }
      ]},
      { verb: "ablegen", meanings: [
        { label: "Im Text", example: "Die Unterlagen wurden geordnet abgelegt. (ordentlich aufbewahren)" },
        { label: "Weitere Bedeutung", example: "Er hat vor Gericht ein Geständnis abgelegt. (formal aussagen)" }
      ]},
      { verb: "auslegen", meanings: [
        { label: "Im Text", example: "Die Broschüren sind ausgelegt. (sichtbar verteilen)" },
        { label: "Weitere Bedeutung", example: "Man kann seine Worte verschieden auslegen. (interpretieren)" }
      ]},
      { verb: "belegen", meanings: [
        { label: "Im Text", example: "Kannst du das belegen? (nachweisen)" },
        { label: "Weitere Bedeutung", example: "Sie belegt dieses Semester drei Kurse. (einen Kurs besuchen)" }
      ]}
    ]
  },
  {
    id: "m8-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Der Termin wurde auf nächste Woche verlegt.\" – Was bedeutet verlegen hier?", options: ["an den falschen Ort legen", "zeitlich verschieben", "Material befestigen"], correctIndex: 1 },
      { question: "\"Er hat vor Gericht ein Geständnis abgelegt.\" – Was bedeutet ablegen hier?", options: ["ordentlich aufbewahren", "Kleidung ausziehen", "formal eine Aussage machen"], correctIndex: 2 },
      { question: "\"Man kann seine Worte verschieden auslegen.\" – Was bedeutet auslegen hier?", options: ["sichtbar verteilen", "interpretieren", "erklären"], correctIndex: 1 },
      { question: "\"Sie belegt dieses Semester drei Kurse an der Uni.\" – Was bedeutet belegen hier?", options: ["nachweisen", "einen Kurs besuchen", "etwas beilegen"], correctIndex: 1 },
      { question: "\"Der Boden wurde mit neuem Laminat verlegt.\" – Was bedeutet verlegen hier?", options: ["etwas nicht finden", "zeitlich verschieben", "Material am Boden befestigen"], correctIndex: 2 }
    ]
  }
];

// ========== MODULE 9: kommen ==========
allExercises[9] = [
  {
    id: "m9-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Alex will am Wochenende keine Mails auf dem Sofa beantworten.", correct: true },
      { statement: "Der Kunde braucht die Angebote am Montagmorgen.", correct: true },
      { statement: "Alex schickt dem Kunden am Freitag die komplette Berechnung.", correct: false },
      { statement: "Ben und Alex fahren am Samstag gemeinsam an den See.", correct: true },
      { statement: "Am Sonntagabend geht Alex noch einmal ins Büro.", correct: false }
    ]
  },
  {
    id: "m9-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form.",
    sentences: [
      { text: "Am Montag sollen die Angebote beim Kunden ___.", answer: "ankommen" },
      { text: "Ich habe mir fest vorgenommen, dieses Wochenende wirklich ___.", answer: "runterzukommen" },
      { text: "Ich ___ dem Kunden ___ und schicke eine Kurzübersicht.", answer: "komme ... entgegen" },
      { text: "Ben fragt: ___ du morgen mit zum See?", answer: "Kommst" },
      { text: "Am See ___ wir mit einem kleinen Rucksack ___.", answer: "kommen ... aus" },
      { text: "Nora ___ am Nachmittag noch kurz ___.", answer: "kommt ... vorbei" }
    ]
  },
  {
    id: "m9-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die kommen-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "Ankunft & Bewegung", items: ["ankommen", "mitkommen", "zurückkommen", "vorbeikommen", "wegkommen", "dazukommen"] },
      { name: "Zustand & Empfinden", items: ["runterkommen", "hochkommen", "klarkommen", "auskommen"] },
      { name: "Fortschritt & Lösung", items: ["weiterkommen", "durchkommen", "entgegenkommen", "zukommen"] }
    ]
  },
  {
    id: "m9-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["angekommen", "runtergekommen", "durchgekommen", "vorbeigekommen", "zurückgekommen", "klargekommen"],
    sentences: [
      { text: "Um halb sieben ist Alex endlich zu Hause ___.", answer: "angekommen" },
      { text: "Am See ist Alex endlich ___.", answer: "runtergekommen" },
      { text: "Trotz Baustellen sind sie gut ___.", answer: "durchgekommen" },
      { text: "Nora ist am Nachmittag noch kurz ___.", answer: "vorbeigekommen" },
      { text: "Am Sonntag sind Alex und Ben vom Ausflug ___.", answer: "zurückgekommen" },
      { text: "Der Kunde ist mit der Kurzübersicht erst mal ___.", answer: "klargekommen" }
    ]
  },
  {
    id: "m9-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Die Arbeit war anstrengend und unangenehm.", right: "kein Zuckerschlecken" },
      { left: "Man braucht Abstand vom Stress.", right: "den Kopf freibekommen" },
      { left: "Wer ruhig bleibt, handelt besser.", right: "In der Ruhe liegt die Kraft." },
      { left: "Man prüft, ob etwas Dringendes passiert ist.", right: "sichergehen, dass nichts brennt" },
      { left: "Eine kurze ruhige Phase vor neuem Stress.", right: "die Ruhe vor dem Sturm" },
      { left: "Etwas akzeptieren, obwohl es nicht perfekt ist.", right: "mit etwas leben können" }
    ]
  },
  {
    id: "m9-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Diese Woche war echt kein ___.", modelAnswer: "Zuckerschlecken" },
      { prompt: "Ich muss mal raus, um den Kopf ___.", modelAnswer: "freizubekommen" },
      { prompt: "In der Ruhe liegt die ___.", modelAnswer: "Kraft" },
      { prompt: "Das ist wohl die Ruhe vor dem ___.", modelAnswer: "Sturm" },
      { prompt: "Ich sehe kurz nach, ob nichts ___.", modelAnswer: "brennt" },
      { prompt: "Damit kann ich ___.", modelAnswer: "leben" }
    ]
  },
  {
    id: "m9-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Ich komme dem Kunden vor und schicke eine Übersicht.", correct: "Ich komme dem Kunden entgegen und schicke eine Übersicht.", explanation: "entgegenkommen = einen Kompromiss anbieten. vorkommen = passieren." },
      { incorrect: "Am Wochenende will ich endlich hochkommen.", correct: "Am Wochenende will ich endlich runterkommen.", explanation: "runterkommen = entspannen. hochkommen = aus dem Bett kommen." },
      { incorrect: "Trotz Baustellen kommen wir gut raus.", correct: "Trotz Baustellen kommen wir gut durch.", explanation: "durchkommen = hindurchkommen. rauskommen = herauskommen." },
      { incorrect: "Nora kommt am Nachmittag kurz rüber.", correct: "Nora kommt am Nachmittag kurz vorbei.", explanation: "vorbeikommen = jemanden kurz besuchen." },
      { incorrect: "Wir kommen mit einem kleinen Rucksack durch.", correct: "Wir kommen mit einem kleinen Rucksack aus.", explanation: "auskommen = zurechtkommen mit wenig. durchkommen = hindurchkommen." }
    ]
  },
  {
    id: "m9-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden kommen-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese kommen-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- ankommen\n- runterkommen\n- entgegenkommen\n- auskommen\n- vorbeikommen\n- durchkommen",
    mustUseWords: ["ankommen", "runterkommen", "entgegenkommen", "auskommen", "vorbeikommen", "durchkommen"],
    modelAnswer: "Ankommen bedeutet, irgendwo eintreffen. Runterkommen heißt, sich zu entspannen und Stress loszulassen. Entgegenkommen bedeutet, jemandem einen Kompromiss anzubieten. Auskommen heißt, mit wenig zurechtzukommen. Vorbeikommen bedeutet, jemanden kurz zu besuchen. Durchkommen heißt, ohne große Probleme hindurchzukommen."
  },
  {
    id: "m9-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele kommen-Verben haben mehr als eine Bedeutung!",
    content: "Viele kommen-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "ankommen", meanings: [
        { label: "Im Text", example: "Die Mail ist angekommen. (eintreffen)" },
        { label: "Weitere Bedeutung", example: "Es kommt auf die Qualität an. (wichtig sein)" }
      ]},
      { verb: "auskommen", meanings: [
        { label: "Im Text", example: "Wir kommen mit wenig aus. (zurechtkommen)" },
        { label: "Weitere Bedeutung", example: "Sie kommen gut miteinander aus. (sich verstehen)" }
      ]},
      { verb: "runterkommen", meanings: [
        { label: "Im Text", example: "Am See komme ich runter. (sich entspannen)" },
        { label: "Weitere Bedeutung", example: "Das Haus ist ganz schön runtergekommen. (verwahrlost)" }
      ]},
      { verb: "durchkommen", meanings: [
        { label: "Im Text", example: "Wir sind gut durchgekommen. (es schaffen)" },
        { label: "Weitere Bedeutung", example: "Ich komme telefonisch nicht durch. (keine Verbindung)" }
      ]}
    ]
  },
  {
    id: "m9-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Es kommt jetzt auf die Details an.\" – Was bedeutet ankommen hier?", options: ["eintreffen", "wichtig sein", "erscheinen"], correctIndex: 1 },
      { question: "\"Die beiden kommen gut miteinander aus.\" – Was bedeutet auskommen hier?", options: ["mit wenig zurechtkommen", "sich gut verstehen", "herauskommen"], correctIndex: 1 },
      { question: "\"Das Gebäude ist ziemlich runtergekommen.\" – Was bedeutet runterkommen hier?", options: ["sich entspannen", "verwahrlost sein", "herunterfallen"], correctIndex: 1 },
      { question: "\"Ich komme telefonisch nicht durch.\" – Was bedeutet durchkommen hier?", options: ["es schaffen", "keine Verbindung bekommen", "verstehen"], correctIndex: 1 },
      { question: "\"Da kommt noch einiges auf uns zu.\" – Was bedeutet zukommen hier?", options: ["zurechtkommen", "in Zukunft auf jemanden warten", "ankommen"], correctIndex: 1 }
    ]
  }
];

// ========== MODULE 10: halten ==========
allExercises[10] = [
  {
    id: "m10-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Alex wird morgens in der Straßenbahn durch einen Lieferwagen aufgehalten.", correct: true },
      { statement: "Die Sendung für Lichtenberg hängt wegen eines falschen Produkts fest.", correct: false },
      { statement: "Mehmet will sich aktiv um das Lichtenberg-Problem kümmern.", correct: false },
      { statement: "Die Hausnummer im System stimmt nicht mit der Kundenmail überein.", correct: true },
      { statement: "Am Ende des Tages hat Alex keine neuen Aufgaben mehr.", correct: false }
    ]
  },
  {
    id: "m10-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form.",
    sentences: [
      { text: "Die Straßenbahn wird gerade ___.", answer: "aufgehalten" },
      { text: "Ich ___ mich am Griff ___.", answer: "halte ... fest" },
      { text: "Der Kunde besteht darauf, dass wir den Termin ___.", answer: "einhalten" },
      { text: "Die Ware wurde im Depot ___.", answer: "zurückgehalten" },
      { text: "Ich ___ mich da lieber ___.", answer: "halte ... raus" },
      { text: "Ich frage mich, wie lange ich das noch ___.", answer: "aushalte" }
    ]
  },
  {
    id: "m10-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die halten-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "Stoppen & Verzögern", items: ["anhalten", "aufhalten", "zurückhalten"] },
      { name: "Durchhalten & Ertragen", items: ["durchhalten", "aushalten", "einhalten"] },
      { name: "Distanz & Dokumentation", items: ["sich raushalten", "stillhalten", "festhalten", "abhalten"] }
    ]
  },
  {
    id: "m10-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["angehalten", "aufgehalten", "festgehalten", "eingehalten", "zurückgehalten", "durchgehalten"],
    sentences: [
      { text: "Die Straßenbahn hat kurz vor der Haltestelle ___.", answer: "angehalten" },
      { text: "Die Sendung wurde im Depot ___.", answer: "aufgehalten" },
      { text: "Die Adressdaten wurden letzte Woche schriftlich ___.", answer: "festgehalten" },
      { text: "Der Liefertermin muss unbedingt ___ werden.", answer: "eingehalten" },
      { text: "Die Ware wurde vorübergehend ___.", answer: "zurückgehalten" },
      { text: "Alex hat den ganzen stressigen Tag ___.", answer: "durchgehalten" }
    ]
  },
  {
    id: "m10-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Man bleibt ruhig und kontrolliert.", right: "die Nerven behalten" },
      { left: "Der übliche alltägliche Stress.", right: "der ganz normale Wahnsinn" },
      { left: "Es wird anstrengend oder chaotisch.", right: "Heute wird's sportlich." },
      { left: "Man wartet endlos am Telefon.", right: "in der Schleife warten" },
      { left: "Man ist knapp und nicht besonders gesprächig.", right: "kurz angebunden sein" },
      { left: "Resigniert-ironisch: Natürlich passiert genau das.", right: "War ja klar." }
    ]
  },
  {
    id: "m10-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Immer ruhig ___.", modelAnswer: "Blut" },
      { prompt: "Der ganz normale ___ in den Öffis.", modelAnswer: "Wahnsinn" },
      { prompt: "Heute wird's ___.", modelAnswer: "sportlich" },
      { prompt: "Bitte ___ Sie sich an die Vereinbarung.", modelAnswer: "halten" },
      { prompt: "Das darf doch wohl nicht wahr ___!", modelAnswer: "sein" },
      { prompt: "Die Situation habe ich im ___.", modelAnswer: "Griff" }
    ]
  },
  {
    id: "m10-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Die Straßenbahn wird gerade festgehalten.", correct: "Die Straßenbahn wird gerade aufgehalten.", explanation: "aufhalten = verzögern. festhalten = sich klammern oder dokumentieren." },
      { incorrect: "Ich halte mich am Griff auf.", correct: "Ich halte mich am Griff fest.", explanation: "festhalten = sich klammern. aufhalten = verzögern." },
      { incorrect: "Der Termin muss unbedingt durchgehalten werden.", correct: "Der Termin muss unbedingt eingehalten werden.", explanation: "einhalten = eine Frist schaffen. durchhalten = weitermachen trotz Stress." },
      { incorrect: "Ich will mich nicht einhalten.", correct: "Ich will mich raushalten.", explanation: "sich raushalten = sich nicht beteiligen. einhalten = Frist/Termin schaffen." },
      { incorrect: "Ich weiß nicht, wie lange ich das noch anhalte.", correct: "Ich weiß nicht, wie lange ich das noch aushalte.", explanation: "aushalten = ertragen. anhalten = stoppen." }
    ]
  },
  {
    id: "m10-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden halten-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese halten-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- aufhalten\n- festhalten\n- einhalten\n- durchhalten\n- aushalten\n- sich raushalten",
    mustUseWords: ["aufhalten", "festhalten", "einhalten", "durchhalten", "aushalten", "raushalten"],
    modelAnswer: "Aufhalten bedeutet, etwas zu verzögern. Festhalten heißt, sich irgendwo zu klammern, oder etwas schriftlich zu dokumentieren. Einhalten bedeutet, einen Termin oder eine Frist zu schaffen. Durchhalten heißt, weiterzumachen, obwohl etwas anstrengend ist. Aushalten bedeutet, etwas Belastendes zu ertragen. Sich raushalten heißt, sich nicht in etwas einzumischen."
  },
  {
    id: "m10-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele halten-Verben haben mehr als eine Bedeutung!",
    content: "Viele halten-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "festhalten", meanings: [
        { label: "Im Text", example: "Ich halte mich am Griff fest. (sich klammern)" },
        { label: "Weitere Bedeutung", example: "Wir haben alles schriftlich festgehalten. (dokumentieren)" }
      ]},
      { verb: "aufhalten", meanings: [
        { label: "Im Text", example: "Die Sendung wird aufgehalten. (verzögern)" },
        { label: "Weitere Bedeutung", example: "Wo hältst du dich gerade auf? (sich befinden)" }
      ]},
      { verb: "anhalten", meanings: [
        { label: "Im Text", example: "Die Bahn hält an. (stoppen)" },
        { label: "Weitere Bedeutung", example: "Der Regen hält schon den ganzen Tag an. (andauern)" }
      ]},
      { verb: "zurückhalten", meanings: [
        { label: "Im Text", example: "Die Ware wurde zurückgehalten. (nicht freigeben)" },
        { label: "Weitere Bedeutung", example: "Er hält sich mit Kritik zurück. (sich bremsen)" }
      ]}
    ]
  },
  {
    id: "m10-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Wir haben das Ergebnis schriftlich festgehalten.\" – Was bedeutet festhalten hier?", options: ["sich klammern", "dokumentieren", "stoppen"], correctIndex: 1 },
      { question: "\"Wo hältst du dich gerade auf?\" – Was bedeutet sich aufhalten hier?", options: ["verzögert werden", "sich befinden", "warten"], correctIndex: 1 },
      { question: "\"Der Regen hält schon den ganzen Tag an.\" – Was bedeutet anhalten hier?", options: ["stoppen", "andauern", "festhalten"], correctIndex: 1 },
      { question: "\"Er hält sich mit seiner Meinung zurück.\" – Was bedeutet sich zurückhalten hier?", options: ["etwas nicht freigeben", "sich bremsen", "etwas behalten"], correctIndex: 1 },
      { question: "\"Nichts konnte ihn davon abhalten.\" – Was bedeutet abhalten hier?", options: ["jemanden hindern", "etwas ertragen", "etwas stoppen"], correctIndex: 0 }
    ]
  }
];

// ========== MODULE 11: gehen ==========
allExercises[11] = [
  {
    id: "m11-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Alex geht normalerweise nach der Arbeit direkt ins Fitnessstudio.", correct: false },
      { statement: "Das Marketing-Team liegt in der Challenge vorn.", correct: true },
      { statement: "Tom, der Trainer, geht den Plan strukturiert durch.", correct: true },
      { statement: "Am Ende des Trainings liegt das Vertriebs-Team auf Platz eins.", correct: false },
      { statement: "Alex plant, die Trainingszeiten in der kommenden Woche zu priorisieren.", correct: true }
    ]
  },
  {
    id: "m11-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form.",
    sentences: [
      { text: "Die aus dem Marketing ___ gerade richtig ___.", answer: "gehen ... ab" },
      { text: "Heute ___ wir das Training härter ___.", answer: "gehen ... an" },
      { text: "Tom ___ den Plan Punkt für Punkt ___.", answer: "geht ... durch" },
      { text: "Auf dem Laufband ___ Alex langsam ins Laufen ___.", answer: "geht ... über" },
      { text: "Am Ende ___ den anderen Teams die Kraft ___.", answer: "geht ... aus" },
      { text: "Die Punktzahl ist ___.", answer: "hochgegangen" }
    ]
  },
  {
    id: "m11-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die gehen-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "Bewegung & Richtung", items: ["gehen", "vorbeigehen", "hochgehen", "mitgehen"] },
      { name: "Anfangen & Handeln", items: ["angehen", "vorgehen", "durchgehen", "weitergehen"] },
      { name: "Intensität & Ergebnis", items: ["abgehen", "untergehen", "ausgehen", "übergehen", "rangehen", "zusammengehen"] }
    ]
  },
  {
    id: "m11-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["untergegangen", "angegangen", "durchgegangen", "ausgegangen", "vorbeigegangen", "hochgegangen"],
    sentences: [
      { text: "Die Trainingszeiten sind im Alltag fast ___.", answer: "untergegangen" },
      { text: "Das Team hat das Training hart ___.", answer: "angegangen" },
      { text: "Tom hat den Plan mit dem Team ___.", answer: "durchgegangen" },
      { text: "Den anderen Teams ist am Ende die Kraft ___.", answer: "ausgegangen" },
      { text: "Sie sind an der Tafel beim Eingang ___.", answer: "vorbeigegangen" },
      { text: "Die Punktzahl ist ___.", answer: "hochgegangen" }
    ]
  },
  {
    id: "m11-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Es ist viel los und die Stimmung ist energiegeladen.", right: "Es geht ab." },
      { left: "Jemanden sehr nerven.", right: "jemandem auf den Sack gehen" },
      { left: "Alles riskieren oder maximal reinhängen.", right: "aufs Ganze gehen" },
      { left: "Nichts bekommen.", right: "leer ausgehen" },
      { left: "Sich maximal anstrengen.", right: "an seine Grenze gehen" },
      { left: "Vor Erschöpfung fast zusammenbrechen.", right: "in die Knie gehen" }
    ]
  },
  {
    id: "m11-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Im Fitnessstudio geht es richtig ___.", modelAnswer: "ab" },
      { prompt: "Das geht mir auf den ___.", modelAnswer: "Sack" },
      { prompt: "Jule geht sofort aufs ___.", modelAnswer: "Ganze" },
      { prompt: "Am Ende gehen die anderen Teams leer ___.", modelAnswer: "aus" },
      { prompt: "Am Ende muss Alex in die Knie ___.", modelAnswer: "gehen" },
      { prompt: "An uns kommt niemand mehr ___!", modelAnswer: "vorbei" }
    ]
  },
  {
    id: "m11-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Die anderen Teams gehen am Ende leer durch.", correct: "Die anderen Teams gehen am Ende leer aus.", explanation: "leer ausgehen = nichts bekommen. durchgehen = Schritt für Schritt besprechen." },
      { incorrect: "Tom geht den Plan Punkt für Punkt an.", correct: "Tom geht den Plan Punkt für Punkt durch.", explanation: "durchgehen = besprechen. angehen = in Angriff nehmen." },
      { incorrect: "Die Trainingszeiten dürfen nicht vorbeigehen.", correct: "Die Trainingszeiten dürfen nicht untergehen.", explanation: "untergehen = verloren gehen. vorbeigehen = vorbeilaufen." },
      { incorrect: "Unsere Punktzahl ist mitgegangen.", correct: "Unsere Punktzahl ist hochgegangen.", explanation: "hochgehen = steigen. mitgehen = parallel ansteigen (Puls)." },
      { incorrect: "Nach dem Training geht Alex in die Grenze.", correct: "Nach dem Training geht Alex an seine Grenze.", explanation: "an seine Grenze gehen = sich maximal anstrengen." }
    ]
  },
  {
    id: "m11-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden gehen-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese gehen-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- abgehen\n- angehen\n- durchgehen\n- ausgehen\n- untergehen\n- vorbeigehen",
    mustUseWords: ["abgehen", "angehen", "durchgehen", "ausgehen", "untergehen", "vorbeigehen"],
    modelAnswer: "Abgehen bedeutet, dass viel Energie da ist und es viel Action gibt. Angehen heißt, etwas in Angriff zu nehmen oder zu beginnen. Durchgehen bedeutet, etwas Schritt für Schritt zu besprechen. Ausgehen heißt, dass etwas zu Ende geht, z. B. die Kraft. Untergehen bedeutet, dass etwas im Gesamtbild verloren geht. Vorbeigehen heißt, an etwas vorbeilaufen."
  },
  {
    id: "m11-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele gehen-Verben haben mehr als eine Bedeutung!",
    content: "Viele gehen-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "ausgehen", meanings: [
        { label: "Im Text", example: "Den anderen geht die Kraft aus. (zu Ende sein)" },
        { label: "Weitere Bedeutung", example: "Wir gehen heute Abend aus. (abends weggehen)" }
      ]},
      { verb: "angehen", meanings: [
        { label: "Im Text", example: "Wir gehen das Training hart an. (in Angriff nehmen)" },
        { label: "Weitere Bedeutung", example: "Das geht dich nichts an. (jemanden betreffen)" }
      ]},
      { verb: "untergehen", meanings: [
        { label: "Im Text", example: "Die Trainingszeiten gehen unter. (verloren gehen)" },
        { label: "Weitere Bedeutung", example: "Die Sonne geht unter. (Sonnenuntergang)" }
      ]},
      { verb: "durchgehen", meanings: [
        { label: "Im Text", example: "Tom geht den Plan durch. (Schritt für Schritt besprechen)" },
        { label: "Weitere Bedeutung", example: "Das Pferd ist durchgegangen. (die Kontrolle verlieren)" }
      ]}
    ]
  },
  {
    id: "m11-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Wir gehen heute Abend schick aus.\" – Was bedeutet ausgehen hier?", options: ["zu Ende sein", "abends weggehen", "leer ausgehen"], correctIndex: 1 },
      { question: "\"Das geht dich überhaupt nichts an!\" – Was bedeutet angehen hier?", options: ["beginnen", "in Angriff nehmen", "jemanden betreffen"], correctIndex: 2 },
      { question: "\"Die Sonne geht gerade unter.\" – Was bedeutet untergehen hier?", options: ["verloren gehen", "Sonnenuntergang", "scheitern"], correctIndex: 1 },
      { question: "\"Der Gaul ist mit ihm durchgegangen.\" – Was bedeutet durchgehen hier?", options: ["Schritt für Schritt besprechen", "die Kontrolle verlieren", "hindurchgehen"], correctIndex: 1 },
      { question: "\"Es geht nicht an, dass er immer zu spät kommt.\" – Was bedeutet angehen hier?", options: ["beginnen", "es ist nicht akzeptabel", "jemanden betreffen"], correctIndex: 1 }
    ]
  }
];

// ========== MODULE 12: machen ==========
allExercises[12] = [
  {
    id: "m12-ex1", type: "true-false", skill: "lesen",
    instruction: "Übung 1 – Richtig oder falsch? Lies die Aussagen und entscheide: Stimmt das mit der Geschichte überein?",
    statements: [
      { statement: "Am Montagmorgen funktioniert das Licht im Büro nicht.", correct: true },
      { statement: "Der Stromausfall betrifft nur das Büro, nicht das Lager.", correct: false },
      { statement: "Alex ruft die Kunden mit dem Diensthandy an.", correct: true },
      { statement: "Der Hausmeister findet heraus, dass die Handwerker am Wochenende gepfuscht haben.", correct: true },
      { statement: "Am Ende des Tages fühlt sich Alex voller Energie.", correct: false }
    ]
  },
  {
    id: "m12-ex2", type: "gap-fill", skill: "lesen",
    instruction: "Übung 2 – Lückentext: Schreibe das passende Verb in der richtigen Form.",
    sentences: [
      { text: "Ich will das Licht im Büro ___, aber nichts passiert.", answer: "anmachen" },
      { text: "Alex ___ das Fenster ___, damit Tageslicht reinkommt.", answer: "macht ... auf" },
      { text: "Im Lager können die Jungs nichts mehr ___.", answer: "fertigmachen" },
      { text: "Wir hatten mit dem Kunden ___, dass die Ware heute rausgeht.", answer: "ausgemacht" },
      { text: "Ich rufe an und ___ ihnen ___, dass wir nichts dafür können.", answer: "mache ... klar" },
      { text: "Am Ende macht Alex konsequent das Handy ___.", answer: "aus" }
    ]
  },
  {
    id: "m12-ex3", type: "verb-grouping", skill: "lesen",
    instruction: "Übung 3 – Verben in Gruppen: Ordne die machen-Verben den richtigen Kategorien zu.",
    categories: [
      { name: "An/Aus & Öffnen", items: ["anmachen", "ausmachen", "aufmachen"] },
      { name: "Arbeit & Erledigung", items: ["fertigmachen", "weitermachen", "abmachen"] },
      { name: "Kommunikation & Wirkung", items: ["klarmachen", "kaputtmachen", "sich aufmachen"] }
    ]
  },
  {
    id: "m12-ex4", type: "gap-fill", skill: "lesen",
    instruction: "Übung 4 – Passendes Verb einsetzen: Ergänze das passende Verb aus dem Kasten.",
    wordBank: ["angemacht", "ausgemacht", "aufgemacht", "fertiggemacht", "weitergemacht", "klargemacht"],
    sentences: [
      { text: "Das Licht konnte nicht ___ werden.", answer: "angemacht" },
      { text: "Der Termin war mit dem Kunden fest ___.", answer: "ausgemacht" },
      { text: "Alex hat als Erstes das Fenster ___.", answer: "aufgemacht" },
      { text: "Ohne Strom konnte im Lager nichts ___ werden.", answer: "fertiggemacht" },
      { text: "Nach der Stromreparatur wurde sofort ___.", answer: "weitergemacht" },
      { text: "Alex hat den Kunden ___, dass sie nichts dafür können.", answer: "klargemacht" }
    ]
  },
  {
    id: "m12-ex5", type: "matching", skill: "lesen",
    instruction: "Übung 5 – Redewendungen verbinden: Welcher Ausdruck passt zu welcher Situation?",
    pairs: [
      { left: "Man ist sehr gestresst und angespannt.", right: "unter Strom stehen" },
      { left: "Vieles geht schief, nichts funktioniert.", right: "Es ist der Wurm drin." },
      { left: "Man versteht etwas gerade nicht.", right: "auf dem Schlauch stehen" },
      { left: "Etwas allein tun, ohne Rücksprache.", right: "auf eigene Faust" },
      { left: "Etwas ist kaputt und funktioniert nicht mehr.", right: "im Eimer sein" },
      { left: "Plötzlich und unangemeldet auftauchen.", right: "bei jemandem auf der Matte stehen" }
    ]
  },
  {
    id: "m12-ex6", type: "sentence-completion", skill: "schreiben",
    instruction: "Übung 6 – Satzergänzungen: Ergänze die Sätze sinnvoll auf Deutsch.",
    sentences: [
      { prompt: "Heute ist echt der ___ drin.", modelAnswer: "Wurm" },
      { prompt: "Ich stehe total unter ___.", modelAnswer: "Strom" },
      { prompt: "Vor zehn Jahren hätte mich das komplett ___ gemacht.", modelAnswer: "kirre" },
      { prompt: "Der Hausmeister hat gesagt: nicht auf eigene ___!", modelAnswer: "Faust" },
      { prompt: "Die Elektronik war komplett im ___.", modelAnswer: "Eimer" },
      { prompt: "Macht euch bloß nicht ___.", modelAnswer: "verrückt" }
    ]
  },
  {
    id: "m12-ex7", type: "error-correction", skill: "schreiben",
    instruction: "Übung 7 – Fehler finden: Jeder Satz enthält genau einen Fehler. Schreibe den korrigierten Satz.",
    sentences: [
      { incorrect: "Ich will das Licht aufmachen.", correct: "Ich will das Licht anmachen.", explanation: "anmachen = einschalten. aufmachen = öffnen." },
      { incorrect: "Wir hatten mit dem Kunden angemacht, dass die Ware heute rausgeht.", correct: "Wir hatten mit dem Kunden ausgemacht, dass die Ware heute rausgeht.", explanation: "ausmachen/abmachen = vereinbaren. anmachen = einschalten." },
      { incorrect: "Alex macht den Kunden auf, dass es einen Stromausfall gibt.", correct: "Alex macht den Kunden klar, dass es einen Stromausfall gibt.", explanation: "klarmachen = erklären. aufmachen = öffnen." },
      { incorrect: "Am Ende des Tages hat Alex das Handy fertiggemacht.", correct: "Am Ende des Tages hat Alex das Handy ausgemacht.", explanation: "ausmachen = ausschalten. fertigmachen = etwas abschließen oder jemanden erschöpfen." },
      { incorrect: "Der Hausmeister machte sich erst mal an die Tür.", correct: "Der Hausmeister machte sich erst mal auf den Weg.", explanation: "sich aufmachen = sich auf den Weg machen." }
    ]
  },
  {
    id: "m12-ex8", type: "open-writing", skill: "schreiben",
    instruction: "Übung 8 – Verben erklären: Erkläre die folgenden machen-Verben mit eigenen Worten auf Deutsch.",
    prompt: "Erkläre auf Deutsch, was diese machen-Verben bedeuten. Schreibe für jedes Verb mindestens einen Satz mit einem eigenen Beispiel:\n\n- anmachen\n- ausmachen\n- aufmachen\n- fertigmachen\n- klarmachen\n- sich aufmachen",
    mustUseWords: ["anmachen", "ausmachen", "aufmachen", "fertigmachen", "klarmachen", "aufmachen"],
    modelAnswer: "Anmachen bedeutet, etwas einzuschalten, z. B. das Licht. Ausmachen heißt, etwas ausschalten oder etwas vereinbaren. Aufmachen bedeutet, etwas zu öffnen, z. B. ein Fenster. Fertigmachen heißt, eine Aufgabe komplett abzuschließen. Klarmachen bedeutet, jemandem etwas deutlich zu erklären. Sich aufmachen heißt, sich auf den Weg machen."
  },
  {
    id: "m12-ex9", type: "info-box", skill: "lesen",
    instruction: "Übung 9 – Doppelte Bedeutungen: Viele machen-Verben haben mehr als eine Bedeutung!",
    content: "Viele machen-Verben, die du in der Geschichte kennengelernt hast, haben im Alltag noch eine weitere Bedeutung. Schau dir die Beispiele unten an – erkennst du den Unterschied?",
    verbExamples: [
      { verb: "anmachen", meanings: [
        { label: "Im Text", example: "Mach das Licht an. (einschalten)" },
        { label: "Weitere Bedeutung", example: "Mach mich nicht an! (provozieren, belästigen)" }
      ]},
      { verb: "ausmachen", meanings: [
        { label: "Im Text", example: "Mach das Handy aus. (ausschalten)" },
        { label: "Weitere Bedeutung", example: "Das macht nichts aus. (nicht stören, egal sein)" }
      ]},
      { verb: "fertigmachen", meanings: [
        { label: "Im Text", example: "Die Bestellungen fertigmachen. (abschließen)" },
        { label: "Weitere Bedeutung", example: "Der Tag hat mich fertiggemacht. (erschöpfen)" }
      ]},
      { verb: "aufmachen", meanings: [
        { label: "Im Text", example: "Das Fenster aufmachen. (öffnen)" },
        { label: "Weitere Bedeutung", example: "Sie hat einen kleinen Laden aufgemacht. (eröffnen)" }
      ]}
    ]
  },
  {
    id: "m12-ex10", type: "multiple-choice", skill: "lesen",
    instruction: "Übung 10 – Welche Bedeutung? Wähle die richtige Bedeutung des Verbs im jeweiligen Satz.",
    questions: [
      { question: "\"Mach mich nicht so an – ich bin nicht in Stimmung!\" – Was bedeutet anmachen hier?", options: ["einschalten", "provozieren", "öffnen"], correctIndex: 1 },
      { question: "\"Das macht mir überhaupt nichts aus.\" – Was bedeutet ausmachen hier?", options: ["ausschalten", "vereinbaren", "stören"], correctIndex: 2 },
      { question: "\"Der ganze Stress hat ihn total fertiggemacht.\" – Was bedeutet fertigmachen hier?", options: ["abschließen", "erschöpfen", "vorbereiten"], correctIndex: 1 },
      { question: "\"Sie hat letztes Jahr einen neuen Laden aufgemacht.\" – Was bedeutet aufmachen hier?", options: ["öffnen", "eröffnen", "einschalten"], correctIndex: 1 },
      { question: "\"Wir müssen noch ausmachen, wann wir uns treffen.\" – Was bedeutet ausmachen hier?", options: ["ausschalten", "stören", "vereinbaren"], correctIndex: 2 }
    ]
  }
];

// ── apply replacements ───────────────────────────────────────

// Process modules from 12 downward so line-number shifts don't affect earlier modules.
const moduleNums = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

for (const n of moduleNums) {
  // Find the first exercise id for this module
  const idPattern = `"id": "m${n}-`;
  let firstExIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(idPattern)) {
      firstExIdx = i;
      break;
    }
  }
  if (firstExIdx === -1) {
    console.error(`Could not find exercises for module ${n}`);
    continue;
  }

  // Search backward for "exercises": [
  let exStart = firstExIdx;
  while (exStart > 0 && !lines[exStart].trimStart().startsWith('"exercises"')) {
    exStart--;
  }

  // Search forward for ],  followed by "reviewItems"
  let exEnd = firstExIdx;
  while (exEnd < lines.length - 1) {
    if (lines[exEnd + 1] && lines[exEnd + 1].includes('"reviewItems"')) {
      break;
    }
    exEnd++;
  }

  // Build replacement text
  const newExercisesStr = exercisesToString(allExercises[n]);

  // Replace lines from exStart to exEnd (inclusive) with new exercises text + closing
  const newLines = newExercisesStr.split('\n');
  // Ensure the array closes with ],
  if (!newLines[newLines.length - 1].trim().endsWith('],')) {
    newLines[newLines.length - 1] = newLines[newLines.length - 1].replace(/\]$/, '],');
  }

  const removed = lines.splice(exStart, exEnd - exStart + 1, ...newLines);
  console.log(`Module ${n}: replaced ${removed.length} lines (${exStart + 1}-${exEnd + 1}) with ${newLines.length} lines`);
}

// Write updated content
fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
console.log('\nDone! All exercises updated.');
