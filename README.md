# KeyFlow

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)

**KeyFlow** is a modern, high-performance web platform engineered to help developers master their typing speed, accuracy, and coding muscle memory. Unlike standard typing tests, KeyFlow integrates programming-specific syntax training with real-time AI coaching and a competitive gamification system.

---

## 🚀 Key Features

### Typing & Code Mastery

- **Standard Typing Engine**: Measure WPM, accuracy, and keystroke consistency in real-time.
- **Code Practice Mode**: Train muscle memory on actual programming snippets (JavaScript, TypeScript, Python, etc.) complete with intelligent syntax highlighting.
- **AI Coaching**: Integrated with the Groq API (Llama 3) to provide sub-second, personalized insights and dynamic lesson generation based on your weaknesses.

### Social & Competitive Ecosystem

- **Gamification**: Earn experience points (XP), unlock achievements, and level up as you complete typing challenges.
- **Global Leaderboards**: Compete against other developers in real-time ranked ladders (Bronze, Silver, Gold).
- **Public Profiles**: Showcase your typing statistics, league rank, and focus languages via customizable user passports.

### Advanced Analytics

- **Performance Hub**: Visualize your typing progression with historical charts and interactive keystroke heatmaps.
- **Session Breakdowns**: Analyze detailed metrics per session to identify specific character bottlenecks.

---

## 🏗️ Architecture & Tech Stack

KeyFlow is built with modern, scalable, and edge-ready technologies:

- **Frontend Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Radix UI Primitives, Framer Motion
- **State Management**: Zustand
- **Database & Auth**: Supabase (PostgreSQL, GoTrue, Realtime)
- **AI Provider**: Groq Cloud API

---

## 🛠️ Local Development Setup

To get KeyFlow running locally on your machine, follow these steps:

### Prerequisites

- Node.js (v20 or higher)
- npm or pnpm
- A Supabase Project
- A Groq API Key

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/keyflow.git
cd keyflow
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration

Create a `.env.local` file in the root directory and configure your environment variables:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
\`\`\`

### 4. Database Migrations

Execute the SQL scripts located in the `/database-migrations` directory within your Supabase SQL Editor to provision the necessary tables and Row Level Security (RLS) policies.

### 5. Start the Application

\`\`\`bash
npm run dev
\`\`\`
The application will be available at `http://localhost:3000`.

---

## 🧪 Testing

KeyFlow includes a robust testing environment configured for the core typing engine logic.
\`\`\`bash
npm run test
\`\`\`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
