import React from 'react';
import { Eye, User, FileText, CheckCircle, X, CreditCard } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const ApplicationReview = ({ formData, onGoToStep }) => {
    const { isNepali } = useTranslation();

    const text = {
        reviewTitle: isNepali ? 'आवेदन पुनरावलोकन गर्नुहोस्' : 'Review Your Application',
        personalInfo: isNepali ? 'व्यक्तिगत जानकारी' : 'Personal Information',
        fullName: isNepali ? 'पूरा नाम' : 'Full Name',
        email: isNepali ? 'इमेल ठेगाना' : 'Email Address',
        phone: isNepali ? 'फोन नम्बर' : 'Phone Number',
        whatsapp: isNepali ? 'व्हाट्सएप नम्बर' : 'WhatsApp Number',
        passport: isNepali ? 'पासपोर्ट नम्बर' : 'Passport Number',
        documents: isNepali ? 'अपलोड गरिएका कागजातहरू' : 'Uploaded Documents',
        notUploaded: isNepali ? 'अपलोड गरिएको छैन' : 'Not uploaded',
        view: isNepali ? 'हेर्नुहोस्' : 'View',
        fileSizeUnit: isNepali ? 'मेगाबाइट' : 'MB',
        makeChanges: isNepali ? 'परिवर्तन गर्नु पर्छ?' : 'Need to make changes?',
        editInfo: isNepali ? 'व्यक्तिगत जानकारी सम्पादन गर्नुहोस्' : 'Edit Personal Information',
        editDocs: isNepali ? 'कागजात सम्पादन गर्नुहोस्' : 'Edit Documents',
        editPayment: isNepali ? 'भुक्तानी सम्पादन गर्नुहोस्' : 'Edit Payment'
    };

    const documentConfig = isNepali
        ? [
            { name: 'passport_front', label: 'पासपोर्ट अगाडिको पाना', required: true },
            { name: 'valid_visa', label: 'वैध भिसा', required: false },
            { name: 'labor_visa_front', label: 'लेबर भिसा अगाडिको पाना', required: true },
            { name: 'labor_visa_back', label: 'लेबर भिसा पछाडिको पाना', required: false },
            { name: 'arrival', label: 'आगमन कागजात', required: true },
            { name: 'agreement_paper', label: 'सम्झौता कागजात', required: true },
            { name: 'passport_back', label: 'पासपोर्ट पछाडिको पाना (MRP भए आवश्यक छैन)', required: true },
            { name: 'previous_visa', label: 'अघिल्लो भिसा', required: false },
            { name: 'departure', label: 'प्रस्थान कागजात', required: true },
            { name: 'further_info', label: 'थप जानकारी', required: false },
            { name: 'payment_proof', label: 'भुक्तानी प्रमाण', required: true }
        ]
        : [
            { name: 'passport_front', label: 'Passport Front', required: true },
            { name: 'valid_visa', label: 'Valid Visa', required: false },
            { name: 'labor_visa_front', label: 'Labor Visa card(front)', required: true },
            { name: 'labor_visa_back', label: 'Labor Visa card(back)', required: false },
            { name: 'arrival', label: 'Arrival', required: true },
            { name: 'agreement_paper', label: 'Agreement Paper', required: true },
            { name: 'passport_back', label: 'Passport back (If MRP passport not needed)', required: true },
            { name: 'previous_visa', label: 'Previous Visa', required: false },
            { name: 'departure', label: 'Departure', required: true },
            { name: 'further_info', label: 'Further Info', required: false },
            { name: 'payment_proof', label: 'Payment Info', required: true }
        ];

    const handleViewDocument = (document, label) => {
        if (document.type === 'application/pdf') {
            try {
                const base64Data = document.base64.split(',')[1];
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const newWindow = window.open('', '_blank');
                newWindow.location.href = url;
            } catch (error) {
                console.error('Error viewing PDF:', error);
                alert(isNepali ? 'PDF खोल्न त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।' : 'Error opening PDF. Please try again.');
            }
        } else {
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <html>
                    <head><title>${label}</title></head>
                    <body style="margin:0;padding:20px;background:#f0f0f0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                        <img src="${document.base64}" style="max-width:90vw;max-height:90vh;object-fit:contain;box-shadow:0 4px 8px rgba(0,0,0,0.1);" alt="${label}" />
                    </body>
                </html>
            `);
            newWindow.document.close();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center mb-4 sm:mb-6">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-2 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">{text.reviewTitle}</h2>
            </div>

            {/* Personal Info */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                    <span className="break-words">{text.personalInfo}</span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 break-words">{text.fullName}</label>
                        <p className="text-xs sm:text-sm text-gray-900 bg-white p-2 sm:p-3 rounded border break-words min-h-[2rem] sm:min-h-[2.5rem]">
                            {formData.fullName || '-'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 break-words">{text.email}</label>
                        <p className="text-xs sm:text-sm text-gray-900 bg-white p-2 sm:p-3 rounded border break-all min-h-[2rem] sm:min-h-[2.5rem]">
                            {formData.email || '-'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 break-words">{text.phone}</label>
                        <p className="text-xs sm:text-sm text-gray-900 bg-white p-2 sm:p-3 rounded border break-words min-h-[2rem] sm:min-h-[2.5rem]">
                            {formData.phone || '-'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 break-words">{text.whatsapp}</label>
                        <p className="text-xs sm:text-sm text-gray-900 bg-white p-2 sm:p-3 rounded border break-words min-h-[2rem] sm:min-h-[2.5rem]">
                            {formData.whatsappNumber || '-'}
                        </p>
                    </div>
                    <div className="space-y-1 lg:col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 break-words">{text.passport}</label>
                        <p className="text-xs sm:text-sm text-gray-900 bg-white p-2 sm:p-3 rounded border break-words min-h-[2rem] sm:min-h-[2.5rem]">
                            {formData.passportNumber || '-'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Documents */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                    <span className="break-words">{text.documents}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {documentConfig.map((doc) => (
                        <div key={doc.name} className="bg-white p-3 sm:p-4 rounded border">
                            <div className="flex items-start justify-between mb-2 gap-2">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-900 break-words flex-1 leading-tight">
                                    {doc.label}
                                </h4>
                                <div className="flex-shrink-0">
                                    {formData[doc.name] ? (
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                    ) : (
                                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                    )}
                                </div>
                            </div>
                            {formData[doc.name] ? (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                                            {formData[doc.name].name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(formData[doc.name].size / 1024 / 1024).toFixed(2)} {text.fileSizeUnit}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleViewDocument(formData[doc.name], doc.label)}
                                        className="text-blue-600 hover:text-blue-800 cursor-pointer text-xs sm:text-sm font-medium underline flex-shrink-0 text-left sm:text-right"
                                    >
                                        {text.view}
                                    </button>
                                </div>
                            ) : (
                                <p className="text-xs sm:text-sm text-red-600 break-words">{text.notUploaded}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm sm:text-base font-bold text-blue-900 mb-2 sm:mb-3 break-words">
                    {text.makeChanges}
                </h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 sm:items-center">
                    <button
                        onClick={() => onGoToStep(1)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800 text-xs sm:text-sm font-medium underline text-left break-words"
                    >
                        {text.editInfo}
                    </button>
                    <span className="text-blue-600 hidden sm:inline">•</span>
                    <button
                        onClick={() => onGoToStep(2)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800 text-xs sm:text-sm font-medium underline text-left break-words"
                    >
                        {text.editDocs}
                    </button>
                    <span className="text-blue-600 hidden sm:inline">•</span>
                    <button
                        onClick={() => onGoToStep(3)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800 text-xs sm:text-sm font-medium underline text-left break-words flex items-center"
                    >
                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        {text.editPayment}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationReview;