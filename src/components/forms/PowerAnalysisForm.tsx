import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const powerAnalysisMethods = [
  { id: 'ttest', label: 'T-test Power Analysis', description: 'Power calculation for two-sample t-tests' },
  { id: 'anova', label: 'ANOVA Power Analysis', description: 'Power calculation for analysis of variance' },
  { id: 'regression', label: 'Regression Power Analysis', description: 'Power calculation for linear regression models' },
  { id: 'correlation', label: 'Correlation Power Analysis', description: 'Power calculation for correlation tests' },
  { id: 'proportion', label: 'Proportion Power Analysis', description: 'Power calculation for proportion tests' },
  { id: 'nonparametric', label: 'Non-parametric Power Analysis', description: 'Power calculation for non-parametric tests' },
  { id: 'custom', label: 'Custom Power Analysis', description: 'Specify custom power analysis methods' }
];

const effectSizeOptions = [
  { id: 'small', label: 'Small Effect Size (Cohen\'s d = 0.2)', description: 'Minimal practical significance' },
  { id: 'medium', label: 'Medium Effect Size (Cohen\'s d = 0.5)', description: 'Moderate practical significance' },
  { id: 'large', label: 'Large Effect Size (Cohen\'s d = 0.8)', description: 'High practical significance' },
  { id: 'custom', label: 'Custom Effect Size', description: 'Specify custom effect size values' }
];

interface PowerAnalysisFormProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  selectedEffectSizes: string[];
  onEffectSizesChange: (sizes: string[]) => void;
  powerLevel: string;
  onPowerLevelChange: (power: string) => void;
  alphaLevel: string;
  onAlphaLevelChange: (alpha: string) => void;
  customEffectSize: string;
  onCustomEffectSizeChange: (size: string) => void;
  customMethods: string;
  onCustomMethodsChange: (methods: string) => void;
}

export const PowerAnalysisForm: React.FC<PowerAnalysisFormProps> = ({
  selectedMethod,
  onMethodChange,
  selectedEffectSizes,
  onEffectSizesChange,
  powerLevel,
  onPowerLevelChange,
  alphaLevel,
  onAlphaLevelChange,
  customEffectSize,
  onCustomEffectSizeChange,
  customMethods,
  onCustomMethodsChange,
}) => {
  const handleEffectSizeChange = (effectSizeId: string, checked: boolean) => {
    if (checked) {
      onEffectSizesChange([...selectedEffectSizes, effectSizeId]);
    } else {
      onEffectSizesChange(selectedEffectSizes.filter(id => id !== effectSizeId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Power Analysis & Sample Size Calculation</h3>
        <p className="text-muted-foreground mb-6">
          Configure power analysis methods to determine adequate sample sizes and evaluate statistical power.
        </p>
      </div>

      {/* Power Analysis Method */}
      <Card>
        <CardHeader>
          <CardTitle>Power Analysis Method</CardTitle>
          <CardDescription>Select the primary method for power calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
            {powerAnalysisMethods.map((method) => (
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

      {/* Effect Size Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Effect Size Specification</CardTitle>
          <CardDescription>Select expected effect sizes for power calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {effectSizeOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={option.id}
                  checked={selectedEffectSizes.includes(option.id)}
                  onCheckedChange={(checked) => handleEffectSizeChange(option.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedEffectSizes.includes('custom') && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="customEffectSize" className="text-sm font-medium">
                Custom Effect Size Values
              </Label>
              <Textarea
                id="customEffectSize"
                placeholder="Specify custom effect size values (e.g., Cohen's d = 0.3, eta-squared = 0.06, etc.)"
                value={customEffectSize}
                onChange={(e) => onCustomEffectSizeChange(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistical Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Statistical Parameters</CardTitle>
          <CardDescription>Set power and significance levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="powerLevel" className="text-sm font-medium">
                Power Level (1 - β)
              </Label>
              <Input
                id="powerLevel"
                type="number"
                min="0.01"
                max="0.99"
                step="0.01"
                placeholder="0.80"
                value={powerLevel}
                onChange={(e) => onPowerLevelChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Typically 0.80 (80%) or 0.90 (90%)</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alphaLevel" className="text-sm font-medium">
                Alpha Level (α)
              </Label>
              <Input
                id="alphaLevel"
                type="number"
                min="0.001"
                max="0.1"
                step="0.001"
                placeholder="0.05"
                value={alphaLevel}
                onChange={(e) => onAlphaLevelChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Typically 0.05 or 0.01</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Methods */}
      {selectedMethod === 'custom' && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Power Analysis Methods</CardTitle>
            <CardDescription>Describe additional or custom power analysis approaches</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe custom power analysis methods, simulation approaches, or specialized calculations..."
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