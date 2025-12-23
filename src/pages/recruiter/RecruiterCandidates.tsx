import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Filter,
  Star,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const candidates = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    university: 'Stanford University',
    degree: 'B.S. Computer Science',
    gpa: '3.85',
    appliedFor: 'Frontend Developer Intern',
    matchScore: 95,
    status: 'shortlisted',
    skills: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    university: 'MIT',
    degree: 'B.S. Software Engineering',
    gpa: '3.92',
    appliedFor: 'Software Engineer',
    matchScore: 92,
    status: 'interview',
    skills: ['Python', 'AWS', 'Docker'],
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@university.edu',
    university: 'UC Berkeley',
    degree: 'B.S. Data Science',
    gpa: '3.78',
    appliedFor: 'Data Science Intern',
    matchScore: 88,
    status: 'new',
    skills: ['Python', 'SQL', 'TensorFlow'],
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@university.edu',
    university: 'Carnegie Mellon',
    degree: 'B.S. Computer Science',
    gpa: '3.90',
    appliedFor: 'Frontend Developer Intern',
    matchScore: 85,
    status: 'new',
    skills: ['Vue.js', 'JavaScript', 'CSS'],
  },
  {
    id: 5,
    name: 'James Wilson',
    email: 'james.wilson@university.edu',
    university: 'Georgia Tech',
    degree: 'B.S. Computer Engineering',
    gpa: '3.72',
    appliedFor: 'Software Engineer',
    matchScore: 80,
    status: 'rejected',
    skills: ['Java', 'Spring Boot', 'MySQL'],
  },
];

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700' },
  shortlisted: { label: 'Shortlisted', color: 'bg-green-100 text-green-700' },
  interview: { label: 'Interview', color: 'bg-purple-100 text-purple-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  hired: { label: 'Hired', color: 'bg-emerald-100 text-emerald-700' },
};

const RecruiterCandidates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground mt-1">Review and manage applicants</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-foreground">{candidates.length}</p>
            <p className="text-sm text-muted-foreground">Total Candidates</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{candidates.filter(c => c.status === 'new').length}</p>
            <p className="text-sm text-muted-foreground">New Applications</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-green-600">{candidates.filter(c => c.status === 'shortlisted').length}</p>
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{candidates.filter(c => c.status === 'interview').length}</p>
            <p className="text-sm text-muted-foreground">In Interview</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </motion.div>

      {/* Candidates Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredCandidates.map((candidate, index) => {
          const status = statusConfig[candidate.status as keyof typeof statusConfig];
          return (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
            >
              <Card variant="interactive" className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.university}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-foreground">{candidate.matchScore}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      {candidate.degree} • GPA: {candidate.gpa}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {candidate.email}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Applied for: {candidate.appliedFor}</p>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <Badge className={status.color}>{status.label}</Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-green-600">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500">
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default RecruiterCandidates;
