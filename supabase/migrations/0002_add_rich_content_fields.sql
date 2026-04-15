-- Migration to add rich content fields to tables

-- 1. COURSES
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level text DEFAULT 'All Levels';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS language text DEFAULT 'English';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS prerequisites jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS objectives jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS includes jsonb DEFAULT '[]'::jsonb;

-- 2. EXAMS
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS instructions text; -- Simple text or JSON? Adapter logic: instructions ? JSON.stringify : null. So likely JSON or Text. Let's make it JSONB or Text. Adapter treats it as stringified JSON presumably if it's a list?
-- Adapter: instructions: typeof dbExam.instructions === 'string' ? JSON.parse : dbExam.instructions.
-- Let's use jsonb for structured lists (like rules).
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS instructions jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS prerequisites jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS objectives jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- 3. PROFILES (Instructors)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb; -- e.g. { twitter: "...", linkedin: "..." }

-- 4. LEARNING PATHS (If needed)
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS level text;
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS language text;
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS objectives jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS prerequisites jsonb DEFAULT '[]'::jsonb;
