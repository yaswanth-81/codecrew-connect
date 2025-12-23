import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Eye,
  UserCheck,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  { label: 'Active Jobs', value: '8', icon: Briefcase, color: 'text-accent', change: '+2' },
  { label: 'Total Applicants', value: '156', icon: Users, color: 'text-success', change: '+23' },
  { label: 'Interviews Scheduled', value: '12', icon: Calendar, color: 'text-primary', change: '+5' },
  { label: 'Conversion Rate', value: '24%', icon: TrendingUp, color: 'text-warning', change: '+3%' },
];

const postedJobs = [
  { id: 1, title: 'Frontend Developer Intern', applicants: 45, status: 'Active', posted: '2 days ago' },
  { id: 2, title: 'Backend Engineer', applicants: 32, status: 'Active', posted: '5 days ago' },
  { id: 3, title: 'UI/UX Designer', applicants: 28, status: 'Paused', posted: '1 week ago' },
  { id: 4, title: 'Data Analyst Intern', applicants: 51, status: 'Active', posted: '3 days ago' },
];

const shortlistedCandidates = [
  { id: 1, name: 'Alex Johnson', role: 'Frontend Developer Intern', status: 'Interview', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 2, name: 'Maria Garcia', role: 'Backend Engineer', status: 'Screening', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
  { id: 3, name: 'David Kim', role: 'UI/UX Designer', status: 'Offer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: 4, name: 'Emma Wilson', role: 'Data Analyst Intern', status: 'Interview', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
];

const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success/20 text-success';
      case 'Paused': return 'bg-warning/20 text-warning';
      case 'Interview': return 'bg-accent/20 text-accent';
      case 'Screening': return 'bg-primary/20 text-primary';
      case 'Offer': return 'bg-success/20 text-success';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading">
              Recruiter Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage job postings and track candidates
            </p>
          </div>
          <Button variant="accent" className="w-fit">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
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
                  <p className="text-xs text-success mt-2">
                    {stat.change} from last week
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Posted Jobs Table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Posted Opportunities</CardTitle>
                    <CardDescription>Your active job listings</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postedJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-xs text-muted-foreground">{job.posted}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            {job.applicants}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Candidate Shortlist Kanban */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Candidate Shortlist</CardTitle>
                    <CardDescription>Track your hiring pipeline</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shortlistedCandidates.map((candidate, index) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/50 hover:shadow-sm transition-all"
                    >
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.role}</p>
                      </div>
                      <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <UserCheck className="w-4 h-4" />
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
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
