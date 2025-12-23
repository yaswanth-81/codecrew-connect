import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Award, 
  Code, 
  Edit,
  Download,
  Share2,
  CheckCircle
} from 'lucide-react';

const skills = [
  { name: 'React', level: 90, verified: true },
  { name: 'TypeScript', level: 85, verified: true },
  { name: 'Node.js', level: 75, verified: false },
  { name: 'Python', level: 80, verified: true },
  { name: 'SQL', level: 70, verified: false },
  { name: 'AWS', level: 60, verified: false },
];

const certifications = [
  { name: 'AWS Cloud Practitioner', issuer: 'Amazon', date: 'Dec 2024', verified: true },
  { name: 'React Developer Certification', issuer: 'Meta', date: 'Nov 2024', verified: true },
  { name: 'Data Structures & Algorithms', issuer: 'Coursera', date: 'Oct 2024', verified: true },
];

const StudentProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your verifiable digital profile</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="accent" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated" className="h-full">
            <CardContent className="pt-6 text-center">
              <div className="w-24 h-24 rounded-full gradient-primary mx-auto flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Alex Johnson</h2>
              <p className="text-muted-foreground">Computer Science, 4th Year</p>
              
              <div className="mt-4 space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  alex.johnson@university.edu
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  San Francisco, CA
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profile Completion</span>
                  <span className="font-medium text-foreground">85%</span>
                </div>
                <Progress value={85} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Academic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">University</span>
                <span className="font-medium">Stanford University</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Degree</span>
                <span className="font-medium">B.S. Computer Science</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGPA</span>
                <span className="font-medium text-green-600">3.85 / 4.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Graduation</span>
                <span className="font-medium">May 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class Rank</span>
                <span className="font-medium">Top 10%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">{cert.name}</p>
                      <p className="text-xs text-muted-foreground">{cert.issuer} • {cert.date}</p>
                    </div>
                    {cert.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{skill.name}</span>
                      {skill.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
