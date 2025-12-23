import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase,
  Clock,
  Target,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const metrics = [
  { label: 'Total Applications', value: '242', change: '+18%', trend: 'up' },
  { label: 'Conversion Rate', value: '12.5%', change: '+2.3%', trend: 'up' },
  { label: 'Avg. Time to Hire', value: '18 days', change: '-3 days', trend: 'up' },
  { label: 'Active Postings', value: '8', change: '+2', trend: 'up' },
];

const jobPerformance = [
  { title: 'Frontend Developer Intern', applications: 45, interviews: 12, offers: 2 },
  { title: 'Software Engineer', applications: 78, interviews: 20, offers: 5 },
  { title: 'Data Science Intern', applications: 62, interviews: 15, offers: 3 },
  { title: 'Product Manager', applications: 34, interviews: 8, offers: 1 },
  { title: 'UX Designer', applications: 23, interviews: 6, offers: 1 },
];

const sourceBreakdown = [
  { source: 'Campus Portal', percentage: 45 },
  { source: 'LinkedIn', percentage: 25 },
  { source: 'Referrals', percentage: 15 },
  { source: 'Career Fairs', percentage: 10 },
  { source: 'Other', percentage: 5 },
];

const RecruiterAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your recruitment performance</p>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * index }}
          >
            <Card variant="elevated">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{metric.value}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                    {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {metric.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Job Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobPerformance.map((job, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground text-sm">{job.title}</p>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{job.applications}</span> applications
                      </span>
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{job.interviews}</span> interviews
                      </span>
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-green-600">{job.offers}</span> offers
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-primary rounded-full"
                        style={{ width: `${(job.offers / job.applications) * 100 * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Source Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Application Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sourceBreakdown.map((source, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{source.source}</span>
                      <span className="text-sm font-medium text-foreground">{source.percentage}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${source.percentage}%` }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                        className="h-full gradient-accent rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Quick Insights</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Campus portal driving highest quality candidates
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Time to hire improved by 15% this month
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    Referral hires have 20% higher retention
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterAnalytics;
