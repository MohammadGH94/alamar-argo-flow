import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const normalizationMethods = [
  { 
    id: 'median-centering', 
    label: 'Median Centering', 
    description: 'Center data around the median value for each plate/lot' 
  },
  { 
    id: 'z-score', 
    label: 'Z-Score Normalization', 
    description: 'Standardize using mean and standard deviation' 
  },
  { 
    id: 'quantile', 
    label: 'Quantile Normalization', 
    description: 'Make distributions identical across plates/lots' 
  },
  { 
    id: 'combat', 
    label: 'ComBat Batch Correction', 
    description: 'Remove batch effects while preserving biological variation' 
  },
  { 
    id: 'bridge-samples', 
    label: 'Bridge Sample Correction', 
    description: 'Use bridge samples to adjust for batch effects' 
  },
  { 
    id: 'custom', 
    label: 'Custom Method', 
    description: 'Define your own normalization approach' 
  },
];

const bridgingOptions = [
  'Pooled QC samples',
  'Reference standards',
  'Internal controls',
  'Duplicate samples across plates',
  'Custom bridge sample strategy',
];

interface NormalizationFormProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  selectedBridgingOptions: string[];
  onBridgingOptionsChange: (options: string[]) => void;
  customMethod: string;
  onCustomMethodChange: (method: string) => void;
}

export const NormalizationForm: React.FC<NormalizationFormProps> = ({
  selectedMethod,
  onMethodChange,
  selectedBridgingOptions,
  onBridgingOptionsChange,
  customMethod,
  onCustomMethodChange,
}) => {
  const handleBridgingOptionChange = (option: string, checked: boolean) => {
    if (checked) {
      onBridgingOptionsChange([...selectedBridgingOptions, option]);
    } else {
      onBridgingOptionsChange(selectedBridgingOptions.filter(opt => opt !== option));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold text-foreground mb-4 block">
          Normalization Method
        </Label>
        <RadioGroup
          value={selectedMethod}
          onValueChange={onMethodChange}
          className="space-y-3"
        >
          {normalizationMethods.map((method) => (
            <div key={method.id} className="flex items-start space-x-3">
              <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
              <div className="flex-1">
                <Label
                  htmlFor={method.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {method.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-semibold text-foreground mb-4 block">
          Bridging Strategy
        </Label>
        <div className="space-y-3">
          {bridgingOptions.map((option) => (
            <div key={option} className="flex items-start space-x-3">
              <Checkbox
                id={option}
                checked={selectedBridgingOptions.includes(option)}
                onCheckedChange={(checked) => 
                  handleBridgingOptionChange(option, checked as boolean)
                }
                className="mt-1"
              />
              <Label
                htmlFor={option}
                className="text-sm font-medium cursor-pointer flex-1"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {selectedMethod === 'custom' && (
        <div>
          <Label htmlFor="custom-normalization" className="text-base font-semibold text-foreground mb-2 block">
            Custom Normalization Method
          </Label>
          <Textarea
            id="custom-normalization"
            placeholder="Describe your custom normalization and bridging approach..."
            value={customMethod}
            onChange={(e) => onCustomMethodChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Provide detailed description of your normalization strategy.
          </p>
        </div>
      )}
    </div>
  );
};