import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  UserX,
  Activity,
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

const stats = [
  { label: 'Total Users', value: '2,847', icon: Users, color: 'text-accent' },
  { label: 'Verified Users', value: '2,654', icon: UserCheck, color: 'text-success' },
  { label: 'Pending Verification', value: '193', icon: UserX, color: 'text-warning' },
  { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-primary' },
];

const pendingUsers = [
  { id: 1, name: 'John Smith', email: 'john.smith@company.com', role: 'Recruiter', submitted: '1 hour ago' },
  { id: 2, name: 'Lisa Anderson', email: 'l.anderson@university.edu', role: 'Faculty', submitted: '3 hours ago' },
  { id: 3, name: 'Mike Johnson', email: 'm.johnson@startup.io', role: 'Recruiter', submitted: '5 hours ago' },
  { id: 4, name: 'Sarah Lee', email: 'sarah.lee@edu.org', role: 'Placement Cell', submitted: '1 day ago' },
];

const systemAlerts = [
  { id: 1, type: 'warning', message: 'High API usage detected from TechCorp integration', time: '10 min ago' },
  { id: 2, type: 'info', message: 'Scheduled maintenance window: Dec 28, 2AM-4AM', time: '2 hours ago' },
  { id: 3, type: 'success', message: 'Database backup completed successfully', time: '6 hours ago' },
];

const AdminDashboard: React.FC = () => {
  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-warning/20 text-warning border-warning/50';
      case 'info': return 'bg-primary/20 text-primary border-primary/50';
      case 'success': return 'bg-success/20 text-success border-success/50';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle2;
      default: return Shield;
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
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            System oversight and compliance management
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Verification Queue */}
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
                      <UserCheck className="w-5 h-5 text-accent" />
                      User Verification Queue
                    </CardTitle>
                    <CardDescription>Pending account verifications</CardDescription>
                  </div>
                  <Badge variant="secondary">{pendingUsers.length} pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="accent">Verify</Button>
                            <Button size="sm" variant="outline">Review</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  System Alerts
                </CardTitle>
                <CardDescription>Recent system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.map((alert, index) => {
                    const AlertIcon = getAlertIcon(alert.type);
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${getAlertStyle(alert.type)}`}
                      >
                        <AlertIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs opacity-70">{alert.time}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
