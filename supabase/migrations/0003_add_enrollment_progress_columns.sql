-- Add progress_percent and completed columns to enrollments table
-- This supports the frontend logic which expects these fields directly on the enrollment object

ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS progress_percent integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false;
