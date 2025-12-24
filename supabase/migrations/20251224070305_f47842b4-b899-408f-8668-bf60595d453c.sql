-- Create exams/assessments table
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    passing_score INTEGER NOT NULL DEFAULT 60,
    max_attempts INTEGER DEFAULT 1,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'completed')),
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coding questions table
CREATE TABLE public.coding_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    constraints TEXT,
    examples TEXT,
    starter_code TEXT,
    test_cases JSONB NOT NULL DEFAULT '[]',
    expected_output TEXT,
    points INTEGER DEFAULT 50,
    time_limit_seconds INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student exam attempts table
CREATE TABLE public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
    student_id UUID NOT NULL,
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    total_score INTEGER DEFAULT 0,
    percentage_score NUMERIC(5,2) DEFAULT 0,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'evaluated', 'passed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(assessment_id, student_id)
);

-- Create code submissions for each question
CREATE TABLE public.code_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.coding_questions(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL,
    language TEXT DEFAULT 'javascript',
    test_cases_passed INTEGER DEFAULT 0,
    total_test_cases INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    execution_time_ms INTEGER,
    output TEXT,
    error TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(attempt_id, question_id)
);

-- Enable RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_submissions ENABLE ROW LEVEL SECURITY;

-- Assessments policies
CREATE POLICY "Placement and admin can manage assessments"
ON public.assessments FOR ALL
USING (has_role(auth.uid(), 'placement') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view active assessments for their approved applications"
ON public.assessments FOR SELECT
USING (
    status IN ('active', 'scheduled') AND
    EXISTS (
        SELECT 1 FROM applications a 
        WHERE a.job_id = assessments.job_id 
        AND a.student_id = auth.uid() 
        AND a.status = 'faculty_approved'
    )
);

CREATE POLICY "Faculty can view assessments"
ON public.assessments FOR SELECT
USING (has_role(auth.uid(), 'faculty'));

CREATE POLICY "Recruiters can view assessments for their jobs"
ON public.assessments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM jobs j 
        WHERE j.id = assessments.job_id 
        AND j.recruiter_id = auth.uid()
    )
);

-- Coding questions policies
CREATE POLICY "Placement and admin can manage questions"
ON public.coding_questions FOR ALL
USING (has_role(auth.uid(), 'placement') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view questions for active exams"
ON public.coding_questions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM assessments a 
        WHERE a.id = coding_questions.assessment_id 
        AND a.status = 'active'
        AND EXISTS (
            SELECT 1 FROM applications app 
            WHERE app.job_id = a.job_id 
            AND app.student_id = auth.uid() 
            AND app.status = 'faculty_approved'
        )
    )
);

-- Exam attempts policies
CREATE POLICY "Students can manage their own attempts"
ON public.exam_attempts FOR ALL
USING (auth.uid() = student_id);

CREATE POLICY "Placement and admin can view all attempts"
ON public.exam_attempts FOR SELECT
USING (has_role(auth.uid(), 'placement') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Faculty can view attempts"
ON public.exam_attempts FOR SELECT
USING (has_role(auth.uid(), 'faculty'));

CREATE POLICY "Recruiters can view attempts for their jobs"
ON public.exam_attempts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM assessments a 
        JOIN jobs j ON j.id = a.job_id
        WHERE a.id = exam_attempts.assessment_id 
        AND j.recruiter_id = auth.uid()
    )
);

-- Code submissions policies
CREATE POLICY "Students can manage their own submissions"
ON public.code_submissions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM exam_attempts ea 
        WHERE ea.id = code_submissions.attempt_id 
        AND ea.student_id = auth.uid()
    )
);

CREATE POLICY "Placement and admin can view all submissions"
ON public.code_submissions FOR SELECT
USING (has_role(auth.uid(), 'placement') OR has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_assessments_updated_at
BEFORE UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for exam attempts
ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_attempts;