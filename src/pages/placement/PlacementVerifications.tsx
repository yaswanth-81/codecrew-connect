import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Building2 } from 'lucide-react';

const verifications = [
  { id: 1, company: 'TechCorp Inc.', type: 'New Partner', submitted: 'Dec 20, 2024', status: 'pending' },
  { id: 2, company: 'InnovateTech', type: 'Job Posting', submitted: 'Dec 19, 2024', status: 'pending' },
  { id: 3, company: 'DataDriven Co.', type: 'New Partner', submitted: 'Dec 18, 2024', status: 'approved' },
];

const PlacementVerifications: React.FC = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-heading font-bold text-foreground">Verifications</h1>
      <p className="text-muted-foreground mt-1">Approve companies and job postings</p>
    </motion.div>
    <Card variant="elevated">
      <CardHeader><CardTitle>Pending Verifications</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {verifications.map((v) => (
          <div key={v.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">{v.company}</p>
                <p className="text-sm text-muted-foreground">{v.type} • {v.submitted}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={v.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                {v.status}
              </Badge>
              {v.status === 'pending' && (
                <>
                  <Button size="sm" variant="outline" className="text-green-600"><CheckCircle className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline" className="text-red-500"><XCircle className="w-4 h-4" /></Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default PlacementVerifications;
