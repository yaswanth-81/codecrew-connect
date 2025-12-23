import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Building2, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare
} from 'lucide-react';

const applications = [
  {
    id: 1,
    position: 'Frontend Developer Intern',
    company: 'TechCorp Inc.',
    appliedDate: 'Dec 18, 2024',
    status: 'interview',
    nextStep: 'Technical Interview - Dec 26',
  },
  {
    id: 2,
    position: 'Software Engineer',
    company: 'InnovateTech',
    appliedDate: 'Dec 15, 2024',
    status: 'review',
    nextStep: 'Application under review',
  },
  {
    id: 3,
    position: 'Full Stack Developer',
    company: 'StartupXYZ',
    appliedDate: 'Dec 10, 2024',
    status: 'accepted',
    nextStep: 'Offer received!',
  },
  {
    id: 4,
    position: 'Data Analyst Intern',
    company: 'DataCo',
    appliedDate: 'Dec 5, 2024',
    status: 'rejected',
    nextStep: 'Application not selected',
  },
  {
    id: 5,
    position: 'Cloud Engineer',
    company: 'CloudFirst',
    appliedDate: 'Dec 20, 2024',
    status: 'submitted',
    nextStep: 'Waiting for initial review',
  },
];

const statusConfig = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: Clock },
  review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  interview: { label: 'Interview', color: 'bg-purple-100 text-purple-700', icon: Calendar },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const StudentApplications: React.FC = () => {
  const stats = {
    total: applications.length,
    active: applications.filter(a => !['accepted', 'rejected'].includes(a.status)).length,
    interviews: applications.filter(a => a.status === 'interview').length,
    offers: applications.filter(a => a.status === 'accepted').length,
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground mt-1">Track your job application status</p>
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
            <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{stats.interviews}</p>
            <p className="text-sm text-muted-foreground">Interviews</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{stats.offers}</p>
            <p className="text-sm text-muted-foreground">Offers</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Applications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Application History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app, index) => {
                const status = statusConfig[app.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{app.position}</h3>
                        <p className="text-sm text-muted-foreground">{app.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">Applied: {app.appliedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">{app.nextStep}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentApplications;
