-- Migration: Update Enrollments & Add Exam/LP Enrollments

-- 1. Update Existing 'enrollments' table
-- Add generic ID column
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();

-- Drop old composite primary key (user_id, course_id)
ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_pkey;

-- Set new ID as Primary Key
ALTER TABLE public.enrollments ADD PRIMARY KEY (id);

-- Enforce uniqueness on user_id + course_id (previously the PK)
ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_user_course_unique UNIQUE (user_id, course_id);

-- Add new columns
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS price_paid numeric DEFAULT 0;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS payment_meta jsonb;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS last_accessed_at timestamp with time zone DEFAULT timezone('utc'::text, now());


-- 2. Create 'exam_enrollments' table
CREATE TABLE IF NOT EXISTS public.exam_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_id uuid REFERENCES public.exams(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at timestamp with time zone,
  score integer,
  status text DEFAULT 'in_progress', -- in_progress, passed, failed
  progress jsonb DEFAULT '{}'::jsonb, -- Store answers or section progress
  price_paid numeric DEFAULT 0,
  payment_meta jsonb,
  last_accessed_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, exam_id)
);

-- RLS for Exam Enrollments
ALTER TABLE public.exam_enrollments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view own exam enrollments" ON public.exam_enrollments FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can enroll in exams" ON public.exam_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own exam progress" ON public.exam_enrollments FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


-- 3. Create 'learning_path_enrollments' table
CREATE TABLE IF NOT EXISTS public.learning_path_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  learning_path_id uuid REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at timestamp with time zone,
  progress jsonb DEFAULT '{}'::jsonb,
  price_paid numeric DEFAULT 0,
  payment_meta jsonb,
  last_accessed_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, learning_path_id)
);

-- RLS for LP Enrollments
ALTER TABLE public.learning_path_enrollments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view own lp enrollments" ON public.learning_path_enrollments FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can enroll in lps" ON public.learning_path_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own lp progress" ON public.learning_path_enrollments FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
