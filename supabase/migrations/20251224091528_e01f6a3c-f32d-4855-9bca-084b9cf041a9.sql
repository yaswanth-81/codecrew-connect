-- Change the default for is_approved to null (pending) instead of false (rejected)
ALTER TABLE public.faculty_profiles 
ALTER COLUMN is_approved SET DEFAULT null;