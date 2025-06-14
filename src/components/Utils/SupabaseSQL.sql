
-- This SQL is just for reference - we need to add these columns to the users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS preferred_cleaner_sex text,
ADD COLUMN IF NOT EXISTS preferred_cleaner_experience text,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cleaning_supplies jsonb DEFAULT '{}'::jsonb;
