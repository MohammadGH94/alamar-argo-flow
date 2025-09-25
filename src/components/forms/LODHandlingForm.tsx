import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const lodMethods = [
  { 
    id: 'substitute-lod2', 
    label: 'Substitute with LOD/2', 
    description: 'Replace below LOD values with half the limit of detection' 
  },
  { 
    id: 'substitute-lod-sqrt2', 
    label: 'Substitute with LOD/√2', 
    description: 'Replace below LOD values with LOD divided by square root of 2' 
  },
  { 
    id: 'imputation', 
    label: 'Statistical Imputation', 
    description: 'Use statistical methods to estimate below LOD values' 
  },
  { 
    id: 'flag-only', 
    label: 'Flag Only', 
    description: 'Keep original values but flag as below LOD' 
  },
  { 
    id: 'remove', 
    label: 'Remove Samples', 
    description: 'Exclude samples with below LOD values from analysis' 
  },
  { 
    id: 'custom', 
    label: 'Custom Method', 
    description: 'Define your own approach for handling below LOD values' 
  },
];

interface LODHandlingFormProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  lodThreshold: string;
  onLODThresholdChange: (threshold: string) => void;
  customMethod: string;
  onCustomMethodChange: (method: string) => void;
}

export const LODHandlingForm: React.FC<LODHandlingFormProps> = ({
  selectedMethod,
  onMethodChange,
  lodThreshold,
  onLODThresholdChange,
  customMethod,
  onCustomMethodChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold text-foreground mb-4 block">
          Below LOD Handling Method
        </Label>
        <RadioGroup
          value={selectedMethod}
          onValueChange={onMethodChange}
          className="space-y-3"
        >
          {lodMethods.map((method) => (
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
        <Label htmlFor="lod-threshold" className="text-base font-semibold text-foreground mb-2 block">
          LOD Threshold Percentage
        </Label>
        <Input
          id="lod-threshold"
          type="number"
          min="0"
          max="100"
          placeholder="50"
          value={lodThreshold}
          onChange={(e) => onLODThresholdChange(e.target.value)}
          className="max-w-[200px]"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Percentage of samples that must be above LOD to include the analyte in analysis.
        </p>
      </div>

      {selectedMethod === 'custom' && (
        <div>
          <Label htmlFor="custom-method" className="text-base font-semibold text-foreground mb-2 block">
            Custom LOD Handling Method
          </Label>
          <Textarea
            id="custom-method"
            placeholder="Describe your custom method for handling below LOD values..."
            value={customMethod}
            onChange={(e) => onCustomMethodChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Provide detailed description of your custom approach.
          </p>
        </div>
      )}
    </div>
  );
};