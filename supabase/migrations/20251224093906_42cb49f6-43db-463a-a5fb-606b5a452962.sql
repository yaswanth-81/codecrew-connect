-- Change default value for is_verified to NULL so we can distinguish pending from rejected
ALTER TABLE public.student_profiles ALTER COLUMN is_verified SET DEFAULT NULL;

-- Reset existing unverified students to NULL (pending state)
UPDATE public.student_profiles SET is_verified = NULL WHERE is_verified = false;