import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, RotateCcw, LogOut, BarChart3, Save } from "lucide-react";
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
    selectedMethods: string[];
    effectSize: string;
    powerLevel: string;
    alphaLevel: string;
    customMethods: string;
  };
  qc: {
    selectedMethods: string[];
    qualityThreshold: string;
    customMethods: string;
  };
  lodHandling: {
    selectedMethods: string[];
    threshold: string;
    customMethods: string;
  };
  outlierDetection: {
    selectedMethods: string[];
    handlingStrategies: string[];
    zScoreThreshold: string;
    iqrMultiplier: string;
    customMethods: string;
  };
  normalization: {
    selectedMethods: string[];
    referenceGroup: string;
    customMethods: string;
  };
  batchEffect: {
    selectedMethods: string[];
    batchVariables: string;
    customMethods: string;
  };
  exploratoryAnalysis: {
    selectedMethods: string[];
    customMethods: string;
  };
  groupComparison: {
    numberOfGroups: number;
    timePoints: number;
    dataType: string;
    selectedModels: string[];
    useMachineLearning: boolean;
  };
  dataTransformation: {
    selectedTransformations: string[];
    customTransformations: string;
  };
  statisticalModeling: {
    selectedMethods: string[];
    confidenceLevel: string;
    customMethods: string;
  };
  comparators: {
    selectedMethods: string[];
    referenceGroup: string;
    customMethods: string;
  };
  multipleTestingCorrection: {
    selectedMethods: string[];
    alphaLevel: string;
    customMethods: string;
  };
  sensitivityAnalysis: {
    selectedMethods: string[];
    parameterRanges: string;
    customMethods: string;
  };
  visualization: {
    selectedTypes: string[];
    customTypes: string;
  };
  export: {
    selectedFormats: string[];
    selectedReportSections: string[];
    customOptions: string;
    customReportSections: string;
  };
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(-1); // Start with user info form (-1)
  const [pipelineState, setPipelineState] = useState<PipelineState>({
    userInfo: {
      name: '',
      email: ''
    },
    dataEntry: {
      selectedFileTypes: [],
      additionalRequirements: ''
    },
    powerAnalysis: {
      selectedMethods: [],
      effectSize: '',
      powerLevel: '0.8',
      alphaLevel: '0.05',
      customMethods: ''
    },
    qc: {
      selectedMethods: [],
      qualityThreshold: '',
      customMethods: ''
    },
    lodHandling: {
      selectedMethods: [],
      threshold: '',
      customMethods: ''
    },
    outlierDetection: {
      selectedMethods: [],
      handlingStrategies: [],
      zScoreThreshold: '3',
      iqrMultiplier: '1.5',
      customMethods: ''
    },
    normalization: {
      selectedMethods: [],
      referenceGroup: '',
      customMethods: ''
    },
    batchEffect: {
      selectedMethods: [],
      batchVariables: '',
      customMethods: ''
    },
    exploratoryAnalysis: {
      selectedMethods: [],
      customMethods: ''
    },
    groupComparison: {
      numberOfGroups: 2,
      timePoints: 1,
      dataType: 'cross-sectional',
      selectedModels: [],
      useMachineLearning: false
    },
    dataTransformation: {
      selectedTransformations: [],
      customTransformations: ''
    },
    statisticalModeling: {
      selectedMethods: [],
      confidenceLevel: '95',
      customMethods: ''
    },
    comparators: {
      selectedMethods: [],
      referenceGroup: '',
      customMethods: ''
    },
    multipleTestingCorrection: {
      selectedMethods: [],
      alphaLevel: '0.05',
      customMethods: ''
    },
    sensitivityAnalysis: {
      selectedMethods: [],
      parameterRanges: '',
      customMethods: ''
    },
    visualization: {
      selectedTypes: [],
      customTypes: ''
    },
    export: {
      selectedFormats: [],
      selectedReportSections: [],
      customOptions: '',
      customReportSections: ''
    }
  });

  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const savePipelineData = async (status: 'draft' | 'completed' = 'draft') => {
    if (!user || !pipelineState.userInfo.name) return;

    try {
      const { data, error } = await supabase.functions.invoke('save-pipeline', {
        body: {
          pipelineData: pipelineState,
          userName: pipelineState.userInfo.name,
          status
        }
      });

      if (error) throw error;

      toast({
        title: status === 'completed' ? "Pipeline completed!" : "Progress saved",
        description: status === 'completed' 
          ? "Your pipeline configuration has been completed and saved."
          : "Your progress has been saved automatically.",
      });
    } catch (error) {
      console.error('Error saving pipeline:', error);
      toast({
        title: "Error saving progress",
        description: "There was an issue saving your progress. Please try again.",
        variant: "destructive"
      });
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
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
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
          selectedMethods={pipelineState.powerAnalysis.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              powerAnalysis: { ...prev.powerAnalysis, selectedMethods: methods }
            }))
          }
          effectSize={pipelineState.powerAnalysis.effectSize}
          onEffectSizeChange={(size) =>
            setPipelineState(prev => ({
              ...prev,
              powerAnalysis: { ...prev.powerAnalysis, effectSize: size }
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
          selectedMethods={pipelineState.qc.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              qc: { ...prev.qc, selectedMethods: methods }
            }))
          }
          qualityThreshold={pipelineState.qc.qualityThreshold}
          onQualityThresholdChange={(threshold) =>
            setPipelineState(prev => ({
              ...prev,
              qc: { ...prev.qc, qualityThreshold: threshold }
            }))
          }
          customMethods={pipelineState.qc.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              qc: { ...prev.qc, customMethods: methods }
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
          selectedMethods={pipelineState.lodHandling.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              lodHandling: { ...prev.lodHandling, selectedMethods: methods }
            }))
          }
          threshold={pipelineState.lodHandling.threshold}
          onThresholdChange={(threshold) =>
            setPipelineState(prev => ({
              ...prev,
              lodHandling: { ...prev.lodHandling, threshold }
            }))
          }
          customMethods={pipelineState.lodHandling.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              lodHandling: { ...prev.lodHandling, customMethods: methods }
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
          selectedMethods={pipelineState.outlierDetection.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              outlierDetection: { ...prev.outlierDetection, selectedMethods: methods }
            }))
          }
          handlingStrategies={pipelineState.outlierDetection.handlingStrategies}
          onHandlingStrategiesChange={(strategies) =>
            setPipelineState(prev => ({
              ...prev,
              outlierDetection: { ...prev.outlierDetection, handlingStrategies: strategies }
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
          onIqrMultiplierChange={(multiplier) =>
            setPipelineState(prev => ({
              ...prev,
              outlierDetection: { ...prev.outlierDetection, iqrMultiplier: multiplier }
            }))
          }
          customMethods={pipelineState.outlierDetection.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              outlierDetection: { ...prev.outlierDetection, customMethods: methods }
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
          selectedMethods={pipelineState.normalization.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              normalization: { ...prev.normalization, selectedMethods: methods }
            }))
          }
          referenceGroup={pipelineState.normalization.referenceGroup}
          onReferenceGroupChange={(group) =>
            setPipelineState(prev => ({
              ...prev,
              normalization: { ...prev.normalization, referenceGroup: group }
            }))
          }
          customMethods={pipelineState.normalization.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              normalization: { ...prev.normalization, customMethods: methods }
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
          selectedMethods={pipelineState.batchEffect.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              batchEffect: { ...prev.batchEffect, selectedMethods: methods }
            }))
          }
          batchVariables={pipelineState.batchEffect.batchVariables}
          onBatchVariablesChange={(variables) =>
            setPipelineState(prev => ({
              ...prev,
              batchEffect: { ...prev.batchEffect, batchVariables: variables }
            }))
          }
          customMethods={pipelineState.batchEffect.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              batchEffect: { ...prev.batchEffect, customMethods: methods }
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
          onSelectedModelsChange={(models) =>
            setPipelineState(prev => ({
              ...prev,
              groupComparison: { ...prev.groupComparison, selectedModels: models }
            }))
          }
          useMachineLearning={pipelineState.groupComparison.useMachineLearning}
          onUseMachineLearningChange={(use) =>
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
          selectedMethods={pipelineState.statisticalModeling.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              statisticalModeling: { ...prev.statisticalModeling, selectedMethods: methods }
            }))
          }
          confidenceLevel={pipelineState.statisticalModeling.confidenceLevel}
          onConfidenceLevelChange={(level) =>
            setPipelineState(prev => ({
              ...prev,
              statisticalModeling: { ...prev.statisticalModeling, confidenceLevel: level }
            }))
          }
          customMethods={pipelineState.statisticalModeling.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              statisticalModeling: { ...prev.statisticalModeling, customMethods: methods }
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
          selectedMethods={pipelineState.comparators.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              comparators: { ...prev.comparators, selectedMethods: methods }
            }))
          }
          referenceGroup={pipelineState.comparators.referenceGroup}
          onReferenceGroupChange={(group) =>
            setPipelineState(prev => ({
              ...prev,
              comparators: { ...prev.comparators, referenceGroup: group }
            }))
          }
          customMethods={pipelineState.comparators.customMethods}
          onCustomMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              comparators: { ...prev.comparators, customMethods: methods }
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
          selectedMethods={pipelineState.multipleTestingCorrection.selectedMethods}
          onMethodsChange={(methods) =>
            setPipelineState(prev => ({
              ...prev,
              multipleTestingCorrection: { ...prev.multipleTestingCorrection, selectedMethods: methods }
            }))
          }
          alphaLevel={pipelineState.multipleTestingCorrection.alphaLevel}
          onAlphaLevelChange={(level) =>
            setPipelineState(prev => ({
              ...prev,
              multipleTestingCorrection: { ...prev.multipleTestingCorrection, alphaLevel: level }
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
          parameterRanges={pipelineState.sensitivityAnalysis.parameterRanges}
          onParameterRangesChange={(ranges) =>
            setPipelineState(prev => ({
              ...prev,
              sensitivityAnalysis: { ...prev.sensitivityAnalysis, parameterRanges: ranges }
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
          selectedTypes={pipelineState.visualization.selectedTypes}
          onTypesChange={(types) =>
            setPipelineState(prev => ({
              ...prev,
              visualization: { ...prev.visualization, selectedTypes: types }
            }))
          }
          customTypes={pipelineState.visualization.customTypes}
          onCustomTypesChange={(types) =>
            setPipelineState(prev => ({
              ...prev,
              visualization: { ...prev.visualization, customTypes: types }
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
          customOptions={pipelineState.export.customOptions}
          onCustomOptionsChange={(options) =>
            setPipelineState(prev => ({
              ...prev,
              export: { ...prev.export, customOptions: options }
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

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Auto-save progress
      await savePipelineData('draft');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 0) {
      setCurrentStep(-1); // Go back to user info
    }
  };

  const handleRestart = () => {
    setCurrentStep(-1);
    setPipelineState({
      userInfo: { name: '', email: '' },
      dataEntry: { selectedFileTypes: [], additionalRequirements: '' },
      powerAnalysis: { selectedMethods: [], effectSize: '', powerLevel: '0.8', alphaLevel: '0.05', customMethods: '' },
      qc: { selectedMethods: [], qualityThreshold: '', customMethods: '' },
      lodHandling: { selectedMethods: [], threshold: '', customMethods: '' },
      outlierDetection: { selectedMethods: [], handlingStrategies: [], zScoreThreshold: '3', iqrMultiplier: '1.5', customMethods: '' },
      normalization: { selectedMethods: [], referenceGroup: '', customMethods: '' },
      batchEffect: { selectedMethods: [], batchVariables: '', customMethods: '' },
      exploratoryAnalysis: { selectedMethods: [], customMethods: '' },
      groupComparison: { numberOfGroups: 2, timePoints: 1, dataType: 'cross-sectional', selectedModels: [], useMachineLearning: false },
      dataTransformation: { selectedTransformations: [], customTransformations: '' },
      statisticalModeling: { selectedMethods: [], confidenceLevel: '95', customMethods: '' },
      comparators: { selectedMethods: [], referenceGroup: '', customMethods: '' },
      multipleTestingCorrection: { selectedMethods: [], alphaLevel: '0.05', customMethods: '' },
      sensitivityAnalysis: { selectedMethods: [], parameterRanges: '', customMethods: '' },
      visualization: { selectedTypes: [], customTypes: '' },
      export: { selectedFormats: [], selectedReportSections: [], customOptions: '', customReportSections: '' }
    });
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
                <div className="flex items-center">
                  {getStepStatus(index) === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : getStepStatus(index) === 'current' ? (
                    <Circle className="h-5 w-5 text-blue-500 fill-current" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                  <Badge 
                    variant={getStepStatus(index) === 'current' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {index + 1}
                  </Badge>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-4 h-0.5 bg-gray-200 mx-2" />
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
            disabled={currentStep === 0}
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