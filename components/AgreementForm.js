import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const AgreementForm = ({ formData, errors, onInputChange }) => {
    const { isNepali } = useTranslation();

    const agreements = [
        {
            name: 'termsAccepted',
            title: isNepali ? 'सर्तहरू मान्छु *' : 'I agree to terms *',
            description: isNepali
                ? 'म यी सर्तहरूमा सहमत छु। झुटो जानकारी दिएमा मेरो आवेदन रद्द हुन्छ।'
                : 'I agree to these terms. False information will cancel my application.',
            linkText: isNepali ? 'सर्तहरू हेर्नुहोस्' : 'View terms',
            linkUrl: 'https://nepalishram.com/privacypolicy'
        },
        {
            name: 'privacyAccepted',
            title: isNepali ? 'गोपनीयता मान्छु *' : 'I agree to privacy *',
            description: isNepali
                ? 'म मेरो जानकारी सुरक्षित राख्न सहमत छु।'
                : 'I agree to keep my information safe.',
            linkText: isNepali ? 'गोपनीयता हेर्नुहोस्' : 'View privacy',
            linkUrl: 'https://nepalishram.com/privacypolicy'
        },
        {
            name: 'dataProcessingAccepted',
            title: isNepali ? 'डाटा प्रयोग मान्छु *' : 'I agree to data use *',
            description: isNepali
                ? 'म मेरो जानकारी काम खोज्नका लागि प्रयोग गर्न दिन्छु।'
                : 'I allow my information to be used for job search.',
            linkText: isNepali ? 'डाटा नीति हेर्नुहोस्' : 'View data policy',
            linkUrl: 'https://nepalishram.com/agreement'
        }
    ];

    const handleCheckboxChange = (name, checked) => {
        onInputChange({
            target: {
                name,
                type: 'checkbox',
                checked
            }
        });
    };

    const handleLinkClick = (e, url) => {
        e.stopPropagation();
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 md:p-6">
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex items-center mb-4 sm:mb-6">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                        {isNepali ? 'सहमति' : 'Agreement'}
                    </h2>
                </div>

                {/* Agreements List */}
                <div className="space-y-3 sm:space-y-4">
                    {agreements.map((agreement) => (
                        <div
                            key={agreement.name}
                            className="border rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => handleCheckboxChange(agreement.name, !formData[agreement.name])}
                        >
                            <div className="flex items-start space-x-3">
                                {/* Checkbox */}
                                <div className="flex-shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        name={agreement.name}
                                        checked={formData[agreement.name] || false}
                                        onChange={() => {}}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded pointer-events-none"
                                        required
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <label className="text-sm sm:text-base font-medium text-gray-900 cursor-pointer">
                                            {agreement.title}
                                        </label>
                                        
                                        {/* Link Button */}
                                        <button
                                            onClick={(e) => handleLinkClick(e, agreement.linkUrl)}
                                            className="flex items-center text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition-colors duration-200 group self-start sm:self-center"
                                        >
                                            <span className="mr-1">{agreement.linkText}</span>
                                            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                                        </button>
                                    </div>
                                    
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                                        {agreement.description}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Error Message */}
                            {errors[agreement.name] && (
                                <div className="mt-2 ml-7">
                                    <p className="text-red-500 text-xs sm:text-sm font-medium">{errors[agreement.name]}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Application Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-medium text-blue-900 mb-2 sm:mb-3">
                        {isNepali ? 'सारांश' : 'Summary'}
                    </h3>
                    <div className="text-xs sm:text-sm text-blue-800 space-y-1 sm:space-y-2">
                        <div className="flex items-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                            <p>{isNepali ? 'व्यक्तिगत विवरण पूरा' : 'Personal details done'}</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                            <p>{isNepali ? 'कागजातहरू अपलोड पूरा' : 'Documents uploaded'}</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                            <p>{isNepali ? 'सबै सहमति पूरा' : 'All agreements done'}</p>
                        </div>
                    </div>
                </div>

                {/* Required Fields Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-amber-800 flex items-start">
                        <span className="text-red-500 mr-1 flex-shrink-0">*</span>
                        <span>
                            {isNepali 
                                ? 'सबै बक्स चेक गर्नुहोस्।'
                                : 'Check all boxes to continue.'
                            }
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AgreementForm