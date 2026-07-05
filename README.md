# KeyFlow 🚀

**A premium typing and coding practice platform with world-class design and AI-powered learning.**

KeyFlow is a production-grade platform built with Next.js 15, Supabase, and a comprehensive typing engine. The platform combines beautiful UI/UX with powerful typing practice capabilities, real-time analytics, and AI coaching.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Status](#-project-status)
- [Architecture](#-architecture)
- [Typing Engine](#-typing-engine)
- [Features Implemented](#-features-implemented)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - App Router with Turbopack for blazing-fast development
- **React 19** - Latest React with Server Components
- **TypeScript** - Strict mode enabled for type safety
- **Tailwind CSS v4** - Modern design tokens and utility-first CSS
- **Framer Motion** - Premium animations throughout
- **Radix UI** - Accessible component primitives (shadcn/ui)

### State & Data

- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling with Zod validation
- **date-fns** - Date manipulation

### Backend & Database

- **Supabase** - Authentication, PostgreSQL database, real-time subscriptions, storage
- **Row Level Security (RLS)** - Database security policies
- **Server Actions** - Type-safe server mutations

### AI Integration

- **Google Gemini** - AI-powered practice content
- **Groq** - Fast AI inference
- **Provider-based architecture** - Unified AI interface

### Developer Experience

- **ESLint** - Code linting with Next.js config
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **EditorConfig** - Consistent editor settings

---

## ✅ Project Status

### **Completed Modules**

#### 🏠 **Landing Page**

- Premium hero section with live typing demo
- Features showcase with 3D animations
- Interactive coding practice preview
- Analytics showcase
- AI-powered learning section
- Animated statistics with counters
- Testimonials and social proof
- FAQ section with search
- Responsive design (mobile, tablet, desktop)
- **13 components, fully responsive, production-ready**

#### 🎨 **Application Shell**

- Collapsible sidebar with smooth animations
- Top navigation bar with user menu
- Mobile drawer for smaller screens
- Command palette (⌘+K / Ctrl+K)
- Reusable layout components
- Persistent sidebar state
- Keyboard shortcuts
- **7 components, fully accessible**

#### 📊 **Dashboard Module**

- Personalized welcome card with time-based greeting
- Animated statistics grid (8 stat cards)
- Recent activity timeline
- GitHub-style practice heatmap
- Goals section (daily, weekly, monthly, XP)
- **Real Supabase data integration** (no mock data)
- Empty states for new users
- **5 core widgets, production-ready**

#### ⚙️ **Typing Engine** ⭐

- **Framework-independent core** (~3,000 lines)
- Event-driven architecture
- Multiple practice modes (word, paragraph, quote, custom, coding)
- Professional statistics (WPM, Raw WPM, CPM, Accuracy, Consistency)
- Comprehensive mistake tracking
- Session persistence (localStorage + Supabase ready)
- Timer system (countdown, elapsed, untimed)
- Input management (keyboard, IME, special keys)
- Complete test coverage ready
- **9 core modules, fully typed, zero errors**

---

## 🏗️ Architecture

### Design Philosophy

- **Component-driven** - Reusable, composable components
- **Type-safe** - Strict TypeScript throughout
- **Server-first** - Server Components by default
- **Progressive enhancement** - Works without JavaScript
- **Accessibility-first** - WCAG compliant components
- **Performance-optimized** - Code splitting, lazy loading

### Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Authenticated app routes
│   │   └── dashboard/     # Dashboard page
│   ├── (auth)/            # Authentication routes
│   ├── (onboarding)/      # Onboarding flow
│   ├── (public)/          # Public routes
│   └── page.tsx           # Landing page
│
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn)
│   ├── app-shell/        # App layout components
│   ├── dashboard/        # Dashboard widgets
│   ├── landing/          # Landing page sections
│   └── ...
│
├── lib/                  # Core libraries
│   ├── typing-engine/    # ⭐ Typing Engine (framework-independent)
│   ├── supabase/         # Supabase utilities
│   ├── ai/               # AI provider abstraction
│   ├── validations/      # Zod schemas
│   ├── constants/        # App constants
│   ├── errors/           # Error handling
│   └── utils.ts          # Utility functions
│
├── hooks/                # Custom React hooks
├── providers/            # React context providers
├── features/             # Feature modules
├── stores/               # Zustand stores
└── types/                # TypeScript types
```

---

## ⌨️ Typing Engine

The **KeyFlow Typing Engine** is a comprehensive, framework-independent typing system that powers all typing-related features.

### 🎯 Core Features

- **Session Management** - Complete lifecycle with pause/resume
- **Input Processing** - Keyboard, IME, special keys, clipboard control
- **Timer System** - Countdown, elapsed, untimed modes
- **Statistics Engine** - WPM, Raw WPM, CPM, Accuracy, Consistency
- **Mistake Tracking** - Real-time detection and correction analysis
- **Text Generation** - Dynamic content based on configuration
- **Event System** - 16 event types for reactive UIs
- **Session Persistence** - Auto-save and recovery

### 📦 Architecture

```
lib/typing-engine/
├── types.ts                      # Complete type system (25+ interfaces)
├── typing-engine.ts              # Main orchestrator
├── index.ts                      # Public API
│
├── core/                         # Core managers
│   ├── event-dispatcher.ts       # Event-driven architecture
│   ├── config-manager.ts         # Configuration with validation
│   ├── timer-manager.ts          # Precise timing system
│   └── cursor-manager.ts         # Cursor tracking
│
├── input/                        # Input handling
│   └── input-manager.ts          # Keyboard processing
│
├── text/                         # Text generation
│   ├── text-generator.ts         # Dynamic text generation
│   └── word-lists.ts             # Word databases
│
├── statistics/                   # Statistics & analysis
│   ├── statistics-calculator.ts  # Professional calculations
│   └── mistake-tracker.ts        # Mistake detection
│
├── persistence/                  # Session storage
│   └── session-storage.ts        # localStorage & Supabase
│
└── examples/                     # Usage examples
    └── basic-usage.ts            # Code samples
```

### 🚀 Quick Start

```typescript
import { TypingEngine } from "@/lib/typing-engine";

// Create engine
const engine = new TypingEngine({
  mode: "word",
  timerMode: "countdown",
  duration: 60,
  wordCount: 50,
  allowBackspace: true,
});

// Initialize and start
engine.initialize();
engine.start();

// Subscribe to events
engine.on("statistics:updated", (event) => {
  const stats = event.data;
  console.log(`WPM: ${stats.wpm}, Accuracy: ${stats.accuracy}%`);
});

// Process input
document.addEventListener("keydown", (e) => {
  engine.processInput(e);
});
```

### 📊 Statistics Calculated

- **WPM** - Words Per Minute (industry standard)
- **Raw WPM** - Without error adjustment
- **CPM** - Characters Per Minute
- **Accuracy** - Percentage of correct characters
- **Error Rate** - Mistake percentage
- **Consistency** - WPM variance over time
- **Character Stats** - Per-character accuracy
- **Word Stats** - Fastest/slowest words
- **Progress** - Completion percentage

### 🎮 Supported Modes

- ✅ **Word Mode** - Random word practice
- ✅ **Paragraph Mode** - Sentence-based practice
- ✅ **Quote Mode** - Famous quotes
- ✅ **Custom Mode** - User-provided text
- ✅ **Coding Mode** - Code snippet practice
- 🔜 **Multiplayer** - Real-time races
- 🔜 **AI-Generated** - Personalized lessons
- 🔜 **Game Mode** - Typing games

---

## 🎯 Features Implemented

### Authentication & User Management

- ✅ Email/password authentication
- ✅ OAuth providers (Google, GitHub ready)
- ✅ Email verification flow
- ✅ Password reset flow
- ✅ User profiles with avatars
- ✅ Onboarding wizard
- ✅ Session management with middleware
- ✅ Protected routes

### Database & Backend

- ✅ PostgreSQL with Supabase
- ✅ Row Level Security (RLS)
- ✅ User profiles table
- ✅ User preferences table
- ✅ User statistics table
- ✅ Server Actions for mutations
- ✅ Real-time subscriptions ready
- ✅ File storage (avatars)

### Dashboard & Analytics

- ✅ Real-time statistics from Supabase
- ✅ Dynamic level/XP calculation
- ✅ Streak tracking
- ✅ Goal progress (daily, weekly, monthly)
- ✅ Practice heatmap
- ✅ Recent activity timeline
- ✅ Empty states

### UI/UX

- ✅ Premium landing page
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/light theme support
- ✅ Smooth Framer Motion animations
- ✅ Accessible components (ARIA labels, keyboard nav)
- ✅ Loading states and skeletons
- ✅ Error boundaries

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for authentication & database)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Typing_application

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure Supabase credentials in .env.local
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Run database migrations (execute supabase-schema.sql in Supabase SQL Editor)

# Start development server
npm run dev
```

Visit http://localhost:3000

### Environment Variables

Required for full functionality:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI (Optional - for AI features)
GOOGLE_AI_API_KEY=
GROQ_API_KEY=
```

---

## 💻 Development

### Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format with Prettier
npm run format:check     # Check formatting

# Git Hooks (automatic)
# pre-commit: lint-staged runs on changed files
```

### Code Style

- **TypeScript** - Strict mode enabled
- **Prettier** - 2 spaces, single quotes, no semicolons (except when required)
- **ESLint** - Next.js recommended + custom rules
- **Naming** - camelCase for variables, PascalCase for components
- **Files** - kebab-case for files, PascalCase for components

### Component Structure

```typescript
// Component file structure
"use client"; // Only if client component needed

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ComponentProps {
  title: string;
  children?: React.ReactNode;
}

export function Component({ title, children }: ComponentProps) {
  const [state, setState] = useState(false);

  return (
    <div className="container">
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

---

## 🗄️ Database Schema

### Core Tables

**profiles**

```sql
- id (uuid, primary key, references auth.users)
- email (text)
- display_name (text)
- username (text, unique)
- avatar_url (text)
- country (text)
- preferred_language (text)
- onboarding_completed (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

**user_preferences**

```sql
- user_id (uuid, primary key, references profiles)
- theme (text: light/dark/system)
- keyboard_layout (text)
- daily_goal_minutes (integer)
- ai_enabled (boolean)
- typing_experience (text)
- programming_experience (text)
- sound_enabled (boolean)
- haptic_enabled (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

**user_statistics**

```sql
- user_id (uuid, primary key, references profiles)
- total_practice_time (integer, minutes)
- total_sessions (integer)
- current_streak (integer)
- longest_streak (integer)
- last_practice_date (date)
- average_wpm (numeric)
- average_accuracy (numeric)
- best_wpm (numeric)
- best_accuracy (numeric)
- total_words_typed (integer)
- total_errors (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### Future Tables (Ready to Implement)

- typing_sessions - Individual practice sessions
- achievements - Achievement definitions
- user_achievements - User achievement progress
- leaderboards - Global/country/friends rankings
- multiplayer_sessions - Real-time typing races
- coding_challenges - Coding practice content

---

## 📁 Project Structure

```
Typing_application/
├── .husky/                    # Git hooks
├── .next/                     # Next.js build output
├── node_modules/              # Dependencies
├── public/                    # Static assets
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (app)/            # Authenticated routes
│   │   │   ├── dashboard/
│   │   │   └── layout.tsx
│   │   ├── (auth)/           # Auth routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── verify-email/
│   │   ├── (onboarding)/     # Onboarding
│   │   ├── (public)/         # Public routes
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   │
│   ├── components/
│   │   ├── ui/               # Base components
│   │   ├── app-shell/        # Layout components
│   │   ├── dashboard/        # Dashboard widgets
│   │   └── landing/          # Landing sections
│   │
│   ├── lib/
│   │   ├── typing-engine/    # ⭐ Typing Engine
│   │   ├── supabase/         # Supabase utilities
│   │   ├── ai/               # AI providers
│   │   └── ...
│   │
│   ├── hooks/                # Custom hooks
│   ├── providers/            # Context providers
│   ├── features/             # Feature modules
│   └── types/                # TypeScript types
│
├── .env.local                # Environment variables (create from .env.example)
├── .eslintrc.json            # ESLint config
├── .prettierrc               # Prettier config
├── tsconfig.json             # TypeScript config
├── next.config.ts            # Next.js config
├── tailwind.config.ts        # Tailwind config
├── package.json              # Dependencies
├── supabase-schema.sql       # Database schema
└── README.md                 # This file
```

---

## 📚 Documentation

### Key Documents

- **TYPING_ENGINE.md** - Complete typing engine documentation
- **QUICK_START.md** - Typing engine quick start guide (`src/lib/typing-engine/`)
- **APPLICATION_SHELL.md** - App shell architecture
- **DASHBOARD.md** - Dashboard implementation details
- **AUTH_SETUP.md** - Authentication setup guide
- **supabase-schema.sql** - Database schema with RLS policies

### Additional Resources

- **examples/basic-usage.ts** - Typing engine usage examples
- **types.ts** - Complete type system for typing engine
- Inline JSDoc comments throughout codebase

---

## 🎯 Roadmap

### Phase 1: Core Typing (In Progress)

- ✅ Typing Engine implementation
- 🔄 Typing Practice UI
- 🔄 Results screen with detailed analytics
- 🔄 Save sessions to Supabase

### Phase 2: Advanced Features

- ⏳ Multiplayer typing races
- ⏳ Daily challenges
- ⏳ Achievement system
- ⏳ Leaderboards (global, country, friends)

### Phase 3: Coding Practice

- ⏳ Coding practice mode
- ⏳ Multiple programming languages
- ⏳ Syntax highlighting
- ⏳ Code challenges

### Phase 4: AI Integration

- ⏳ AI-generated practice content
- ⏳ Personalized lessons
- ⏳ Weak key recommendations
- ⏳ Performance coaching

### Phase 5: Gamification

- ⏳ Typing games
- ⏳ Tournaments
- ⏳ Team challenges
- ⏳ Seasonal events

---

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the development team.

---

## 📄 License

All rights reserved. Internal use only - KeyFlow Platform.

---

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**KeyFlow** - Master typing and coding, one keystroke at a time. ⚡
