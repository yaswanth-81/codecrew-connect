import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Briefcase } from 'lucide-react';

const companies = [
  { name: 'TechCorp Inc.', industry: 'Technology', hires: 12, jobs: 5, status: 'active' },
  { name: 'InnovateTech', industry: 'Software', hires: 8, jobs: 3, status: 'active' },
  { name: 'DataDriven Co.', industry: 'Data Analytics', hires: 5, jobs: 2, status: 'active' },
  { name: 'CloudFirst', industry: 'Cloud Services', hires: 3, jobs: 1, status: 'pending' },
];

const PlacementCompanies: React.FC = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-heading font-bold text-foreground">Partner Companies</h1>
      <p className="text-muted-foreground mt-1">Manage industry partnerships</p>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {companies.map((c, i) => (
        <Card key={i} variant="interactive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Building2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.industry}</p>
              </div>
              <Badge className={c.status === 'active' ? 'bg-green-100 text-green-700 ml-auto' : 'bg-yellow-100 text-yellow-700 ml-auto'}>{c.status}</Badge>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{c.hires} hires</span>
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{c.jobs} active jobs</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default PlacementCompanies;
