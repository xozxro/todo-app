"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const THEMES = [
  { id: "midnight", label: "Midnight", gradient: "from-[#0f0f1a] via-[#1a1a2e] to-[#16213e]" },
  { id: "ocean", label: "Ocean", gradient: "from-[#0a1628] via-[#0d2137] to-[#0a2a4a]" },
  { id: "ember", label: "Ember", gradient: "from-[#1a0a0a] via-[#2e1a1a] to-[#3e1616]" },
  { id: "forest", label: "Forest", gradient: "from-[#0a1a0f] via-[#1a2e1a] to-[#163e22]" },
];

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("midnight");
  const [compactMode, setCompactMode] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("settings");
    if (saved) {
      const s = JSON.parse(saved);
      setTheme(s.theme || "midnight");
      setCompactMode(s.compactMode || false);
      setShowCompleted(s.showCompleted !== false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("settings", JSON.stringify({ theme, compactMode, showCompleted }));
    }
  }, [theme, compactMode, showCompleted, mounted]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-glass border border-glass-border hover:bg-glass-strong transition-all backdrop-blur-xl"
          >
            <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-slate-400">Customize your experience</p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-glass border border-glass-border rounded-2xl p-6 backdrop-blur-xl glass-card">
            <h2 className="text-lg font-semibold text-white mb-4">Theme</h2>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-left",
                    theme === t.id
                      ? "border-accent bg-accent/10"
                      : "border-glass-border hover:border-white/20 bg-glass-light"
                  )}
                >
                  <div className={cn("w-full h-8 rounded-lg bg-gradient-to-r mb-2", t.gradient)} />
                  <span className="text-sm text-slate-200">{t.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-glass border border-glass-border rounded-2xl p-6 backdrop-blur-xl glass-card">
            <h2 className="text-lg font-semibold text-white mb-4">Display</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm text-slate-200">Compact Mode</p>
                  <p className="text-xs text-slate-500">Reduce spacing between items</p>
                </div>
                <div
                  className={cn("w-11 h-6 rounded-full transition-all relative", compactMode ? "bg-accent" : "bg-white/10")}
                  onClick={() => setCompactMode(!compactMode)}
                >
                  <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm", compactMode ? "left-6" : "left-1")} />
                </div>
              </label>
              <div className="border-t border-glass-border-light" />
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm text-slate-200">Show Completed</p>
                  <p className="text-xs text-slate-500">Display completed todos in the list</p>
                </div>
                <div
                  className={cn("w-11 h-6 rounded-full transition-all relative", showCompleted ? "bg-accent" : "bg-white/10")}
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm", showCompleted ? "left-6" : "left-1")} />
                </div>
              </label>
            </div>
          </section>

          <section className="bg-glass border border-glass-border rounded-2xl p-6 backdrop-blur-xl glass-card">
            <h2 className="text-lg font-semibold text-white mb-2">About</h2>
            <div className="space-y-1 text-sm text-slate-400">
              <p>Todo App v1.0.0</p>
              <p>Built with Next.js 15, Tailwind v4, Drizzle ORM</p>
              <p className="text-xs text-slate-600 mt-2">Made with ♥ by Cipher</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
