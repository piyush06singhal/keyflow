# KeyFlow

KeyFlow is a production-grade typing and coding practice platform built with Next.js, Supabase, and a provider-based AI architecture. This repository currently contains the project foundation only: no authentication UI, landing page, dashboard, typing engine, coding practice, or business feature modules have been implemented yet.

## Foundation Stack

- Next.js 15 App Router with Turbopack
- React 19 and strict TypeScript
- Tailwind CSS v4 design tokens
- shadcn-style Radix UI primitives
- Framer Motion-ready animation constants
- TanStack Query, Zustand, React Hook Form, Zod
- Supabase client, server, middleware, storage, and realtime helpers
- Gemini and Groq behind a shared AI provider layer
- ESLint, Prettier, Husky, lint-staged, EditorConfig

## Project Shape

```txt
src/
  app/          Route groups, root layout, global boundaries
  components/   UI primitives, layout, navigation, shared surfaces
  config/       Site and environment configuration
  features/     Feature-first modules
  hooks/        Reusable client hooks
  lib/          Supabase, AI, errors, constants, utilities
  providers/    Global React providers
  services/     Cross-feature service boundaries
  stores/       Zustand stores
  styles/       Shared style assets
  types/        Shared TypeScript types
```

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run format
```

## Environment

Copy `.env.example` and provide values when enabling Supabase or AI-backed features. Core development can compile without these values, but runtime calls to Supabase or AI providers will fail until the relevant variables are configured.
