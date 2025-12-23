-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'recruiter', 'placement', 'faculty', 'admin');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('pending', 'faculty_approved', 'faculty_rejected', 'applied', 'shortlisted', 'interview', 'selected', 'rejected');

-- Create enum for job status
CREATE TYPE public.job_status AS ENUM ('draft', 'pending_verification', 'active', 'closed');

-- Create user_roles table (security-focused role management)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table (base profile for all users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_profiles table
CREATE TABLE public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    roll_number TEXT,
    department TEXT,
    year_of_study INTEGER,
    cgpa DECIMAL(3,2),
    skills TEXT[],
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recruiter_profiles table
CREATE TABLE public.recruiter_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    company_logo_url TEXT,
    company_website TEXT,
    designation TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create faculty_profiles table
CREATE TABLE public.faculty_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    employee_id TEXT,
    department TEXT,
    designation TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    company_name TEXT NOT NULL,
    location TEXT,
    job_type TEXT DEFAULT 'Full-time',
    salary_min INTEGER,
    salary_max INTEGER,
    required_skills TEXT[],
    min_cgpa DECIMAL(3,2),
    deadline TIMESTAMP WITH TIME ZONE,
    status job_status DEFAULT 'pending_verification',
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status application_status DEFAULT 'pending',
    faculty_id UUID REFERENCES auth.users(id),
    faculty_approved_at TIMESTAMP WITH TIME ZONE,
    faculty_notes TEXT,
    recruiter_notes TEXT,
    match_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(job_id, student_id)
);

-- Create interview_schedules table
CREATE TABLE public.interview_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own role on signup" ON public.user_roles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "All authenticated users can view profiles" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for student_profiles
CREATE POLICY "Students can view their own profile" ON public.student_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Faculty and placement can view student profiles" ON public.student_profiles
    FOR SELECT USING (
        public.has_role(auth.uid(), 'faculty') OR 
        public.has_role(auth.uid(), 'placement') OR
        public.has_role(auth.uid(), 'admin') OR
        public.has_role(auth.uid(), 'recruiter')
    );

CREATE POLICY "Students can update their own profile" ON public.student_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own profile" ON public.student_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for recruiter_profiles
CREATE POLICY "Recruiters can view their own profile" ON public.recruiter_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "All authenticated users can view recruiter profiles" ON public.recruiter_profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Recruiters can update their own profile" ON public.recruiter_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can insert their own profile" ON public.recruiter_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for faculty_profiles
CREATE POLICY "Faculty can view their own profile" ON public.faculty_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "All authenticated users can view faculty profiles" ON public.faculty_profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Faculty can update their own profile" ON public.faculty_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Faculty can insert their own profile" ON public.faculty_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for jobs
CREATE POLICY "Everyone can view active jobs" ON public.jobs
    FOR SELECT USING (status = 'active');

CREATE POLICY "Recruiters can view their own jobs" ON public.jobs
    FOR SELECT USING (auth.uid() = recruiter_id);

CREATE POLICY "Placement can view all jobs" ON public.jobs
    FOR SELECT USING (public.has_role(auth.uid(), 'placement') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Recruiters can insert jobs" ON public.jobs
    FOR INSERT WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can update their own jobs" ON public.jobs
    FOR UPDATE USING (auth.uid() = recruiter_id);

CREATE POLICY "Placement can update jobs for verification" ON public.jobs
    FOR UPDATE USING (public.has_role(auth.uid(), 'placement') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for applications
CREATE POLICY "Students can view their own applications" ON public.applications
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Recruiters can view applications for their jobs" ON public.applications
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid())
    );

CREATE POLICY "Faculty can view applications they need to approve" ON public.applications
    FOR SELECT USING (
        public.has_role(auth.uid(), 'faculty') OR 
        public.has_role(auth.uid(), 'placement') OR
        public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Students can insert their own applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Faculty can update applications for approval" ON public.applications
    FOR UPDATE USING (
        public.has_role(auth.uid(), 'faculty') OR 
        public.has_role(auth.uid(), 'placement')
    );

CREATE POLICY "Recruiters can update applications for their jobs" ON public.applications
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid())
    );

CREATE POLICY "Students can update their own applications" ON public.applications
    FOR UPDATE USING (auth.uid() = student_id);

-- RLS Policies for interview_schedules
CREATE POLICY "Users can view their related interviews" ON public.interview_schedules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.applications a
            WHERE a.id = interview_schedules.application_id
            AND (
                a.student_id = auth.uid() OR
                EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = a.job_id AND j.recruiter_id = auth.uid())
            )
        )
    );

CREATE POLICY "Recruiters can insert interviews" ON public.interview_schedules
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.applications a
            JOIN public.jobs j ON j.id = a.job_id
            WHERE a.id = interview_schedules.application_id
            AND j.recruiter_id = auth.uid()
        )
    );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruiter_profiles_updated_at BEFORE UPDATE ON public.recruiter_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_profiles_updated_at BEFORE UPDATE ON public.faculty_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();