import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Search,
  Filter,
  Star,
  Building2,
  BookmarkPlus,
  ArrowRight
} from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Internship',
    salary: '$25-35/hr',
    posted: '2 days ago',
    matchScore: 95,
    skills: ['React', 'TypeScript', 'Tailwind'],
    saved: false,
  },
  {
    id: 2,
    title: 'Software Engineer',
    company: 'InnovateTech',
    location: 'Remote',
    type: 'Full-time',
    salary: '$80K-100K',
    posted: '1 week ago',
    matchScore: 88,
    skills: ['Node.js', 'Python', 'AWS'],
    saved: true,
  },
  {
    id: 3,
    title: 'Data Science Intern',
    company: 'DataDriven Co.',
    location: 'New York, NY',
    type: 'Internship',
    salary: '$30-40/hr',
    posted: '3 days ago',
    matchScore: 75,
    skills: ['Python', 'SQL', 'Machine Learning'],
    saved: false,
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$90K-120K',
    posted: '5 days ago',
    matchScore: 82,
    skills: ['React', 'Node.js', 'PostgreSQL'],
    saved: false,
  },
  {
    id: 5,
    title: 'Cloud Engineer Intern',
    company: 'CloudFirst',
    location: 'Seattle, WA',
    type: 'Internship',
    salary: '$35-45/hr',
    posted: '1 day ago',
    matchScore: 70,
    skills: ['AWS', 'Docker', 'Kubernetes'],
    saved: true,
  },
];

const StudentJobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Job Matching</h1>
          <p className="text-muted-foreground mt-1">AI-powered job recommendations based on your profile</p>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, company, or skills..."
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

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-primary">152</p>
            <p className="text-sm text-muted-foreground">Matching Jobs</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-accent">24</p>
            <p className="text-sm text-muted-foreground">New This Week</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-green-600">88%</p>
            <p className="text-sm text-muted-foreground">Avg Match Score</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-blue-600">5</p>
            <p className="text-sm text-muted-foreground">Saved Jobs</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card variant="interactive" className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                      <p className="text-muted-foreground">{job.company}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.posted}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-bold text-foreground">{job.matchScore}%</span>
                      <span className="text-sm text-muted-foreground">match</span>
                    </div>
                    <Badge variant={job.type === 'Internship' ? 'default' : 'secondary'}>
                      {job.type}
                    </Badge>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <BookmarkPlus className="w-4 h-4" />
                      </Button>
                      <Button variant="accent" size="sm" className="gap-1">
                        Apply <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentJobs;
