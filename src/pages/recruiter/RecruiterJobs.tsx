import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Clock,
  MapPin,
  DollarSign,
  MoreVertical
} from 'lucide-react';

const jobPostings = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Internship',
    salary: '$25-35/hr',
    posted: 'Dec 15, 2024',
    applications: 45,
    status: 'active',
  },
  {
    id: 2,
    title: 'Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$80K-100K',
    posted: 'Dec 10, 2024',
    applications: 78,
    status: 'active',
  },
  {
    id: 3,
    title: 'Data Science Intern',
    department: 'Data',
    location: 'New York, NY',
    type: 'Internship',
    salary: '$30-40/hr',
    posted: 'Dec 5, 2024',
    applications: 62,
    status: 'active',
  },
  {
    id: 4,
    title: 'Product Manager',
    department: 'Product',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$100K-130K',
    posted: 'Nov 28, 2024',
    applications: 34,
    status: 'closed',
  },
  {
    id: 5,
    title: 'UX Designer',
    department: 'Design',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$70K-90K',
    posted: 'Dec 18, 2024',
    applications: 23,
    status: 'draft',
  },
];

const RecruiterJobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobPostings.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: jobPostings.length,
    active: jobPostings.filter(j => j.status === 'active').length,
    totalApplications: jobPostings.reduce((acc, j) => acc + j.applications, 0),
    avgApplications: Math.round(jobPostings.reduce((acc, j) => acc + j.applications, 0) / jobPostings.length),
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Job Postings</h1>
          <p className="text-muted-foreground mt-1">Manage your job listings</p>
        </div>
        <Button variant="accent" className="gap-2">
          <Plus className="w-4 h-4" />
          Post New Job
        </Button>
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
            <Briefcase className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Postings</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active Jobs</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <Users className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{stats.totalApplications}</p>
            <p className="text-sm text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{stats.avgApplications}</p>
            <p className="text-sm text-muted-foreground">Avg per Job</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search job postings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Job Listings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="elevated">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Position</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Applications</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job, index) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-foreground">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.department} • Posted {job.posted}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{job.type}</Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-foreground">{job.applications}</span>
                    </td>
                    <td className="p-4">
                      <Badge 
                        className={
                          job.status === 'active' ? 'bg-green-100 text-green-700' :
                          job.status === 'closed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RecruiterJobs;
