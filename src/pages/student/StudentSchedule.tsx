import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  User,
  ChevronLeft,
  ChevronRight,
  Bell
} from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Technical Interview - TechCorp',
    type: 'interview',
    date: 'Dec 26, 2024',
    time: '10:00 AM - 11:00 AM',
    location: 'Video Call',
    interviewer: 'Sarah Johnson',
    isOnline: true,
  },
  {
    id: 2,
    title: 'HR Round - InnovateTech',
    type: 'interview',
    date: 'Dec 28, 2024',
    time: '2:00 PM - 2:30 PM',
    location: 'Video Call',
    interviewer: 'Mike Chen',
    isOnline: true,
  },
  {
    id: 3,
    title: 'Campus Career Fair',
    type: 'event',
    date: 'Jan 5, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'Main Auditorium',
    isOnline: false,
  },
  {
    id: 4,
    title: 'Resume Workshop',
    type: 'workshop',
    date: 'Jan 8, 2025',
    time: '3:00 PM - 4:30 PM',
    location: 'Room 204',
    isOnline: false,
  },
  {
    id: 5,
    title: 'Mock Interview Session',
    type: 'workshop',
    date: 'Jan 10, 2025',
    time: '11:00 AM - 12:00 PM',
    location: 'Career Center',
    isOnline: false,
  },
];

const upcomingWeek = [
  { day: 'Mon', date: 23, events: 0 },
  { day: 'Tue', date: 24, events: 0 },
  { day: 'Wed', date: 25, events: 0 },
  { day: 'Thu', date: 26, events: 1, isToday: false },
  { day: 'Fri', date: 27, events: 0 },
  { day: 'Sat', date: 28, events: 1 },
  { day: 'Sun', date: 29, events: 0 },
];

const typeConfig = {
  interview: { label: 'Interview', color: 'bg-purple-100 text-purple-700' },
  event: { label: 'Event', color: 'bg-blue-100 text-blue-700' },
  workshop: { label: 'Workshop', color: 'bg-green-100 text-green-700' },
};

const StudentSchedule: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">My Schedule</h1>
          <p className="text-muted-foreground mt-1">Manage your interviews and events</p>
        </div>
        <Button variant="accent" className="gap-2">
          <Bell className="w-4 h-4" />
          Set Reminders
        </Button>
      </motion.div>

      {/* Week View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>December 2024</CardTitle>
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
            <div className="grid grid-cols-7 gap-2">
              {upcomingWeek.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className={`p-4 rounded-xl text-center cursor-pointer transition-all ${
                    day.events > 0 
                      ? 'bg-primary/10 border-2 border-primary' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <p className="text-sm text-muted-foreground">{day.day}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{day.date}</p>
                  {day.events > 0 && (
                    <Badge className="mt-2 bg-primary text-primary-foreground text-xs">
                      {day.events} event
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event, index) => {
                const type = typeConfig[event.type as keyof typeof typeConfig];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl gradient-primary flex flex-col items-center justify-center text-primary-foreground">
                        <span className="text-xs">{event.date.split(' ')[0]}</span>
                        <span className="text-lg font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{event.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            {event.isOnline ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                            {event.location}
                          </span>
                        </div>
                        {event.interviewer && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Interviewer: {event.interviewer}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={type.color}>{type.label}</Badge>
                      {event.isOnline && (
                        <Button variant="accent" size="sm">
                          Join Call
                        </Button>
                      )}
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

export default StudentSchedule;
