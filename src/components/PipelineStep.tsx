import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PipelineStepProps {
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed';
  isLast?: boolean;
  children?: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const PipelineStep: React.FC<PipelineStepProps> = ({
  stepNumber,
  title,
  description,
  status,
  isLast = false,
  children,
  onNext,
  onPrevious,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-step-complete" />;
      case 'current':
        return <Circle className="h-6 w-6 text-step-current fill-step-current" />;
      default:
        return <Circle className="h-6 w-6 text-step-pending" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'border-step-complete bg-accent-light/10';
      case 'current':
        return 'border-step-current bg-secondary-light/10 shadow-glow';
      default:
        return 'border-step-pending bg-muted/30';
    }
  };

  return (
    <div className="relative">
      {/* Step connector line */}
      {!isLast && (
        <div className="absolute left-8 top-16 h-24 w-0.5 bg-border" />
      )}
      
      <Card className={cn(
        "transition-all duration-300 hover:shadow-medium",
        getStatusColor()
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-full bg-background p-2 shadow-soft">
              {getStatusIcon()}
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {stepNumber}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span>{title}</span>
              </CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        {status === 'current' && children && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              {children}
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={onPrevious}
                  disabled={stepNumber === 1}
                  className="transition-smooth"
                >
                  Previous
                </Button>
                <Button
                  onClick={onNext}
                  className="bg-gradient-primary hover:opacity-90 transition-smooth"
                >
                  {isLast ? 'Complete Pipeline' : 'Next Step'}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};