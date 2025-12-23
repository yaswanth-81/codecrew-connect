import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap, Briefcase } from 'lucide-react';

const students = [
  { name: 'Alex Johnson', degree: 'B.S. Computer Science', gpa: '3.85', status: 'placed', company: 'TechCorp' },
  { name: 'Sarah Chen', degree: 'B.S. Software Engineering', gpa: '3.92', status: 'interviewing', company: 'InnovateTech' },
  { name: 'Michael Brown', degree: 'B.S. Data Science', gpa: '3.78', status: 'searching', company: null },
];

const FacultyStudents: React.FC = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-heading font-bold text-foreground">My Students</h1>
      <p className="text-muted-foreground mt-1">Monitor mentee progress</p>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map((s, i) => (
        <Card key={i} variant="interactive">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full gradient-primary mx-auto flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">{s.name}</h3>
            <p className="text-sm text-muted-foreground">{s.degree}</p>
            <p className="text-sm text-muted-foreground">GPA: {s.gpa}</p>
            <Badge className={`mt-3 ${s.status === 'placed' ? 'bg-green-100 text-green-700' : s.status === 'interviewing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {s.status} {s.company && `@ ${s.company}`}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FacultyStudents;
