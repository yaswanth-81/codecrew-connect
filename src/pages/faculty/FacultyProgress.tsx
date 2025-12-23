import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Award } from 'lucide-react';

const FacultyProgress: React.FC = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-heading font-bold text-foreground">Student Progress</h1>
      <p className="text-muted-foreground mt-1">Track mentee achievements</p>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card variant="glass"><CardContent className="pt-6 text-center"><Users className="w-8 h-8 text-primary mx-auto mb-2" /><p className="text-2xl font-bold">12</p><p className="text-sm text-muted-foreground">Total Mentees</p></CardContent></Card>
      <Card variant="glass"><CardContent className="pt-6 text-center"><Award className="w-8 h-8 text-green-500 mx-auto mb-2" /><p className="text-2xl font-bold">8</p><p className="text-sm text-muted-foreground">Placed</p></CardContent></Card>
      <Card variant="glass"><CardContent className="pt-6 text-center"><TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" /><p className="text-2xl font-bold">92%</p><p className="text-sm text-muted-foreground">Success Rate</p></CardContent></Card>
    </div>
    <Card variant="elevated">
      <CardHeader><CardTitle>Placement Progress</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[{ name: 'Applications Submitted', value: 85 }, { name: 'Interviews Scheduled', value: 60 }, { name: 'Offers Received', value: 40 }].map((p, i) => (
            <div key={i}><div className="flex justify-between mb-1"><span className="text-sm">{p.name}</span><span className="text-sm font-medium">{p.value}%</span></div><Progress value={p.value} className="h-2" /></div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default FacultyProgress;
