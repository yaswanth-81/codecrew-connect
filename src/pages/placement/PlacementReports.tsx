import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar } from 'lucide-react';

const reports = [
  { name: 'Monthly Placement Report', period: 'December 2024', generated: 'Dec 20, 2024' },
  { name: 'Company Performance Report', period: 'Q4 2024', generated: 'Dec 15, 2024' },
  { name: 'Student Placement Summary', period: 'Fall 2024', generated: 'Dec 10, 2024' },
];

const PlacementReports: React.FC = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-heading font-bold text-foreground">Reports</h1>
      <p className="text-muted-foreground mt-1">Generate and download placement reports</p>
    </motion.div>
    <Card variant="elevated">
      <CardHeader><CardTitle>Available Reports</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {reports.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">{r.name}</p>
                <p className="text-sm text-muted-foreground">{r.period} • Generated {r.generated}</p>
              </div>
            </div>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Download</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default PlacementReports;
