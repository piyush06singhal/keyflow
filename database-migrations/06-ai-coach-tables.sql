-- ============================================================================
-- AI Coach and Personalized Learning Platform - Database Schema
-- ============================================================================

-- ============================================================================
-- Create Tables
-- ============================================================================

-- AI Practice Recommendations
CREATE TABLE IF NOT EXISTS public.ai_practice_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    recommendation_type TEXT NOT NULL CHECK (recommendation_type IN (
        'daily_practice',
        'typing_exercise',
        'coding_exercise',
        'weak_area_focus',
        'skill_progression',
        'custom'
    )),
    
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'dismissed', 'expired')),
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reasoning TEXT,
    
    -- Recommended practice settings
    recommended_mode TEXT,
    recommended_language TEXT,
    recommended_difficulty TEXT,
    recommended_duration INTEGER,
    recommended_focus_areas TEXT[],
    
    -- AI metadata
    ai_provider TEXT NOT NULL DEFAULT 'groq',
    ai_model TEXT,
    confidence_score DECIMAL(3, 2),
    
    -- Generated content (for lessons/exercises)
    generated_content JSONB,
    
    -- Tracking
    viewed_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Performance Reports
CREATE TABLE IF NOT EXISTS public.ai_performance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    report_type TEXT NOT NULL CHECK (report_type IN (
        'session_analysis',
        'weekly_summary',
        'monthly_summary',
        'skill_assessment',
        'progress_report'
    )),
    
    -- Report period
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    
    -- Analysis data
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    
    -- Detailed insights
    strengths TEXT[],
    weaknesses TEXT[],
    improvements TEXT[],
    recommendations TEXT[],
    
    -- Metrics analyzed
    metrics_analyzed JSONB NOT NULL,
    
    -- Typing analysis
    typing_insights JSONB,
    weak_keys JSONB,
    accuracy_trends JSONB,
    wpm_trends JSONB,
    consistency_analysis JSONB,
    
    -- Coding analysis
    coding_insights JSONB,
    language_performance JSONB,
    syntax_mistakes JSONB,
    framework_proficiency JSONB,
    
    -- Practice habits
    practice_frequency_analysis JSONB,
    best_practice_times JSONB,
    streak_analysis JSONB,
    
    -- Goals and achievements
    goals_progress JSONB,
    milestones_reached TEXT[],
    next_milestones TEXT[],
    
    -- AI metadata
    ai_provider TEXT NOT NULL DEFAULT 'groq',
    ai_model TEXT,
    generation_time_ms INTEGER,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Generated Lessons
CREATE TABLE IF NOT EXISTS public.ai_generated_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    lesson_type TEXT NOT NULL CHECK (lesson_type IN (
        'typing_drill',
        'coding_practice',
        'weak_key_focus',
        'syntax_practice',
        'custom'
    )),
    
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    
    -- Target areas
    target_skills TEXT[] NOT NULL,
    target_weaknesses TEXT[],
    
    -- Lesson content
    content TEXT NOT NULL,
    language TEXT,
    framework TEXT,
    estimated_duration INTEGER,
    
    -- Practice settings
    practice_config JSONB,
    
    -- Usage tracking
    usage_count INTEGER NOT NULL DEFAULT 0,
    completion_count INTEGER NOT NULL DEFAULT 0,
    average_score DECIMAL(5, 2),
    
    -- User feedback
    is_favorited BOOLEAN NOT NULL DEFAULT false,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    
    -- AI metadata
    ai_provider TEXT NOT NULL DEFAULT 'groq',
    ai_model TEXT,
    generation_prompt TEXT,
    
    -- Status
    is_archived BOOLEAN NOT NULL DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Insights Cache
CREATE TABLE IF NOT EXISTS public.ai_insights_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    insight_type TEXT NOT NULL,
    cache_key TEXT NOT NULL,
    
    -- Cached data
    insight_data JSONB NOT NULL,
    
    -- Metadata
    ai_provider TEXT NOT NULL DEFAULT 'groq',
    computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Tracking
    access_count INTEGER NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI User Goals
CREATE TABLE IF NOT EXISTS public.ai_user_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    goal_type TEXT NOT NULL CHECK (goal_type IN (
        'daily',
        'weekly',
        'monthly',
        'custom'
    )),
    
    category TEXT NOT NULL CHECK (category IN (
        'typing_speed',
        'typing_accuracy',
        'coding_proficiency',
        'practice_consistency',
        'skill_mastery',
        'custom'
    )),
    
    title TEXT NOT NULL,
    description TEXT,
    
    -- Goal metrics
    target_metric TEXT NOT NULL,
    target_value DECIMAL(10, 2) NOT NULL,
    current_value DECIMAL(10, 2) DEFAULT 0,
    
    -- Timeline
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'abandoned')),
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    
    -- AI metadata
    is_ai_recommended BOOLEAN NOT NULL DEFAULT false,
    ai_confidence DECIMAL(3, 2),
    recommendation_reasoning TEXT,
    
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI User Preferences
CREATE TABLE IF NOT EXISTS public.ai_user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Feature toggles
    ai_enabled BOOLEAN NOT NULL DEFAULT true,
    auto_recommendations BOOLEAN NOT NULL DEFAULT true,
    weekly_reports BOOLEAN NOT NULL DEFAULT true,
    daily_practice_planner BOOLEAN NOT NULL DEFAULT true,
    
    -- Notification preferences
    notification_recommendations BOOLEAN NOT NULL DEFAULT true,
    notification_reports BOOLEAN NOT NULL DEFAULT true,
    notification_goals BOOLEAN NOT NULL DEFAULT true,
    notification_insights BOOLEAN NOT NULL DEFAULT true,
    
    -- Learning preferences
    preferred_learning_style TEXT DEFAULT 'balanced' CHECK (preferred_learning_style IN (
        'visual',
        'practical',
        'theoretical',
        'balanced'
    )),
    focus_areas TEXT[] DEFAULT '{}',
    avoid_topics TEXT[] DEFAULT '{}',
    
    -- Practice preferences
    preferred_practice_times TEXT[] DEFAULT '{}',
    preferred_languages TEXT[] DEFAULT '{}',
    preferred_difficulty TEXT DEFAULT 'intermediate',
    
    -- Privacy
    allow_performance_analysis BOOLEAN NOT NULL DEFAULT true,
    allow_habit_tracking BOOLEAN NOT NULL DEFAULT true,
    share_insights_anonymous BOOLEAN NOT NULL DEFAULT false,
    
    -- Provider preferences
    preferred_ai_provider TEXT DEFAULT 'groq',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Indexes
-- ============================================================================

-- ai_practice_recommendations indexes
CREATE INDEX idx_ai_recommendations_user_id ON public.ai_practice_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_status ON public.ai_practice_recommendations(status);
CREATE INDEX idx_ai_recommendations_type ON public.ai_practice_recommendations(recommendation_type);
CREATE INDEX idx_ai_recommendations_priority ON public.ai_practice_recommendations(priority);
CREATE INDEX idx_ai_recommendations_expires ON public.ai_practice_recommendations(expires_at);
CREATE INDEX idx_ai_recommendations_user_status ON public.ai_practice_recommendations(user_id, status, created_at DESC);

-- ai_performance_reports indexes
CREATE INDEX idx_ai_reports_user_id ON public.ai_performance_reports(user_id);
CREATE INDEX idx_ai_reports_type ON public.ai_performance_reports(report_type);
CREATE INDEX idx_ai_reports_period ON public.ai_performance_reports(period_start, period_end);
CREATE INDEX idx_ai_reports_user_created ON public.ai_performance_reports(user_id, created_at DESC);

-- ai_generated_lessons indexes
CREATE INDEX idx_ai_lessons_user_id ON public.ai_generated_lessons(user_id);
CREATE INDEX idx_ai_lessons_type ON public.ai_generated_lessons(lesson_type);
CREATE INDEX idx_ai_lessons_language ON public.ai_generated_lessons(language);
CREATE INDEX idx_ai_lessons_difficulty ON public.ai_generated_lessons(difficulty);
CREATE INDEX idx_ai_lessons_favorited ON public.ai_generated_lessons(user_id, is_favorited);
CREATE INDEX idx_ai_lessons_archived ON public.ai_generated_lessons(is_archived);

-- ai_insights_cache indexes
CREATE INDEX idx_ai_cache_user_id ON public.ai_insights_cache(user_id);
CREATE INDEX idx_ai_cache_key ON public.ai_insights_cache(user_id, cache_key);
CREATE INDEX idx_ai_cache_expires ON public.ai_insights_cache(expires_at);
CREATE INDEX idx_ai_cache_type ON public.ai_insights_cache(insight_type);

-- ai_user_goals indexes
CREATE INDEX idx_ai_goals_user_id ON public.ai_user_goals(user_id);
CREATE INDEX idx_ai_goals_status ON public.ai_user_goals(status);
CREATE INDEX idx_ai_goals_type ON public.ai_user_goals(goal_type);
CREATE INDEX idx_ai_goals_target_date ON public.ai_user_goals(target_date);
CREATE INDEX idx_ai_goals_user_active ON public.ai_user_goals(user_id, status, target_date);

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE public.ai_practice_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_performance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generated_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_user_preferences ENABLE ROW LEVEL SECURITY;

-- ai_practice_recommendations policies
CREATE POLICY "Users can view own recommendations"
    ON public.ai_practice_recommendations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
    ON public.ai_practice_recommendations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
    ON public.ai_practice_recommendations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
    ON public.ai_practice_recommendations FOR DELETE
    USING (auth.uid() = user_id);

-- ai_performance_reports policies
CREATE POLICY "Users can view own reports"
    ON public.ai_performance_reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
    ON public.ai_performance_reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
    ON public.ai_performance_reports FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
    ON public.ai_performance_reports FOR DELETE
    USING (auth.uid() = user_id);

-- ai_generated_lessons policies
CREATE POLICY "Users can view own lessons"
    ON public.ai_generated_lessons FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lessons"
    ON public.ai_generated_lessons FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lessons"
    ON public.ai_generated_lessons FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lessons"
    ON public.ai_generated_lessons FOR DELETE
    USING (auth.uid() = user_id);

-- ai_insights_cache policies
CREATE POLICY "Users can view own cache"
    ON public.ai_insights_cache FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cache"
    ON public.ai_insights_cache FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cache"
    ON public.ai_insights_cache FOR DELETE
    USING (auth.uid() = user_id);

-- ai_user_goals policies
CREATE POLICY "Users can view own goals"
    ON public.ai_user_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
    ON public.ai_user_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
    ON public.ai_user_goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
    ON public.ai_user_goals FOR DELETE
    USING (auth.uid() = user_id);

-- ai_user_preferences policies
CREATE POLICY "Users can view own preferences"
    ON public.ai_user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
    ON public.ai_user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.ai_user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================================
-- Functions and Triggers
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_recommendations_updated_at
    BEFORE UPDATE ON public.ai_practice_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_tables_updated_at();

CREATE TRIGGER update_ai_reports_updated_at
    BEFORE UPDATE ON public.ai_performance_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_tables_updated_at();

CREATE TRIGGER update_ai_lessons_updated_at
    BEFORE UPDATE ON public.ai_generated_lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_tables_updated_at();

CREATE TRIGGER update_ai_goals_updated_at
    BEFORE UPDATE ON public.ai_user_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_tables_updated_at();

CREATE TRIGGER update_ai_preferences_updated_at
    BEFORE UPDATE ON public.ai_user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_tables_updated_at();

-- Automatically expire old cache entries
CREATE OR REPLACE FUNCTION clean_expired_ai_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM public.ai_insights_cache
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Automatically update goal progress
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.current_value >= NEW.target_value THEN
        NEW.status = 'completed';
        NEW.progress_percentage = 100.00;
        NEW.completed_at = NOW();
    ELSE
        NEW.progress_percentage = (NEW.current_value / NEW.target_value) * 100;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_goal_progress
    BEFORE UPDATE ON public.ai_user_goals
    FOR EACH ROW
    WHEN (OLD.current_value IS DISTINCT FROM NEW.current_value)
    EXECUTE FUNCTION update_goal_progress();

-- ============================================================================
-- Permissions
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_practice_recommendations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_performance_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_generated_lessons TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.ai_insights_cache TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_user_goals TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ai_user_preferences TO authenticated;

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'AI Coach and Personalized Learning Platform tables created successfully!';
  RAISE NOTICE 'Tables: ai_practice_recommendations, ai_performance_reports, ai_generated_lessons, ai_insights_cache, ai_user_goals, ai_user_preferences';
  RAISE NOTICE 'Remember to regenerate your TypeScript types in Supabase dashboard.';
END $$;
