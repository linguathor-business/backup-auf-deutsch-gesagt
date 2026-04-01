"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Zap } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { useProgressStore } from "@/store/progress";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const initProgress = useProgressStore((s) => s.initProgress);
  const router = useRouter();

  const handleAdminLogin = () => {
    login({ id: "admin-001", email: "admin@adg.de", name: "Admin" });
    initProgress("admin-001");
    router.push("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side demo auth (replace with real API)
    setTimeout(() => {
      if (email && password.length >= 4) {
        const userId = btoa(email).slice(0, 12);
        login({
          id: userId,
          email,
          name: email.split("@")[0],
        });
        initProgress(userId);
        router.push("/dashboard");
      } else {
        setError("Bitte gib deine E-Mail und dein Passwort ein.");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/Logo-ADG-weiss.png" alt="Fixe Geschichten" width={200} height={60} className="logo-dark-only" />
            <Image src="/ADG! Logo_transparent.png" alt="Fixe Geschichten" width={200} height={60} className="logo-light-only" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Willkommen zurück
          </h1>
          <p className="text-muted text-sm">
            Melde dich an, um weiterzulernen.
          </p>
        </div>

        {/* Admin quick-access */}
        <button
          onClick={handleAdminLogin}
          className="w-full flex items-center justify-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-colors rounded-xl py-2.5 text-sm font-medium mb-4"
        >
          <Zap className="w-4 h-4" />
          Admin – direkt einloggen
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl border border-border p-6 space-y-4"
        >
          {error && (
            <div className="bg-coral-500/10 border border-coral-500/20 text-coral-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-muted mb-1.5">E-Mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className="w-full bg-navy-800 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted/50 outline-none focus:border-gold-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Passwort</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-navy-800 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted/50 outline-none focus:border-gold-500 transition-colors"
                required
                minLength={4}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 text-navy-900 py-2.5 rounded-lg font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Wird geladen..." : (
              <>Anmelden <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Noch kein Konto?{" "}
          <Link href="/register" className="text-gold-400 hover:text-gold-300">
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
