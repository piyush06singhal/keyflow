-- ============================================================================
-- KeyFlow Incremental Migration
-- ============================================================================
-- This migration adds ONLY new tables that don't exist yet.
-- Safe to run even if some tables already exist (uses IF NOT EXISTS).
-- ============================================================================

-- ============================================================================
-- NEW TYPING PRACTICE TABLES
-- ============================================================================

-- Typing sessions table - stores completed typing practice sessions
CREATE TABLE IF NOT EXISTS public.typing_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_mode TEXT NOT NULL,
  duration INTEGER NOT NULL,
  final_wpm REAL NOT NULL,
  final_accuracy REAL NOT NULL,
  consistency REAL NOT NULL,
  peak_wpm REAL NOT NULL,
  average_wpm REAL NOT NULL,
  raw_wpm REAL NOT NULL,
  correct_chars INTEGER NOT NULL,
  incorrect_chars INTEGER NOT NULL,
  total_chars INTEGER NOT NULL,
  mistakes JSONB DEFAULT '[]'::jsonb,
  character_stats JSONB DEFAULT '{}'::jsonb,
  word_stats JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Practice preferences table - stores typing practice UI preferences
CREATE TABLE IF NOT EXISTS public.practice_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_mode TEXT NOT NULL DEFAULT 'word',
  timer_mode TEXT NOT NULL DEFAULT 'countdown',
  duration INTEGER NOT NULL DEFAULT 60,
  include_punctuation BOOLEAN NOT NULL DEFAULT FALSE,
  include_numbers BOOLEAN NOT NULL DEFAULT FALSE,
  include_capitalization BOOLEAN NOT NULL DEFAULT FALSE,
  word_count INTEGER NOT NULL DEFAULT 50,
  allow_backspace BOOLEAN NOT NULL DEFAULT TRUE,
  blind_mode BOOLEAN NOT NULL DEFAULT FALSE,
  strict_mode BOOLEAN NOT NULL DEFAULT FALSE,
  font_size TEXT NOT NULL DEFAULT 'lg',
  font_family TEXT NOT NULL DEFAULT 'mono',
  cursor_style TEXT NOT NULL DEFAULT 'line',
  show_live_wpm BOOLEAN NOT NULL DEFAULT TRUE,
  show_keyboard BOOLEAN NOT NULL DEFAULT TRUE,
  keyboard_layout TEXT NOT NULL DEFAULT 'ansi',
  sound_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  reduced_motion BOOLEAN NOT NULL DEFAULT FALSE,
  high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- FUTURE FEATURE TABLES
-- ============================================================================

-- Achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value JSONB NOT NULL,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Leaderboards table
CREATE TABLE IF NOT EXISTS public.leaderboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  score REAL NOT NULL,
  rank INTEGER,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all-time')),
  period_start DATE NOT NULL,
  period_end DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  type TEXT NOT NULL,
  requirements JSONB NOT NULL,
  rewards JSONB NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User challenges table
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, challenge_id)
);

-- Custom texts table
CREATE TABLE IF NOT EXISTS public.custom_texts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  tags TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Coding practice sessions
CREATE TABLE IF NOT EXISTS public.coding_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  code_snippet TEXT NOT NULL,
  final_wpm REAL NOT NULL,
  final_accuracy REAL NOT NULL,
  time_taken INTEGER NOT NULL,
  mistakes JSONB DEFAULT '[]'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI coaching sessions
CREATE TABLE IF NOT EXISTS public.ai_coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  feedback JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  improvement_areas TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User follows table
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES (Only create if they don't exist)
-- ============================================================================

-- Typing sessions indexes
CREATE INDEX IF NOT EXISTS typing_sessions_user_id_idx ON public.typing_sessions(user_id);
CREATE INDEX IF NOT EXISTS typing_sessions_completed_at_idx ON public.typing_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS typing_sessions_user_completed_idx ON public.typing_sessions(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS typing_sessions_practice_mode_idx ON public.typing_sessions(practice_mode);

-- User achievements indexes
CREATE INDEX IF NOT EXISTS user_achievements_user_id_idx ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS user_achievements_unlocked_at_idx ON public.user_achievements(unlocked_at DESC);

-- Leaderboards indexes
CREATE INDEX IF NOT EXISTS leaderboards_user_id_idx ON public.leaderboards(user_id);
CREATE INDEX IF NOT EXISTS leaderboards_category_period_idx ON public.leaderboards(category, period, rank);
CREATE INDEX IF NOT EXISTS leaderboards_rank_idx ON public.leaderboards(rank);

-- User challenges indexes
CREATE INDEX IF NOT EXISTS user_challenges_user_id_idx ON public.user_challenges(user_id);
CREATE INDEX IF NOT EXISTS user_challenges_status_idx ON public.user_challenges(status);

-- Custom texts indexes
CREATE INDEX IF NOT EXISTS custom_texts_user_id_idx ON public.custom_texts(user_id);
CREATE INDEX IF NOT EXISTS custom_texts_is_public_idx ON public.custom_texts(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS custom_texts_tags_idx ON public.custom_texts USING GIN(tags);

-- Coding sessions indexes
CREATE INDEX IF NOT EXISTS coding_sessions_user_id_idx ON public.coding_sessions(user_id);
CREATE INDEX IF NOT EXISTS coding_sessions_language_idx ON public.coding_sessions(language);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);

-- User follows indexes
CREATE INDEX IF NOT EXISTS user_follows_follower_idx ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS user_follows_following_idx ON public.user_follows(following_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.typing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Typing sessions policies
DROP POLICY IF EXISTS "Users can view their own typing sessions" ON public.typing_sessions;
CREATE POLICY "Users can view their own typing sessions"
  ON public.typing_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own typing sessions" ON public.typing_sessions;
CREATE POLICY "Users can insert their own typing sessions"
  ON public.typing_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Practice preferences policies
DROP POLICY IF EXISTS "Users can view their own practice preferences" ON public.practice_preferences;
CREATE POLICY "Users can view their own practice preferences"
  ON public.practice_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own practice preferences" ON public.practice_preferences;
CREATE POLICY "Users can insert their own practice preferences"
  ON public.practice_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own practice preferences" ON public.practice_preferences;
CREATE POLICY "Users can update their own practice preferences"
  ON public.practice_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Achievements policies
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievements;
CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  USING (TRUE);

-- User achievements policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Leaderboards policies
DROP POLICY IF EXISTS "Anyone can view leaderboards" ON public.leaderboards;
CREATE POLICY "Anyone can view leaderboards"
  ON public.leaderboards FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own leaderboard entries" ON public.leaderboards;
CREATE POLICY "Users can insert their own leaderboard entries"
  ON public.leaderboards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own leaderboard entries" ON public.leaderboards;
CREATE POLICY "Users can update their own leaderboard entries"
  ON public.leaderboards FOR UPDATE
  USING (auth.uid() = user_id);

-- Challenges policies
DROP POLICY IF EXISTS "Anyone can view active challenges" ON public.challenges;
CREATE POLICY "Anyone can view active challenges"
  ON public.challenges FOR SELECT
  USING (is_active = TRUE);

-- User challenges policies
DROP POLICY IF EXISTS "Users can view their own challenges" ON public.user_challenges;
CREATE POLICY "Users can view their own challenges"
  ON public.user_challenges FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own challenges" ON public.user_challenges;
CREATE POLICY "Users can insert their own challenges"
  ON public.user_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own challenges" ON public.user_challenges;
CREATE POLICY "Users can update their own challenges"
  ON public.user_challenges FOR UPDATE
  USING (auth.uid() = user_id);

-- Custom texts policies
DROP POLICY IF EXISTS "Users can view public texts" ON public.custom_texts;
CREATE POLICY "Users can view public texts"
  ON public.custom_texts FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own texts" ON public.custom_texts;
CREATE POLICY "Users can insert their own texts"
  ON public.custom_texts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own texts" ON public.custom_texts;
CREATE POLICY "Users can update their own texts"
  ON public.custom_texts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own texts" ON public.custom_texts;
CREATE POLICY "Users can delete their own texts"
  ON public.custom_texts FOR DELETE
  USING (auth.uid() = user_id);

-- Coding sessions policies
DROP POLICY IF EXISTS "Users can view their own coding sessions" ON public.coding_sessions;
CREATE POLICY "Users can view their own coding sessions"
  ON public.coding_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own coding sessions" ON public.coding_sessions;
CREATE POLICY "Users can insert their own coding sessions"
  ON public.coding_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- AI coaching sessions policies
DROP POLICY IF EXISTS "Users can view their own AI sessions" ON public.ai_coaching_sessions;
CREATE POLICY "Users can view their own AI sessions"
  ON public.ai_coaching_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own AI sessions" ON public.ai_coaching_sessions;
CREATE POLICY "Users can insert their own AI sessions"
  ON public.ai_coaching_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User follows policies
DROP POLICY IF EXISTS "Users can view all follows" ON public.user_follows;
CREATE POLICY "Users can view all follows"
  ON public.user_follows FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Users can follow others" ON public.user_follows;
CREATE POLICY "Users can follow others"
  ON public.user_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow others" ON public.user_follows;
CREATE POLICY "Users can unfollow others"
  ON public.user_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- ============================================================================

-- Trigger for practice_preferences updated_at
DROP TRIGGER IF EXISTS set_updated_at_practice_preferences ON public.practice_preferences;
CREATE TRIGGER set_updated_at_practice_preferences
  BEFORE UPDATE ON public.practice_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for custom_texts updated_at
DROP TRIGGER IF EXISTS set_updated_at_custom_texts ON public.custom_texts;
CREATE TRIGGER set_updated_at_custom_texts
  BEFORE UPDATE ON public.custom_texts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for leaderboards updated_at
DROP TRIGGER IF EXISTS set_updated_at_leaderboards ON public.leaderboards;
CREATE TRIGGER set_updated_at_leaderboards
  BEFORE UPDATE ON public.leaderboards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- UPDATE handle_new_user FUNCTION TO INCLUDE NEW TABLES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert profile (if not exists)
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert default preferences (if not exists)
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert default statistics (if not exists)
  INSERT INTO public.user_statistics (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert default practice preferences (NEW)
  INSERT INTO public.practice_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- ============================================================================
-- REALTIME SUBSCRIPTIONS (Safe approach - only add if not already added)
-- ============================================================================

-- Check and add tables to realtime publication if not already added
DO $$
BEGIN
  -- Add practice_preferences if not already in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'practice_preferences'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.practice_preferences;
  END IF;

  -- Add notifications if not already in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;

  -- Add leaderboards if not already in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'leaderboards'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboards;
  END IF;

  -- Add user_challenges if not already in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'user_challenges'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_challenges;
  END IF;
END $$;

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT ALL ON public.typing_sessions TO authenticated;
GRANT ALL ON public.practice_preferences TO authenticated;
GRANT SELECT ON public.achievements TO authenticated;
GRANT ALL ON public.user_achievements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.leaderboards TO authenticated;
GRANT SELECT ON public.challenges TO authenticated;
GRANT ALL ON public.user_challenges TO authenticated;
GRANT ALL ON public.custom_texts TO authenticated;
GRANT ALL ON public.coding_sessions TO authenticated;
GRANT ALL ON public.ai_coaching_sessions TO authenticated;
GRANT ALL ON public.user_follows TO authenticated;
GRANT ALL ON public.notifications TO authenticated;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'KeyFlow Incremental Migration Complete!';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'New Tables Added:';
  RAISE NOTICE '  ✓ typing_sessions';
  RAISE NOTICE '  ✓ practice_preferences';
  RAISE NOTICE '  ✓ achievements';
  RAISE NOTICE '  ✓ user_achievements';
  RAISE NOTICE '  ✓ leaderboards';
  RAISE NOTICE '  ✓ challenges';
  RAISE NOTICE '  ✓ user_challenges';
  RAISE NOTICE '  ✓ custom_texts';
  RAISE NOTICE '  ✓ coding_sessions';
  RAISE NOTICE '  ✓ ai_coaching_sessions';
  RAISE NOTICE '  ✓ user_follows';
  RAISE NOTICE '  ✓ notifications';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Regenerate TypeScript types in Supabase Dashboard';
  RAISE NOTICE '  2. Replace src/types/database.ts with generated types';
  RAISE NOTICE '  3. Restart your development server';
  RAISE NOTICE '  4. Test typing practice - sessions should save!';
  RAISE NOTICE '============================================================================';
END $$;
