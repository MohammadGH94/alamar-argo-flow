import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const qcSteps = [
  { id: 'missing-data', label: 'Missing Data Detection', description: 'Identify and flag missing values' },
  { id: 'outlier-detection', label: 'Outlier Detection', description: 'Statistical outlier identification' },
  { id: 'duplicate-removal', label: 'Duplicate Removal', description: 'Remove duplicate records or samples' },
  { id: 'range-validation', label: 'Range Validation', description: 'Validate data within expected ranges' },
  { id: 'consistency-checks', label: 'Consistency Checks', description: 'Cross-field validation and logic checks' },
  { id: 'format-validation', label: 'Format Validation', description: 'Ensure proper data formatting' },
  { id: 'completeness-check', label: 'Completeness Check', description: 'Verify required fields are populated' },
];

interface QCFormProps {
  selectedQCSteps: string[];
  onQCStepsChange: (steps: string[]) => void;
  qualityThreshold: string;
  onQualityThresholdChange: (threshold: string) => void;
  customQCSteps: string;
  onCustomQCStepsChange: (steps: string) => void;
}

export const QCForm: React.FC<QCFormProps> = ({
  selectedQCSteps,
  onQCStepsChange,
  qualityThreshold,
  onQualityThresholdChange,
  customQCSteps,
  onCustomQCStepsChange,
}) => {
  const handleQCStepChange = (stepId: string, checked: boolean) => {
    if (checked) {
      onQCStepsChange([...selectedQCSteps, stepId]);
    } else {
      onQCStepsChange(selectedQCSteps.filter(id => id !== stepId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold text-foreground mb-4 block">
          Quality Control Steps
        </Label>
        <div className="grid grid-cols-1 gap-4">
          {qcSteps.map((step) => (
            <div key={step.id} className="flex items-start space-x-3">
              <Checkbox
                id={step.id}
                checked={selectedQCSteps.includes(step.id)}
                onCheckedChange={(checked) => 
                  handleQCStepChange(step.id, checked as boolean)
                }
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor={step.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {step.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="quality-threshold" className="text-base font-semibold text-foreground mb-2 block">
          Quality Threshold (%)
        </Label>
        <Input
          id="quality-threshold"
          type="number"
          min="0"
          max="100"
          placeholder="95"
          value={qualityThreshold}
          onChange={(e) => onQualityThresholdChange(e.target.value)}
          className="max-w-[200px]"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Minimum percentage of data that must pass QC checks to proceed.
        </p>
      </div>

      <div>
        <Label htmlFor="custom-qc-steps" className="text-base font-semibold text-foreground mb-2 block">
          Custom QC Procedures
        </Label>
        <Textarea
          id="custom-qc-steps"
          placeholder="Describe any custom quality control procedures or domain-specific validation rules..."
          value={customQCSteps}
          onChange={(e) => onCustomQCStepsChange(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Optional: Define additional QC steps specific to your analysis needs.
        </p>
      </div>
    </div>
  );
};