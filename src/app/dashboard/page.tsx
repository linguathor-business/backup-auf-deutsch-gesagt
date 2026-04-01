"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ModuleCard from "@/components/ModuleCard";
import { useAuthStore } from "@/store/auth";
import { useProgressStore } from "@/store/progress";
import allModules from "@/data/modules";
import { Sparkles, TrendingUp, Bell, Mail, Shield } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const getCompletionPercent = useProgressStore((s) => s.getCompletionPercent);
  const progress = useProgressStore((s) => s.progress);
  const adminMode = useProgressStore((s) => s.adminMode);
  const toggleAdminMode = useProgressStore((s) => s.toggleAdminMode);
  const router = useRouter();
  const [reminderEnabled, setReminderEnabled] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const completedModules = Object.values(progress.modules).filter(
    (m) => m.completed
  ).length;
  const startedModules = Object.values(progress.modules).filter(
    (m) => m.started && !m.completed
  ).length;
  const overallPercent = getCompletionPercent();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Hallo, {user.name}! 👋
          </h1>
          <p className="text-muted">
            Dein Kursfortschritt auf einen Blick.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gold-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-gold-400" />
              </div>
              <span className="text-sm text-muted">Gesamtfortschritt</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-foreground">{overallPercent}%</span>
            </div>
            <div className="mt-3 h-2 bg-navy-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 rounded-full progress-animated"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm text-muted">Abgeschlossen</span>
            </div>
            <span className="text-3xl font-bold text-foreground">
              {completedModules}
            </span>
            <span className="text-muted text-sm ml-1">/ {allModules.length} Module</span>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-sm text-muted">In Bearbeitung</span>
            </div>
            <span className="text-3xl font-bold text-foreground">
              {startedModules}
            </span>
            <span className="text-muted text-sm ml-1">Module</span>
          </div>
        </div>

        {/* Email reminder card */}
        <div className="bg-card rounded-xl border border-border p-5 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold-500/20 flex items-center justify-center">
                <Mail className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">E-Mail-Erinnerungen</h3>
                <p className="text-xs text-muted">Erhalte eine Erinnerung, wenn du 3 Tage nicht gelernt hast.</p>
              </div>
            </div>
            <button
              onClick={() => setReminderEnabled(!reminderEnabled)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                reminderEnabled ? "bg-gold-500" : "bg-navy-600"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  reminderEnabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
          {reminderEnabled && (
            <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1">
              <Bell className="w-3 h-3" /> Erinnerungen aktiviert (kommt bald per E-Mail!)
            </p>
          )}
        </div>

        {/* Admin mode toggle */}
        <div className="bg-card rounded-xl border border-border p-5 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                adminMode ? "bg-coral-500/20" : "bg-navy-700"
              }`}>
                <Shield className={`w-4 h-4 ${adminMode ? "text-coral-400" : "text-muted"}`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Admin-Modus</h3>
                <p className="text-xs text-muted">Alle Module freischalten, ohne vorherige abzuschließen.</p>
              </div>
            </div>
            <button
              onClick={toggleAdminMode}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                adminMode ? "bg-coral-500" : "bg-navy-600"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  adminMode ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
          {adminMode && (
            <p className="text-xs text-coral-400 mt-3 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Alle Module sind freigeschaltet.
            </p>
          )}
        </div>

        {/* Module grid */}
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Deine Module
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allModules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </main>
    </div>
  );
}
