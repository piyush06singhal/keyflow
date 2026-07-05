-- Typing Practice Tables Migration
-- Run this in your Supabase SQL Editor to create the required tables

-- 1. Create typing_sessions table
CREATE TABLE IF NOT EXISTS typing_sessions (
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

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS typing_sessions_user_id_idx ON typing_sessions(user_id);
CREATE INDEX IF NOT EXISTS typing_sessions_completed_at_idx ON typing_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS typing_sessions_user_completed_idx ON typing_sessions(user_id, completed_at DESC);

-- Enable Row Level Security
ALTER TABLE typing_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for typing_sessions
CREATE POLICY "Users can view their own typing sessions"
  ON typing_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own typing sessions"
  ON typing_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 2. Create practice_preferences table
CREATE TABLE IF NOT EXISTS practice_preferences (
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

-- Enable Row Level Security
ALTER TABLE practice_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for practice_preferences
CREATE POLICY "Users can view their own practice preferences"
  ON practice_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own practice preferences"
  ON practice_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own practice preferences"
  ON practice_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger for practice_preferences
CREATE TRIGGER update_practice_preferences_updated_at
  BEFORE UPDATE ON practice_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Create trigger for user_statistics (if not exists)
DROP TRIGGER IF EXISTS update_user_statistics_updated_at ON user_statistics;
CREATE TRIGGER update_user_statistics_updated_at
  BEFORE UPDATE ON user_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Grant permissions
GRANT ALL ON typing_sessions TO authenticated;
GRANT ALL ON practice_preferences TO authenticated;

-- 7. Enable realtime for practice_preferences (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE practice_preferences;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Typing Practice tables created successfully!';
  RAISE NOTICE 'Tables: typing_sessions, practice_preferences';
  RAISE NOTICE 'Remember to regenerate your TypeScript types in Supabase dashboard.';
END $$;
