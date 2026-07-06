-- ======================================================
-- Migration: 09-user-settings.sql
-- Description: Create tables for user settings, preferences, and privacy controls
-- ======================================================

-- 1. Create User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Categorized settings stored as JSONB for flexibility
    appearance_settings JSONB DEFAULT '{"theme": "system", "density": "comfortable", "animation_intensity": "normal", "accent_color": "default", "font_family": "inter", "code_font": "fira_code"}'::jsonb,
    
    typing_settings JSONB DEFAULT '{"default_duration": 60, "preferred_mode": "time", "sounds_enabled": true, "caret_style": "block", "show_virtual_keyboard": false}'::jsonb,
    
    coding_settings JSONB DEFAULT '{"default_language": "typescript", "tab_width": 2, "line_numbers": true, "minimap": false, "code_theme": "vs-dark"}'::jsonb,
    
    ai_settings JSONB DEFAULT '{"recommendation_frequency": "medium", "auto_generate_lessons": true, "weekly_reports": true}'::jsonb,
    
    privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "activity_visibility": "friends", "analytics_sharing": false, "show_friend_list": true}'::jsonb,
    
    notification_settings JSONB DEFAULT '{"email_updates": false, "friend_requests": true, "challenge_invites": true, "streak_reminders": true}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on User Preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences FOR ALL 
USING (auth.uid() = user_id);

-- Trigger to create default preferences on new user creation
-- (Assumes auth.users trigger setup is handled in initial migrations, but we provide it for completeness)
CREATE OR REPLACE FUNCTION public.handle_new_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: We would attach this trigger to auth.users if we have superuser rights. 
-- Since we might not, the application will handle Upserting preferences on first load.
