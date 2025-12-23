-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);

-- RLS Policies for avatars bucket (public read, authenticated write own)
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS Policies for resumes bucket (owner and recruiters/faculty can view)
CREATE POLICY "Users can view their own resume" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Recruiters and faculty can view resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' 
    AND (
      public.has_role(auth.uid(), 'recruiter') OR
      public.has_role(auth.uid(), 'faculty') OR
      public.has_role(auth.uid(), 'placement') OR
      public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Users can upload their own resume" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own resume" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own resume" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS Policies for company-logos bucket
CREATE POLICY "Company logos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Recruiters can upload company logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'company-logos' 
    AND public.has_role(auth.uid(), 'recruiter')
  );

CREATE POLICY "Recruiters can update their company logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'company-logos' 
    AND public.has_role(auth.uid(), 'recruiter')
  );

CREATE POLICY "Recruiters can delete their company logos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'company-logos' 
    AND public.has_role(auth.uid(), 'recruiter')
  );