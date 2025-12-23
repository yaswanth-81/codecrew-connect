import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  Calendar,
  Award,
  Target,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSupabaseAuthContext } from '@/contexts/SupabaseAuthContext';

// Import sub-pages
import StudentProfile from './StudentProfile';
import StudentJobs from './StudentJobs';
import StudentApplications from './StudentApplications';
import StudentSchedule from './StudentSchedule';

const stats = [
  { label: 'Applications Sent', value: '12', icon: Briefcase, color: 'text-accent' },
  { label: 'Interview Calls', value: '4', icon: Calendar, color: 'text-success' },
  { label: 'Profile Views', value: '89', icon: TrendingUp, color: 'text-primary' },
  { label: 'Skill Badges', value: '7', icon: Award, color: 'text-warning' },
];

const recommendedJobs = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    matchScore: 95,
    salary: '$25/hr',
    tags: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    matchScore: 88,
    salary: '$30/hr',
    tags: ['Node.js', 'React', 'PostgreSQL'],
  },
  {
    id: 3,
    title: 'UI/UX Design Intern',
    company: 'DesignHub',
    location: 'New York, NY',
    matchScore: 82,
    salary: '$22/hr',
    tags: ['Figma', 'UI Design', 'Prototyping'],
  },
];

const skillBadges = [
  { name: 'React', level: 'Advanced', verified: true },
  { name: 'TypeScript', level: 'Intermediate', verified: true },
  { name: 'Node.js', level: 'Intermediate', verified: false },
  { name: 'Python', level: 'Beginner', verified: true },
];

const StudentHome: React.FC = () => {
  const { profile } = useSupabaseAuthContext();

  const firstName = profile?.full_name?.split(' ')[0] || 'Student';

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold font-heading">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your applications and discover new opportunities
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Verifiable Digital Profile
              </CardTitle>
              <CardDescription>Your skill badges and certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-accent bg-accent/20 flex items-center justify-center text-xl font-bold">
                    {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <Award className="w-3 h-3 text-success-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{profile?.full_name || 'Student Name'}</h3>
                  <p className="text-sm text-muted-foreground">Computer Science, 2024</p>
                  <p className="text-sm text-accent font-medium">GPA: 3.8/4.0</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Skill Badges</p>
                <div className="flex flex-wrap gap-2">
                  {skillBadges.map((skill) => (
                    <Badge
                      key={skill.name}
                      variant={skill.verified ? 'default' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {skill.verified && <Star className="w-3 h-3" />}
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Completion</span>
                  <span className="text-accent font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Recommended Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card variant="elevated" className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    AI Recommended Jobs
                  </CardTitle>
                  <CardDescription>Personalized matches based on your profile</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-4 rounded-lg border border-border hover:border-accent/50 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {job.company} • {job.location}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {job.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              job.matchScore >= 90
                                ? 'bg-success/20 text-success'
                                : job.matchScore >= 80
                                ? 'bg-accent/20 text-accent'
                                : 'bg-warning/20 text-warning'
                            }`}
                          >
                            {job.matchScore}%
                          </div>
                        </div>
                        <p className="text-sm font-medium text-accent">{job.salary}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="accent" className="flex-1">
                        Quick Apply
                      </Button>
                      <Button size="sm" variant="outline">
                        Save
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="jobs" element={<StudentJobs />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="schedule" element={<StudentSchedule />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;
