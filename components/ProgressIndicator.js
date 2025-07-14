import React from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const ProgressIndicator = ({ currentStep, steps }) => {
    const { isNepali } = useTranslation();
    
    const defaultSteps = isNepali
        ? [
            { id: 1, label: 'प्रयोगकर्ता विवरण' },
            { id: 2, label: 'कागजातहरू' },
            { id: 3, label: 'भुक्तानी प्रमाण' },
            { id: 4, label: 'पुनरावलोकन' },
            { id: 5, label: 'सम्झौता' }
        ]
        : [
            { id: 1, label: 'User Details' },
            { id: 2, label: 'Documents' },
            { id: 3, label: 'Payment Proof' },
            { id: 4, label: 'Review' },
            { id: 5, label: 'Agreement' }
        ];

    const stepData = steps || defaultSteps;

    return (
        <div className="w-full px-2 sm:px-4 mb-6 sm:mb-8">
            {/* Mobile Layout (< 640px) */}
            <div className="block sm:hidden">
                <div className="relative">
                    {stepData.map((step, index) => (
                        <div key={step.id} className="relative flex items-center mb-6 last:mb-0">
                            {/* Progress Line - positioned behind the circle */}
                            {index < stepData.length - 1 && (
                                <div className="absolute left-4 top-8 w-0.5 h-6 -ml-px z-0">
                                    <div className={`
                                        w-full h-full transition-all duration-300
                                        ${currentStep > step.id ? 'bg-blue-900' : 'bg-gray-300'}
                                    `}></div>
                                </div>
                            )}
                            
                            {/* Step Circle */}
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                                transition-colors duration-300 flex-shrink-0 relative z-10
                                ${currentStep >= step.id ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-900'}
                            `}>
                                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                            </div>
                            
                            {/* Step Label */}
                            <div className={`
                                ml-3 text-sm font-medium
                                ${currentStep >= step.id ? 'text-blue-900' : 'text-gray-500'}
                            `}>
                                {step.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tablet and Desktop Layout (>= 640px) */}
            <div className="hidden sm:block">
                <div className="relative flex justify-between items-center">
                    {stepData.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center flex-1 relative">
                            {/* Connecting Line */}
                            {index < stepData.length - 1 && (
                                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-300 -translate-y-1/2 z-0">
                                    <div className={`
                                        h-full transition-all duration-500
                                        ${currentStep > step.id ? 'bg-blue-900 w-full' : 'bg-gray-300 w-0'}
                                    `}></div>
                                </div>
                            )}
                            
                            {/* Step Circle */}
                            <div className={`
                                z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center 
                                text-xs sm:text-sm font-semibold transition-colors duration-300
                                ${currentStep >= step.id ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-900'}
                            `}>
                                {currentStep > step.id ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.id}
                            </div>

                            {/* Step Label */}
                            <div className={`
                                mt-2 text-xs sm:text-sm text-center px-1 leading-tight
                                ${currentStep >= step.id ? 'text-blue-900 font-bold' : 'text-gray-500'}
                                max-w-[80px] sm:max-w-none
                            `}>
                                {step.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProgressIndicator;