-- Create mentor_requests table for mentor-student relationships
CREATE TABLE public.mentor_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  mentor_id uuid NOT NULL,
  department text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (student_id) -- A student can only have one mentor request/relationship
);

-- Enable RLS
ALTER TABLE public.mentor_requests ENABLE ROW LEVEL SECURITY;

-- Students can view their own mentor requests
CREATE POLICY "Students can view their own mentor requests"
ON public.mentor_requests
FOR SELECT
USING (auth.uid() = student_id);

-- Students can insert their own mentor requests (only if they don't have an approved one)
CREATE POLICY "Students can create mentor requests"
ON public.mentor_requests
FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- Students can delete their pending requests
CREATE POLICY "Students can delete pending requests"
ON public.mentor_requests
FOR DELETE
USING (auth.uid() = student_id AND status = 'pending');

-- Faculty (mentors) can view requests sent to them
CREATE POLICY "Faculty can view their mentor requests"
ON public.mentor_requests
FOR SELECT
USING (has_role(auth.uid(), 'faculty'::app_role) AND auth.uid() = mentor_id);

-- Faculty can update requests sent to them (accept/reject)
CREATE POLICY "Faculty can update their mentor requests"
ON public.mentor_requests
FOR UPDATE
USING (has_role(auth.uid(), 'faculty'::app_role) AND auth.uid() = mentor_id);

-- Placement and admin can view all mentor requests
CREATE POLICY "Placement can view all mentor requests"
ON public.mentor_requests
FOR SELECT
USING (has_role(auth.uid(), 'placement'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_mentor_requests_updated_at
BEFORE UPDATE ON public.mentor_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_mentor_requests_mentor_id ON public.mentor_requests(mentor_id);
CREATE INDEX idx_mentor_requests_student_id ON public.mentor_requests(student_id);
CREATE INDEX idx_mentor_requests_status ON public.mentor_requests(status);