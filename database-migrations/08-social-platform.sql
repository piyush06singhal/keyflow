-- ======================================================
-- Migration: 08-social-platform.sql
-- Description: Create tables for social profiles, friendships, followers, and community feed
-- ======================================================

-- 1. Create User Profiles (Extended Information)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    biography TEXT,
    country TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    social_github TEXT,
    social_linkedin TEXT,
    social_website TEXT,
    pinned_badges TEXT[], -- Array of achievement IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on User Profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.user_profiles FOR SELECT 
USING (true); -- Note: Privacy checks will filter out private profiles in app logic or advanced RLS later

DROP POLICY IF EXISTS "Users can upsert their own profile" ON public.user_profiles;
CREATE POLICY "Users can upsert their own profile" 
ON public.user_profiles FOR ALL 
USING (auth.uid() = user_id);

-- 2. Create Friendships Table
CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, friend_id)
);

-- Enable RLS on Friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their friendships" ON public.friendships;
CREATE POLICY "Users can view their friendships" 
ON public.friendships FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can manage their friendships" ON public.friendships;
CREATE POLICY "Users can manage their friendships" 
ON public.friendships FOR ALL 
USING (auth.uid() = user_id OR auth.uid() = friend_id);


-- 3. Create Followers Table
CREATE TABLE IF NOT EXISTS public.followers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(follower_id, following_id)
);

-- Enable RLS on Followers
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their followers and followings" ON public.followers;
CREATE POLICY "Users can view their followers and followings" 
ON public.followers FOR SELECT 
USING (true); -- Publicly visible

DROP POLICY IF EXISTS "Users can manage their follows" ON public.followers;
CREATE POLICY "Users can manage their follows" 
ON public.followers FOR ALL 
USING (auth.uid() = follower_id);


-- 4. Create Community Feed Table
CREATE TABLE IF NOT EXISTS public.community_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('achievement', 'level_up', 'new_personal_best', 'streak_milestone', 'challenge_completed')),
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB, -- For extra data (e.g. wpm value, achievement id)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on Community Feed
ALTER TABLE public.community_feed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Feed is viewable by everyone" ON public.community_feed;
CREATE POLICY "Feed is viewable by everyone" 
ON public.community_feed FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create their own feed events" ON public.community_feed;
CREATE POLICY "Users can create their own feed events" 
ON public.community_feed FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS user_profiles_username_idx ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS friendships_user_id_idx ON public.friendships(user_id);
CREATE INDEX IF NOT EXISTS friendships_friend_id_idx ON public.friendships(friend_id);
CREATE INDEX IF NOT EXISTS followers_follower_id_idx ON public.followers(follower_id);
CREATE INDEX IF NOT EXISTS followers_following_id_idx ON public.followers(following_id);
CREATE INDEX IF NOT EXISTS community_feed_user_id_idx ON public.community_feed(user_id);
CREATE INDEX IF NOT EXISTS community_feed_created_at_idx ON public.community_feed(created_at DESC);
