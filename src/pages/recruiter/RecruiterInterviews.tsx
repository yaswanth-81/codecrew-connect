import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Video, 
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Mail
} from 'lucide-react';

const interviews = [
  {
    id: 1,
    candidate: 'Alex Johnson',
    position: 'Frontend Developer Intern',
    date: 'Dec 26, 2024',
    time: '10:00 AM - 11:00 AM',
    type: 'Technical',
    platform: 'Zoom',
    status: 'scheduled',
  },
  {
    id: 2,
    candidate: 'Sarah Chen',
    position: 'Software Engineer',
    date: 'Dec 26, 2024',
    time: '2:00 PM - 3:00 PM',
    type: 'HR Round',
    platform: 'Google Meet',
    status: 'scheduled',
  },
  {
    id: 3,
    candidate: 'Michael Brown',
    position: 'Data Science Intern',
    date: 'Dec 27, 2024',
    time: '11:00 AM - 12:00 PM',
    type: 'Technical',
    platform: 'Zoom',
    status: 'scheduled',
  },
  {
    id: 4,
    candidate: 'Emily Davis',
    position: 'Frontend Developer Intern',
    date: 'Dec 28, 2024',
    time: '3:00 PM - 4:00 PM',
    type: 'Final Round',
    platform: 'In-person',
    status: 'pending',
  },
  {
    id: 5,
    candidate: 'David Lee',
    position: 'Software Engineer',
    date: 'Dec 23, 2024',
    time: '10:00 AM - 11:00 AM',
    type: 'Technical',
    platform: 'Zoom',
    status: 'completed',
  },
];

const statusConfig = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
  pending: { label: 'Pending Confirmation', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

const RecruiterInterviews: React.FC = () => {
  const todayInterviews = interviews.filter(i => i.date === 'Dec 26, 2024');
  const upcomingInterviews = interviews.filter(i => i.status === 'scheduled' || i.status === 'pending');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Interviews</h1>
          <p className="text-muted-foreground mt-1">Manage your interview schedule</p>
        </div>
        <Button variant="accent" className="gap-2">
          <Plus className="w-4 h-4" />
          Schedule Interview
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
            <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{todayInterviews.length}</p>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{upcomingInterviews.length}</p>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <Video className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{interviews.filter(i => i.status === 'completed').length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <User className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{interviews.length}</p>
            <p className="text-sm text-muted-foreground">Total This Week</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card variant="elevated" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayInterviews.length > 0 ? (
                todayInterviews.map((interview) => (
                  <div 
                    key={interview.id} 
                    className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary"
                  >
                    <p className="font-semibold text-foreground">{interview.candidate}</p>
                    <p className="text-sm text-muted-foreground">{interview.position}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {interview.time}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Video className="w-4 h-4" />
                      {interview.platform}
                    </div>
                    <Button variant="accent" size="sm" className="mt-3 w-full">
                      Join Meeting
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No interviews today</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* All Interviews */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Interviews</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {interviews.map((interview, index) => {
                  const status = statusConfig[interview.status as keyof typeof statusConfig];
                  return (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {interview.candidate.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{interview.candidate}</p>
                          <p className="text-sm text-muted-foreground">{interview.position}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">{interview.date}</p>
                        <p className="text-sm text-muted-foreground">{interview.time}</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary">{interview.type}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{interview.platform}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={status.color}>{status.label}</Badge>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterInterviews;
