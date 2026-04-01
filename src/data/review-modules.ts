import { CourseModule } from "@/types";

// ============================================
// Review Module R1 — after Module 4
// Reviews: M1 (ziehen), M2 (bringen), M3 (nehmen), M4 (stellen)
// ============================================

const reviewModule1: CourseModule = {
  id: 101,
  slug: "review-1",
  title: "Wiederholung 1",
  subtitle: "Module 1–4: ziehen, bringen, nehmen, stellen",
  focusVerb: "Wiederholung",
  learningGoals: [
    "Präfixverben aus Modul 1–4 sicher anwenden",
    "Kollokationen mit ziehen, bringen, nehmen, stellen bilden",
    "In freien Texten und Dialogen Verben aktiv einsetzen",
  ],
  estimatedMinutes: 30,
  isReviewModule: true,
  story: {
    text: "",
    paragraphs: [],
    sentences: [],
  },
  coreVerbs: [],
  idioms: [],
  reviewItems: [],
  exercises: [
    // ── 1. Lückentext mit Auswahlmöglichkeiten ──
    {
      id: "r1-ex1",
      type: "cloze-select",
      skill: "lesen",
      instruction: "Übung 1 – Lückentext: Wähle das passende Präfixverb für jede Lücke.",
      sentences: [
        {
          text: "Ben ___ nächsten Monat in eine neue Wohnung ___.",
          options: ["zieht … ein", "stellt … auf", "bringt … mit", "nimmt … an"],
          correctIndex: 0,
        },
        {
          text: "Kannst du mir bitte ___, wie man das Regal ___?",
          options: ["beibringen … aufstellt", "mitnehmen … hinstellt", "annehmen … einstellt", "vorstellen … abstellt"],
          correctIndex: 0,
        },
        {
          text: "Jule hat den Kundentermin auf elf Uhr ___.",
          options: ["vorgezogen", "aufgestellt", "mitgenommen", "angebracht"],
          correctIndex: 0,
        },
        {
          text: "Ich muss ___, dass die Lieferung pünktlich ankommt.",
          options: ["sicherstellen", "durchziehen", "übernehmen", "unterbringen"],
          correctIndex: 0,
        },
        {
          text: "Mehmet hat die ganze Torte allein zum Büro ___.",
          options: ["mitgebracht", "aufgezogen", "eingenommen", "hingestellt"],
          correctIndex: 0,
        },
        {
          text: "Ich kann dem Rezept ___, dass man erst die Zwiebeln anbraten muss.",
          options: ["entnehmen", "vorstellen", "beibringen", "aufbringen"],
          correctIndex: 0,
        },
        {
          text: "Er hat sich einer schwierigen Prüfung ___.",
          options: ["unterzogen", "durchgezogen", "vorgestellt", "aufgebracht"],
          correctIndex: 0,
        },
        {
          text: "Frau Krüger wollte das Problem sofort auf den Punkt ___.",
          options: ["bringen", "stellen", "ziehen", "nehmen"],
          correctIndex: 0,
        },
      ],
    },

    // ── 2. Collocation Building ──
    {
      id: "r1-ex2",
      type: "matching",
      skill: "lesen",
      instruction: "Übung 2 – Kollokationen bilden: Ordne die Verben den passenden Ergänzungen zu. (2 Kollokationen pro Modul)",
      pairs: [
        // M1: ziehen
        { left: "in die Länge", right: "ziehen" },
        { left: "alle Register", right: "ziehen" },
        // M2: bringen
        { left: "auf den Punkt", right: "bringen" },
        { left: "in Ordnung", right: "bringen" },
        // M3: nehmen
        { left: "an einer Besprechung", right: "teilnehmen" },
        { left: "ein Paket", right: "annehmen" },
        // M4: stellen
        { left: "eine Frage", right: "stellen" },
        { left: "die Weichen", right: "stellen" },
      ],
    },

    // ── 3. Storytelling mit Präfixverben (1 pro Modul) ──
    {
      id: "r1-ex3",
      type: "open-writing",
      skill: "schreiben",
      instruction: "Übung 3 – Storytelling: Schreibe eine kurze Geschichte (6–8 Sätze), in der du diese vier Präfixverben verwendest – eines aus jedem Modul.",
      prompt: "Situation: Du hilfst einem Freund beim Umzug und gleichzeitig gibt es ein Problem im Büro. Erzähle, was passiert.\n\nVerwende diese Verben:",
      mustUseWords: ["einziehen", "mitbringen", "übernehmen", "aufstellen"],
      modelAnswer: "Am Samstag wollte Ben endlich in seine neue Wohnung einziehen. Ich hatte versprochen, eine Bohrmaschine mitzubringen. Als wir die Möbel aufstellen wollten, rief plötzlich meine Kollegin an. Ich musste kurz eine Aufgabe im Büro übernehmen. Also setzte ich mich in Bens Küche und bearbeitete die Mails. Danach haben wir das Regal aufgestellt und den Tag gerettet. Ben war froh, dass ich trotzdem mitgebracht hatte, was er brauchte.",
    },

    // ── 4. Offene Fragen mit Präfixverben ──
    {
      id: "r1-ex4",
      type: "open-writing",
      skill: "schreiben",
      instruction: "Übung 4 – Offene Fragen: Beantworte die folgenden Fragen in jeweils 2–3 Sätzen. Verwende dabei die angegebenen Präfixverben.",
      prompt: "1. Was würdest du tun, wenn dein Freund kurzfristig umzieht? (Verwende: ausziehen, einziehen)\n2. Wie bringst du einem Freund etwas Neues bei? (Verwende: beibringen)\n3. Was nimmst du mit, wenn du zu einem Spieleabend gehst? (Verwende: mitnehmen, teilnehmen)\n4. Wie stellst du dich bei neuen Kollegen vor? (Verwende: vorstellen, feststellen)",
      mustUseWords: ["ausziehen", "einziehen", "beibringen", "mitnehmen", "teilnehmen", "vorstellen", "feststellen"],
      modelAnswer: "1. Wenn mein Freund kurzfristig umzieht, helfe ich ihm, aus der alten Wohnung auszuziehen und in die neue einzuziehen.\n2. Ich bringe meinem Freund etwas bei, indem ich es Schritt für Schritt erkläre und zeige.\n3. Zum Spieleabend nehme ich Snacks und ein Kartenspiel mit. Ich nehme gern an solchen Abenden teil, weil es Spaß macht.\n4. Ich stelle mich neuen Kollegen mit meinem Namen und meiner Rolle vor. Dabei stelle ich oft fest, dass viele ähnliche Interessen haben.",
    },

    // ── 5. Chatbot Dialog ──
    {
      id: "r1-ex5",
      type: "chatbot",
      skill: "sprechen",
      instruction: "Übung 5 – Dialog: Führe ein kurzes Gespräch mit dem KI-Partner. Verwende dabei Verben und Redewendungen aus Modul 1–4.",
      scenario: "Du unterhältst dich mit einem Freund über euren stressigen Arbeitstag. Dein Freund erzählt, dass bei ihm in der Firma gerade viel los ist. Reagiere natürlich und verwende Verben mit ziehen, bringen, nehmen und stellen.",
      starterMessage: "Hey! Bei mir im Büro geht es gerade drunter und drüber. Frau Müller hat den Termin vorgezogen, und ich muss heute noch die ganze Präsentation fertig machen. Wie läuft es bei dir?",
      targetVerbs: ["umziehen", "aufziehen", "mitbringen", "beibringen", "übernehmen", "annehmen", "vorstellen", "feststellen"],
      targetIdioms: ["etwas durchziehen", "auf den Punkt bringen", "eine Frage stellen"],
      maxTurns: 4,
    },
  ],
};

// ============================================
// Review Module R2 — after Module 8
// Reviews: M5 (stehen), M6 (geben), M7 (setzen), M8 (legen)
// ============================================

const reviewModule2: CourseModule = {
  id: 102,
  slug: "review-2",
  title: "Wiederholung 2",
  subtitle: "Module 5–8: stehen, geben, setzen, legen",
  focusVerb: "Wiederholung",
  learningGoals: [
    "Präfixverben aus Modul 5–8 sicher anwenden",
    "Kollokationen mit stehen, geben, setzen, legen bilden",
    "In freien Texten und Dialogen Verben aktiv einsetzen",
  ],
  estimatedMinutes: 30,
  isReviewModule: true,
  story: {
    text: "",
    paragraphs: [],
    sentences: [],
  },
  coreVerbs: [],
  idioms: [],
  reviewItems: [],
  exercises: [
    // ── 1. Lückentext mit Auswahlmöglichkeiten ──
    {
      id: "r2-ex1",
      type: "cloze-select",
      skill: "lesen",
      instruction: "Übung 1 – Lückentext: Wähle das passende Präfixverb für jede Lücke.",
      sentences: [
        {
          text: "Ben muss morgen um 6 Uhr ___.",
          options: ["aufstehen", "übergeben", "einsetzen", "auslegen"],
          correctIndex: 0,
        },
        {
          text: "Der Teamleiter ___ darauf, dass die Deadline eingehalten wird.",
          options: ["besteht", "nachgibt", "umsetzt", "vorlegt"],
          correctIndex: 0,
        },
        {
          text: "Jule hat den Bericht gestern bei Frau Krüger ___.",
          options: ["abgegeben", "drübergestanden", "fortgesetzt", "hingelegt"],
          correctIndex: 0,
        },
        {
          text: "Wir müssen den Plan jetzt endlich ___.",
          options: ["umsetzen", "zugeben", "bereitlegen", "übersetzen"],
          correctIndex: 0,
        },
        {
          text: "Ich möchte Ihnen ___, die Unterlagen vorher noch einmal zu prüfen.",
          options: ["nahelegen", "voraussetzen", "aufgeben", "durchsetzen"],
          correctIndex: 0,
        },
        {
          text: "Kannst du kurz ___, was er gerade gesagt hat?",
          options: ["zusammenfassen", "angeben", "bereitlegen", "fortsetzen"],
          correctIndex: 0,
        },
        {
          text: "Der Kunde wollte nicht ___ und hat weiter verhandelt.",
          options: ["nachgeben", "bevorstehen", "festlegen", "sich hinsetzen"],
          correctIndex: 0,
        },
        {
          text: "Bitte ___ Sie hier Ihre Kontaktdaten ___.",
          options: ["legen … bereit", "geben … an", "setzen … ein", "stehen … auf"],
          correctIndex: 1,
        },
      ],
    },

    // ── 2. Collocation Building ──
    {
      id: "r2-ex2",
      type: "matching",
      skill: "lesen",
      instruction: "Übung 2 – Kollokationen bilden: Ordne die Verben den passenden Ergänzungen zu. (2 Kollokationen pro Modul)",
      pairs: [
        // M5: stehen
        { left: "Rede und Antwort", right: "stehen" },
        { left: "auf dem Schlauch", right: "stehen" },
        // M6: geben
        { left: "den Ton", right: "angeben" },
        { left: "Gas", right: "geben" },
        // M7: setzen
        { left: "alles auf eine Karte", right: "setzen" },
        { left: "sich in die Nesseln", right: "setzen" },
        // M8: legen
        { left: "den Finger in die Wunde", right: "legen" },
        { left: "sich ins Zeug", right: "legen" },
      ],
    },

    // ── 3. Storytelling mit Präfixverben ──
    {
      id: "r2-ex3",
      type: "open-writing",
      skill: "schreiben",
      instruction: "Übung 3 – Storytelling: Schreibe eine kurze Geschichte (6–8 Sätze), in der du diese vier Präfixverben verwendest – eines aus jedem Modul.",
      prompt: "Situation: Du bereitest dich auf eine wichtige Präsentation auf der Messe vor. Es gibt Stress mit den Kollegen und unerwartete Probleme. Erzähle, was passiert.\n\nVerwende diese Verben:",
      mustUseWords: ["bestehen", "abgeben", "durchsetzen", "bereitlegen"],
      modelAnswer: "Am Morgen der Messe habe ich alles bereitgelegt: Kataloge, Visitenkarten und die neue Preisliste. Dann kam Jule und wollte ihren Bericht bei mir abgeben, aber das Timing war schlecht. Ich musste mich durchsetzen und klar sagen, dass ich jetzt keine Zeit hatte. Der Kunde bestand darauf, die Zahlen sofort zu sehen. Also legte ich alles schnell bereit und präsentierte so professionell wie möglich. Am Ende lief es besser als erwartet.",
    },

    // ── 4. Offene Fragen mit Präfixverben ──
    {
      id: "r2-ex4",
      type: "open-writing",
      skill: "schreiben",
      instruction: "Übung 4 – Offene Fragen: Beantworte die folgenden Fragen in jeweils 2–3 Sätzen. Verwende dabei die angegebenen Präfixverben.",
      prompt: "1. Was steht diese Woche bei dir auf der Arbeit an? (Verwende: bevorstehen, anstehen)\n2. Wie gehst du mit Kritik um? (Verwende: zugeben, nachgeben)\n3. Was würdest du tun, wenn du einen Plan nicht umsetzen kannst? (Verwende: umsetzen, fortsetzen)\n4. Wie legst du Unterlagen für eine Besprechung bereit? (Verwende: bereitlegen, vorlegen)",
      mustUseWords: ["bevorstehen", "anstehen", "zugeben", "nachgeben", "umsetzen", "fortsetzen", "bereitlegen", "vorlegen"],
      modelAnswer: "1. Diese Woche steht ein wichtiger Kundentermin bevor. Außerdem steht noch die Quartalsabrechnung an.\n2. Wenn die Kritik berechtigt ist, gebe ich meinen Fehler zu. Aber ich gebe nicht einfach nach, wenn ich anderer Meinung bin.\n3. Wenn ich einen Plan nicht umsetzen kann, suche ich nach Alternativen und setze die Arbeit in angepasster Form fort.\n4. Ich lege alle Dokumente am Vorabend bereit und lege sie der Chefin am nächsten Morgen vor.",
    },

    // ── 5. Chatbot Dialog ──
    {
      id: "r2-ex5",
      type: "chatbot",
      skill: "sprechen",
      instruction: "Übung 5 – Dialog: Führe ein kurzes Gespräch mit dem KI-Partner. Verwende dabei Verben und Redewendungen aus Modul 5–8.",
      scenario: "Du bist auf einer Messe und triffst einen ehemaligen Kollegen. Ihr unterhaltet euch über eure aktuelle Arbeitssituation, Herausforderungen und Pläne. Verwende Verben mit stehen, geben, setzen und legen.",
      starterMessage: "Na so was! Dich hab ich ja ewig nicht gesehen! Wie geht's dir? Bei mir hat sich einiges verändert – ich habe mich in der neuen Firma durchgesetzt und leite jetzt ein kleines Team. Was macht deine Arbeit?",
      targetVerbs: ["bestehen", "verstehen", "abgeben", "zugeben", "umsetzen", "einsetzen", "bereitlegen", "festlegen"],
      targetIdioms: ["Rede und Antwort stehen", "den Ton angeben", "sich ins Zeug legen"],
      maxTurns: 4,
    },
  ],
};

// ============================================
// Review Module R3 — after Module 12
// Reviews: M9 (kommen), M10 (halten), M11 (gehen), M12 (machen)
// ============================================

const reviewModule3: CourseModule = {
  id: 103,
  slug: "review-3",
  title: "Wiederholung 3",
  subtitle: "Module 9–12: kommen, halten, gehen, machen",
  focusVerb: "Wiederholung",
  learningGoals: [
    "Präfixverben aus Modul 9–12 sicher anwenden",
    "Kollokationen mit kommen, halten, gehen, machen bilden",
    "In freien Texten und Dialogen Verben aktiv einsetzen",
  ],
  estimatedMinutes: 30,
  isReviewModule: true,
  story: {
    text: "",
    paragraphs: [],
    sentences: [],
  },
  coreVerbs: [],
  idioms: [],
  reviewItems: [],
  exercises: [
    // ── 1. Lückentext mit Auswahlmöglichkeiten ──
    {
      id: "r3-ex1",
      type: "cloze-select",
      skill: "lesen",
      instruction: "Übung 1 – Lückentext: Wähle das passende Präfixverb für jede Lücke.",
      sentences: [
        {
          text: "Nach der stressigen Woche muss ich endlich mal ___.",
          options: ["runterkommen", "aufhalten", "losgehen", "weitermachen"],
          correctIndex: 0,
        },
        {
          text: "Der Spediteur hat die Lieferung im Depot ___.",
          options: ["aufgehalten", "angekommen", "abgegangen", "kaputtgemacht"],
          correctIndex: 0,
        },
        {
          text: "Bitte ___ Sie sich an die vereinbarten Lieferzeiten.",
          options: ["halten", "kommen", "gehen", "machen"],
          correctIndex: 0,
        },
        {
          text: "Wir mussten alles ___, weil der Strom ausgefallen war.",
          options: ["fertigmachen", "runterkommen", "durchhalten", "losgehen"],
          correctIndex: 2,
        },
        {
          text: "Können wir einen Termin für nächste Woche ___?",
          options: ["ausmachen", "ausgehen", "aushalten", "auskommen"],
          correctIndex: 0,
        },
        {
          text: "Der Trainer ist den Plan Punkt für Punkt ___.",
          options: ["durchgegangen", "zurückgehalten", "weitergemacht", "angekommen"],
          correctIndex: 0,
        },
        {
          text: "Sie soll sich bitte nicht verrückt ___ lassen.",
          options: ["machen", "halten", "kommen", "gehen"],
          correctIndex: 0,
        },
        {
          text: "Der Hausmeister wollte, dass wir nichts an der Elektrik ___.",
          options: ["anfassen", "anmachen", "aufhalten", "angehen"],
          correctIndex: 0,
        },
      ],
    },

    // ── 2. Collocation Building ──
    {
      id: "r3-ex2",
      type: "matching",
      skill: "lesen",
      instruction: "Übung 2 – Kollokationen bilden: Ordne die Verben den passenden Ergänzungen zu. (2 Kollokationen pro Modul)",
      pairs: [
        // M9: kommen
        { left: "auf den Geschmack", right: "kommen" },
        { left: "zu kurz", right: "kommen" },
        // M10: halten
        { left: "die Nerven", right: "behalten" },
        { left: "die Füße still", right: "halten" },
        // M11: gehen
        { left: "einen Schritt weiter", right: "gehen" },
        { left: "in sich", right: "gehen" },
        // M12: machen
        { left: "sich nicht verrückt", right: "machen" },
        { left: "das Licht", right: "anmachen" },
      ],
    },

    // ── 3. Storytelling mit Präfixverben ──
    {
      id: "r3-ex3",
      type: "open-writing",
      skill: "schreiben",
      instruction: "Übung 3 – Storytelling: Schreibe eine kurze Geschichte (6–8 Sätze), in der du diese vier Präfixverben verwendest – eines aus jedem Modul.",
      prompt: "Situation: Ein typischer Arbeitstag mit Pannen – der Strom fällt aus, der Kunde ruft an, und du versuchst, den Tag zu retten. Erzähle, was passiert.\n\nVerwende diese Verben:",
      mustUseWords: ["zurechtkommen", "durchhalten", "losgehen", "anmachen"],
      modelAnswer: "Als ich am Morgen das Licht anmachen wollte, passierte nichts – Stromausfall. Trotzdem musste der Tag losgehen. Ich rief den Kunden an und erklärte die Lage so ruhig wie möglich. Er war nicht begeistert, aber wir kamen irgendwie zurecht. Im Lager arbeiteten die Kollegen im Dunkeln weiter – alle mussten durchhalten. Am Nachmittag kam endlich der Strom zurück und wir konnten alles aufholen.",
    },

    // ── 4. Offene Fragen mit Präfixverben ──
    {
      id: "r3-ex4",
      type: "open-writing",
      skill: "schreiben",
      instruction: "Übung 4 – Offene Fragen: Beantworte die folgenden Fragen in jeweils 2–3 Sätzen. Verwende dabei die angegebenen Präfixverben.",
      prompt: "1. Wie kommst du nach einem stressigen Tag runter? (Verwende: runterkommen, ankommen)\n2. Was machst du, um bei einer schwierigen Aufgabe die Nerven zu behalten? (Verwende: durchhalten, festhalten)\n3. Wie gehst du mit Problemen um, die du nicht ändern kannst? (Verwende: losgehen, weitermachen)\n4. Was machst du morgens als Erstes im Büro? (Verwende: anmachen, klarmachen)",
      mustUseWords: ["runterkommen", "ankommen", "durchhalten", "festhalten", "losgehen", "weitermachen", "anmachen", "klarmachen"],
      modelAnswer: "1. Wenn ich nach einem langen Tag zu Hause ankomme, versuche ich, mit einem Spaziergang runterzukommen.\n2. Ich halte an meinem Plan fest und halte durch, auch wenn es schwierig wird.\n3. Wenn etwas schiefgeht, muss ich trotzdem losgehen und weitermachen – aufgeben ist keine Option.\n4. Als Erstes mache ich den Rechner an und mache meinem Team klar, was heute die Prioritäten sind.",
    },

    // ── 5. Chatbot Dialog ──
    {
      id: "r3-ex5",
      type: "chatbot",
      skill: "sprechen",
      instruction: "Übung 5 – Dialog: Führe ein kurzes Gespräch mit dem KI-Partner. Verwende dabei Verben und Redewendungen aus Modul 9–12.",
      scenario: "Du erzählst einem Freund von einem chaotischen Tag auf der Arbeit. Es gab einen Stromausfall, Kundenprobleme und Stress mit dem Hausmeister. Verwende Verben mit kommen, halten, gehen und machen.",
      starterMessage: "Hey, du siehst ja fertig aus! Was war denn heute bei dir los? Ich hatte auch so einen Tag – bei uns im Fitnessstudio ist sogar die Klimaanlage ausgefallen. Erzähl mal!",
      targetVerbs: ["runterkommen", "zurechtkommen", "durchhalten", "einhalten", "losgehen", "angehen", "anmachen", "ausmachen"],
      targetIdioms: ["die Nerven behalten", "der Wurm ist drin", "sich nicht verrückt machen"],
      maxTurns: 4,
    },
  ],
};

export const reviewModules = [reviewModule1, reviewModule2, reviewModule3];
export default reviewModules;
