import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MultipleTestingCorrectionFormProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  selectedAdditionalMethods: string[];
  onAdditionalMethodsChange: (methods: string[]) => void;
  customMethods: string;
  onCustomMethodsChange: (methods: string) => void;
}

export const MultipleTestingCorrectionForm: React.FC<MultipleTestingCorrectionFormProps> = ({
  selectedMethod,
  onMethodChange,
  selectedAdditionalMethods,
  onAdditionalMethodsChange,
  customMethods,
  onCustomMethodsChange,
}) => {
  const primaryMethods = [
    {
      id: 'bonferroni',
      label: 'Bonferroni Correction',
      description: 'Conservative method: p-value × number of tests'
    },
    {
      id: 'fdr-bh',
      label: 'FDR (Benjamini-Hochberg)',
      description: 'Controls false discovery rate, less conservative than Bonferroni'
    },
    {
      id: 'fdr-by',
      label: 'FDR (Benjamini-Yekutieli)',
      description: 'More conservative FDR method for dependent tests'
    },
    {
      id: 'holm',
      label: 'Holm-Bonferroni',
      description: 'Step-down method, less conservative than Bonferroni'
    },
    {
      id: 'hochberg',
      label: 'Hochberg Step-Up',
      description: 'Step-up method, uniformly more powerful than Holm'
    },
    {
      id: 'sidak',
      label: 'Šidák Correction',
      description: 'Less conservative than Bonferroni for independent tests'
    },
    {
      id: 'none',
      label: 'No Correction',
      description: 'Use uncorrected p-values (not recommended for multiple testing)'
    }
  ];

  const additionalMethods = [
    {
      id: 'hommel',
      label: 'Hommel Method',
      description: 'Closed testing procedure, uniformly more powerful than Hochberg'
    },
    {
      id: 'fwer-romano',
      label: 'Romano-Wolf FWER',
      description: 'Bootstrap-based family-wise error rate control'
    },
    {
      id: 'q-value',
      label: 'Q-value (Storey)',
      description: 'Positive false discovery rate control'
    },
    {
      id: 'local-fdr',
      label: 'Local FDR',
      description: 'Local false discovery rate estimation'
    },
    {
      id: 'adaptive-fdr',
      label: 'Adaptive FDR',
      description: 'Adaptive Benjamini-Hochberg procedure'
    },
    {
      id: 'permutation',
      label: 'Permutation-based',
      description: 'Empirical p-value correction via permutation testing'
    }
  ];

  const handleAdditionalMethodToggle = (methodId: string) => {
    const newSelection = selectedAdditionalMethods.includes(methodId)
      ? selectedAdditionalMethods.filter(id => id !== methodId)
      : [...selectedAdditionalMethods, methodId];
    onAdditionalMethodsChange(newSelection);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Primary Correction Method
          </CardTitle>
          <CardDescription>
            Select the main multiple testing correction method to apply
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={onMethodChange} className="space-y-3">
            {primaryMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={method.id}
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    {method.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {method.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Additional Correction Methods
          </CardTitle>
          <CardDescription>
            Select any additional correction methods for comparison or sensitivity analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={method.id}
                  checked={selectedAdditionalMethods.includes(method.id)}
                  onCheckedChange={() => handleAdditionalMethodToggle(method.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={method.id}
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    {method.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {method.description}
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
            Custom Correction Methods
          </CardTitle>
          <CardDescription>
            Specify any custom or specialized multiple testing correction approaches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="custom-methods" className="text-sm font-medium">
              Additional Correction Methods
            </Label>
            <Textarea
              id="custom-methods"
              placeholder="Describe any custom multiple testing correction methods, specialized procedures, or specific software implementations you want to use..."
              value={customMethods}
              onChange={(e) => onCustomMethodsChange(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};