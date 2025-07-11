import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const AgreementForm = ({ formData, errors, onInputChange }) => {
    const { isNepali } = useTranslation();

    const agreements = [
        {
            name: 'termsAccepted',
            title: isNepali ? 'सर्तहरू र नियमहरू *' : 'Terms and Conditions *',
            description: isNepali
                ? 'म नेपाली श्रम पोर्टलको सर्तहरूमा सहमत छु। मैले झुटो जानकारी दिएमा मेरो आवेदन अस्वीकृत हुन सक्छ भन्ने मलाई थाहा छ।'
                : 'I agree to the terms and conditions of the Nepali Shram Portal. I understand that providing false information may result in rejection of my application.'
        },
        {
            name: 'privacyAccepted',
            title: isNepali ? 'गोपनीयता नीति *' : 'Privacy Policy *',
            description: isNepali
                ? 'म आफ्नो व्यक्तिगत डाटाको सङ्कलन, प्रशोधन, र भण्डारणमा गोपनीयता नीतिको अधीनमा सहमत छु।'
                : 'I consent to the collection, processing, and storage of my personal data in accordance with the privacy policy.'
        },
        {
            name: 'dataProcessingAccepted',
            title: isNepali ? 'सम्झौता *' : 'Agreement *',
            description: isNepali
                ? 'म रोजगारीको प्रयोजनको लागि मेरो डाटा प्रशोधन गर्न सहमति दिन्छु र मेरो जानकारी सम्बन्धित निकाय र रोजगारदातासँग साझा हुन सक्छ भन्ने बुझ्दछु।'
                : 'I authorize the processing of my data for employment purposes and understand that my information may be shared with relevant authorities and employers.'
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

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                    {isNepali ? 'सर्तहरू र सहमति' : 'Terms & Agreement'}
                </h2>
            </div>

            <div className="space-y-4">
                {agreements.map((agreement) => (
                    <div
                        key={agreement.name}
                        className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => handleCheckboxChange(agreement.name, !formData[agreement.name])}
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                                <input
                                    type="checkbox"
                                    name={agreement.name}
                                    checked={formData[agreement.name]}
                                    onChange={() => {}} // Click handled by div
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded pointer-events-none"
                                />
                            </div>
                            <div className="ml-3 flex-1">
                                <label className="text-lg font-semibold text-gray-900 cursor-pointer">
                                    {agreement.title}
                                </label>
                                <p className="text-sm text-gray-700 mt-1">
                                    {agreement.description}
                                </p>
                            </div>
                        </div>
                        {errors[agreement.name] && (
                            <p className="text-red-500 text-sm mt-2 ml-8">{errors[agreement.name]}</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                    {isNepali ? 'आवेदन सारांश' : 'Application Summary'}
                </h3>
                <div className="text-sm text-blue-800 space-y-1">
                    <p>• {isNepali ? 'व्यक्तिगत विवरण भरिएको छ' : 'Personal information completed'}</p>
                    <p>• {isNepali ? 'कागजातहरू सफलतापूर्वक अपलोड गरियो' : 'Documents uploaded successfully'}</p>
                    <p>• {isNepali ? 'सबै सहमतिहरू स्वीकृत गरियो' : 'All agreements accepted'}</p>
                </div>
            </div>
        </div>
    );
};

export default AgreementForm;
