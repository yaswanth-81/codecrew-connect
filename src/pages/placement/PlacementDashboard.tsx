import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/layout/DashboardLayout';

const stats = [
  { label: 'Students Placed', value: '847', icon: Users, color: 'text-success', change: '+12%', up: true },
  { label: 'Active Partners', value: '156', icon: Building2, color: 'text-accent', change: '+8%', up: true },
  { label: 'Pending Approvals', value: '23', icon: Clock, color: 'text-warning', change: '-5%', up: false },
  { label: 'Placement Rate', value: '94%', icon: TrendingUp, color: 'text-primary', change: '+3%', up: true },
];

const verificationQueue = [
  { id: 1, company: 'TechCorp Inc.', type: 'New Partner', submitted: '2 hours ago', priority: 'high' },
  { id: 2, company: 'StartupXYZ', type: 'Job Posting', submitted: '4 hours ago', priority: 'medium' },
  { id: 3, company: 'DesignHub', type: 'New Partner', submitted: '1 day ago', priority: 'low' },
  { id: 4, company: 'DataFlow Systems', type: 'Job Posting', submitted: '2 days ago', priority: 'medium' },
];

const departmentStats = [
  { name: 'Computer Science', placed: 245, total: 280, percentage: 88 },
  { name: 'Electrical Engineering', placed: 180, total: 200, percentage: 90 },
  { name: 'Mechanical Engineering', placed: 156, total: 190, percentage: 82 },
  { name: 'Business Admin', placed: 142, total: 160, percentage: 89 },
  { name: 'Data Science', placed: 124, total: 130, percentage: 95 },
];

const PlacementDashboard: React.FC = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/20 text-destructive';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-success/20 text-success';
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
        >
          <h1 className="text-2xl md:text-3xl font-bold font-heading">
            Placement Cell Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of campus placement activities and metrics
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
                  <div className={`flex items-center gap-1 text-xs mt-2 ${stat.up ? 'text-success' : 'text-destructive'}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change} from last month
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Verification Queue */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      Verification Queue
                    </CardTitle>
                    <CardDescription>Pending partner and job approvals</CardDescription>
                  </div>
                  <Badge variant="secondary">{verificationQueue.length} pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {verificationQueue.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.company}</p>
                          <p className="text-xs text-muted-foreground">{item.type} • {item.submitted}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">Review</Button>
                          <Button size="sm" variant="accent">Approve</Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Department Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Department-wise Placements
                </CardTitle>
                <CardDescription>Current academic year statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept, index) => (
                    <motion.div
                      key={dept.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{dept.name}</span>
                        <span className="text-muted-foreground">
                          {dept.placed}/{dept.total} ({dept.percentage}%)
                        </span>
                      </div>
                      <Progress
                        value={dept.percentage}
                        className="h-2"
                      />
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

export default PlacementDashboard;
