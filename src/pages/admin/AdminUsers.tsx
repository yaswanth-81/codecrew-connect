import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle, XCircle, Eye } from 'lucide-react';

const users = [
  { name: 'John Doe', email: 'john@university.edu', role: 'student', status: 'active' },
  { name: 'Jane Smith', email: 'jane@techcorp.com', role: 'recruiter', status: 'pending' },
  { name: 'Prof. Williams', email: 'williams@university.edu', role: 'faculty', status: 'active' },
];

const AdminUsers: React.FC = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-heading font-bold text-foreground">User Management</h1>
      <p className="text-muted-foreground mt-1">Manage platform users</p>
    </motion.div>
    <Card variant="elevated">
      <CardContent className="p-0">
        <table className="w-full">
          <thead><tr className="border-b"><th className="text-left p-4">User</th><th className="text-left p-4">Role</th><th className="text-left p-4">Status</th><th className="text-left p-4">Actions</th></tr></thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-4"><p className="font-medium">{u.name}</p><p className="text-sm text-muted-foreground">{u.email}</p></td>
                <td className="p-4"><Badge variant="secondary">{u.role}</Badge></td>
                <td className="p-4"><Badge className={u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>{u.status}</Badge></td>
                <td className="p-4"><div className="flex gap-2"><Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button><Button size="sm" variant="outline" className="text-green-600"><CheckCircle className="w-4 h-4" /></Button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
);

export default AdminUsers;
