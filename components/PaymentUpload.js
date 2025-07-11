import React, { useState } from 'react';
import { Upload, FileText, X, Eye, CreditCard, Info } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import PaymentModal from './PaymentModal';

const PaymentUpload = ({ formData, errors, onFileChange, onRemoveFile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isNepali } = useTranslation();

    const text = {
        title: isNepali ? 'भुक्तानी प्रमाण अपलोड गर्नुहोस्' : 'Upload Payment Proof',
        description: isNepali ? 'कृपया भुक्तानी रसिद वा स्क्रिनसट अपलोड गर्नुहोस्' : 'Please upload payment receipt or screenshot',
        clickToUpload: isNepali ? 'अपलोड गर्न क्लिक गर्नुहोस्' : 'Click to upload',
        supported: isNepali ? 'समर्थित: PDF, JPG, PNG (अधिकतम 10MB)' : 'Supported: PDF, JPG, PNG (Max 10MB)',
        view: isNepali ? 'हेर्नुहोस्' : 'View',
        replace: isNepali ? 'फेरि अपलोड गर्नुहोस्' : 'Replace',
        remove: isNepali ? 'हटाउनुहोस्' : 'Remove',
        notAvailable: isNepali ? 'भुक्तानी प्रमाण हेर्न उपलब्ध छैन' : 'Payment proof not available for viewing',
        popupAlert: isNepali ? 'कागजात हेर्न पपअप अनुमति दिनुहोस्' : 'Please allow popups to view the document',
        errorOpen: isNepali ? 'कागजात खोल्न त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।' : 'Error opening document. Please try again.',
        paymentProof: isNepali ? 'भुक्तानी प्रमाण' : 'Payment Proof',
        required: isNepali ? 'आवश्यक' : 'Required',
        paymentInfo: isNepali ? 'भुक्तानी जानकारी हेर्नुहोस्' : 'View Payment Information'
    };

    const handleViewDocument = (document, label) => {
        if (!document || !document.base64) {
            alert(text.notAvailable);
            return;
        }

        try {
            if (document.type === 'application/pdf') {
                const base64Data = document.base64.includes(',')
                    ? document.base64.split(',')[1]
                    : document.base64;
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const newWindow = window.open('', '_blank');
                if (newWindow) {
                    newWindow.location.href = url;
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                } else {
                    alert(text.popupAlert);
                }
            } else {
                const newWindow = window.open('', '_blank');
                if (newWindow) {
                    newWindow.document.write(`
                        <html>
                            <head>
                                <title>${label}</title>
                                <style>
                                    body { margin: 0; padding: 20px; background: #f0f0f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                                    img { max-width: 90vw; max-height: 90vh; object-fit: contain; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                                </style>
                            </head>
                            <body>
                                <img src="${document.base64}" alt="${label}" onload="document.title='${label} - Loaded'" onerror="document.body.innerHTML='<p>Error loading image</p>'" />
                            </body>
                        </html>
                    `);
                    newWindow.document.close();
                } else {
                    alert(text.popupAlert);
                }
            }
        } catch (error) {
            console.error('Error viewing document:', error);
            alert(text.errorOpen);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <CreditCard className="w-6 h-6 text-green-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">{text.title}</h2>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    <Info className="w-4 h-4 mr-2" />
                    {text.paymentInfo}
                </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">{text.description}</p>
            </div>

            <div className="max-w-md mx-auto">
                <input 
                    type="file" 
                    name="payment_proof" 
                    onChange={onFileChange} 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    className="hidden" 
                    id="payment_proof" 
                />

                {formData.payment_proof ? (
                    <div className="relative">
                        <div className="h-64 rounded-lg overflow-hidden border-2 border-green-300 bg-white">
                            {formData.payment_proof.type?.startsWith('image/') ? (
                                <img
                                    src={formData.payment_proof.base64}
                                    alt={text.paymentProof}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-green-100">
                                    <FileText className="w-16 h-16 text-green-600 mb-2" />
                                    <p className="text-sm font-medium text-green-800 text-center px-2">
                                        {formData.payment_proof.name}
                                    </p>
                                    <p className="text-xs text-green-600">PDF Document</p>
                                </div>
                            )}
                            <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-900">
                                {text.paymentProof} <span className="text-red-500">*</span>
                            </div>
                            <button
                                onClick={() => onRemoveFile('payment_proof')}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full"
                                type="button"
                                title={text.remove}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => handleViewDocument(formData.payment_proof, text.paymentProof)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                type="button"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                {text.view}
                            </button>
                            <label
                                htmlFor="payment_proof"
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 cursor-pointer"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {text.replace}
                            </label>
                        </div>
                    </div>
                ) : (
                    <label
                        htmlFor="payment_proof"
                        className="block border-2 border-dashed border-gray-300 rounded-lg p-8 h-64 text-center hover:border-green-400 transition-colors cursor-pointer flex flex-col items-center justify-center"
                    >
                        <CreditCard className="w-16 h-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {text.paymentProof} <span className="text-red-500">*</span>
                        </h3>
                        <p className="text-sm text-green-600 font-medium">{text.clickToUpload}</p>
                        <p className="text-xs text-gray-500 mt-2">{text.supported}</p>
                    </label>
                )}

                {errors.payment_proof && (
                    <p className="text-red-500 text-sm mt-2">{errors.payment_proof}</p>
                )}
            </div>

            {/* Payment Modal */}
            <PaymentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default PaymentUpload;