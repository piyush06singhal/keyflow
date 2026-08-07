<div align="center">

# KeyFlow

**A playful, local-first typing and coding practice arena — no sign-up, no database, no tracking.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: Personal](https://img.shields.io/badge/license-personal--project-lightgrey)](#license)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Why Local-First](#why-local-first)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [License](#license)

---

## About

**KeyFlow** helps you get faster and more accurate at two things: typing prose, and
typing real code. Open the page and start typing immediately — there's no login, no
onboarding flow, and no data collection. Every statistic you see is computed and stored
entirely in your own browser.

## Features

### ⌨️ Typing Practice

Drill words, paragraphs, quotes, or your own custom text, with live WPM, accuracy, and
consistency feedback as you type. The text area scrolls smoothly line by line instead of
showing one huge wall of text, and if you're fast enough to finish before your timer
runs out, fresh content keeps arriving automatically so the session never dead-ends.

### 💻 Coding Practice

Practice on a real code snippet — indentation, line breaks, brackets, and all — scored
character by character against exactly what's on screen. Choose from **17 languages**
and a library of **48 hand-picked snippets**, or let Groq generate a fresh one on demand
for your chosen language and difficulty. Pick from **11 editor color themes** to match
your taste.

### 🗓️ Daily Challenge

Everyone gets the same deterministic practice text on a given calendar day, so you can
track your own progress against it over time. No accounts means no public leaderboard —
just an honest, local history of your own runs.

### 📊 Practice History

A full local record of every session — WPM, accuracy, and trend charts over time —
updating live the moment you finish a run, no reload required.

### ⚙️ Settings That Actually Do Something

Light / dark / system theme, layout density, default practice mode and duration,
default coding language, keystroke sound, and more — every control here genuinely
drives the app's behavior rather than being decorative.

## Why Local-First

There's no backend, no account system, and nothing about your typing is ever sent
anywhere. The only network calls KeyFlow makes are to Groq's API, to generate fresh
practice text or code snippets on request — and if that's ever unavailable, a curated
local library keeps you practicing without interruption.

Clear your browser data and your history goes with it. That's the honest trade-off for
an app that genuinely doesn't track you.

## Tech Stack

| Layer        | Choice                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Framework    | Next.js 15 (App Router), React 19, TypeScript                                                                                             |
| UI & Styling | Tailwind CSS v4, Radix UI primitives, Framer Motion                                                                                       |
| State        | Zustand, persisted to `localStorage`                                                                                                      |
| AI           | Groq Cloud API — round-robin multi-key pool, automatic rate-limit fallback (Gemini available as an alternate provider, unused by default) |
| Testing      | Jest, covering the core typing engine                                                                                                     |
| Persistence  | Browser `localStorage` only — no database, no backend                                                                                     |

## Getting Started

### Prerequisites

- Node.js v20+
- npm
- A free Groq API key from [console.groq.com](https://console.groq.com)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your environment

Copy `.env.example` to `.env.local` and add your Groq key:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
GROQ_API_KEYS=gsk_your_key_here
```

`GROQ_API_KEYS` accepts multiple comma- or newline-separated keys — requests
round-robin across them, and any key that hits a rate limit is temporarily skipped in
favor of the others.

### 3. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start typing.

## Available Scripts

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start the development server   |
| `npm run build`     | Create a production build      |
| `npm run start`     | Run the production build       |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run lint`      | Lint with ESLint               |
| `npm run test`      | Run the Jest test suite        |

## Project Structure

```text
src/
├── app/                    Next.js App Router pages
├── components/             Shared UI — design system, landing page, app shell
├── features/coding/        Coding-practice-specific components
├── hooks/                  React hooks (typing engine binding, session lifecycle)
├── lib/
│   ├── typing-engine/      Framework-independent core typing engine
│   ├── coding-practice/    Snippet library, language configs, AI snippet generation
│   ├── ai/                 Groq/Gemini provider abstraction and key pool
│   ├── local-storage/      Practice history, personal bests, daily challenge records
│   └── session-lifecycle/  Session completion, analytics aggregation
└── stores/                 Zustand stores (typing config, coding config, settings)
```

## License

Personal project. No license file yet — all rights reserved by the author.

<div align="center">

Built with Next.js, typed with TypeScript, practiced one keystroke at a time.

</div>
