import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

const approvals = [
  { student: 'Alex Johnson', request: 'Internship Application - TechCorp', submitted: 'Dec 20, 2024' },
  { student: 'Michael Brown', request: 'Course Override Request', submitted: 'Dec 19, 2024' },
  { student: 'Emily Davis', request: 'Letter of Recommendation', submitted: 'Dec 18, 2024' },
];

const FacultyApprovals: React.FC = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-heading font-bold text-foreground">Pending Approvals</h1>
      <p className="text-muted-foreground mt-1">Review student requests</p>
    </motion.div>
    <Card variant="elevated">
      <CardContent className="pt-6 space-y-4">
        {approvals.map((a, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">{a.student}</p>
                <p className="text-sm text-muted-foreground">{a.request} • {a.submitted}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="accent"><CheckCircle className="w-4 h-4 mr-1" />Approve</Button>
              <Button size="sm" variant="outline" className="text-red-500"><XCircle className="w-4 h-4 mr-1" />Reject</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default FacultyApprovals;
