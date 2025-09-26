import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface StatisticalModelingFormProps {
  selectedDiagnostics: string[];
  onDiagnosticsChange: (diagnostics: string[]) => void;
  customDiagnostics: string;
  onCustomDiagnosticsChange: (diagnostics: string) => void;
}

export const StatisticalModelingForm: React.FC<StatisticalModelingFormProps> = ({
  selectedDiagnostics,
  onDiagnosticsChange,
  customDiagnostics,
  onCustomDiagnosticsChange,
}) => {
  const diagnosticOptions = [
    {
      id: 'residual-analysis',
      label: 'Residual Analysis',
      description: 'Examine residuals for patterns, normality, and homoscedasticity'
    },
    {
      id: 'normality-tests',
      label: 'Normality Tests',
      description: 'Shapiro-Wilk, Kolmogorov-Smirnov, Anderson-Darling tests'
    },
    {
      id: 'homoscedasticity',
      label: 'Homoscedasticity Tests',
      description: 'Breusch-Pagan, White, Goldfeld-Quandt tests'
    },
    {
      id: 'model-fit',
      label: 'Model Fit Statistics',
      description: 'R-squared, adjusted R-squared, AIC, BIC, log-likelihood'
    },
    {
      id: 'cross-validation',
      label: 'Cross-Validation',
      description: 'K-fold, leave-one-out, stratified cross-validation'
    },
    {
      id: 'bootstrap',
      label: 'Bootstrap Validation',
      description: 'Bootstrap resampling for confidence intervals and stability'
    },
    {
      id: 'outlier-detection',
      label: 'Outlier Detection',
      description: 'Identify and assess influence of outlying observations'
    },
    {
      id: 'multicollinearity',
      label: 'Multicollinearity Checks',
      description: 'VIF, condition index, correlation matrix analysis'
    },
    {
      id: 'cooks-distance',
      label: "Cook's Distance",
      description: 'Measure influence of individual observations on model'
    },
    {
      id: 'leverage-analysis',
      label: 'Leverage Analysis',
      description: 'Identify high-leverage points and their impact'
    },
    {
      id: 'goodness-of-fit',
      label: 'Goodness-of-Fit Tests',
      description: 'Chi-square, Hosmer-Lemeshow, deviance tests'
    },
    {
      id: 'assumption-validation',
      label: 'Model Assumption Validation',
      description: 'Comprehensive checks for all model assumptions'
    }
  ];

  const handleDiagnosticToggle = (diagnosticId: string) => {
    const newSelection = selectedDiagnostics.includes(diagnosticId)
      ? selectedDiagnostics.filter(id => id !== diagnosticId)
      : [...selectedDiagnostics, diagnosticId];
    onDiagnosticsChange(newSelection);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Model Diagnostics & Validation
          </CardTitle>
          <CardDescription>
            Select the diagnostic and validation procedures to apply to your statistical models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnosticOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={option.id}
                  checked={selectedDiagnostics.includes(option.id)}
                  onCheckedChange={() => handleDiagnosticToggle(option.id)}
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
            Custom Diagnostics
          </CardTitle>
          <CardDescription>
            Specify any additional diagnostic procedures or validation methods you would like to include
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="custom-diagnostics" className="text-sm font-medium">
              Additional Diagnostic Methods
            </Label>
            <Textarea
              id="custom-diagnostics"
              placeholder="Enter any custom diagnostic procedures, validation techniques, or specific tests you want to include..."
              value={customDiagnostics}
              onChange={(e) => onCustomDiagnosticsChange(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};