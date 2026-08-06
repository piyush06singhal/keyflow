# KeyFlow

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)

**KeyFlow** is a playful, local-first typing and coding practice arena. Open the page
and start typing — there's no sign-up, no database, and no tracking. Every stat you see
is calculated and stored right in your browser.

## What it does

KeyFlow helps you get faster and more accurate at two things: typing prose, and typing
real code.

- **Typing Practice** lets you drill words, paragraphs, quotes, or your own custom text,
  with live WPM, accuracy, and consistency feedback as you go. The text area scrolls
  smoothly as you type instead of showing one huge wall of text, and if you're fast
  enough to finish before your timer runs out, more content keeps arriving automatically.
- **Coding Practice** puts a real code snippet in front of you — indentation, line
  breaks, brackets, and all — and scores every keystroke against it. Choose from 17
  languages and a library of 48 hand-picked snippets, or let Groq generate a fresh one
  on demand for your chosen language and difficulty. Pick from 11 editor color themes to
  match your taste.
- **Daily Challenge** gives everyone the same practice text each calendar day, so you
  can track your own progress against it over time — no accounts, so no public
  leaderboard, just an honest local history of your own runs.
- **Practice History** keeps a full local record of your sessions — WPM, accuracy, and
  trend charts over time — updating live as you finish each run.
- **Settings that actually do something**: light/dark/system theme, layout density,
  default practice mode and duration, default coding language, keystroke sound, and
  more, all genuinely wired into how the app behaves rather than being decorative.

## Why local-first

There's no backend, no account system, and nothing about your typing is ever sent
anywhere. The only network calls KeyFlow makes are to Groq's API, to generate fresh
practice text or code snippets on request — and if that's ever unavailable, a curated
local library keeps you practicing without interruption. Clear your browser data and
your history goes with it; that's the trade-off for genuinely not tracking you.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **UI & Styling**: Tailwind CSS v4, Radix UI primitives, Framer Motion
- **State**: Zustand, persisted to `localStorage`
- **AI**: Groq Cloud API, with a round-robin multi-key pool and automatic rate-limit
  fallback (Gemini is also wired in as an alternate provider, available but unused by
  default)
- **Testing**: Jest, covering the core typing engine
- **Persistence**: browser `localStorage` only — no database, no backend

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

Open `http://localhost:3000` and start typing.

## Scripts

```bash
npm run dev         # start the dev server
npm run build        # production build
npm run start        # run the production build
npm run typecheck    # tsc --noEmit
npm run lint          # eslint
npm run test          # jest
```

## Project Structure

```text
src/
  app/                 # Next.js App Router pages
  components/          # Shared UI (design system, landing page, app shell)
  features/coding/     # Coding-practice-specific components
  hooks/                # React hooks (typing engine binding, session lifecycle, ...)
  lib/
    typing-engine/      # Framework-independent core typing engine
    coding-practice/    # Snippet library, language configs, AI snippet generation
    ai/                 # Groq/Gemini provider abstraction and key pool
    local-storage/       # Practice history, personal bests, daily challenge records
    session-lifecycle/   # Session completion, analytics aggregation
  stores/               # Zustand stores (typing config, coding config, settings)
```

## License

Personal project — no license file yet.
