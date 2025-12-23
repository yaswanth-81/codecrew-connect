import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ClipboardCheck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Import sub-pages
import FacultyStudents from './FacultyStudents';
import FacultyApprovals from './FacultyApprovals';
import FacultyProgress from './FacultyProgress';

const stats = [
  { label: 'Assigned Students', value: '45', icon: Users, color: 'text-accent' },
  { label: 'Pending Approvals', value: '8', icon: Clock, color: 'text-warning' },
  { label: 'Approved This Month', value: '23', icon: CheckCircle, color: 'text-success' },
  { label: 'Avg. Progress', value: '76%', icon: TrendingUp, color: 'text-primary' },
];

const initialApprovals = [
  { id: 1, student: 'Alex Johnson', type: 'Job Application', company: 'TechCorp Inc.', submitted: '2 hours ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 2, student: 'Maria Garcia', type: 'Internship Request', company: 'StartupXYZ', submitted: '4 hours ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
  { id: 3, student: 'David Kim', type: 'Job Application', company: 'DesignHub', submitted: '1 day ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: 4, student: 'Emma Wilson', type: 'Leave Request', company: 'Interview at DataFlow', submitted: '1 day ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { id: 5, student: 'James Chen', type: 'Job Application', company: 'CloudTech', submitted: '2 days ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
];

const FacultyHome: React.FC = () => {
  const { toast } = useToast();
  const [pendingApprovals, setPendingApprovals] = useState(initialApprovals);

  const handleApprove = (id: number, studentName: string) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Request Approved",
      description: `${studentName}'s request has been approved successfully.`,
    });
  };

  const handleReject = (id: number, studentName: string) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Request Rejected",
      description: `${studentName}'s request has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold font-heading">
          Faculty Mentor Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Guide your students towards successful placements
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

      {/* Pending Approvals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-accent" />
                  Pending Approval Requests
                </CardTitle>
                <CardDescription>Review and approve student requests</CardDescription>
              </div>
              <Badge variant="secondary" className="text-warning">
                {pendingApprovals.length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-success" />
                <p>All caught up! No pending approvals.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border border-border hover:border-accent/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.student}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{item.student}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.type} • {item.company}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.submitted}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto md:ml-0">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => handleApprove(item.id, item.student)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(item.id, item.student)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const FacultyDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<FacultyHome />} />
        <Route path="students" element={<FacultyStudents />} />
        <Route path="approvals" element={<FacultyApprovals />} />
        <Route path="progress" element={<FacultyProgress />} />
      </Routes>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
