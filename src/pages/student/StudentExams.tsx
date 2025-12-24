import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ClipboardList,
  Clock,
  Play,
  CheckCircle,
  Code,
  Loader2,
  AlertTriangle,
  Timer,
  Send,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuthContext } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Assessment {
  id: string;
  job_id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  passing_score: number;
  status: string;
  jobs?: { title: string; company_name: string };
}

interface CodingQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  constraints: string | null;
  examples: string | null;
  starter_code: string | null;
  test_cases: unknown;
  points: number;
}

interface ExamAttempt {
  id: string;
  assessment_id: string;
  started_at: string;
  submitted_at: string | null;
  total_score: number;
  percentage_score: number;
  status: string;
}

const StudentExams: React.FC = () => {
  const { user } = useSupabaseAuthContext();
  const { toast } = useToast();
  
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Exam state
  const [activeExam, setActiveExam] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { passed: number; total: number }>>({});

  const fetchAssessments = async () => {
    if (!user) return;
    
    try {
      // Get assessments for jobs where student has faculty_approved applications
      const { data: applications } = await supabase
        .from('applications')
        .select('job_id')
        .eq('student_id', user.id)
        .eq('status', 'faculty_approved');

      if (!applications?.length) {
        setAssessments([]);
        setIsLoading(false);
        return;
      }

      const jobIds = applications.map(a => a.job_id);

      const { data: assessmentsData } = await supabase
        .from('assessments')
        .select(`*, jobs (title, company_name)`)
        .in('job_id', jobIds)
        .eq('status', 'active');

      setAssessments(assessmentsData || []);

      // Get student's attempts
      const { data: attemptsData } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('student_id', user.id);

      setAttempts(attemptsData || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [user]);

  // Timer
  useEffect(() => {
    if (!activeExam || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, timeRemaining]);

  const startExam = async (assessment: Assessment) => {
    try {
      // Check for existing attempt
      const existingAttempt = attempts.find(a => a.assessment_id === assessment.id);
      
      if (existingAttempt) {
        if (existingAttempt.status !== 'in_progress') {
          toast({ 
            title: 'Already Attempted', 
            description: 'You have already completed this assessment.', 
            variant: 'destructive' 
          });
          return;
        }
        setCurrentAttempt(existingAttempt);
      } else {
        // Create new attempt
        const { data: attempt, error } = await supabase
          .from('exam_attempts')
          .insert({
            assessment_id: assessment.id,
            student_id: user?.id,
            status: 'in_progress',
          })
          .select()
          .single();

        if (error) throw error;
        setCurrentAttempt(attempt);
      }

      // Fetch questions
      const { data: questionsData } = await supabase
        .from('coding_questions')
        .select('*')
        .eq('assessment_id', assessment.id);

      setQuestions(questionsData || []);
      
      // Initialize answers with starter code
      const initialAnswers: Record<string, string> = {};
      questionsData?.forEach(q => {
        initialAnswers[q.id] = q.starter_code || '';
      });
      setAnswers(initialAnswers);

      setActiveExam(assessment);
      setTimeRemaining(assessment.duration_minutes * 60);
      setCurrentQuestionIndex(0);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const runTests = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const code = answers[questionId];
    const testCases = (Array.isArray(question.test_cases) ? question.test_cases : []) as any[];
    
    let passed = 0;
    
    // Simple JavaScript evaluation (in production, use a sandbox)
    try {
      // Extract function from code
      const funcMatch = code.match(/function\s+(\w+)/);
      if (!funcMatch) {
        setTestResults(prev => ({
          ...prev,
          [questionId]: { passed: 0, total: testCases.length }
        }));
        return;
      }

      const funcName = funcMatch[1];
      
      testCases.forEach((tc: any) => {
        try {
          // Create a sandboxed function evaluation
          const evalCode = `
            ${code}
            ${funcName}(${Object.values(tc.input).map(v => JSON.stringify(v)).join(', ')})
          `;
          
          // Note: In production, never use eval - use a proper sandbox
          const result = new Function(`return ${evalCode}`)();
          
          if (JSON.stringify(result) === JSON.stringify(tc.expected)) {
            passed++;
          }
        } catch (e) {
          // Test case failed
        }
      });
      
      setTestResults(prev => ({
        ...prev,
        [questionId]: { passed, total: testCases.length }
      }));
      
      toast({
        title: 'Tests Run',
        description: `${passed}/${testCases.length} test cases passed`,
        variant: passed === testCases.length ? 'default' : 'destructive'
      });
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [questionId]: { passed: 0, total: testCases.length }
      }));
      toast({ title: 'Error', description: 'Code execution error', variant: 'destructive' });
    }
  };

  const handleSubmitExam = async () => {
    if (!currentAttempt || !activeExam) return;
    
    setIsSubmitting(true);
    setShowConfirmSubmit(false);

    try {
      let totalScore = 0;
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

      // Save each answer and calculate score
      for (const question of questions) {
        const code = answers[question.id] || '';
        const tcLength = Array.isArray(question.test_cases) ? question.test_cases.length : 0;
        const result = testResults[question.id] || { passed: 0, total: tcLength };
        const score = Math.round((result.passed / (result.total || 1)) * question.points);
        
        totalScore += score;

        await supabase.from('code_submissions').upsert({
          attempt_id: currentAttempt.id,
          question_id: question.id,
          code,
          test_cases_passed: result.passed,
          total_test_cases: result.total,
          score,
        }, { onConflict: 'attempt_id,question_id' });
      }

      const percentageScore = Math.round((totalScore / totalPoints) * 100);
      const passed = percentageScore >= activeExam.passing_score;

      // Update attempt
      await supabase
        .from('exam_attempts')
        .update({
          submitted_at: new Date().toISOString(),
          total_score: totalScore,
          percentage_score: percentageScore,
          status: passed ? 'passed' : 'failed',
        })
        .eq('id', currentAttempt.id);

      // If passed, schedule for interview
      if (passed) {
        const { data: application } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', activeExam.job_id)
          .eq('student_id', user?.id)
          .single();

        if (application) {
          await supabase
            .from('applications')
            .update({ status: 'shortlisted' })
            .eq('id', application.id);
        }

        toast({
          title: 'Congratulations! 🎉',
          description: `You scored ${percentageScore}% and passed the assessment!`,
        });
      } else {
        toast({
          title: 'Assessment Completed',
          description: `You scored ${percentageScore}%. Required: ${activeExam.passing_score}%`,
          variant: 'destructive',
        });
      }

      // Reset exam state
      setActiveExam(null);
      setQuestions([]);
      setAnswers({});
      setCurrentAttempt(null);
      setTestResults({});
      fetchAssessments();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAttemptForAssessment = (assessmentId: string) => {
    return attempts.find(a => a.assessment_id === assessmentId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Active exam view
  if (activeExam && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const currentResult = testResults[currentQuestion.id];

    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-muted/50 border-b">
          <div>
            <h1 className="font-bold">{activeExam.title}</h1>
            <p className="text-sm text-muted-foreground">{activeExam.jobs?.company_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-muted'}`}>
              <Timer className="w-4 h-4" />
              <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
            <Button variant="destructive" onClick={() => setShowConfirmSubmit(true)}>
              Submit Exam
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          {/* Question Panel */}
          <div className="p-6 overflow-y-auto border-r">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Question {currentQuestionIndex + 1} of {questions.length}</Badge>
                <Badge variant={currentQuestion.difficulty === 'easy' ? 'secondary' : currentQuestion.difficulty === 'medium' ? 'default' : 'destructive'}>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.points} pts</Badge>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">{currentQuestion.title}</h2>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                {currentQuestion.description}
              </pre>
            </div>

            {currentQuestion.constraints && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm mb-2">Constraints:</h3>
                <p className="text-sm text-muted-foreground">{currentQuestion.constraints}</p>
              </div>
            )}

            {/* Question Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-8 h-8 rounded-full text-sm font-medium ${
                      i === currentQuestionIndex 
                        ? 'bg-primary text-primary-foreground' 
                        : testResults[questions[i].id]?.passed === testResults[questions[i].id]?.total && testResults[questions[i].id]?.total > 0
                        ? 'bg-green-500 text-white'
                        : 'bg-muted'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="flex flex-col overflow-hidden">
            <div className="p-3 bg-muted/50 border-b flex items-center justify-between">
              <span className="text-sm font-medium">Code Editor</span>
              <div className="flex items-center gap-2">
                {currentResult && (
                  <Badge variant={currentResult.passed === currentResult.total ? 'default' : 'destructive'}>
                    {currentResult.passed}/{currentResult.total} tests passed
                  </Badge>
                )}
                <Button size="sm" variant="outline" onClick={() => runTests(currentQuestion.id)}>
                  <Play className="w-4 h-4 mr-1" />
                  Run Tests
                </Button>
              </div>
            </div>
            <Textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
              className="flex-1 font-mono text-sm resize-none rounded-none border-0 focus-visible:ring-0"
              placeholder="Write your code here..."
            />
          </div>
        </div>

        {/* Confirm Submit Dialog */}
        <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Submit Exam?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to submit? You cannot make changes after submission.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <p className="text-sm">Questions answered:</p>
              <div className="flex gap-2">
                {questions.map((q, i) => {
                  const result = testResults[q.id];
                  const hasCode = (answers[q.id]?.length || 0) > 50;
                  return (
                    <div
                      key={q.id}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        result?.passed === result?.total && result?.total > 0
                          ? 'bg-green-500 text-white'
                          : hasCode
                          ? 'bg-yellow-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirmSubmit(false)}>
                Continue Exam
              </Button>
              <Button variant="destructive" onClick={handleSubmitExam} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Exam
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Exams list view
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-foreground">Online Assessments</h1>
        <p className="text-muted-foreground mt-1">Complete coding assessments for your applications</p>
      </motion.div>

      {assessments.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-12 text-center">
            <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No assessments available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Assessments will appear here once your applications are approved by faculty
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assessments.map((assessment, index) => {
            const attempt = getAttemptForAssessment(assessment.id);
            const isCompleted = attempt && attempt.status !== 'in_progress';

            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="interactive" className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Code className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{assessment.title}</h3>
                          <p className="text-muted-foreground">
                            {assessment.jobs?.title} • {assessment.jobs?.company_name}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {assessment.duration_minutes} minutes
                            </span>
                            <span className="flex items-center gap-1">
                              Pass: {assessment.passing_score}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {isCompleted ? (
                          <div className="space-y-2">
                            <Badge variant={attempt.status === 'passed' ? 'default' : 'destructive'} className="flex items-center gap-1">
                              {attempt.status === 'passed' ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {attempt.status === 'passed' ? 'Passed' : 'Failed'}
                            </Badge>
                            <p className="text-2xl font-bold">{attempt.percentage_score}%</p>
                          </div>
                        ) : (
                          <Button onClick={() => startExam(assessment)} className="gap-2">
                            <Play className="w-4 h-4" />
                            {attempt ? 'Continue' : 'Start Exam'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentExams;
