"use client"

import React from "react";
import { Suspense } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Loading from "../components/loading";

// ─── Feature card data ───────────────────────────────────────────────────────
const features = [
  {
    emoji: "🧩",
    title: "Component Showcase",
    description: "Explore Kumo UI components, from buttons to surfaces and clipboard utilities.",
    href: "/showcase",
    tag: "UI",
  },
  {
    emoji: "📡",
    title: "API Playground",
    description: "Fire off live requests, inspect responses, and test your endpoints in seconds.",
    href: "/other",
    tag: "Dev",
  },
  {
    emoji: "🎨",
    title: "Theme Lab",
    description: "Toggle light and dark mode. See how every component responds in real time.",
    href: "#",
    tag: "Design",
  },
];

// ─── Tiny stat items ─────────────────────────────────────────────────────────
const stats = [
  { value: "3+", label: "Playground sections" },
  { value: "∞", label: "Things to break" },
  { value: "1", label: "Developer (you)" },
];

export default function Home() {
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration flicker on mount
  React.useEffect(() => setMounted(true), []);

  return (
    <Suspense fallback={<Loading />}>
      {/* ── Page wrapper ── */}
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">

        {/* ── Top nav ── */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md">
          {/* Logo / wordmark */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter">danng</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 uppercase tracking-widest">
              dev
            </span>
          </div>

          {/* Nav links + toggle */}
          <nav className="flex items-center gap-6">
            <a href="/showcase" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Showcase
            </a>
            <a href="/other" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Other
            </a>
            <ThemeToggle />
          </nav>
        </header>

        {/* ── Hero ── */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-24 gap-6">
          {/* Eyebrow label */}
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Personal Playground
          </span>

          {/* Big headline — this is just a plain h1 styled with Tailwind */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none max-w-3xl">
            Build fast.{" "}
            <span className="text-zinc-400 dark:text-zinc-600">Break things.</span>{" "}
            Learn more.
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            A scratchpad for experimenting with components, APIs, and whatever
            else is interesting this week.
          </p>

          {/* CTA buttons — plain <a> tags styled with Tailwind, no Kumo needed */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <a
              href="/showcase"
              className="px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              Explore components →
            </a>
            <a
              href="/other"
              className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              API playground
            </a>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="border-y border-zinc-200 dark:border-zinc-800 py-8 px-6">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                {/* 
                  text-3xl  → font size (equivalent to ~30px)
                  font-black → heaviest font weight (900)
                  tabular-nums → makes numbers align nicely  
                */}
                <span className="text-3xl font-black tabular-nums">{s.value}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature cards ── */}
        <section className="max-w-3xl mx-auto px-6 py-20 flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight">What's in here</h2>

          {/*
            grid grid-cols-1       → 1 column by default (mobile)
            md:grid-cols-3         → 3 columns on medium screens and up
            gap-4                  → spacing between cards
          */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <a
                key={f.title}
                href={f.href}
                className="
                  group flex flex-col gap-3 p-5
                  rounded-2xl border border-zinc-200 dark:border-zinc-800
                  bg-white dark:bg-zinc-900
                  hover:border-zinc-400 dark:hover:border-zinc-600
                  hover:-translate-y-1
                  transition-all duration-200
                "
              >
                {/* Card top row: emoji + tag */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                    {f.tag}
                  </span>
                </div>

                {/* Title: text-base = 16px, font-semibold = 600 weight */}
                <h3 className="text-base font-semibold">{f.title}</h3>

                {/* Description: text-sm = 14px, muted color */}
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {f.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* ── "Start learning" callout ── */}
        <section className="max-w-3xl mx-auto px-6 pb-24">
          {/*
            rounded-3xl           → very rounded corners
            bg-zinc-900           → dark background in light mode  
            dark:bg-zinc-100      → light background in dark mode (inverted!)
            text-zinc-100         → light text in light mode
            dark:text-zinc-900    → dark text in dark mode
            p-10                  → large padding (40px)
          */}
          <div className="rounded-3xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold tracking-tight">Ready to dig in?</h2>
              <p className="text-sm opacity-70 max-w-sm">
                Pick a section, poke around, and see what breaks. That's the
                whole point.
              </p>
            </div>
            <a
              href="/showcase"
              className="
                flex-shrink-0 px-6 py-3 rounded-xl
                bg-zinc-100 dark:bg-zinc-900
                text-zinc-900 dark:text-zinc-100
                text-sm font-semibold
                hover:opacity-80 transition-opacity
              "
            >
              Let's go →
            </a>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-6">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
            <span className="font-semibold tracking-tight">danngdev</span>
            <span>© 2026 — built with Next.js & Tailwind</span>
          </div>
        </footer>

      </div>
    </Suspense>
  );
}