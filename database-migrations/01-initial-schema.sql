-- KeyFlow Database Schema
-- This file documents the required database tables for the authentication system
-- Execute these commands in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  username text unique,
  avatar_url text,
  country text,
  preferred_language text default 'en',
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_preferences table
create table if not exists public.user_preferences (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  theme text default 'system' check (theme in ('light', 'dark', 'system')),
  keyboard_layout text default 'qwerty',
  daily_goal_minutes integer default 30 check (daily_goal_minutes >= 5 and daily_goal_minutes <= 240),
  ai_enabled boolean default false,
  typing_experience text default 'beginner' check (typing_experience in ('beginner', 'intermediate', 'advanced')),
  programming_experience text default 'none' check (programming_experience in ('none', 'beginner', 'intermediate', 'advanced')),
  sound_enabled boolean default true,
  haptic_enabled boolean default false,
  show_wpm_live boolean default true,
  show_accuracy_live boolean default true,
  notification_email boolean default true,
  notification_push boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_statistics table
create table if not exists public.user_statistics (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  total_practice_time integer default 0,
  total_sessions integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_practice_date date,
  average_wpm numeric(5,2),
  average_accuracy numeric(5,2),
  best_wpm numeric(5,2),
  best_accuracy numeric(5,2),
  total_words_typed integer default 0,
  total_errors integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create storage bucket for user uploads
insert into storage.buckets (id, name, public)
values ('user-uploads', 'user-uploads', true)
on conflict (id) do nothing;

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_statistics enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile."
  on public.profiles for update
  using (auth.uid() = id);

-- User preferences policies
create policy "Users can view their own preferences."
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences."
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences."
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- User statistics policies
create policy "Users can view their own statistics."
  on public.user_statistics for select
  using (auth.uid() = user_id);

create policy "Users can insert their own statistics."
  on public.user_statistics for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own statistics."
  on public.user_statistics for update
  using (auth.uid() = user_id);

-- Storage policies for avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using (bucket_id = 'user-uploads');

create policy "Users can upload their own avatar."
  on storage.objects for insert
  with check (
    bucket_id = 'user-uploads' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar."
  on storage.objects for update
  using (
    bucket_id = 'user-uploads' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar."
  on storage.objects for delete
  using (
    bucket_id = 'user-uploads' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Create trigger to automatically create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers for updated_at
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_preferences
  before update on public.user_preferences
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_statistics
  before update on public.user_statistics
  for each row execute procedure public.handle_updated_at();
