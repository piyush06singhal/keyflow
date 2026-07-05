-- ============================================================================
-- Heatmap Table Migration
-- ============================================================================
-- Creates the practice_heatmap table for tracking daily practice activity
-- 
-- Run this migration after 03-incremental-migration.sql

-- Create practice_heatmap table
CREATE TABLE IF NOT EXISTS public.practice_heatmap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    sessions INTEGER DEFAULT 0,
    minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one row per user per date
    CONSTRAINT practice_heatmap_user_date_unique UNIQUE (user_id, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_practice_heatmap_user_id 
    ON public.practice_heatmap(user_id);

CREATE INDEX IF NOT EXISTS idx_practice_heatmap_date 
    ON public.practice_heatmap(date);

CREATE INDEX IF NOT EXISTS idx_practice_heatmap_user_date 
    ON public.practice_heatmap(user_id, date DESC);

-- Enable RLS
ALTER TABLE public.practice_heatmap ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own heatmap data"
    ON public.practice_heatmap
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own heatmap data"
    ON public.practice_heatmap
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own heatmap data"
    ON public.practice_heatmap
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own heatmap data"
    ON public.practice_heatmap
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_practice_heatmap_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_practice_heatmap_updated_at
    BEFORE UPDATE ON public.practice_heatmap
    FOR EACH ROW
    EXECUTE FUNCTION update_practice_heatmap_updated_at();

-- Comments
COMMENT ON TABLE public.practice_heatmap IS 'Tracks daily typing practice activity for heatmap visualization';
COMMENT ON COLUMN public.practice_heatmap.user_id IS 'Reference to the user';
COMMENT ON COLUMN public.practice_heatmap.date IS 'Date of practice activity';
COMMENT ON COLUMN public.practice_heatmap.sessions IS 'Number of sessions completed on this date';
COMMENT ON COLUMN public.practice_heatmap.minutes IS 'Total minutes practiced on this date';
