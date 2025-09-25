import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Clock, BarChart } from 'lucide-react';

interface GroupComparisonFormProps {
  numberOfGroups: string;
  onNumberOfGroupsChange: (value: string) => void;
  dataType: string;
  onDataTypeChange: (value: string) => void;
  timePoints: string;
  onTimePointsChange: (value: string) => void;
  selectedModels: string[];
  onModelsChange: (models: string[]) => void;
  useMachineLearning: boolean;
  onMachineLearningChange: (value: boolean) => void;
}

export const GroupComparisonForm: React.FC<GroupComparisonFormProps> = ({
  numberOfGroups,
  onNumberOfGroupsChange,
  dataType,
  onDataTypeChange,
  timePoints,
  onTimePointsChange,
  selectedModels,
  onModelsChange,
  useMachineLearning,
  onMachineLearningChange,
}) => {
  const modelOptions = [
    {
      id: 'logistic-regression',
      label: 'Logistic Regression',
      description: 'For binary or categorical outcomes'
    },
    {
      id: 'linear-regression',
      label: 'Linear Regression',
      description: 'For continuous outcomes'
    },
    {
      id: 'limma',
      label: 'LIMMA',
      description: 'Linear models for microarray/omics data'
    },
    {
      id: 'mixed-effects',
      label: 'Mixed-Effect Modeling',
      description: 'For hierarchical or repeated measures data'
    }
  ];

  const handleModelToggle = (modelId: string) => {
    const updatedModels = selectedModels.includes(modelId)
      ? selectedModels.filter(id => id !== modelId)
      : [...selectedModels, modelId];
    onModelsChange(updatedModels);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              Study Design
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groups">Number of Groups</Label>
              <Input
                id="groups"
                type="number"
                min="2"
                placeholder="e.g., 3"
                value={numberOfGroups}
                onChange={(e) => onNumberOfGroupsChange(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data-type">Data Type</Label>
              <Select value={dataType} onValueChange={onDataTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cross-sectional">Cross-sectional</SelectItem>
                  <SelectItem value="longitudinal">Longitudinal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Temporal Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timepoints">Number of Time Points</Label>
              <Input
                id="timepoints"
                type="number"
                min="1"
                placeholder="e.g., 4"
                value={timePoints}
                onChange={(e) => onTimePointsChange(e.target.value)}
                disabled={dataType !== 'longitudinal'}
              />
              {dataType !== 'longitudinal' && (
                <p className="text-xs text-muted-foreground">
                  Available for longitudinal data only
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Statistical Models
          </CardTitle>
          <CardDescription>
            Select the statistical modeling approaches for your analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {modelOptions.map((model) => (
            <div key={model.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
              <Checkbox
                id={model.id}
                checked={selectedModels.includes(model.id)}
                onCheckedChange={() => handleModelToggle(model.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-1">
                <Label 
                  htmlFor={model.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {model.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {model.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="text-base">Machine Learning</CardTitle>
          <CardDescription>
            Enable machine learning approaches for pattern discovery and prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="machine-learning"
              checked={useMachineLearning}
              onCheckedChange={onMachineLearningChange}
            />
            <Label htmlFor="machine-learning" className="cursor-pointer">
              Include machine learning methods in the analysis pipeline
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};