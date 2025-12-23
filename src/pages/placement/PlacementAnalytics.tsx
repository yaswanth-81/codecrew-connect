import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Briefcase, GraduationCap, Building2 } from 'lucide-react';

const PlacementAnalytics: React.FC = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-heading font-bold text-foreground">Analytics Dashboard</h1>
      <p className="text-muted-foreground mt-1">Comprehensive placement statistics</p>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: 'Placement Rate', value: '87%', icon: TrendingUp, color: 'text-green-500' },
        { label: 'Avg Package', value: '$85K', icon: Briefcase, color: 'text-primary' },
        { label: 'Companies Visited', value: '45', icon: Building2, color: 'text-accent' },
      ].map((stat, i) => (
        <Card key={i} variant="elevated">
          <CardContent className="pt-6 flex items-center gap-4">
            <stat.icon className={`w-10 h-10 ${stat.color}`} />
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default PlacementAnalytics;
