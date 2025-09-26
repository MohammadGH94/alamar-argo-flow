import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ComparatorsFormProps {
  selectedContrasts: string[];
  onContrastsChange: (contrasts: string[]) => void;
  selectedExtractionValues: string[];
  onExtractionValuesChange: (values: string[]) => void;
  customContrasts: string;
  onCustomContrastsChange: (contrasts: string) => void;
  customExtractionValues: string;
  onCustomExtractionValuesChange: (values: string) => void;
}

export const ComparatorsForm: React.FC<ComparatorsFormProps> = ({
  selectedContrasts,
  onContrastsChange,
  selectedExtractionValues,
  onExtractionValuesChange,
  customContrasts,
  onCustomContrastsChange,
  customExtractionValues,
  onCustomExtractionValuesChange,
}) => {
  const contrastOptions = [
    {
      id: 'pairwise',
      label: 'Pairwise Comparisons',
      description: 'Compare each group to every other group'
    },
    {
      id: 'control-vs-treatment',
      label: 'Control vs Treatment',
      description: 'Compare treatment groups against control group'
    },
    {
      id: 'dose-response',
      label: 'Dose-Response Trend',
      description: 'Test for linear or polynomial dose-response relationships'
    },
    {
      id: 'time-effects',
      label: 'Time Effects',
      description: 'Compare changes over time points'
    },
    {
      id: 'interaction',
      label: 'Interaction Contrasts',
      description: 'Test for group × time or other interaction effects'
    },
    {
      id: 'baseline-comparison',
      label: 'Baseline Comparison',
      description: 'Compare all groups to baseline measurements'
    },
    {
      id: 'sequential',
      label: 'Sequential Comparisons',
      description: 'Compare adjacent groups in ordered sequence'
    },
    {
      id: 'orthogonal',
      label: 'Orthogonal Contrasts',
      description: 'Independent, non-overlapping comparisons'
    }
  ];

  const extractionOptions = [
    {
      id: 'coefficients',
      label: 'Model Coefficients',
      description: 'Parameter estimates and their standard errors'
    },
    {
      id: 'p-values',
      label: 'P-values',
      description: 'Statistical significance values for each contrast'
    },
    {
      id: 'confidence-intervals',
      label: 'Confidence Intervals',
      description: '95% confidence intervals for estimates'
    },
    {
      id: 'effect-sizes',
      label: 'Effect Sizes',
      description: "Cohen's d, eta-squared, or other effect size measures"
    },
    {
      id: 'fold-changes',
      label: 'Fold Changes',
      description: 'Ratio of means between groups'
    },
    {
      id: 'log-fold-changes',
      label: 'Log Fold Changes',
      description: 'Log-transformed fold changes'
    },
    {
      id: 'adjusted-means',
      label: 'Adjusted Means',
      description: 'Least squares means adjusted for covariates'
    },
    {
      id: 'residuals',
      label: 'Model Residuals',
      description: 'Residual values for diagnostic purposes'
    },
    {
      id: 'predicted-values',
      label: 'Predicted Values',
      description: 'Model-predicted values for each observation'
    },
    {
      id: 'variance-components',
      label: 'Variance Components',
      description: 'Variance estimates for random effects'
    },
    {
      id: 'model-statistics',
      label: 'Model Statistics',
      description: 'R-squared, AIC, BIC, and other fit statistics'
    },
    {
      id: 'contrasts-matrix',
      label: 'Contrast Matrix',
      description: 'Matrix defining linear combinations for contrasts'
    }
  ];

  const handleContrastToggle = (contrastId: string) => {
    const newSelection = selectedContrasts.includes(contrastId)
      ? selectedContrasts.filter(id => id !== contrastId)
      : [...selectedContrasts, contrastId];
    onContrastsChange(newSelection);
  };

  const handleExtractionToggle = (valueId: string) => {
    const newSelection = selectedExtractionValues.includes(valueId)
      ? selectedExtractionValues.filter(id => id !== valueId)
      : [...selectedExtractionValues, valueId];
    onExtractionValuesChange(newSelection);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Statistical Contrasts
          </CardTitle>
          <CardDescription>
            Select the types of statistical contrasts you want to perform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contrastOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={option.id}
                  checked={selectedContrasts.includes(option.id)}
                  onCheckedChange={() => handleContrastToggle(option.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={option.id}
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Model Output Values
          </CardTitle>
          <CardDescription>
            Choose which values to extract from the statistical models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extractionOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={option.id}
                  checked={selectedExtractionValues.includes(option.id)}
                  onCheckedChange={() => handleExtractionToggle(option.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={option.id}
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Custom Contrasts
            </CardTitle>
            <CardDescription>
              Define any additional custom contrasts or comparisons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="custom-contrasts" className="text-sm font-medium">
                Additional Contrasts
              </Label>
              <Textarea
                id="custom-contrasts"
                placeholder="Specify custom contrasts, comparison schemes, or specific hypotheses you want to test..."
                value={customContrasts}
                onChange={(e) => onCustomContrastsChange(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Custom Extraction Values
            </CardTitle>
            <CardDescription>
              Specify any additional values to extract from models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="custom-extraction" className="text-sm font-medium">
                Additional Values
              </Label>
              <Textarea
                id="custom-extraction"
                placeholder="Specify any custom statistics, derived values, or specific model outputs you want to extract..."
                value={customExtractionValues}
                onChange={(e) => onCustomExtractionValuesChange(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};