import React, { useState } from 'react';
import { PipelineStep } from '@/components/PipelineStep';
import { DataEntryForm } from '@/components/forms/DataEntryForm';
import { QCForm } from '@/components/forms/QCForm';
import { LODHandlingForm } from '@/components/forms/LODHandlingForm';
import { NormalizationForm } from '@/components/forms/NormalizationForm';
import { ExploratoryAnalysisForm } from '@/components/forms/ExploratoryAnalysisForm';
import { GroupComparisonForm } from '@/components/forms/GroupComparisonForm';
import { DataTransformationForm } from '@/components/forms/DataTransformationForm';
import { StatisticalModelingForm } from '@/components/forms/StatisticalModelingForm';
import { ComparatorsForm } from '@/components/forms/ComparatorsForm';
import { MultipleTestingCorrectionForm } from '@/components/forms/MultipleTestingCorrectionForm';
import { VisualizationForm } from '@/components/forms/VisualizationForm';
import { ExportForm } from '@/components/forms/ExportForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database } from 'lucide-react';

interface PipelineState {
  // Data Entry
  selectedFileTypes: string[];
  additionalRequirements: string;
  
  // QC
  selectedQCSteps: string[];
  qualityThreshold: string;
  customQCSteps: string;
  
  // LOD Handling
  lodMethod: string;
  lodThreshold: string;
  customLODMethod: string;
  
  // Normalization
  normalizationMethod: string;
  selectedBridgingOptions: string[];
  customNormalizationMethod: string;
  
  // Exploratory Analysis
  selectedAnalysisMethods: string[];
  customAnalysisMethods: string;
  
  // Group Comparison
  numberOfGroups: string;
  dataType: string;
  timePoints: string;
  selectedModels: string[];
  useMachineLearning: boolean;
  
  // Data Transformation
  selectedTransformations: string[];
  customTransformations: string;
  
  // Statistical Modeling
  selectedDiagnostics: string[];
  customDiagnostics: string;
  
  // Comparators
  selectedContrasts: string[];
  selectedExtractionValues: string[];
  customContrasts: string;
  customExtractionValues: string;
  
  // Multiple Testing Correction
  correctionMethod: string;
  selectedAdditionalCorrectionMethods: string[];
  customCorrectionMethods: string;
  
  // Visualization
  selectedGraphs: string[];
  selectedTables: string[];
  customVisualizations: string;
  customTables: string;
  
  // Export
  selectedFormats: string[];
  selectedReportSections: string[];
  customExportOptions: string;
  customReportSections: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [pipelineState, setPipelineState] = useState<PipelineState>({
    selectedFileTypes: [],
    additionalRequirements: '',
    selectedQCSteps: [],
    qualityThreshold: '',
    customQCSteps: '',
    lodMethod: '',
    lodThreshold: '',
    customLODMethod: '',
    normalizationMethod: '',
    selectedBridgingOptions: [],
    customNormalizationMethod: '',
    selectedAnalysisMethods: [],
    customAnalysisMethods: '',
    numberOfGroups: '',
    dataType: '',
    timePoints: '',
    selectedModels: [],
    useMachineLearning: false,
    selectedTransformations: [],
    customTransformations: '',
    selectedDiagnostics: [],
    customDiagnostics: '',
    selectedContrasts: [],
    selectedExtractionValues: [],
    customContrasts: '',
    customExtractionValues: '',
    correctionMethod: '',
    selectedAdditionalCorrectionMethods: [],
    customCorrectionMethods: '',
    selectedGraphs: [],
    selectedTables: [],
    customVisualizations: '',
    customTables: '',
    selectedFormats: [],
    selectedReportSections: [],
    customExportOptions: '',
    customReportSections: '',
  });

  const steps = [
    {
      title: 'Data Entry',
      description: 'Configure file types and data requirements for input',
      component: (
        <DataEntryForm
          selectedFileTypes={pipelineState.selectedFileTypes}
          onFileTypesChange={(types) => setPipelineState(prev => ({ ...prev, selectedFileTypes: types }))}
          additionalRequirements={pipelineState.additionalRequirements}
          onAdditionalRequirementsChange={(req) => setPipelineState(prev => ({ ...prev, additionalRequirements: req }))}
        />
      )
    },
    {
      title: 'Quality Control',
      description: 'Define quality control procedures and validation steps',
      component: (
        <QCForm
          selectedQCSteps={pipelineState.selectedQCSteps}
          onQCStepsChange={(steps) => setPipelineState(prev => ({ ...prev, selectedQCSteps: steps }))}
          qualityThreshold={pipelineState.qualityThreshold}
          onQualityThresholdChange={(threshold) => setPipelineState(prev => ({ ...prev, qualityThreshold: threshold }))}
          customQCSteps={pipelineState.customQCSteps}
          onCustomQCStepsChange={(steps) => setPipelineState(prev => ({ ...prev, customQCSteps: steps }))}
        />
      )
    },
    {
      title: 'LOD Handling',
      description: 'Configure how to handle below limit of detection values',
      component: (
        <LODHandlingForm
          selectedMethod={pipelineState.lodMethod}
          onMethodChange={(method) => setPipelineState(prev => ({ ...prev, lodMethod: method }))}
          lodThreshold={pipelineState.lodThreshold}
          onLODThresholdChange={(threshold) => setPipelineState(prev => ({ ...prev, lodThreshold: threshold }))}
          customMethod={pipelineState.customLODMethod}
          onCustomMethodChange={(method) => setPipelineState(prev => ({ ...prev, customLODMethod: method }))}
        />
      )
    },
    {
      title: 'Bridging & Normalization',
      description: 'Set up data normalization across plates and lots',
      component: (
        <NormalizationForm
          selectedMethod={pipelineState.normalizationMethod}
          onMethodChange={(method) => setPipelineState(prev => ({ ...prev, normalizationMethod: method }))}
          selectedBridgingOptions={pipelineState.selectedBridgingOptions}
          onBridgingOptionsChange={(options) => setPipelineState(prev => ({ ...prev, selectedBridgingOptions: options }))}
          customMethod={pipelineState.customNormalizationMethod}
          onCustomMethodChange={(method) => setPipelineState(prev => ({ ...prev, customNormalizationMethod: method }))}
        />
      )
    },
    {
      title: 'Exploratory Analysis',
      description: 'Configure exploratory data analysis methods',
      component: (
        <ExploratoryAnalysisForm
          selectedMethods={pipelineState.selectedAnalysisMethods}
          onMethodsChange={(methods) => setPipelineState(prev => ({ ...prev, selectedAnalysisMethods: methods }))}
          customMethods={pipelineState.customAnalysisMethods}
          onCustomMethodsChange={(methods) => setPipelineState(prev => ({ ...prev, customAnalysisMethods: methods }))}
        />
      )
    },
    {
      title: 'Group Comparison',
      description: 'Set up group-based statistical comparisons',
      component: (
        <GroupComparisonForm
          numberOfGroups={pipelineState.numberOfGroups}
          onNumberOfGroupsChange={(value) => setPipelineState(prev => ({ ...prev, numberOfGroups: value }))}
          dataType={pipelineState.dataType}
          onDataTypeChange={(value) => setPipelineState(prev => ({ ...prev, dataType: value }))}
          timePoints={pipelineState.timePoints}
          onTimePointsChange={(value) => setPipelineState(prev => ({ ...prev, timePoints: value }))}
          selectedModels={pipelineState.selectedModels}
          onModelsChange={(models) => setPipelineState(prev => ({ ...prev, selectedModels: models }))}
          useMachineLearning={pipelineState.useMachineLearning}
          onMachineLearningChange={(value) => setPipelineState(prev => ({ ...prev, useMachineLearning: value }))}
        />
      )
    },
    {
      title: 'Data Transformation',
      description: 'Configure data transformation algorithms',
      component: (
        <DataTransformationForm
          selectedTransformations={pipelineState.selectedTransformations}
          onTransformationsChange={(transformations) => setPipelineState(prev => ({ ...prev, selectedTransformations: transformations }))}
          customTransformations={pipelineState.customTransformations}
          onCustomTransformationsChange={(transformations) => setPipelineState(prev => ({ ...prev, customTransformations: transformations }))}
        />
      )
    },
    {
      title: 'Statistical Modeling',
      description: 'Define model diagnostics and validation',
      component: (
        <StatisticalModelingForm
          selectedDiagnostics={pipelineState.selectedDiagnostics}
          onDiagnosticsChange={(diagnostics) => setPipelineState(prev => ({ ...prev, selectedDiagnostics: diagnostics }))}
          customDiagnostics={pipelineState.customDiagnostics}
          onCustomDiagnosticsChange={(diagnostics) => setPipelineState(prev => ({ ...prev, customDiagnostics: diagnostics }))}
        />
      )
    },
    {
      title: 'Comparators',
      description: 'Select values to extract from models',
      component: (
        <ComparatorsForm
          selectedContrasts={pipelineState.selectedContrasts}
          onContrastsChange={(contrasts) => setPipelineState(prev => ({ ...prev, selectedContrasts: contrasts }))}
          selectedExtractionValues={pipelineState.selectedExtractionValues}
          onExtractionValuesChange={(values) => setPipelineState(prev => ({ ...prev, selectedExtractionValues: values }))}
          customContrasts={pipelineState.customContrasts}
          onCustomContrastsChange={(contrasts) => setPipelineState(prev => ({ ...prev, customContrasts: contrasts }))}
          customExtractionValues={pipelineState.customExtractionValues}
          onCustomExtractionValuesChange={(values) => setPipelineState(prev => ({ ...prev, customExtractionValues: values }))}
        />
      )
    },
    {
      title: 'Multiple Testing Correction',
      description: 'Configure multiple comparison correction methods',
      component: (
        <MultipleTestingCorrectionForm
          selectedMethod={pipelineState.correctionMethod}
          onMethodChange={(method) => setPipelineState(prev => ({ ...prev, correctionMethod: method }))}
          selectedAdditionalMethods={pipelineState.selectedAdditionalCorrectionMethods}
          onAdditionalMethodsChange={(methods) => setPipelineState(prev => ({ ...prev, selectedAdditionalCorrectionMethods: methods }))}
          customMethods={pipelineState.customCorrectionMethods}
          onCustomMethodsChange={(methods) => setPipelineState(prev => ({ ...prev, customCorrectionMethods: methods }))}
        />
      )
    },
    {
      title: 'Visualization',
      description: 'Define output graphs and tables',
      component: (
        <VisualizationForm
          selectedGraphs={pipelineState.selectedGraphs}
          onGraphsChange={(graphs) => setPipelineState(prev => ({ ...prev, selectedGraphs: graphs }))}
          selectedTables={pipelineState.selectedTables}
          onTablesChange={(tables) => setPipelineState(prev => ({ ...prev, selectedTables: tables }))}
          customVisualizations={pipelineState.customVisualizations}
          onCustomVisualizationsChange={(visualizations) => setPipelineState(prev => ({ ...prev, customVisualizations: visualizations }))}
          customTables={pipelineState.customTables}
          onCustomTablesChange={(tables) => setPipelineState(prev => ({ ...prev, customTables: tables }))}
        />
      )
    },
    {
      title: 'Export',
      description: 'Configure export formats and content',
      component: (
        <ExportForm
          selectedFormats={pipelineState.selectedFormats}
          onFormatsChange={(formats) => setPipelineState(prev => ({ ...prev, selectedFormats: formats }))}
          selectedReportSections={pipelineState.selectedReportSections}
          onReportSectionsChange={(sections) => setPipelineState(prev => ({ ...prev, selectedReportSections: sections }))}
          customExportOptions={pipelineState.customExportOptions}
          onCustomExportOptionsChange={(options) => setPipelineState(prev => ({ ...prev, customExportOptions: options }))}
          customReportSections={pipelineState.customReportSections}
          onCustomReportSectionsChange={(sections) => setPipelineState(prev => ({ ...prev, customReportSections: sections }))}
        />
      )
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-medium">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Alamar Argo
                </h1>
                <p className="text-sm text-muted-foreground">Analytical Pipeline Builder</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">Step {currentStep} of {steps.length}</p>
                <p className="text-xs text-muted-foreground">{steps[currentStep - 1]?.title}</p>
              </div>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Pipeline Overview Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="transition-smooth"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pipeline Overview
            </Button>
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const status = getStepStatus(stepNumber);
            
            return (
              <PipelineStep
                key={stepNumber}
                stepNumber={stepNumber}
                title={step.title}
                description={step.description}
                status={status}
                isLast={stepNumber === steps.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
              >
                {step.component}
              </PipelineStep>
            );
          })}

          {/* Summary */}
          {currentStep > steps.length && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Pipeline Configuration Complete!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your analytical pipeline has been configured and is ready to process data.
              </p>
              <Button
                onClick={() => setCurrentStep(1)}
                className="bg-gradient-primary hover:opacity-90"
              >
                Review Configuration
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;