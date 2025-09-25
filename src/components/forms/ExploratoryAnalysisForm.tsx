import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BarChart3 } from 'lucide-react';

interface ExploratoryAnalysisFormProps {
  selectedMethods: string[];
  onMethodsChange: (methods: string[]) => void;
  customMethods: string;
  onCustomMethodsChange: (methods: string) => void;
}

export const ExploratoryAnalysisForm: React.FC<ExploratoryAnalysisFormProps> = ({
  selectedMethods,
  onMethodsChange,
  customMethods,
  onCustomMethodsChange,
}) => {
  const analysisOptions = [
    {
      id: 'pca',
      label: 'PCA (Principal Component Analysis)',
      description: 'Dimensional reduction and pattern identification'
    },
    {
      id: 'heatmaps',
      label: 'Heat Maps',
      description: 'Visual correlation matrices and clustering'
    },
    {
      id: 'volcano-plots',
      label: 'Volcano Plots',
      description: 'Statistical significance vs fold-change visualization'
    },
    {
      id: 'individual-analyte',
      label: 'Individual Analyte Comparison',
      description: 'Single biomarker analysis and trends'
    }
  ];

  const handleMethodToggle = (methodId: string) => {
    const updatedMethods = selectedMethods.includes(methodId)
      ? selectedMethods.filter(id => id !== methodId)
      : [...selectedMethods, methodId];
    onMethodsChange(updatedMethods);
  };

  return (
    <div className="space-y-6">
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Analysis Methods
          </CardTitle>
          <CardDescription>
            Select the exploratory analysis methods you want to include in your pipeline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisOptions.map((option) => (
            <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
              <Checkbox
                id={option.id}
                checked={selectedMethods.includes(option.id)}
                onCheckedChange={() => handleMethodToggle(option.id)}
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
        </CardContent>
      </Card>

      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="text-base">Custom Analysis Methods</CardTitle>
          <CardDescription>
            Specify any additional exploratory analysis methods not listed above
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter custom analysis methods, one per line..."
            value={customMethods}
            onChange={(e) => onCustomMethodsChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
};