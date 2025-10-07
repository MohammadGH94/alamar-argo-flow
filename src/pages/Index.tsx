import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, RotateCcw, LogOut, BarChart3, Save, LayoutDashboard } from "lucide-react";
import { UserInfoForm } from "@/components/UserInfoForm";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Form components
import { DataEntryForm } from '@/components/forms/DataEntryForm';
import { PowerAnalysisForm } from '@/components/forms/PowerAnalysisForm';
import { QCForm } from '@/components/forms/QCForm';
import { LODHandlingForm } from '@/components/forms/LODHandlingForm';
import { OutlierDetectionForm } from '@/components/forms/OutlierDetectionForm';
import { NormalizationForm } from '@/components/forms/NormalizationForm';
import { BatchEffectForm } from '@/components/forms/BatchEffectForm';
import { ExploratoryAnalysisForm } from '@/components/forms/ExploratoryAnalysisForm';
import { GroupComparisonForm } from '@/components/forms/GroupComparisonForm';
import { DataTransformationForm } from '@/components/forms/DataTransformationForm';
import { StatisticalModelingForm } from '@/components/forms/StatisticalModelingForm';
import { ComparatorsForm } from '@/components/forms/ComparatorsForm';
import { MultipleTestingCorrectionForm } from '@/components/forms/MultipleTestingCorrectionForm';
import { SensitivityAnalysisForm } from '@/components/forms/SensitivityAnalysisForm';
import { VisualizationForm } from '@/components/forms/VisualizationForm';
import { ExportForm } from '@/components/forms/ExportForm';

// Pipeline state interface
interface PipelineState {
  userInfo: {
    name: string;
    email: string;
  };
  dataEntry: {
    selectedFileTypes: string[];
    additionalRequirements: string;
  };
  powerAnalysis: {
    selectedMethod: string;
    selectedEffectSizes: string[];
    powerLevel: string;
    alphaLevel: string;
    customEffectSize: string;
    customMethods: string;
  };
  qc: {
    selectedQCSteps: string[];
    qualityThreshold: string;
    customQCSteps: string;
  };
  lodHandling: {
    selectedMethod: string;
    lodThreshold: string;
    customMethod: string;
  };
  outlierDetection: {
    selectedDetectionMethods: string[];
    selectedHandlingStrategies: string[];
    zScoreThreshold: string;
    iqrMultiplier: string;
    customDetectionMethods: string;
  };
  normalization: {
    selectedMethod: string;
    selectedBridgingOptions: string[];
    customMethod: string;
  };
  batchEffect: {
    selectedDetectionMethods: string[];
    selectedCorrectionMethod: string;
    selectedBatchVariables: string[];
    preservedVariables: string;
    customCorrectionMethod: string;
  };
  exploratoryAnalysis: {
    selectedMethods: string[];
    customMethods: string;
  };
  groupComparison: {
    numberOfGroups: string;
    timePoints: string;
    dataType: string;
    selectedModels: string[];
    useMachineLearning: boolean;
  };
  dataTransformation: {
    selectedTransformations: string[];
    customTransformations: string;
  };
  statisticalModeling: {
    selectedDiagnostics: string[];
    customDiagnostics: string;
  };
  comparators: {
    selectedContrasts: string[];
    selectedExtractionValues: string[];
    customContrasts: string;
    customExtractionValues: string;
  };
  multipleTestingCorrection: {
    selectedMethod: string;
    selectedAdditionalMethods: string[];
    customMethods: string;
  };
  sensitivityAnalysis: {
    selectedMethods: string[];
    selectedParameterTypes: string[];
    selectedRobustnessChecks: string[];
    parameterRanges: string;
    stabilityThreshold: string;
    customMethods: string;
  };
  visualization: {
    selectedGraphs: string[];
    selectedTables: string[];
    customVisualizations: string;
    customTables: string;
  };
  export: {
    selectedFormats: string[];
    selectedReportSections: string[];
    customExportOptions: string;
    customReportSections: string;
  };
}

const createInitialPipelineState = (): PipelineState => ({
  userInfo: {
    name: '',
    email: ''
  },
  dataEntry: {
    selectedFileTypes: [],
    additionalRequirements: ''
  },
  powerAnalysis: {
    selectedMethod: '',
    selectedEffectSizes: [],
    powerLevel: '0.8',
    alphaLevel: '0.05',
    customEffectSize: '',
    customMethods: ''
  },
  qc: {
    selectedQCSteps: [],
    qualityThreshold: '',
    customQCSteps: ''
  },
  lodHandling: {
    selectedMethod: '',
    lodThreshold: '',
    customMethod: ''
  },
  outlierDetection: {
    selectedDetectionMethods: [],
    selectedHandlingStrategies: [],
    zScoreThreshold: '3',
    iqrMultiplier: '1.5',
    customDetectionMethods: ''
  },
  normalization: {
    selectedMethod: '',
    selectedBridgingOptions: [],
    customMethod: ''
  },
  batchEffect: {
    selectedDetectionMethods: [],
    selectedCorrectionMethod: '',
    selectedBatchVariables: [],
    preservedVariables: '',
    customCorrectionMethod: ''
  },
  exploratoryAnalysis: {
    selectedMethods: [],
    customMethods: ''
  },
  groupComparison: {
    numberOfGroups: '2',
    timePoints: '1',
    dataType: 'cross-sectional',
    selectedModels: [],
    useMachineLearning: false
  },
  dataTransformation: {
    selectedTransformations: [],
    customTransformations: ''
  },
  statisticalModeling: {
    selectedDiagnostics: [],
    customDiagnostics: ''
  },
  comparators: {
    selectedContrasts: [],
    selectedExtractionValues: [],
    customContrasts: '',
    customExtractionValues: ''
  },
  multipleTestingCorrection: {
    selectedMethod: '',
    selectedAdditionalMethods: [],
    customMethods: ''
  },
  sensitivityAnalysis: {
    selectedMethods: [],
    selectedParameterTypes: [],
    selectedRobustnessChecks: [],
    parameterRanges: '',
    stabilityThreshold: '10',
    customMethods: ''
  },
  visualization: {
    selectedGraphs: [],
    selectedTables: [],
    customVisualizations: '',
    customTables: ''
  },
  export: {
    selectedFormats: [],
    selectedReportSections: [],
    customExportOptions: '',
    customReportSections: ''
  }
});

const Index = () => {
  const [currentStep, setCurrentStep] = useState(-1); // Start with user info form (-1)
  const [editingPipelineId, setEditingPipelineId] = useState<string | null>(null);
  const [pipelineState, setPipelineState] = useState<PipelineState>(() => createInitialPipelineState());
  const [userProfile, setUserProfile] = useState<any>(null);

  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const skipNextEditLoad = useRef(false);

  useEffect(() => {
    const initializeUser = async () => {
      if (!loading && !user) {
        navigate('/auth');
        return;
      }

      if (user && !userProfile) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile) {
          setUserProfile(profile);
          // Auto-fill user info from profile for new pipelines
          if (!editingPipelineId && !pipelineState.userInfo.name) {
            setPipelineState(prev => ({
              ...prev,
              userInfo: {
                name: profile.name || '',
                email: profile.email || ''
              }
            }));
            // Skip user info form if profile exists
            if (profile.name) {
              setCurrentStep(0);
              toast({
                title: "New pipeline started",
                description: "Creating a new pipeline configuration.",
              });
            }
          }
        }
      }
    };

    initializeUser();
  }, [user, loading, navigate, userProfile, editingPipelineId, pipelineState.userInfo.name, toast]);

  // Load pipeline data if editing
  useEffect(() => {
    const loadPipelineForEditing = async () => {
      const editId = searchParams.get('edit');
      if (skipNextEditLoad.current) {
        skipNextEditLoad.current = false;
        return;
      }

      if (!editId || !user || editId === editingPipelineId) return;

      try {
        const { data, error } = await supabase
          .from('pipeline_responses')
          .select('*')
          .eq('id', editId)
          .single();

        if (error) throw error;

        if (data) {
          setEditingPipelineId(editId);
          setPipelineState(data.pipeline_data as unknown as PipelineState);
          setCurrentStep(0); // Start at first step when editing
          
          toast({
            title: "Pipeline loaded",
            description: `Loaded ${data.status} pipeline for editing.`,
          });
        }
      } catch (error) {
        console.error('Error loading pipeline:', error);
        toast({
          title: "Error loading pipeline",
          description: "Could not load the pipeline. Please try again.",
          variant: "destructive"
        });
      }
    };

    if (!loading && user) {
      loadPipelineForEditing();
    }
  }, [user, loading, searchParams, toast, editingPipelineId]);

  const savePipelineData = async (status: 'draft' | 'completed' = 'draft'): Promise<boolean> => {
    if (!user || !pipelineState.userInfo.name) {
      console.error('Cannot save: No user or user name');
      return false;
    }

    try {
      console.log('Saving pipeline data...', { status, userId: user.id, editingId: editingPipelineId });

      const { data, error } = await supabase.functions.invoke('save-pipeline', {
        body: {
          pipelineData: pipelineState,
          userName: pipelineState.userInfo.name,
          status,
          pipelineId: editingPipelineId ?? undefined
        }
      });

      if (error) {
        console.error('Edge function returned error:', error);
        throw error;
      }

      const savedPipeline = data?.data as { id?: string } | null | undefined;

      if (savedPipeline?.id) {
        setEditingPipelineId(savedPipeline.id);
      }

      toast({
        title: status === 'completed' ? "Pipeline completed!" : "Progress saved",
        description: status === 'completed'
          ? "Your pipeline configuration has been completed and saved."
          : "Your progress has been saved.",
      });

      return true;
    } catch (error) {
      console.error('Error saving pipeline:', error);
      toast({
        title: "Error saving progress",
        description: "There was an issue saving your progress. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleUserInfoSubmit = (userInfo: { name: string; email: string }) => {
    setPipelineState(prev => ({
      ...prev,
      userInfo
    }));
    setCurrentStep(0);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    </div>;
  }

  if (!user) {
    return null;
  }

  // Show user info form first
  if (currentStep === -1) {
    return (
      <div className="min-h-screen bg-background p-4">
        <header className="mb-8">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Alamar Argo</h1>
              <p className="text-muted-foreground">Analytical Pipeline Builder</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>
        
        <UserInfoForm onSubmit={handleUserInfoSubmit} />
      </div>
    );
  }

  const steps = [
    {
      title: "Data Entry",
      description: "Configure data input and file type requirements",
      component: (
        <DataEntryForm
          selectedFileTypes={pipelineState.dataEntry.selectedFileTypes}
          onFileTypesChange={(types) => 
            setPipelineState(prev => ({
              ...prev,
              dataEntry: { ...prev.dataEntry, selectedFileTypes: types }
            }))
          }
          additionalRequirements={pipelineState.dataEntry.additionalRequirements}
          onAdditionalRequirementsChange={(requirements) =>
            setPipelineState(prev => ({
              ...prev,
              dataEntry: { ...prev.dataEntry, additionalRequirements: requirements }
            }))
          }
        />
      )
    },
    {
      title: "Power Analysis & Sample Size Calculation",
      description: "Determine statistical power and calculate required sample sizes",
      component: (
        <PowerAnalysisForm
          selectedMethod={pipelineState.powerAnalysis.selectedMethod}
          onMethodChange={(method) =>
            setPipelineState(prev => ({
              ...prev,
              powerAnalysis: { ...prev.powerAnalysis, selectedMethod: method }
            }))
          }
          selectedEffectSizes={pipelineState.powerAnalysis.selectedEffectSizes}
          onEffectSizesChange={(sizes) =>
            setPipelineState(prev => ({
              ...prev,
              powerAnalysis: { ...prev.powerAnalysis, selectedEffectSizes: sizes }
            }))
          }
          powerLevel={pipelineState.powerAnalysis.powerLevel}
          onPowerLevelChange={(level) =>
            setPipelineState(prev => ({
              ...prev,
              powerAnalysis: { ...prev.powerAnalysis, powerLevel: level }
            }))
          }
          alphaLevel={pipelineState.powerAnalysis.alphaLevel}
          onAlphaLevelChange={(level) =>
            setPipelineState(prev => ({
              ...prev,
              powerAnalysis: { ...prev.powerAnalysis, alphaLevel: level }
            }))
          }
          customEffectSize={pipelineState.powerAnalysis.customEffectSize}
          onCustomEffectSizeChange={(size) =>
            setPipelineState(prev => ({
              ...prev,
              powerAnalysis: { ...prev.powerAnalysis, customEffectSize: size }
            }))
          }
          customMethods={pipelineState.powerAnalysis.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              powerAnalysis: { ...prev.powerAnalysis, customMethods: methods }
            }))
          }
        />
      )
    },
    {
      title: "Quality Control",
      description: "Define quality control measures and thresholds",
      component: (
        <QCForm
          selectedQCSteps={pipelineState.qc.selectedQCSteps}
          onQCStepsChange={(steps) =>
            setPipelineState(prev => ({
              ...prev,
              qc: { ...prev.qc, selectedQCSteps: steps }
            }))
          }
          qualityThreshold={pipelineState.qc.qualityThreshold}
          onQualityThresholdChange={(threshold) =>
            setPipelineState(prev => ({
              ...prev,
              qc: { ...prev.qc, qualityThreshold: threshold }
            }))
          }
          customQCSteps={pipelineState.qc.customQCSteps}
          onCustomQCStepsChange={(steps) =>
            setPipelineState(prev => ({
              ...prev,
              qc: { ...prev.qc, customQCSteps: steps }
            }))
          }
        />
      )
    },
    {
      title: "LOD Handling",
      description: "Configure limit of detection handling strategies",
      component: (
        <LODHandlingForm
          selectedMethod={pipelineState.lodHandling.selectedMethod}
          onMethodChange={(method) =>
            setPipelineState(prev => ({
              ...prev,
              lodHandling: { ...prev.lodHandling, selectedMethod: method }
            }))
          }
          lodThreshold={pipelineState.lodHandling.lodThreshold}
          onLODThresholdChange={(threshold) =>
            setPipelineState(prev => ({
              ...prev,
              lodHandling: { ...prev.lodHandling, lodThreshold: threshold }
            }))
          }
          customMethod={pipelineState.lodHandling.customMethod}
          onCustomMethodChange={(method) =>
            setPipelineState(prev => ({
              ...prev,
              lodHandling: { ...prev.lodHandling, customMethod: method }
            }))
          }
        />
      )
    },
    {
      title: "Outlier Detection & Handling",
      description: "Identify and handle outliers in your data",
      component: (
        <OutlierDetectionForm
          selectedDetectionMethods={pipelineState.outlierDetection.selectedDetectionMethods}
          onDetectionMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              outlierDetection: { ...prev.outlierDetection, selectedDetectionMethods: methods }
            }))
          }
          selectedHandlingStrategies={pipelineState.outlierDetection.selectedHandlingStrategies}
          onHandlingStrategiesChange={(strategies) =>
            setPipelineState(prev => ({
              ...prev,
              outlierDetection: { ...prev.outlierDetection, selectedHandlingStrategies: strategies }
            }))
          }
          zScoreThreshold={pipelineState.outlierDetection.zScoreThreshold}
          onZScoreThresholdChange={(threshold) =>
            setPipelineState(prev => ({
              ...prev,
              outlierDetection: { ...prev.outlierDetection, zScoreThreshold: threshold }
            }))
          }
          iqrMultiplier={pipelineState.outlierDetection.iqrMultiplier}
          onIQRMultiplierChange={(multiplier) =>
            setPipelineState(prev => ({
              ...prev,
              outlierDetection: { ...prev.outlierDetection, iqrMultiplier: multiplier }
            }))
          }
          customDetectionMethods={pipelineState.outlierDetection.customDetectionMethods}
          onCustomDetectionMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              outlierDetection: { ...prev.outlierDetection, customDetectionMethods: methods }
            }))
          }
        />
      )
    },
    {
      title: "Bridging & Normalization",
      description: "Configure data bridging and normalization methods",
      component: (
        <NormalizationForm
          selectedMethod={pipelineState.normalization.selectedMethod}
          onMethodChange={(method) =>
            setPipelineState(prev => ({
              ...prev,
              normalization: { ...prev.normalization, selectedMethod: method }
            }))
          }
          selectedBridgingOptions={pipelineState.normalization.selectedBridgingOptions}
          onBridgingOptionsChange={(options) =>
            setPipelineState(prev => ({
              ...prev,
              normalization: { ...prev.normalization, selectedBridgingOptions: options }
            }))
          }
          customMethod={pipelineState.normalization.customMethod}
          onCustomMethodChange={(method) =>
            setPipelineState(prev => ({
              ...prev,
              normalization: { ...prev.normalization, customMethod: method }
            }))
          }
        />
      )
    },
    {
      title: "Batch Effect Assessment & Correction",
      description: "Detect and correct for batch effects in your data",
      component: (
        <BatchEffectForm
          selectedDetectionMethods={pipelineState.batchEffect.selectedDetectionMethods}
          onDetectionMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              batchEffect: { ...prev.batchEffect, selectedDetectionMethods: methods }
            }))
          }
          selectedCorrectionMethod={pipelineState.batchEffect.selectedCorrectionMethod}
          onCorrectionMethodChange={(method) =>
            setPipelineState(prev => ({
              ...prev,
              batchEffect: { ...prev.batchEffect, selectedCorrectionMethod: method }
            }))
          }
          selectedBatchVariables={pipelineState.batchEffect.selectedBatchVariables}
          onBatchVariablesChange={(variables) =>
            setPipelineState(prev => ({
              ...prev,
              batchEffect: { ...prev.batchEffect, selectedBatchVariables: variables }
            }))
          }
          preservedVariables={pipelineState.batchEffect.preservedVariables}
          onPreservedVariablesChange={(variables) =>
            setPipelineState(prev => ({
              ...prev,
              batchEffect: { ...prev.batchEffect, preservedVariables: variables }
            }))
          }
          customCorrectionMethod={pipelineState.batchEffect.customCorrectionMethod}
          onCustomCorrectionMethodChange={(method) =>
            setPipelineState(prev => ({
              ...prev,
              batchEffect: { ...prev.batchEffect, customCorrectionMethod: method }
            }))
          }
        />
      )
    },
    {
      title: "Exploratory Analysis",
      description: "Define exploratory data analysis methods",
      component: (
        <ExploratoryAnalysisForm
          selectedMethods={pipelineState.exploratoryAnalysis.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              exploratoryAnalysis: { ...prev.exploratoryAnalysis, selectedMethods: methods }
            }))
          }
          customMethods={pipelineState.exploratoryAnalysis.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              exploratoryAnalysis: { ...prev.exploratoryAnalysis, customMethods: methods }
            }))
          }
        />
      )
    },
    {
      title: "Group Comparison",
      description: "Configure group comparison and study design parameters",
      component: (
        <GroupComparisonForm
          numberOfGroups={pipelineState.groupComparison.numberOfGroups}
          onNumberOfGroupsChange={(groups) =>
            setPipelineState(prev => ({
              ...prev,
              groupComparison: { ...prev.groupComparison, numberOfGroups: groups }
            }))
          }
          timePoints={pipelineState.groupComparison.timePoints}
          onTimePointsChange={(points) =>
            setPipelineState(prev => ({
              ...prev,
              groupComparison: { ...prev.groupComparison, timePoints: points }
            }))
          }
          dataType={pipelineState.groupComparison.dataType}
          onDataTypeChange={(type) =>
            setPipelineState(prev => ({
              ...prev,
              groupComparison: { ...prev.groupComparison, dataType: type }
            }))
          }
          selectedModels={pipelineState.groupComparison.selectedModels}
          onModelsChange={(models) =>
            setPipelineState(prev => ({
              ...prev,
              groupComparison: { ...prev.groupComparison, selectedModels: models }
            }))
          }
          useMachineLearning={pipelineState.groupComparison.useMachineLearning}
          onMachineLearningChange={(use) =>
            setPipelineState(prev => ({
              ...prev,
              groupComparison: { ...prev.groupComparison, useMachineLearning: use }
            }))
          }
        />
      )
    },
    {
      title: "Data Transformation",
      description: "Select and configure data transformation methods",
      component: (
        <DataTransformationForm
          selectedTransformations={pipelineState.dataTransformation.selectedTransformations}
          onTransformationsChange={(transformations) =>
            setPipelineState(prev => ({
              ...prev,
              dataTransformation: { ...prev.dataTransformation, selectedTransformations: transformations }
            }))
          }
          customTransformations={pipelineState.dataTransformation.customTransformations}
          onCustomTransformationsChange={(transformations) =>
            setPipelineState(prev => ({
              ...prev,
              dataTransformation: { ...prev.dataTransformation, customTransformations: transformations }
            }))
          }
        />
      )
    },
    {
      title: "Statistical Modeling",
      description: "Configure statistical modeling approaches",
      component: (
        <StatisticalModelingForm
          selectedDiagnostics={pipelineState.statisticalModeling.selectedDiagnostics}
          onDiagnosticsChange={(diagnostics) =>
            setPipelineState(prev => ({
              ...prev,
              statisticalModeling: { ...prev.statisticalModeling, selectedDiagnostics: diagnostics }
            }))
          }
          customDiagnostics={pipelineState.statisticalModeling.customDiagnostics}
          onCustomDiagnosticsChange={(diagnostics) =>
            setPipelineState(prev => ({
              ...prev,
              statisticalModeling: { ...prev.statisticalModeling, customDiagnostics: diagnostics }
            }))
          }
        />
      )
    },
    {
      title: "Comparators",
      description: "Define comparison strategies and reference groups",
      component: (
        <ComparatorsForm
          selectedContrasts={pipelineState.comparators.selectedContrasts}
          onContrastsChange={(contrasts) =>
            setPipelineState(prev => ({
              ...prev,
              comparators: { ...prev.comparators, selectedContrasts: contrasts }
            }))
          }
          selectedExtractionValues={pipelineState.comparators.selectedExtractionValues}
          onExtractionValuesChange={(values) =>
            setPipelineState(prev => ({
              ...prev,
              comparators: { ...prev.comparators, selectedExtractionValues: values }
            }))
          }
          customContrasts={pipelineState.comparators.customContrasts}
          onCustomContrastsChange={(contrasts) =>
            setPipelineState(prev => ({
              ...prev,
              comparators: { ...prev.comparators, customContrasts: contrasts }
            }))
          }
          customExtractionValues={pipelineState.comparators.customExtractionValues}
          onCustomExtractionValuesChange={(values) =>
            setPipelineState(prev => ({
              ...prev,
              comparators: { ...prev.comparators, customExtractionValues: values }
            }))
          }
        />
      )
    },
    {
      title: "Multiple Testing Correction",
      description: "Configure multiple testing correction methods",
      component: (
        <MultipleTestingCorrectionForm
          selectedMethod={pipelineState.multipleTestingCorrection.selectedMethod}
          onMethodChange={(method) =>
            setPipelineState(prev => ({
              ...prev,
              multipleTestingCorrection: { ...prev.multipleTestingCorrection, selectedMethod: method }
            }))
          }
          selectedAdditionalMethods={pipelineState.multipleTestingCorrection.selectedAdditionalMethods}
          onAdditionalMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              multipleTestingCorrection: { ...prev.multipleTestingCorrection, selectedAdditionalMethods: methods }
            }))
          }
          customMethods={pipelineState.multipleTestingCorrection.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              multipleTestingCorrection: { ...prev.multipleTestingCorrection, customMethods: methods }
            }))
          }
        />
      )
    },
    {
      title: "Sensitivity Analysis",
      description: "Configure sensitivity analysis and robustness testing",
      component: (
        <SensitivityAnalysisForm
          selectedMethods={pipelineState.sensitivityAnalysis.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              sensitivityAnalysis: { ...prev.sensitivityAnalysis, selectedMethods: methods }
            }))
          }
          selectedParameterTypes={pipelineState.sensitivityAnalysis.selectedParameterTypes}
          onParameterTypesChange={(types) =>
            setPipelineState(prev => ({
              ...prev,
              sensitivityAnalysis: { ...prev.sensitivityAnalysis, selectedParameterTypes: types }
            }))
          }
          selectedRobustnessChecks={pipelineState.sensitivityAnalysis.selectedRobustnessChecks}
          onRobustnessChecksChange={(checks) =>
            setPipelineState(prev => ({
              ...prev,
              sensitivityAnalysis: { ...prev.sensitivityAnalysis, selectedRobustnessChecks: checks }
            }))
          }
          parameterRanges={pipelineState.sensitivityAnalysis.parameterRanges}
          onParameterRangesChange={(ranges) =>
            setPipelineState(prev => ({
              ...prev,
              sensitivityAnalysis: { ...prev.sensitivityAnalysis, parameterRanges: ranges }
            }))
          }
          stabilityThreshold={pipelineState.sensitivityAnalysis.stabilityThreshold}
          onStabilityThresholdChange={(threshold) =>
            setPipelineState(prev => ({
              ...prev,
              sensitivityAnalysis: { ...prev.sensitivityAnalysis, stabilityThreshold: threshold }
            }))
          }
          customMethods={pipelineState.sensitivityAnalysis.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              sensitivityAnalysis: { ...prev.sensitivityAnalysis, customMethods: methods }
            }))
          }
        />
      )
    },
    {
      title: "Visualization",
      description: "Select visualization types and configure output formats",
      component: (
        <VisualizationForm
          selectedGraphs={pipelineState.visualization.selectedGraphs}
          onGraphsChange={(graphs) =>
            setPipelineState(prev => ({
              ...prev,
              visualization: { ...prev.visualization, selectedGraphs: graphs }
            }))
          }
          selectedTables={pipelineState.visualization.selectedTables}
          onTablesChange={(tables) =>
            setPipelineState(prev => ({
              ...prev,
              visualization: { ...prev.visualization, selectedTables: tables }
            }))
          }
          customVisualizations={pipelineState.visualization.customVisualizations}
          onCustomVisualizationsChange={(visualizations) =>
            setPipelineState(prev => ({
              ...prev,
              visualization: { ...prev.visualization, customVisualizations: visualizations }
            }))
          }
          customTables={pipelineState.visualization.customTables}
          onCustomTablesChange={(tables) =>
            setPipelineState(prev => ({
              ...prev,
              visualization: { ...prev.visualization, customTables: tables }
            }))
          }
        />
      )
    },
    {
      title: "Export",
      description: "Configure export formats and report generation",
      component: (
        <ExportForm
          selectedFormats={pipelineState.export.selectedFormats}
          onFormatsChange={(formats) =>
            setPipelineState(prev => ({
              ...prev,
              export: { ...prev.export, selectedFormats: formats }
            }))
          }
          selectedReportSections={pipelineState.export.selectedReportSections}
          onReportSectionsChange={(sections) =>
            setPipelineState(prev => ({
              ...prev,
              export: { ...prev.export, selectedReportSections: sections }
            }))
          }
          customExportOptions={pipelineState.export.customExportOptions}
          onCustomExportOptionsChange={(options) =>
            setPipelineState(prev => ({
              ...prev,
              export: { ...prev.export, customExportOptions: options }
            }))
          }
          customReportSections={pipelineState.export.customReportSections}
          onCustomReportSectionsChange={(sections) =>
            setPipelineState(prev => ({
              ...prev,
              export: { ...prev.export, customReportSections: sections }
            }))
          }
        />
      )
    }
  ];

  const navigateToStep = async (targetStep: number) => {
    const clampedStep = Math.max(-1, Math.min(targetStep, steps.length));

    if (clampedStep === currentStep) {
      return;
    }

    if (clampedStep > currentStep) {
      const status = clampedStep === steps.length ? 'completed' : 'draft';
      const saved = await savePipelineData(status);
      if (!saved) {
        return;
      }
    }

    setCurrentStep(clampedStep);
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      await navigateToStep(currentStep + 1);
    }
  };

  const handlePrevious = async () => {
    await navigateToStep(currentStep - 1);
  };

  const handleRestart = async () => {
    skipNextEditLoad.current = true;
    setSearchParams({}, { replace: true });
    setEditingPipelineId(null);
    
    // Reset to initial state
    const initialState = createInitialPipelineState();
    
    // Pre-fill user info from profile if available
    if (userProfile?.name) {
      initialState.userInfo = {
        name: userProfile.name || '',
        email: userProfile.email || ''
      };
      setPipelineState(initialState);
      setCurrentStep(0); // Skip user info form
      toast({
        title: "New pipeline started",
        description: "Ready to configure a new analytical pipeline.",
      });
    } else {
      setPipelineState(initialState);
      setCurrentStep(-1);
    }
    
    navigate('/', { replace: true });
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alamar Argo</h1>
            <p className="text-muted-foreground">
              Welcome, {pipelineState.userInfo.name} - Configure your analytical pipeline
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="outline" onClick={() => savePipelineData('draft')}>
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pipeline Configuration Progress</h2>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    void navigateToStep(index);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-accent hover:shadow-sm cursor-pointer group"
                  title={step.title}
                >
                  {getStepStatus(index) === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : getStepStatus(index) === 'current' ? (
                    <Circle className="h-5 w-5 text-blue-500 fill-current" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                  <Badge 
                    variant={getStepStatus(index) === 'current' ? 'default' : 'secondary'}
                  >
                    {index + 1}
                  </Badge>
                  <span className={`text-xs font-medium ${
                    getStepStatus(index) === 'current' 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  } group-hover:text-foreground transition-colors`}>
                    {step.title}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className="w-4 h-0.5 bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep === steps.length ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                🎉 Pipeline Configuration Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Your analytical pipeline has been successfully configured with all {steps.length} steps.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => savePipelineData('completed')} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" />
                  Mark as Complete
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
                <Button variant="outline" onClick={handleRestart}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Configure New Pipeline
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {currentStep + 1}
                </span>
                {steps[currentStep].title}
              </CardTitle>
              <p className="text-muted-foreground ml-11">
                {steps[currentStep].description}
              </p>
            </CardHeader>
            <CardContent>
              {steps[currentStep].component}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === -1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={currentStep >= steps.length}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;