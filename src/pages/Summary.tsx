import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, TrendingUp, Users, Clock, Activity, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

interface PipelineResponse {
  id: string;
  user_id: string;
  user_name: string;
  pipeline_data: any;
  status: string;
  created_at: string;
  updated_at: string;
}

const Summary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pipelines, setPipelines] = useState<PipelineResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('pipeline_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPipelines(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregate statistics
  const stats = {
    total: pipelines.length,
    completed: pipelines.filter(p => p.status === 'completed').length,
    inProgress: pipelines.filter(p => p.status === 'in_progress').length,
    draft: pipelines.filter(p => p.status === 'draft').length,
    uniqueUsers: new Set(pipelines.map(p => p.user_id)).size,
  };

  // Status distribution data
  const statusData = [
    { name: 'Completed', value: stats.completed, color: '#22c55e' },
    { name: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
    { name: 'Draft', value: stats.draft, color: '#6b7280' },
  ].filter(item => item.value > 0);

  // Pipeline creation timeline (last 7 days)
  const getTimelineData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: pipelines.filter(p => p.created_at.split('T')[0] === date).length,
    }));
  };

  // Most common analysis steps
  const getStepUsage = () => {
    const steps = [
      'dataEntry', 'qcStep', 'lodHandling', 'normalization', 'batchEffect',
      'outlierDetection', 'dataTransformation', 'exploratoryAnalysis',
      'groupComparison', 'statisticalModeling', 'multipleTestingCorrection',
      'powerAnalysis', 'sensitivityAnalysis', 'visualization', 'exportData'
    ];

    const stepLabels: Record<string, string> = {
      dataEntry: 'Data Entry',
      qcStep: 'Quality Control',
      lodHandling: 'LOD Handling',
      normalization: 'Normalization',
      batchEffect: 'Batch Effect',
      outlierDetection: 'Outlier Detection',
      dataTransformation: 'Transformation',
      exploratoryAnalysis: 'Exploratory',
      groupComparison: 'Group Comparison',
      statisticalModeling: 'Statistical Modeling',
      multipleTestingCorrection: 'Multiple Testing',
      powerAnalysis: 'Power Analysis',
      sensitivityAnalysis: 'Sensitivity',
      visualization: 'Visualization',
      exportData: 'Export'
    };

    return steps.map(step => {
      const count = pipelines.filter(p => p.pipeline_data?.[step] && Object.keys(p.pipeline_data[step]).length > 0).length;
      return {
        name: stepLabels[step] || step,
        count,
      };
    }).filter(item => item.count > 0).sort((a, b) => b.count - a.count).slice(0, 10);
  };

  // Get selected options breakdown for each step
  const getOptionBreakdown = () => {
    const breakdowns: Record<string, Record<string, number>> = {};

    pipelines.forEach(pipeline => {
      const data = pipeline.pipeline_data;

      // Data Entry - File Types
      if (data.dataEntry?.selectedFileTypes) {
        if (!breakdowns.dataEntry) breakdowns.dataEntry = {};
        data.dataEntry.selectedFileTypes.forEach((type: string) => {
          breakdowns.dataEntry[type] = (breakdowns.dataEntry[type] || 0) + 1;
        });
      }

      // QC Methods
      if (data.qc?.selectedMethods) {
        if (!breakdowns.qc) breakdowns.qc = {};
        data.qc.selectedMethods.forEach((method: string) => {
          breakdowns.qc[method] = (breakdowns.qc[method] || 0) + 1;
        });
      }

      // LOD Handling
      if (data.lodHandling?.selectedMethods) {
        if (!breakdowns.lodHandling) breakdowns.lodHandling = {};
        data.lodHandling.selectedMethods.forEach((method: string) => {
          breakdowns.lodHandling[method] = (breakdowns.lodHandling[method] || 0) + 1;
        });
      }

      // Normalization
      if (data.normalization?.selectedMethods) {
        if (!breakdowns.normalization) breakdowns.normalization = {};
        data.normalization.selectedMethods.forEach((method: string) => {
          breakdowns.normalization[method] = (breakdowns.normalization[method] || 0) + 1;
        });
      }

      // Batch Effect
      if (data.batchEffect?.selectedMethods) {
        if (!breakdowns.batchEffect) breakdowns.batchEffect = {};
        data.batchEffect.selectedMethods.forEach((method: string) => {
          breakdowns.batchEffect[method] = (breakdowns.batchEffect[method] || 0) + 1;
        });
      }

      // Outlier Detection
      if (data.outlierDetection?.selectedMethods) {
        if (!breakdowns.outlierDetection) breakdowns.outlierDetection = {};
        data.outlierDetection.selectedMethods.forEach((method: string) => {
          breakdowns.outlierDetection[method] = (breakdowns.outlierDetection[method] || 0) + 1;
        });
      }

      // Data Transformation
      if (data.dataTransformation?.selectedTransformations) {
        if (!breakdowns.dataTransformation) breakdowns.dataTransformation = {};
        data.dataTransformation.selectedTransformations.forEach((transform: string) => {
          breakdowns.dataTransformation[transform] = (breakdowns.dataTransformation[transform] || 0) + 1;
        });
      }

      // Exploratory Analysis
      if (data.exploratoryAnalysis?.selectedMethods) {
        if (!breakdowns.exploratoryAnalysis) breakdowns.exploratoryAnalysis = {};
        data.exploratoryAnalysis.selectedMethods.forEach((method: string) => {
          breakdowns.exploratoryAnalysis[method] = (breakdowns.exploratoryAnalysis[method] || 0) + 1;
        });
      }

      // Statistical Modeling
      if (data.statisticalModeling?.selectedMethods) {
        if (!breakdowns.statisticalModeling) breakdowns.statisticalModeling = {};
        data.statisticalModeling.selectedMethods.forEach((method: string) => {
          breakdowns.statisticalModeling[method] = (breakdowns.statisticalModeling[method] || 0) + 1;
        });
      }

      // Multiple Testing Correction
      if (data.multipleTestingCorrection?.selectedMethods) {
        if (!breakdowns.multipleTestingCorrection) breakdowns.multipleTestingCorrection = {};
        data.multipleTestingCorrection.selectedMethods.forEach((method: string) => {
          breakdowns.multipleTestingCorrection[method] = (breakdowns.multipleTestingCorrection[method] || 0) + 1;
        });
      }

      // Power Analysis
      if (data.powerAnalysis?.selectedMethods) {
        if (!breakdowns.powerAnalysis) breakdowns.powerAnalysis = {};
        data.powerAnalysis.selectedMethods.forEach((method: string) => {
          breakdowns.powerAnalysis[method] = (breakdowns.powerAnalysis[method] || 0) + 1;
        });
      }

      // Sensitivity Analysis
      if (data.sensitivityAnalysis?.selectedMethods) {
        if (!breakdowns.sensitivityAnalysis) breakdowns.sensitivityAnalysis = {};
        data.sensitivityAnalysis.selectedMethods.forEach((method: string) => {
          breakdowns.sensitivityAnalysis[method] = (breakdowns.sensitivityAnalysis[method] || 0) + 1;
        });
      }

      // Visualization
      if (data.visualization?.selectedTypes) {
        if (!breakdowns.visualization) breakdowns.visualization = {};
        data.visualization.selectedTypes.forEach((type: string) => {
          breakdowns.visualization[type] = (breakdowns.visualization[type] || 0) + 1;
        });
      }

      // Export Formats
      if (data.export?.selectedFormats) {
        if (!breakdowns.exportData) breakdowns.exportData = {};
        data.export.selectedFormats.forEach((format: string) => {
          breakdowns.exportData[format] = (breakdowns.exportData[format] || 0) + 1;
        });
      }
    });

    return breakdowns;
  };

  const optionBreakdowns = getOptionBreakdown();

  const stepLabels: Record<string, string> = {
    dataEntry: 'Data Entry - File Types',
    qc: 'Quality Control Methods',
    lodHandling: 'LOD Handling Methods',
    normalization: 'Normalization Methods',
    batchEffect: 'Batch Effect Methods',
    outlierDetection: 'Outlier Detection Methods',
    dataTransformation: 'Data Transformation Methods',
    exploratoryAnalysis: 'Exploratory Analysis Methods',
    statisticalModeling: 'Statistical Modeling Methods',
    multipleTestingCorrection: 'Multiple Testing Correction Methods',
    powerAnalysis: 'Power Analysis Methods',
    sensitivityAnalysis: 'Sensitivity Analysis Methods',
    visualization: 'Visualization Types',
    exportData: 'Export Formats'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Pipeline Summary</h1>
            <p className="text-muted-foreground">Aggregate analytics across all pipeline configurations</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pipelines</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pipeline Creation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Creation (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getTimelineData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Steps Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Most Used Analysis Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getStepUsage()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Option Breakdown */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Selected Options Breakdown</h2>
          <p className="text-muted-foreground mb-4">
            Detailed summary of all selected options across pipeline steps
          </p>
          
          {Object.entries(optionBreakdowns).map(([stepKey, options]) => (
            <Card key={stepKey}>
              <CardHeader>
                <CardTitle className="text-lg">{stepLabels[stepKey] || stepKey}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(options)
                    .sort((a, b) => b[1] - a[1])
                    .map(([option, count]) => (
                      <div 
                        key={option}
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                      >
                        <span className="text-sm font-medium">{option}</span>
                        <Badge variant="secondary">
                          {count} {count === 1 ? 'pipeline' : 'pipelines'}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(optionBreakdowns).length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No pipeline data available yet
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
