-- ============================================================================
-- Coding Practice Module - Database Schema
-- Drop and recreate all tables
-- ============================================================================

-- Drop existing tables if they exist (cascades to dependent objects)
DROP TABLE IF EXISTS public.snippet_ratings CASCADE;
DROP TABLE IF EXISTS public.snippet_favorites CASCADE;
DROP TABLE IF EXISTS public.code_snippets CASCADE;
DROP TABLE IF EXISTS public.coding_sessions CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_snippet_statistics() CASCADE;
DROP FUNCTION IF EXISTS update_snippet_rating() CASCADE;

-- ============================================================================
-- Create Tables
-- ============================================================================

-- Create coding_sessions table
CREATE TABLE public.coding_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    session_id TEXT NOT NULL,
    session_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration INTEGER NOT NULL,
    mode TEXT NOT NULL DEFAULT 'coding',
    completed BOOLEAN NOT NULL DEFAULT false,
    
    language TEXT NOT NULL,
    framework TEXT,
    category TEXT,
    snippet_id TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    
    wpm DECIMAL(10, 2) NOT NULL,
    raw_wpm DECIMAL(10, 2) NOT NULL,
    accuracy DECIMAL(5, 2) NOT NULL,
    consistency DECIMAL(5, 2) NOT NULL DEFAULT 0,
    
    correct_lines INTEGER NOT NULL DEFAULT 0,
    incorrect_lines INTEGER NOT NULL DEFAULT 0,
    total_lines INTEGER NOT NULL DEFAULT 0,
    line_accuracy DECIMAL(5, 2) NOT NULL DEFAULT 0,
    bracket_accuracy DECIMAL(5, 2) DEFAULT 0,
    indentation_accuracy DECIMAL(5, 2) DEFAULT 0,
    symbol_accuracy DECIMAL(5, 2) DEFAULT 0,
    
    mistakes_count INTEGER NOT NULL DEFAULT 0,
    text_content TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create code_snippets table
CREATE TABLE public.code_snippets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL,
    framework TEXT,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    type TEXT NOT NULL,
    
    code TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    is_public BOOLEAN NOT NULL DEFAULT false,
    is_ai_generated BOOLEAN NOT NULL DEFAULT false,
    source TEXT NOT NULL DEFAULT 'custom',
    
    usage_count INTEGER NOT NULL DEFAULT 0,
    average_wpm DECIMAL(10, 2) DEFAULT 0,
    average_accuracy DECIMAL(5, 2) DEFAULT 0,
    
    rating_sum INTEGER NOT NULL DEFAULT 0,
    rating_count INTEGER NOT NULL DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create snippet_favorites table
CREATE TABLE public.snippet_favorites (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snippet_id UUID NOT NULL REFERENCES public.code_snippets(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, snippet_id)
);

-- Create snippet_ratings table
CREATE TABLE public.snippet_ratings (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snippet_id UUID NOT NULL REFERENCES public.code_snippets(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, snippet_id)
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX idx_coding_sessions_user_id ON public.coding_sessions(user_id);
CREATE INDEX idx_coding_sessions_language ON public.coding_sessions(language);
CREATE INDEX idx_coding_sessions_difficulty ON public.coding_sessions(difficulty);
CREATE INDEX idx_coding_sessions_timestamp ON public.coding_sessions(session_timestamp DESC);
CREATE INDEX idx_coding_sessions_user_language ON public.coding_sessions(user_id, language);
CREATE INDEX idx_coding_sessions_user_timestamp ON public.coding_sessions(user_id, session_timestamp DESC);

CREATE INDEX idx_code_snippets_user_id ON public.code_snippets(user_id);
CREATE INDEX idx_code_snippets_language ON public.code_snippets(language);
CREATE INDEX idx_code_snippets_difficulty ON public.code_snippets(difficulty);
CREATE INDEX idx_code_snippets_category ON public.code_snippets(category);
CREATE INDEX idx_code_snippets_is_public ON public.code_snippets(is_public);
CREATE INDEX idx_code_snippets_is_ai_generated ON public.code_snippets(is_ai_generated);
CREATE INDEX idx_code_snippets_created_at ON public.code_snippets(created_at DESC);
CREATE INDEX idx_code_snippets_average_rating ON public.code_snippets(average_rating DESC);

CREATE INDEX idx_snippet_favorites_user_id ON public.snippet_favorites(user_id);
CREATE INDEX idx_snippet_favorites_snippet_id ON public.snippet_favorites(snippet_id);

CREATE INDEX idx_snippet_ratings_snippet_id ON public.snippet_ratings(snippet_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE public.coding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_ratings ENABLE ROW LEVEL SECURITY;

-- Coding Sessions Policies
CREATE POLICY "Users can view own coding sessions"
    ON public.coding_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coding sessions"
    ON public.coding_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coding sessions"
    ON public.coding_sessions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own coding sessions"
    ON public.coding_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- Code Snippets Policies
CREATE POLICY "Users can view own snippets"
    ON public.code_snippets FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own snippets"
    ON public.code_snippets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own snippets"
    ON public.code_snippets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own snippets"
    ON public.code_snippets FOR DELETE
    USING (auth.uid() = user_id);

-- Snippet Favorites Policies
CREATE POLICY "Users can view own favorites"
    ON public.snippet_favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
    ON public.snippet_favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON public.snippet_favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Snippet Ratings Policies
CREATE POLICY "Anyone can view ratings"
    ON public.snippet_ratings FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own ratings"
    ON public.snippet_ratings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
    ON public.snippet_ratings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
    ON public.snippet_ratings FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- Functions and Triggers
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coding_sessions_updated_at
    BEFORE UPDATE ON public.coding_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_snippets_updated_at
    BEFORE UPDATE ON public.code_snippets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snippet_ratings_updated_at
    BEFORE UPDATE ON public.snippet_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_snippet_statistics()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.code_snippets
    SET usage_count = usage_count + 1
    WHERE id = NEW.snippet_id::UUID;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_snippet_stats_on_session
    AFTER INSERT ON public.coding_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_statistics();

CREATE OR REPLACE FUNCTION update_snippet_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.code_snippets
    SET 
        rating_sum = (
            SELECT COALESCE(SUM(rating), 0)
            FROM public.snippet_ratings
            WHERE snippet_id = NEW.snippet_id
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM public.snippet_ratings
            WHERE snippet_id = NEW.snippet_id
        ),
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.snippet_ratings
            WHERE snippet_id = NEW.snippet_id
        )
    WHERE id = NEW.snippet_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_snippet_rating_on_insert
    AFTER INSERT ON public.snippet_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_rating();

CREATE TRIGGER update_snippet_rating_on_update
    AFTER UPDATE ON public.snippet_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_rating();

CREATE TRIGGER update_snippet_rating_on_delete
    AFTER DELETE ON public.snippet_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_rating();

-- ============================================================================
-- Permissions
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.coding_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.code_snippets TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.snippet_favorites TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.snippet_ratings TO authenticated;
