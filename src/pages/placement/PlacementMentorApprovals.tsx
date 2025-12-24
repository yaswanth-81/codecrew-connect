import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen, 
  Loader2,
  Mail,
  Building2,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface FacultyWithProfile {
  id: string;
  user_id: string;
  department: string | null;
  designation: string | null;
  employee_id: string | null;
  is_approved: boolean | null;
  created_at: string;
  profile: {
    full_name: string;
    email: string;
  } | null;
}

const PlacementMentorApprovals: React.FC = () => {
  const [facultyList, setFacultyList] = useState<FacultyWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPendingFaculty = async () => {
    try {
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (facultyError) throw facultyError;

      // Fetch profiles for each faculty
      const facultyWithProfiles = await Promise.all(
        (facultyData || []).map(async (faculty) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', faculty.user_id)
            .single();

          return {
            ...faculty,
            profile: profileData,
          };
        })
      );

      setFacultyList(facultyWithProfiles);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingFaculty();
  }, []);

  const handleApproval = async (faculty: FacultyWithProfile, approve: boolean) => {
    setProcessingId(faculty.id);

    try {
      const { error } = await supabase
        .from('faculty_profiles')
        .update({ is_approved: approve })
        .eq('id', faculty.id);

      if (error) throw error;

      // Send email notification
      if (faculty.profile?.email) {
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'mentor_approved',
            recipientEmail: faculty.profile.email,
            recipientName: faculty.profile.full_name || 'Faculty Member',
            data: {
              message: approve ? 'Your account has been approved' : 'Your account has been rejected',
            },
          },
        });
      }

      toast({
        title: approve ? 'Faculty Approved' : 'Faculty Rejected',
        description: `${faculty.profile?.full_name || 'Faculty member'} has been ${approve ? 'approved' : 'rejected'}.`,
      });

      fetchPendingFaculty();
    } catch (error) {
      console.error('Error updating faculty approval:', error);
      toast({
        title: 'Error',
        description: 'Failed to update faculty status.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingFaculty = facultyList.filter(f => !f.is_approved);
  const approvedFaculty = facultyList.filter(f => f.is_approved);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-foreground">Faculty/Mentor Approvals</h1>
        <p className="text-muted-foreground mt-1">Approve or reject faculty and mentor registrations</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{pendingFaculty.length}</p>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{approvedFaculty.length}</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-4 text-center">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{facultyList.length}</p>
            <p className="text-sm text-muted-foreground">Total Faculty</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pending Approvals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Pending Faculty Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingFaculty.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <p className="text-muted-foreground">No pending approvals</p>
              </div>
            ) : (
              pendingFaculty.map((faculty, index) => (
                <motion.div
                  key={faculty.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {faculty.profile?.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <p className="font-semibold text-foreground">
                          {faculty.profile?.full_name || 'Unknown'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {faculty.profile?.email || 'No email'}
                        </span>
                        {faculty.department && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {faculty.department}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Registered: {format(new Date(faculty.created_at), 'MMM dd, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-yellow-100 text-yellow-700">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="accent"
                        disabled={processingId === faculty.id}
                        onClick={() => handleApproval(faculty, true)}
                      >
                        {processingId === faculty.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-600"
                        disabled={processingId === faculty.id}
                        onClick={() => handleApproval(faculty, false)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Approved Faculty */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Approved Faculty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {approvedFaculty.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No approved faculty yet</p>
              </div>
            ) : (
              approvedFaculty.map((faculty, index) => (
                <motion.div
                  key={faculty.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                      {faculty.profile?.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {faculty.profile?.full_name || 'Unknown'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {faculty.designation || 'Faculty'} • {faculty.department || 'Department N/A'}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                  </Badge>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PlacementMentorApprovals;
