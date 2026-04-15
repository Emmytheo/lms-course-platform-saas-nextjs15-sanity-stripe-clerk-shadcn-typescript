-- Add progress and completion columns to learning_path_enrollments
-- This fixes the error: "Could not find the 'progress_percent' column"

ALTER TABLE public.learning_path_enrollments 
ADD COLUMN IF NOT EXISTS progress_percent integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_accessed_at timestamp with time zone DEFAULT now();

-- Optional: Create an index for performance if many users
CREATE INDEX IF NOT EXISTS idx_lp_enrollments_user_id ON public.learning_path_enrollments(user_id);
