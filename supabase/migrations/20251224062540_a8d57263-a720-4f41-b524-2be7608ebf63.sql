-- Add is_approved column to faculty_profiles for placement cell approval
ALTER TABLE public.faculty_profiles 
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

-- Add is_approved column to recruiter_profiles (for placement approval)
ALTER TABLE public.recruiter_profiles 
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Create interview_schedules enhancement for placement cell management
ALTER TABLE public.interview_schedules 
ADD COLUMN IF NOT EXISTS interview_status text DEFAULT 'scheduled' CHECK (interview_status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
ADD COLUMN IF NOT EXISTS scheduled_by uuid REFERENCES auth.users(id);

-- Enable realtime for interview_schedules
ALTER PUBLICATION supabase_realtime ADD TABLE public.interview_schedules;

-- Update RLS policies for faculty_profiles to allow placement to update approval
CREATE POLICY "Placement can update faculty approval"
ON public.faculty_profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'placement') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'placement') OR public.has_role(auth.uid(), 'admin'));

-- Allow placement to view all faculty profiles
CREATE POLICY "Placement can view faculty profiles"
ON public.faculty_profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'placement') OR public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

-- Allow placement to schedule interviews
CREATE POLICY "Placement can manage interviews"
ON public.interview_schedules
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'placement') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'placement') OR public.has_role(auth.uid(), 'admin'));

-- Allow all authenticated users to view interviews
CREATE POLICY "Users can view relevant interviews"
ON public.interview_schedules
FOR SELECT
TO authenticated
USING (true);