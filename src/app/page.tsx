"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: BookOpen,
    title: "12 fesselnde Geschichten",
    desc: "Jedes Modul erzählt eine Geschichte rund um ein Verb-Universum – authentisch, lebendig, einprägsam.",
  },
  {
    icon: Headphones,
    title: "Synchro-Audio",
    desc: "Höre die Geschichte, folge mit – jeder Satz wird hervorgehoben. Klicke auf Sätze zum Wiederholen.",
  },
  {
    icon: PenTool,
    title: "Gezielte Übungen",
    desc: "Lesen, Hören, Sprechen, Schreiben – vier Fertigkeiten, strukturierte Aufgaben, sofortiges Feedback.",
  },
  {
    icon: Mic,
    title: "Sprechen mit Pflicht-Wörtern",
    desc: "Übe aktiv mit Speaking-Prompts und Pflicht-Ausdrücken. Musterlösungen zeigen dir den Weg.",
  },
  {
    icon: BarChart3,
    title: "Sichtbarer Fortschritt",
    desc: "Sieh genau, was erledigt ist und was fehlt. Modul für Modul, Fertigkeit für Fertigkeit.",
  },
  {
    icon: Sparkles,
    title: "KI-gestütztes Feedback",
    desc: "Schreibe Texte und bekomme intelligentes Feedback. Die Musterlösung ist immer nur einen Klick entfernt.",
  },
];

const modulePreview = [
  { num: 1, title: "Der Umzug", verb: "ziehen" },
  { num: 2, title: "Alles mitgebracht?", verb: "bringen" },
  { num: 3, title: "Man nehme, so man hat", verb: "nehmen" },
  { num: 4, title: "Genau an diese Stelle", verb: "stellen" },
  { num: 5, title: "Einfach drüberstehen", verb: "stehen" },
  { num: 6, title: "Viele Übergaben", verb: "geben" },
  { num: 7, title: "Setz dich dazu", verb: "setzen" },
  { num: 8, title: "Liegt alles bereit?", verb: "legen" },
  { num: 9, title: "Endlich runterkommen", verb: "kommen" },
  { num: 10, title: "Nerven behalten", verb: "halten" },
  { num: 11, title: "Im Studio geht es ab", verb: "gehen" },
  { num: 12, title: "Mach Licht an!", verb: "machen" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-4 pt-12 sm:pt-16 pb-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
            {/* Photo — top on mobile, right column on desktop */}
            <div className="shrink-0 w-44 sm:w-56 lg:w-80 lg:order-2">
              <Image
                src="/robin-landing-page.jpeg"
                alt="Robin Meinert"
                width={400}
                height={520}
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                priority
              />
            </div>
            {/* Text */}
            <div className="flex-1 text-center lg:text-left lg:order-1">
              <Image
                src="/Logo-ADG-weiss.png"
                alt="Fixe Geschichten"
                width={260}
                height={78}
                className="mx-auto lg:mx-0 logo-dark-only mb-4"
                priority
              />
              <Image
                src="/ADG! Logo_transparent.png"
                alt="Fixe Geschichten"
                width={260}
                height={78}
                className="mx-auto lg:mx-0 logo-light-only mb-4"
                priority
              />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
                Fixe Geschichten
              </h1>
              <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 text-sm text-gold-400 mb-5">
                <Sparkles className="w-4 h-4" />
                12 Module · Geschichten · Verben · Redewendungen
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-muted mb-4">
                Deutsch lernen,{" "}
                <span className="text-gold-400">wie es wirklich klingt.</span>
              </p>
              <p className="text-base sm:text-lg text-muted max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Tauche ein in 12 Geschichten, meistere die wichtigsten Verben und Redewendungen
                und trainiere alle vier Fertigkeiten – mit Audio, Übungen und intelligentem Feedback.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-gold-500 text-navy-900 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-gold-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
                >
                  Jetzt starten <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="text-muted hover:text-foreground transition-colors px-6 py-3.5 text-lg"
                >
                  Anmelden →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App preview */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
          <Image
            src="/robin-inside-app.jpeg"
            alt="So sieht der Kurs von innen aus"
            width={1200}
            height={750}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-3">
          So funktioniert der Kurs
        </h2>
        <p className="text-center text-muted mb-12 max-w-xl mx-auto">
          Jedes Modul folgt dem gleichen bewährten Ablauf — Story first, dann Vokabeln, dann Übungen.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "1", label: "Geschichte lesen & hören", desc: "Tauche ein in die Story mit synchronisiertem Audio." },
            { step: "2", label: "Verben & Redewendungen", desc: "Lerne die Schlüssel-Ausdrücke mit Beispielen." },
            { step: "3", label: "Übungen machen", desc: "Lesen, Hören, Sprechen, Schreiben – aktiv trainieren." },
            { step: "4", label: "Fortschritt sehen", desc: "Sieh deinen Fortschritt und wiederhole bei Bedarf." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-400 font-bold text-lg flex items-center justify-center mx-auto mb-3">
                {s.step}
              </div>
              <h3 className="font-semibold text-foreground mb-1">{s.label}</h3>
              <p className="text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-navy-800/50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Was dich erwartet
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card rounded-xl border border-border p-6 hover:border-gold-500/30 transition-colors"
              >
                <f.icon className="w-8 h-8 text-gold-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module overview */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-3">
          12 Module. 12 Verben. 12 Geschichten.
        </h2>
        <p className="text-center text-muted mb-12 max-w-xl mx-auto">
          Jedes Modul dreht sich um ein Verb und seine Redewendungen – eingebettet in eine unvergessliche Geschichte.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulePreview.map((m) => (
            <div
              key={m.num}
              className="flex items-center gap-4 bg-card rounded-lg border border-border p-4 hover:border-gold-500/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 text-gold-400 font-bold flex items-center justify-center text-sm shrink-0">
                {m.num}
              </div>
              <div>
                <h4 className="font-medium text-foreground">{m.title}</h4>
                <p className="text-xs text-muted">Fokus: {m.verb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="bg-navy-800/50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Was du bekommst
          </h2>
          <div className="space-y-3 text-left max-w-lg mx-auto">
            {[
              "12 vollständige Module mit Geschichten",
              "Audio-synchronisiertes Lesen",
              "Über 150 Verben & Redewendungen",
              "Lesen-, Hören-, Sprech- und Schreibübungen",
              "Musterlösungen und KI-Feedback",
              "Flashcards & Wiederholungssystem",
              "Fortschritts-Tracking pro Modul",
              "3 Review-Module nach Modul 4, 8 und 12",
              "Mobil-optimierte Web-App",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-gold-500 text-navy-900 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-gold-400 transition-colors mt-10 shadow-lg shadow-gold-500/20"
          >
            Jetzt starten <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted text-sm">
            <Image src="/ADG!_Icon_transparent.png" alt="" width={20} height={20} />
            <span>Fixe Geschichten · Robin Meinert</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a href="https://aufdeutschgesagt.de/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Website
            </a>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Anmelden
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
