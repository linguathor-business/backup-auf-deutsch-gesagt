"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useProgressStore } from "@/store/progress";
import {
  LogOut,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const getCompletionPercent = useProgressStore((s) => s.getCompletionPercent);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <Image
            src="/ADG!_Icon_transparent.png"
            alt="Auf Deutsch gesagt!"
            width={32}
            height={32}
            className="group-hover:scale-105 transition-transform"
          />
          <span className="font-semibold text-lg text-foreground">
            Fixe Geschichten
          </span>
        </Link>

        {/* Desktop nav */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-muted hover:text-foreground transition-colors text-sm"
            >
              Kursübersicht
            </Link>
            <Link
              href="/progress"
              className="text-muted hover:text-foreground transition-colors text-sm flex items-center gap-1"
            >
              <BarChart3 className="w-4 h-4" />
              Fortschritt
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-24 h-1.5 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 rounded-full progress-animated"
                  style={{ width: `${getCompletionPercent()}%` }}
                />
              </div>
              <span className="text-muted text-xs">{getCompletionPercent()}%</span>
            </div>
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <ThemeToggle />
              <span className="text-sm text-muted">{user?.name}</span>
              <button
                onClick={logout}
                className="text-muted hover:text-coral-400 transition-colors"
                title="Abmelden"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile menu button */}
        {isAuthenticated && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-muted"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        {!isAuthenticated && (
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Anmelden
            </Link>
            <Link
              href="/register"
              className="text-sm bg-gold-500 text-navy-900 px-4 py-2 rounded-lg hover:bg-gold-400 transition-colors font-medium"
            >
              Registrieren
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isAuthenticated && mobileOpen && (
        <div className="md:hidden bg-navy-800 border-b border-border px-4 py-4 space-y-3">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="block text-muted hover:text-foreground transition-colors text-sm"
          >
            Kursübersicht
          </Link>
          <Link
            href="/progress"
            onClick={() => setMobileOpen(false)}
            className="block text-muted hover:text-foreground transition-colors text-sm"
          >
            Fortschritt
          </Link>
          <div className="pt-2 border-t border-border">
            <span className="text-sm text-muted">{user?.name}</span>
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="ml-4 text-coral-400 text-sm"
            >
              Abmelden
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
