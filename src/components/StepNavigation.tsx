import React from 'react';
import { ChevronRight, Check, FileText, Sparkles, Video, Download } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  icon: React.ComponentType<any>;
}

interface StepNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  allowNavigation?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  currentStep, 
  onStepClick, 
  allowNavigation = true 
}) => {
  const steps: Step[] = [
    { id: 1, name: '動画詳細', icon: FileText },
    { id: 2, name: '構成案選択', icon: Sparkles },
    { id: 3, name: '動画生成', icon: Video },
    { id: 4, name: '完了', icon: Download }
  ];

  const handleStepClick = (stepId: number) => {
    if (!allowNavigation) return;
    
    // Only allow going back to previous steps
    if (stepId < currentStep) {
      onStepClick(stepId);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isClickable = allowNavigation && step.id < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isClickable}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                        : isActive 
                          ? 'bg-orange-100 text-orange-600 border-2 border-orange-500' 
                          : 'bg-gray-100 text-gray-400'
                    } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </button>
                  <span className={`ml-3 text-sm font-medium transition-colors ${
                    isActive ? 'text-orange-600' : isCompleted ? 'text-orange-500' : 'text-gray-400'
                  } ${isClickable ? 'hover:text-orange-700 cursor-pointer' : ''}`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-300 mx-4" />
                )}
              </div>
            );
          })}
        </div>
        
        {allowNavigation && currentStep > 1 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              前のステップをクリックして戻ることができます
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;