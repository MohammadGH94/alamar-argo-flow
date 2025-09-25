import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';

interface DataTransformationFormProps {
  selectedTransformations: string[];
  onTransformationsChange: (transformations: string[]) => void;
  customTransformations: string;
  onCustomTransformationsChange: (transformations: string) => void;
}

export const DataTransformationForm: React.FC<DataTransformationFormProps> = ({
  selectedTransformations,
  onTransformationsChange,
  customTransformations,
  onCustomTransformationsChange,
}) => {
  const transformationOptions = [
    {
      id: 'log-transform',
      label: 'Log Transformation',
      description: 'Natural logarithm transformation for right-skewed data'
    },
    {
      id: 'sqrt-transform',
      label: 'Square Root Transformation',
      description: 'Square root transformation for moderately skewed data'
    },
    {
      id: 'box-cox',
      label: 'Box-Cox Transformation',
      description: 'Power transformation to stabilize variance and normalize'
    },
    {
      id: 'z-score',
      label: 'Z-Score Normalization',
      description: 'Standardization using mean and standard deviation'
    },
    {
      id: 'min-max',
      label: 'Min-Max Scaling',
      description: 'Scale features to a fixed range (typically 0-1)'
    },
    {
      id: 'robust-scaling',
      label: 'Robust Scaling',
      description: 'Scale using median and interquartile range'
    },
    {
      id: 'quantile-transform',
      label: 'Quantile Transformation',
      description: 'Transform to uniform or normal distribution'
    },
    {
      id: 'power-transform',
      label: 'Power Transformation',
      description: 'Yeo-Johnson or Box-Cox power transformation'
    }
  ];

  const handleTransformationToggle = (transformationId: string) => {
    const updatedTransformations = selectedTransformations.includes(transformationId)
      ? selectedTransformations.filter(id => id !== transformationId)
      : [...selectedTransformations, transformationId];
    onTransformationsChange(updatedTransformations);
  };

  return (
    <div className="space-y-6">
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            Transformation Algorithms
          </CardTitle>
          <CardDescription>
            Select the data transformation methods to apply before analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transformationOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
                <Checkbox
                  id={option.id}
                  checked={selectedTransformations.includes(option.id)}
                  onCheckedChange={() => handleTransformationToggle(option.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <Label 
                    htmlFor={option.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="text-base">Custom Transformation Methods</CardTitle>
          <CardDescription>
            Specify any additional transformation algorithms not listed above
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter custom transformation methods (e.g., Inverse hyperbolic sine transformation, Custom polynomial transformation)..."
            value={customTransformations}
            onChange={(e) => onCustomTransformationsChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
};