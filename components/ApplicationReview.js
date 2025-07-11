import React from 'react';
import { Eye, User, FileText, CheckCircle, X } from 'lucide-react';
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
        editDocs: isNepali ? 'कागजात सम्पादन गर्नुहोस्' : 'Edit Documents'
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
            { name: 'further_info', label: 'थप जानकारी', required: false }
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
            { name: 'further_info', label: 'Further Info', required: false }
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
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">{text.reviewTitle}</h2>
            </div>

            {/* Personal Info */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {text.personalInfo}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{text.fullName}</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.fullName || '-'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{text.email}</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.email || '-'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{text.phone}</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.phone || '-'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{text.whatsapp}</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.whatsappNumber || '-'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{text.passport}</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.passportNumber || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Documents */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    {text.documents}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documentConfig.map((doc) => (
                        <div key={doc.name} className="bg-white p-4 rounded border">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-900">{doc.label}</h4>
                                {formData[doc.name] ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <X className="w-5 h-5 text-red-500" />
                                )}
                            </div>
                            {formData[doc.name] ? (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">{formData[doc.name].name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(formData[doc.name].size / 1024 / 1024).toFixed(2)} {text.fileSizeUnit}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleViewDocument(formData[doc.name], doc.label)}
                                        className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium"
                                    >
                                        {text.view}
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-red-600">{text.notUploaded}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-900 mb-2">{text.makeChanges}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onGoToStep(1)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm font-medium underline"
                    >
                        {text.editInfo}
                    </button>
                    <span className="text-blue-600">•</span>
                    <button
                        onClick={() => onGoToStep(2)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm font-medium underline"
                    >
                        {text.editDocs}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationReview;
