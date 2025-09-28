import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const detectionMethods = [
  { id: 'pca', label: 'Principal Component Analysis (PCA)', description: 'Visualize batch effects using PCA plots' },
  { id: 'hierarchical_clustering', label: 'Hierarchical Clustering', description: 'Detect batch clustering in dendrograms' },
  { id: 'rle_plots', label: 'RLE (Relative Log Expression) Plots', description: 'Assess batch effects using RLE visualization' },
  { id: 'boxplots', label: 'Batch-wise Boxplots', description: 'Compare distributions across batches' },
  { id: 'mds', label: 'Multidimensional Scaling (MDS)', description: 'Distance-based batch effect visualization' },
  { id: 'statistical_tests', label: 'Statistical Tests', description: 'ANOVA or other tests for batch differences' },
  { id: 'pvca', label: 'PVCA Analysis', description: 'Principal Variance Component Analysis for batch effects' }
];

const correctionMethods = [
  { id: 'combat', label: 'ComBat', description: 'Empirical Bayes method for batch effect removal' },
  { id: 'combat_seq', label: 'ComBat-Seq', description: 'ComBat for sequencing count data' },
  { id: 'limma_removebatcheffect', label: 'limma removeBatchEffect', description: 'Linear model-based batch correction' },
  { id: 'ruv', label: 'RUV (Remove Unwanted Variation)', description: 'Factor analysis approach for batch correction' },
  { id: 'sva', label: 'SVA (Surrogate Variable Analysis)', description: 'Identify and remove hidden batch effects' },
  { id: 'harmony', label: 'Harmony', description: 'Fast integration of multiple datasets' },
  { id: 'mnn', label: 'MNN (Mutual Nearest Neighbors)', description: 'Batch correction for single-cell data' },
  { id: 'seurat_integration', label: 'Seurat Integration', description: 'Canonical correlation analysis for batch correction' },
  { id: 'custom', label: 'Custom Correction Method', description: 'Specify custom batch correction approaches' }
];

const batchVariables = [
  { id: 'plate', label: 'Plate/Chip', description: 'Experimental plate or chip identifier' },
  { id: 'run_date', label: 'Run Date', description: 'Date of experiment execution' },
  { id: 'operator', label: 'Operator/Technician', description: 'Person performing the experiment' },
  { id: 'instrument', label: 'Instrument', description: 'Equipment used for measurements' },
  { id: 'lot', label: 'Reagent Lot', description: 'Batch of reagents or consumables' },
  { id: 'storage_time', label: 'Storage Time', description: 'Duration of sample storage' },
  { id: 'processing_batch', label: 'Processing Batch', description: 'Sample processing group' }
];

interface BatchEffectFormProps {
  selectedDetectionMethods: string[];
  onDetectionMethodsChange: (methods: string[]) => void;
  selectedCorrectionMethod: string;
  onCorrectionMethodChange: (method: string) => void;
  selectedBatchVariables: string[];
  onBatchVariablesChange: (variables: string[]) => void;
  preservedVariables: string;
  onPreservedVariablesChange: (variables: string) => void;
  customCorrectionMethod: string;
  onCustomCorrectionMethodChange: (method: string) => void;
}

export const BatchEffectForm: React.FC<BatchEffectFormProps> = ({
  selectedDetectionMethods,
  onDetectionMethodsChange,
  selectedCorrectionMethod,
  onCorrectionMethodChange,
  selectedBatchVariables,
  onBatchVariablesChange,
  preservedVariables,
  onPreservedVariablesChange,
  customCorrectionMethod,
  onCustomCorrectionMethodChange,
}) => {
  const handleDetectionMethodChange = (methodId: string, checked: boolean) => {
    if (checked) {
      onDetectionMethodsChange([...selectedDetectionMethods, methodId]);
    } else {
      onDetectionMethodsChange(selectedDetectionMethods.filter(id => id !== methodId));
    }
  };

  const handleBatchVariableChange = (variableId: string, checked: boolean) => {
    if (checked) {
      onBatchVariablesChange([...selectedBatchVariables, variableId]);
    } else {
      onBatchVariablesChange(selectedBatchVariables.filter(id => id !== variableId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Batch Effect Assessment & Correction</h3>
        <p className="text-muted-foreground mb-6">
          Configure methods for detecting and correcting batch effects in your experimental data.
        </p>
      </div>

      {/* Batch Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Variables</CardTitle>
          <CardDescription>Identify variables that may introduce batch effects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {batchVariables.map((variable) => (
              <div key={variable.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={variable.id}
                  checked={selectedBatchVariables.includes(variable.id)}
                  onCheckedChange={(checked) => handleBatchVariableChange(variable.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={variable.id} className="text-sm font-medium cursor-pointer">
                    {variable.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{variable.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detection Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Effect Detection Methods</CardTitle>
          <CardDescription>Select methods for assessing the presence of batch effects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detectionMethods.map((method) => (
              <div key={method.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={method.id}
                  checked={selectedDetectionMethods.includes(method.id)}
                  onCheckedChange={(checked) => handleDetectionMethodChange(method.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={method.id} className="text-sm font-medium cursor-pointer">
                    {method.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Correction Method */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Effect Correction Method</CardTitle>
          <CardDescription>Select the primary method for correcting batch effects</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedCorrectionMethod} onValueChange={onCorrectionMethodChange}>
            {correctionMethods.map((method) => (
              <div key={method.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={method.id} className="text-sm font-medium cursor-pointer">
                    {method.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Variables to Preserve */}
      <Card>
        <CardHeader>
          <CardTitle>Variables to Preserve</CardTitle>
          <CardDescription>Specify biological or experimental variables that should be preserved during batch correction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="preservedVariables" className="text-sm font-medium">
              Protected Variables
            </Label>
            <Textarea
              id="preservedVariables"
              placeholder="List variables that should not be affected by batch correction (e.g., treatment group, time point, disease status)..."
              value={preservedVariables}
              onChange={(e) => onPreservedVariablesChange(e.target.value)}
              className="min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground">
              These variables represent true biological or experimental effects that should remain in the data after batch correction.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Correction Method */}
      {selectedCorrectionMethod === 'custom' && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Batch Correction Method</CardTitle>
            <CardDescription>Describe additional or custom batch correction approaches</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe custom batch correction methods, specialized algorithms, or domain-specific approaches..."
              value={customCorrectionMethod}
              onChange={(e) => onCustomCorrectionMethodChange(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};