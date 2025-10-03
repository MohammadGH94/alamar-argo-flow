import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  LogOut,
  Home,
  Plus,
  Trash2
} from 'lucide-react';

interface PipelineResponse {
  id: string;
  user_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  pipeline_data: any;
}

interface DashboardStats {
  totalResponses: number;
  completedResponses: number;
  draftResponses: number;
  uniqueUsers: number;
}

export default function Dashboard() {
  const [responses, setResponses] = useState<PipelineResponse[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      setUserProfile(profile);
      await loadDashboardData();
    };

    checkAuth();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get all pipeline responses (admin view or user's own responses)
      const { data: responsesData, error } = await supabase
        .from('pipeline_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setResponses(responsesData || []);

      // Calculate stats
      const totalResponses = responsesData?.length || 0;
      const completedResponses = responsesData?.filter(r => r.status === 'completed').length || 0;
      const draftResponses = responsesData?.filter(r => r.status === 'draft').length || 0;
      const uniqueUsers = new Set(responsesData?.map(r => r.user_name)).size || 0;

      setStats({
        totalResponses,
        completedResponses,
        draftResponses,
        uniqueUsers
      });
    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewPipeline = () => {
    // Start a brand-new pipeline in the builder without pre-creating a DB row.
    // A new record will be created on the first save from the builder.
    navigate('/');
  };

  const handleDeletePipeline = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('pipeline_responses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Pipeline deleted",
        description: "The pipeline configuration has been removed."
      });

      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error deleting pipeline",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStepProgress = (pipelineData: any) => {
    const totalSteps = 16;
    let completedSteps = 0;
    
    // Count non-empty form sections
    if (pipelineData.dataEntry?.selectedFileTypes?.length > 0) completedSteps++;
    if (pipelineData.powerAnalysis?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.qc?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.lodHandling?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.outlierDetection?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.normalization?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.batchEffect?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.exploratoryAnalysis?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.groupComparison?.numberOfGroups > 0) completedSteps++;
    if (pipelineData.dataTransformation?.selectedTransformations?.length > 0) completedSteps++;
    if (pipelineData.statisticalModeling?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.comparators?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.multipleTestingCorrection?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.sensitivityAnalysis?.selectedMethods?.length > 0) completedSteps++;
    if (pipelineData.visualization?.selectedTypes?.length > 0) completedSteps++;
    if (pipelineData.export?.selectedFormats?.length > 0) completedSteps++;

    return Math.round((completedSteps / totalSteps) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Pipeline Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {userProfile?.name || 'User'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleNewPipeline}>
              <Plus className="h-4 w-4 mr-2" />
              New Pipeline
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Responses</p>
                  <p className="text-2xl font-bold">{stats?.totalResponses || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats?.completedResponses || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{stats?.draftResponses || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Unique Users</p>
                  <p className="text-2xl font-bold">{stats?.uniqueUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Pipeline Configurations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {responses.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pipeline configurations yet</p>
                <Button className="mt-4" onClick={handleNewPipeline}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Pipeline
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {responses.map((response) => (
                  <div 
                    key={response.id} 
                    className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => navigate(`/?edit=${response.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{response.user_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created: {formatDate(response.created_at)}
                        </p>
                        {response.updated_at !== response.created_at && (
                          <p className="text-sm text-muted-foreground">
                            Updated: {formatDate(response.updated_at)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={response.status === 'completed' ? 'default' : 'secondary'}>
                          {response.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {getStepProgress(response.pipeline_data)}% complete
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => handleDeletePipeline(response.id, e)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <div>
                        File Types: {response.pipeline_data.dataEntry?.selectedFileTypes?.length || 0}
                      </div>
                      <div>
                        QC Methods: {response.pipeline_data.qc?.selectedMethods?.length || 0}
                      </div>
                      <div>
                        Analysis Methods: {response.pipeline_data.exploratoryAnalysis?.selectedMethods?.length || 0}
                      </div>
                      <div>
                        Visualizations: {response.pipeline_data.visualization?.selectedTypes?.length || 0}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-primary font-medium">
                      Click to {response.status === 'completed' ? 'view' : 'continue editing'} →
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}