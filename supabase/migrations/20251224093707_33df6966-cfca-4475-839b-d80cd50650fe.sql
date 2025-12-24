-- Allow placement and admin to update student profiles for verification
CREATE POLICY "Placement can update student verification" 
ON public.student_profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'placement'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'placement'::app_role) OR has_role(auth.uid(), 'admin'::app_role));