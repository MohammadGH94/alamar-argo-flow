import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const detectionMethods = [
  { id: 'iqr', label: 'Interquartile Range (IQR)', description: 'Identify outliers beyond 1.5 * IQR from quartiles' },
  { id: 'zscore', label: 'Z-Score Method', description: 'Flag values beyond specified standard deviations from mean' },
  { id: 'modified_zscore', label: 'Modified Z-Score (MAD)', description: 'Robust outlier detection using median absolute deviation' },
  { id: 'isolation_forest', label: 'Isolation Forest', description: 'Machine learning approach for anomaly detection' },
  { id: 'local_outlier_factor', label: 'Local Outlier Factor (LOF)', description: 'Density-based outlier detection' },
  { id: 'elliptic_envelope', label: 'Elliptic Envelope', description: 'Multivariate outlier detection assuming normal distribution' },
  { id: 'one_class_svm', label: 'One-Class SVM', description: 'Support vector machine for novelty detection' },
  { id: 'statistical_tests', label: 'Statistical Tests', description: 'Grubbs, Dixon, or other statistical outlier tests' },
  { id: 'custom', label: 'Custom Detection Method', description: 'Specify custom outlier detection approaches' }
];

const handlingStrategies = [
  { id: 'remove', label: 'Remove Outliers', description: 'Completely remove outlying observations from dataset' },
  { id: 'cap', label: 'Cap/Winsorize', description: 'Cap outliers at specified percentile values' },
  { id: 'transform', label: 'Transform Values', description: 'Apply mathematical transformations to reduce outlier impact' },
  { id: 'flag', label: 'Flag Only', description: 'Mark outliers but retain in dataset for analysis' },
  { id: 'impute', label: 'Impute/Replace', description: 'Replace outliers with imputed values' },
  { id: 'robust_methods', label: 'Use Robust Methods', description: 'Apply outlier-resistant statistical methods' }
];

interface OutlierDetectionFormProps {
  selectedDetectionMethods: string[];
  onDetectionMethodsChange: (methods: string[]) => void;
  selectedHandlingStrategies: string[];
  onHandlingStrategiesChange: (strategies: string[]) => void;
  zScoreThreshold: string;
  onZScoreThresholdChange: (threshold: string) => void;
  iqrMultiplier: string;
  onIQRMultiplierChange: (multiplier: string) => void;
  customDetectionMethods: string;
  onCustomDetectionMethodsChange: (methods: string) => void;
}

export const OutlierDetectionForm: React.FC<OutlierDetectionFormProps> = ({
  selectedDetectionMethods,
  onDetectionMethodsChange,
  selectedHandlingStrategies,
  onHandlingStrategiesChange,
  zScoreThreshold,
  onZScoreThresholdChange,
  iqrMultiplier,
  onIQRMultiplierChange,
  customDetectionMethods,
  onCustomDetectionMethodsChange,
}) => {
  const handleDetectionMethodChange = (methodId: string, checked: boolean) => {
    if (checked) {
      onDetectionMethodsChange([...selectedDetectionMethods, methodId]);
    } else {
      onDetectionMethodsChange(selectedDetectionMethods.filter(id => id !== methodId));
    }
  };

  const handleHandlingStrategyChange = (strategyId: string, checked: boolean) => {
    if (checked) {
      onHandlingStrategiesChange([...selectedHandlingStrategies, strategyId]);
    } else {
      onHandlingStrategiesChange(selectedHandlingStrategies.filter(id => id !== strategyId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Outlier Detection & Handling</h3>
        <p className="text-muted-foreground mb-6">
          Configure methods for identifying and handling outlying observations in your dataset.
        </p>
      </div>

      {/* Detection Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Outlier Detection Methods</CardTitle>
          <CardDescription>Select methods for identifying outliers (multiple selections allowed)</CardDescription>
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

      {/* Detection Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Detection Parameters</CardTitle>
          <CardDescription>Configure thresholds and parameters for outlier detection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zScoreThreshold" className="text-sm font-medium">
                Z-Score Threshold
              </Label>
              <Input
                id="zScoreThreshold"
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="3.0"
                value={zScoreThreshold}
                onChange={(e) => onZScoreThresholdChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Typically 2.5 or 3.0 standard deviations</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="iqrMultiplier" className="text-sm font-medium">
                IQR Multiplier
              </Label>
              <Input
                id="iqrMultiplier"
                type="number"
                min="1"
                max="3"
                step="0.1"
                placeholder="1.5"
                value={iqrMultiplier}
                onChange={(e) => onIQRMultiplierChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Typically 1.5 (mild) or 3.0 (extreme) outliers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Handling Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Outlier Handling Strategies</CardTitle>
          <CardDescription>Select approaches for handling identified outliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {handlingStrategies.map((strategy) => (
              <div key={strategy.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={strategy.id}
                  checked={selectedHandlingStrategies.includes(strategy.id)}
                  onCheckedChange={(checked) => handleHandlingStrategyChange(strategy.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={strategy.id} className="text-sm font-medium cursor-pointer">
                    {strategy.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{strategy.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Methods */}
      {selectedDetectionMethods.includes('custom') && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Detection Methods</CardTitle>
            <CardDescription>Describe additional or custom outlier detection approaches</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe custom outlier detection methods, domain-specific rules, or specialized algorithms..."
              value={customDetectionMethods}
              onChange={(e) => onCustomDetectionMethodsChange(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};