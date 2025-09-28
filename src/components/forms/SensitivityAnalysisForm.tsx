import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const sensitivityMethods = [
  { id: 'parameter_variation', label: 'Parameter Variation Analysis', description: 'Test robustness by varying key parameters' },
  { id: 'model_assumptions', label: 'Model Assumption Testing', description: 'Evaluate impact of different distributional assumptions' },
  { id: 'outlier_influence', label: 'Outlier Influence Analysis', description: 'Assess sensitivity to influential observations' },
  { id: 'missing_data', label: 'Missing Data Sensitivity', description: 'Test different missing data handling approaches' },
  { id: 'transformation_sensitivity', label: 'Data Transformation Sensitivity', description: 'Compare results across different data transformations' },
  { id: 'threshold_variation', label: 'Threshold Variation', description: 'Test sensitivity to different cut-off values' },
  { id: 'bootstrap_stability', label: 'Bootstrap Stability Analysis', description: 'Assess result stability through resampling' },
  { id: 'cross_validation', label: 'Cross-Validation Sensitivity', description: 'Evaluate model stability across CV folds' },
  { id: 'custom', label: 'Custom Sensitivity Analysis', description: 'Specify custom sensitivity testing approaches' }
];

const parameterTypes = [
  { id: 'statistical_parameters', label: 'Statistical Parameters', description: 'Alpha levels, confidence intervals, effect sizes' },
  { id: 'model_parameters', label: 'Model Parameters', description: 'Regression coefficients, hyperparameters' },
  { id: 'preprocessing_parameters', label: 'Preprocessing Parameters', description: 'Normalization factors, filtering thresholds' },
  { id: 'algorithm_parameters', label: 'Algorithm Parameters', description: 'Convergence criteria, iteration limits' },
  { id: 'biological_parameters', label: 'Biological Parameters', description: 'Dose levels, time points, biological thresholds' }
];

const robustnessChecks = [
  { id: 'alternative_methods', label: 'Alternative Analysis Methods', description: 'Compare results using different statistical approaches' },
  { id: 'subset_analysis', label: 'Subset Analysis', description: 'Test results on different data subsets' },
  { id: 'leave_one_out', label: 'Leave-One-Out Analysis', description: 'Evaluate impact of removing individual observations' },
  { id: 'jackknife', label: 'Jackknife Resampling', description: 'Systematic deletion and re-analysis' },
  { id: 'perturbation_analysis', label: 'Data Perturbation Analysis', description: 'Test stability with small data modifications' }
];

interface SensitivityAnalysisFormProps {
  selectedMethods: string[];
  onMethodsChange: (methods: string[]) => void;
  selectedParameterTypes: string[];
  onParameterTypesChange: (types: string[]) => void;
  selectedRobustnessChecks: string[];
  onRobustnessChecksChange: (checks: string[]) => void;
  parameterRanges: string;
  onParameterRangesChange: (ranges: string) => void;
  stabilityThreshold: string;
  onStabilityThresholdChange: (threshold: string) => void;
  customMethods: string;
  onCustomMethodsChange: (methods: string) => void;
}

export const SensitivityAnalysisForm: React.FC<SensitivityAnalysisFormProps> = ({
  selectedMethods,
  onMethodsChange,
  selectedParameterTypes,
  onParameterTypesChange,
  selectedRobustnessChecks,
  onRobustnessChecksChange,
  parameterRanges,
  onParameterRangesChange,
  stabilityThreshold,
  onStabilityThresholdChange,
  customMethods,
  onCustomMethodsChange,
}) => {
  const handleMethodChange = (methodId: string, checked: boolean) => {
    if (checked) {
      onMethodsChange([...selectedMethods, methodId]);
    } else {
      onMethodsChange(selectedMethods.filter(id => id !== methodId));
    }
  };

  const handleParameterTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      onParameterTypesChange([...selectedParameterTypes, typeId]);
    } else {
      onParameterTypesChange(selectedParameterTypes.filter(id => id !== typeId));
    }
  };

  const handleRobustnessCheckChange = (checkId: string, checked: boolean) => {
    if (checked) {
      onRobustnessChecksChange([...selectedRobustnessChecks, checkId]);
    } else {
      onRobustnessChecksChange(selectedRobustnessChecks.filter(id => id !== checkId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Sensitivity Analysis</h3>
        <p className="text-muted-foreground mb-6">
          Configure sensitivity analysis methods to assess the robustness and stability of your analytical results.
        </p>
      </div>

      {/* Sensitivity Analysis Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Sensitivity Analysis Methods</CardTitle>
          <CardDescription>Select approaches for testing result robustness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sensitivityMethods.map((method) => (
              <div key={method.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={method.id}
                  checked={selectedMethods.includes(method.id)}
                  onCheckedChange={(checked) => handleMethodChange(method.id, checked as boolean)}
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

      {/* Parameter Types */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Types for Sensitivity Testing</CardTitle>
          <CardDescription>Select categories of parameters to include in sensitivity analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {parameterTypes.map((type) => (
              <div key={type.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={type.id}
                  checked={selectedParameterTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleParameterTypeChange(type.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={type.id} className="text-sm font-medium cursor-pointer">
                    {type.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Robustness Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Robustness Checks</CardTitle>
          <CardDescription>Additional robustness validation approaches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {robustnessChecks.map((check) => (
              <div key={check.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={check.id}
                  checked={selectedRobustnessChecks.includes(check.id)}
                  onCheckedChange={(checked) => handleRobustnessCheckChange(check.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={check.id} className="text-sm font-medium cursor-pointer">
                    {check.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{check.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Parameter Ranges */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Variation Ranges</CardTitle>
          <CardDescription>Specify ranges or values for parameter sensitivity testing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parameterRanges" className="text-sm font-medium">
                Parameter Ranges and Values
              </Label>
              <Textarea
                id="parameterRanges"
                placeholder="Specify parameter ranges for sensitivity testing (e.g., alpha: 0.01-0.10, effect size: 0.1-1.0, etc.)..."
                value={parameterRanges}
                onChange={(e) => onParameterRangesChange(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stabilityThreshold" className="text-sm font-medium">
                Stability Threshold (%)
              </Label>
              <Input
                id="stabilityThreshold"
                type="number"
                min="1"
                max="50"
                step="1"
                placeholder="10"
                value={stabilityThreshold}
                onChange={(e) => onStabilityThresholdChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum acceptable percentage change in results to consider them stable
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Methods */}
      {selectedMethods.includes('custom') && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Sensitivity Analysis Methods</CardTitle>
            <CardDescription>Describe additional or custom sensitivity analysis approaches</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe custom sensitivity analysis methods, specialized robustness checks, or domain-specific validation approaches..."
              value={customMethods}
              onChange={(e) => onCustomMethodsChange(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};