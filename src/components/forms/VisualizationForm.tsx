import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface VisualizationFormProps {
  selectedGraphs: string[];
  onGraphsChange: (graphs: string[]) => void;
  selectedTables: string[];
  onTablesChange: (tables: string[]) => void;
  customVisualizations: string;
  onCustomVisualizationsChange: (visualizations: string) => void;
  customTables: string;
  onCustomTablesChange: (tables: string) => void;
}

export const VisualizationForm: React.FC<VisualizationFormProps> = ({
  selectedGraphs,
  onGraphsChange,
  selectedTables,
  onTablesChange,
  customVisualizations,
  onCustomVisualizationsChange,
  customTables,
  onCustomTablesChange,
}) => {
  const graphOptions = [
    {
      id: 'bar-charts',
      label: 'Bar Charts',
      description: 'Compare means or frequencies across groups'
    },
    {
      id: 'box-plots',
      label: 'Box Plots',
      description: 'Show distribution and outliers for each group'
    },
    {
      id: 'violin-plots',
      label: 'Violin Plots',
      description: 'Combine box plots with density estimation'
    },
    {
      id: 'scatter-plots',
      label: 'Scatter Plots',
      description: 'Show relationships between continuous variables'
    },
    {
      id: 'line-plots',
      label: 'Line Plots',
      description: 'Display trends over time or dose-response curves'
    },
    {
      id: 'heatmaps',
      label: 'Heatmaps',
      description: 'Visualize correlation matrices or expression patterns'
    },
    {
      id: 'volcano-plots',
      label: 'Volcano Plots',
      description: 'Plot fold change vs statistical significance'
    },
    {
      id: 'pca-plots',
      label: 'PCA Plots',
      description: 'Principal component analysis visualization'
    },
    {
      id: 'qq-plots',
      label: 'Q-Q Plots',
      description: 'Assess normality and model assumptions'
    },
    {
      id: 'residual-plots',
      label: 'Residual Plots',
      description: 'Diagnostic plots for model validation'
    },
    {
      id: 'forest-plots',
      label: 'Forest Plots',
      description: 'Display effect sizes with confidence intervals'
    },
    {
      id: 'dose-response',
      label: 'Dose-Response Curves',
      description: 'Fitted curves showing dose-response relationships'
    },
    {
      id: 'survival-curves',
      label: 'Survival Curves',
      description: 'Kaplan-Meier or parametric survival plots'
    },
    {
      id: 'roc-curves',
      label: 'ROC Curves',
      description: 'Receiver operating characteristic curves'
    },
    {
      id: 'manhattan-plots',
      label: 'Manhattan Plots',
      description: 'Genome-wide association study visualization'
    },
    {
      id: 'waterfall-plots',
      label: 'Waterfall Plots',
      description: 'Individual response patterns'
    }
  ];

  const tableOptions = [
    {
      id: 'summary-statistics',
      label: 'Summary Statistics',
      description: 'Mean, median, SD, quartiles by group'
    },
    {
      id: 'anova-table',
      label: 'ANOVA Table',
      description: 'Analysis of variance results with F-statistics'
    },
    {
      id: 'regression-table',
      label: 'Regression Table',
      description: 'Coefficients, standard errors, p-values'
    },
    {
      id: 'correlation-matrix',
      label: 'Correlation Matrix',
      description: 'Pairwise correlations between variables'
    },
    {
      id: 'pairwise-comparisons',
      label: 'Pairwise Comparisons',
      description: 'Multiple comparison results with adjusted p-values'
    },
    {
      id: 'model-diagnostics',
      label: 'Model Diagnostics',
      description: 'R-squared, AIC, BIC, residual statistics'
    },
    {
      id: 'effect-sizes',
      label: 'Effect Sizes',
      description: "Cohen's d, eta-squared, confidence intervals"
    },
    {
      id: 'contingency-tables',
      label: 'Contingency Tables',
      description: 'Cross-tabulation for categorical variables'
    },
    {
      id: 'dose-response-table',
      label: 'Dose-Response Parameters',
      description: 'IC50, EC50, Hill slope, and confidence intervals'
    },
    {
      id: 'survival-table',
      label: 'Survival Analysis Table',
      description: 'Hazard ratios, median survival times'
    },
    {
      id: 'classification-metrics',
      label: 'Classification Metrics',
      description: 'Sensitivity, specificity, PPV, NPV, accuracy'
    },
    {
      id: 'power-analysis',
      label: 'Power Analysis',
      description: 'Sample size calculations and achieved power'
    }
  ];

  const handleGraphToggle = (graphId: string) => {
    const newSelection = selectedGraphs.includes(graphId)
      ? selectedGraphs.filter(id => id !== graphId)
      : [...selectedGraphs, graphId];
    onGraphsChange(newSelection);
  };

  const handleTableToggle = (tableId: string) => {
    const newSelection = selectedTables.includes(tableId)
      ? selectedTables.filter(id => id !== tableId)
      : [...selectedTables, tableId];
    onTablesChange(newSelection);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Graphs and Visualizations
          </CardTitle>
          <CardDescription>
            Select the types of graphs and visual outputs you want to generate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {graphOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={option.id}
                  checked={selectedGraphs.includes(option.id)}
                  onCheckedChange={() => handleGraphToggle(option.id)}
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
            Tables and Reports
          </CardTitle>
          <CardDescription>
            Choose the types of tables and statistical reports to include
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tableOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={option.id}
                  checked={selectedTables.includes(option.id)}
                  onCheckedChange={() => handleTableToggle(option.id)}
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
              Custom Visualizations
            </CardTitle>
            <CardDescription>
              Specify any additional graphs or custom visualization requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="custom-visualizations" className="text-sm font-medium">
                Additional Graphs & Plots
              </Label>
              <Textarea
                id="custom-visualizations"
                placeholder="Describe any custom graphs, specialized plots, or specific visualization requirements you need..."
                value={customVisualizations}
                onChange={(e) => onCustomVisualizationsChange(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Custom Tables
            </CardTitle>
            <CardDescription>
              Define any additional tables or custom reporting requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="custom-tables" className="text-sm font-medium">
                Additional Tables & Reports
              </Label>
              <Textarea
                id="custom-tables"
                placeholder="Specify any custom tables, specialized reports, or specific formatting requirements you need..."
                value={customTables}
                onChange={(e) => onCustomTablesChange(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};