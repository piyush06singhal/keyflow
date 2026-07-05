# Authentication System Setup Guide

## Overview

Complete authentication and user management system built with Supabase, Next.js 15, and React 19.

## Features Implemented

### Authentication Methods

- ✅ Email and Password login
- ✅ Email and Password registration
- ✅ Google OAuth login
- ✅ GitHub OAuth login
- ✅ Password reset flow
- ✅ Email verification
- ✅ Session management with automatic refresh
- ✅ Secure logout

### Pages

- ✅ Login page (`/login`)
- ✅ Register page (`/register`)
- ✅ Forgot password page (`/forgot-password`)
- ✅ Reset password page (`/auth/reset-password`)
- ✅ Verify email page (`/verify-email`)
- ✅ Onboarding page (`/onboarding`)
- ✅ Unauthorized page (`/unauthorized`)
- ✅ Session expired page (`/session-expired`)
- ✅ Dashboard (protected route example)

### Security & Protection

- ✅ Route-level protection via middleware
- ✅ Server-side authentication checks
- ✅ Client-side authentication hooks
- ✅ Row Level Security (RLS) policies
- ✅ Secure password requirements
- ✅ CSRF protection via Supabase

### User Experience

- ✅ Beautiful glassmorphic design
- ✅ Smooth Framer Motion animations
- ✅ Form validation with React Hook Form + Zod
- ✅ Toast notifications (sonner)
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive layouts
- ✅ Keyboard accessible
- ✅ ARIA labels

### Profile Management

- ✅ Automatic profile creation
- ✅ Avatar upload to Supabase Storage
- ✅ User preferences
- ✅ User statistics
- ✅ Onboarding flow

## Setup Instructions

### 1. Supabase Configuration

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Execute Database Schema

1. Open Supabase SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Execute the SQL to create tables, policies, and triggers

#### Configure OAuth Providers

**Google OAuth:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth credentials
3. Add authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. In Supabase Dashboard → Authentication → Providers → Google
5. Enable Google and add Client ID and Client Secret

**GitHub OAuth:**

1. Go to GitHub → Settings → Developer Settings → OAuth Apps
2. Create new OAuth app
3. Set callback URL: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. In Supabase Dashboard → Authentication → Providers → GitHub
5. Enable GitHub and add Client ID and Client Secret

### 2. Environment Variables

Create `.env.local` file:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: AI Services
GOOGLE_GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
```

### 3. Install Dependencies

All required dependencies are already installed:

- `@supabase/ssr` - Supabase SSR client
- `@supabase/supabase-js` - Supabase client
- `react-hook-form` - Form management
- `@hookform/resolvers` - Form resolvers
- `zod` - Schema validation
- `framer-motion` - Animations
- `sonner` - Toast notifications
- `@radix-ui/react-*` - UI components

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## File Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (login, register, etc.)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   ├── (onboarding)/        # Onboarding flow
│   │   └── onboarding/
│   ├── (app)/               # Protected app pages
│   │   └── dashboard/
│   ├── (public)/            # Public pages
│   │   ├── unauthorized/
│   │   └── session-expired/
│   └── auth/
│       ├── callback/        # OAuth callback handler
│       └── reset-password/  # Password reset page
├── features/
│   └── auth/
│       └── components/      # Reusable auth components
│           ├── auth-form-wrapper.tsx
│           ├── oauth-buttons.tsx
│           ├── auth-divider.tsx
│           ├── logout-button.tsx
│           └── protected-route.tsx
├── hooks/
│   └── use-auth.ts         # Authentication hooks
├── lib/
│   ├── supabase/
│   │   ├── auth.ts         # Auth service layer
│   │   ├── profile.ts      # Profile management
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client
│   │   └── middleware.ts   # Session refresh + route protection
│   ├── validations/
│   │   └── auth.ts         # Zod schemas
│   └── constants/
│       └── routes.ts       # Route constants
└── types/
    └── database.ts         # Database type definitions
```

## Usage Examples

### Server-Side Authentication

```typescript
import { requireAuth, getCurrentUser } from "@/lib/supabase/auth";

// Protect a page (redirects to login if not authenticated)
export default async function ProtectedPage() {
  const user = await requireAuth();

  return <div>Hello {user.email}</div>;
}

// Check auth without redirect
export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Not logged in</div>;
  }

  return <div>Logged in as {user.email}</div>;
}
```

### Client-Side Authentication

```typescript
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Hello {user.email}</div>;
}
```

### Protected Client Component

```typescript
import { ProtectedRoute } from "@/features/auth/components/protected-route";

function MyPage() {
  return (
    <ProtectedRoute>
      <div>This content requires authentication</div>
    </ProtectedRoute>
  );
}
```

### Logout Button

```typescript
import { LogoutButton } from "@/features/auth/components/logout-button";

function Header() {
  return (
    <header>
      <LogoutButton variant="ghost" />
    </header>
  );
}
```

## Authentication Flow

### Registration

1. User fills registration form
2. `signUpWithEmail()` creates account in Supabase
3. Verification email sent automatically
4. Profile auto-created via database trigger
5. User redirected to login

### Login

1. User enters credentials
2. `signInWithEmail()` authenticates
3. Session created and stored in cookies
4. Middleware checks onboarding status
5. Redirects to onboarding or dashboard

### OAuth (Google/GitHub)

1. User clicks OAuth button
2. `signInWithOAuth()` redirects to provider
3. User authorizes
4. Provider redirects to `/auth/callback`
5. Profile initialized
6. User redirected to dashboard

### Password Reset

1. User requests reset via `/forgot-password`
2. Reset email sent via `sendPasswordResetEmail()`
3. User clicks link → redirected to `/auth/reset-password`
4. User sets new password via `updatePassword()`
5. Redirected to login

### Onboarding

1. First-time users redirected to `/onboarding`
2. User completes profile setup
3. `completeOnboarding()` updates profile + preferences + statistics
4. User redirected to dashboard

## Route Protection

### Middleware Protection

Routes automatically protected via middleware:

- `/dashboard`, `/practice/*`, `/analytics`, etc. → require auth
- `/login`, `/register` → redirect to dashboard if authenticated
- `/onboarding` → redirect to dashboard if already completed

### Manual Protection

Use `requireAuth()` in server components or `useRequireAuth()` hook in client components.

## Database Schema

### Tables

- `profiles` - User profile data
- `user_preferences` - User settings
- `user_statistics` - Practice statistics

### Storage

- `user-uploads` bucket - Avatar images

### RLS Policies

- Users can only access their own data
- Profiles publicly viewable
- Avatars publicly accessible

## Next Steps

1. **Setup Supabase project** and execute schema
2. **Configure OAuth providers** (Google, GitHub)
3. **Add environment variables**
4. **Test authentication flows**
5. **Customize onboarding questions**
6. **Add profile edit page**
7. **Implement settings page**
8. **Add email templates** in Supabase

## Troubleshooting

### OAuth not working

- Check redirect URIs match exactly
- Verify OAuth credentials in Supabase dashboard
- Check browser console for errors

### Session not persisting

- Ensure middleware is configured correctly
- Check cookie settings in Supabase client
- Verify NEXT_PUBLIC_APP_URL is correct

### RLS errors

- Ensure RLS policies are applied
- Check user is authenticated
- Verify table permissions

### Type errors

- Run `npm run typecheck` to check for issues
- Regenerate types from Supabase if schema changed

## Production Checklist

- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Configure custom email templates in Supabase
- [ ] Set up custom domain for Supabase project
- [ ] Enable captcha for registration (Supabase settings)
- [ ] Configure rate limiting
- [ ] Set up monitoring and error tracking
- [ ] Review and test all RLS policies
- [ ] Enable email confirmations for all new signups
- [ ] Configure password strength requirements
- [ ] Set up backup and recovery procedures
