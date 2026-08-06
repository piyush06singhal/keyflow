# KeyFlow

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)

**KeyFlow** is a playful, local-first typing and coding practice arena. No accounts, no
database, no tracking — your stats live in your browser's local storage.

---

## 🚀 Features

- **Typing Practice**: word/paragraph/quote/custom modes, live WPM, accuracy, and
  consistency feedback, a fixed-viewport text renderer that scrolls as you type.
- **Coding Practice**: 16 languages with syntax-highlighted, difficulty-tiered snippets.
- **Daily Challenge**: one deterministic challenge shared by everyone that calendar day,
  with a local run history — no fake public leaderboard, since there's no backend.
- **AI-generated content**: typing paragraphs, word lists, and code snippets can be
  generated on demand via the Groq API, honoring your chosen difficulty and category. A
  curated local library keeps practice going if generation is ever unavailable.
- **Local practice history & personal bests**: session history, streaks, and trend
  charts, all computed and stored entirely in `localStorage`.
- **Guides & About**: static content pages — typing/ergonomics tips and an honest
  explanation of how the app works.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **UI & Styling**: Tailwind CSS v4, Radix UI primitives, Framer Motion
- **State**: Zustand (practice config, coding config, settings — all persisted locally)
- **AI**: Groq Cloud API, with a round-robin key pool for multi-key fallback (Gemini is
  also wired in as an alternate provider, unused by default)
- **Persistence**: browser `localStorage` only — no database, no backend, no accounts

---

## 🛠️ Local Development Setup

### Prerequisites

- Node.js v20+
- npm
- A Groq API key ([console.groq.com](https://console.groq.com))

### 1. Install dependencies

```bash
npm install
```

### 2. Environment configuration

Copy `.env.example` to `.env.local` and set your Groq key(s):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
GROQ_API_KEYS=gsk_your_key_here
```

`GROQ_API_KEYS` accepts multiple keys (comma- or newline-separated) — requests
round-robin across them, and a key that hits a rate limit is temporarily skipped in
favor of the others.

### 3. Start the app

```bash
npm run dev
```

The app runs at `http://localhost:3000` (or the next free port).

---

## 🧪 Quality checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # production build
```

There is no automated test suite yet (Jest is configured but no tests exist) — see the
project's known gaps for details.
