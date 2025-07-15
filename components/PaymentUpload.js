import React, { useState } from 'react';
import { Upload, FileText, X, Eye, CreditCard, Info, AlertCircle } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import PaymentModal from './PaymentModal';

const PaymentUpload = ({ formData, errors, onFileChange, onRemoveFile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [currentFileName, setCurrentFileName] = useState('');
    const [currentFileType, setCurrentFileType] = useState('');
    const { isNepali } = useTranslation();

    const text = {
        title: isNepali ? 'भुक्तानी प्रमाण अपलोड गर्नुहोस्' : 'Upload Payment Proof',
        description: isNepali ? 'कृपया भुक्तानी रसिद वा स्क्रिनसट अपलोड गर्नुहोस्' : 'Please upload payment receipt or screenshot',
        clickToUpload: isNepali ? 'अपलोड गर्न क्लिक गर्नुहोस्' : 'Click to upload',
        supported: isNepali ? 'समर्थित: PDF, JPG, PNG (अधिकतम 2MB)' : 'Supported: PDF, JPG, PNG (Max 2MB)',
        view: isNepali ? 'हेर्नुहोस्' : 'View',
        replace: isNepali ? 'फेरि अपलोड गर्नुहोस्' : 'Replace',
        remove: isNepali ? 'हटाउनुहोस्' : 'Remove',
        notAvailable: isNepali ? 'भुक्तानी प्रमाण हेर्न उपलब्ध छैन' : 'Payment proof not available for viewing',
        popupAlert: isNepali ? 'कागजात हेर्न पपअप अनुमति दिनुहोस्' : 'Please allow popups to view the document',
        errorOpen: isNepali ? 'कागजात खोल्न त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।' : 'Error opening document. Please try again.',
        paymentProof: isNepali ? 'भुक्तानी प्रमाण' : 'Payment Proof',
        required: isNepali ? 'आवश्यक' : 'Required',
        paymentInfo: isNepali ? 'भुक्तानी जानकारी हेर्नुहोस्' : 'View Payment Information',
        fileSizeError: isNepali ? 'फाइल २MB भन्दा कम हुनुपर्छ' : 'File must be less than 2MB',
        fileSizeModalTitle: isNepali ? 'फाइल साइज त्रुटि' : 'File Size Error',
        fileSizeModalMessage: isNepali ? 'चयन गरिएको फाइल २MB भन्दा बढी छ। कृपया फाइल कम्प्रेस गर्नुहोस् र फेरि प्रयास गर्नुहोस्।' : 'The selected file is larger than 2MB. Please compress the file and try again.',
        compressionLinkPdf: isNepali ? 'PDF कम्प्रेसनको लागि यहाँ क्लिक गर्नुहोस्' : 'Click here for PDF compression',
        compressionLinkImage: isNepali ? 'इमेज कम्प्रेसनको लागि यहाँ क्लिक गर्नुहोस्' : 'Click here for image compression',
        close: isNepali ? 'बन्द गर्नुहोस्' : 'Close',
        fileName: isNepali ? 'फाइल नाम' : 'File Name'
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            // Clear the input
            event.target.value = '';
            
            // Show modal with error message
            setCurrentFileName(file.name);
            setCurrentFileType(file.type);
            setShowSizeModal(true);
            return;
        }

        // If file size is OK, proceed with normal file handling
        onFileChange(event);
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

    const handleCompressionClick = () => {
        // Determine compression URL based on file type
        const compressionUrl = currentFileType === 'application/pdf' 
            ? 'https://www.ilovepdf.com/compress_pdf'
            : 'https://nepalishram.com/compression';
        
        window.open(compressionUrl, '_blank');
        setShowSizeModal(false);
    };

    const getCompressionLinkText = () => {
        return currentFileType === 'application/pdf' 
            ? text.compressionLinkPdf 
            : text.compressionLinkImage;
    };

    const FileSizeModal = () => {
        if (!showSizeModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center mb-4">
                        <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">{text.fileSizeModalTitle}</h3>
                    </div>
                    
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">{text.fileName}:</span> {currentFileName}
                        </p>
                        <p className="text-sm text-gray-800">{text.fileSizeModalMessage}</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={handleCompressionClick}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            {getCompressionLinkText()}
                        </button>
                        <button
                            onClick={() => setShowSizeModal(false)}
                            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
                        >
                            {text.close}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4 p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-left justify-left mb-4 sm:mb-6">
                <div className="flex items-left">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-left">
                        {text.title}
                    </h2>
                </div>
            </div>
            
            {/* Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-blue-800 text-sm text-center">{text.description}</p>
            </div>

            {/* File Upload Section */}
            <div className="w-full max-w-sm mx-auto">
                <input 
                    type="file" 
                    name="payment_proof" 
                    onChange={handleFileChange} 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    className="hidden" 
                    id="payment_proof" 
                />

                {formData.payment_proof ? (
                    <div className="relative">
                        <div className="h-48 sm:h-64 rounded-lg overflow-hidden border-2 border-green-300 bg-white">
                            {formData.payment_proof.type?.startsWith('image/') ? (
                                <img
                                    src={formData.payment_proof.base64}
                                    alt={text.paymentProof}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-green-100">
                                    <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mb-2" />
                                    <p className="text-xs sm:text-sm font-medium text-green-800 text-center px-2">
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
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full touch-manipulation"
                                type="button"
                                title={text.remove}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            <button
                                onClick={() => handleViewDocument(formData.payment_proof, text.paymentProof)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 touch-manipulation"
                                type="button"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                {text.view}
                            </button>
                            <label
                                htmlFor="payment_proof"
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 cursor-pointer touch-manipulation"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {text.replace}
                            </label>
                        </div>
                    </div>
                ) : (
                    <label
                        htmlFor="payment_proof"
                        className="block border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 h-48 sm:h-64 text-center hover:border-green-400 transition-colors cursor-pointer flex flex-col items-center justify-center touch-manipulation"
                    >
                        <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-2 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                            {text.paymentProof} <span className="text-red-500">*</span>
                        </h3>
                        <p className="text-sm text-green-600 font-medium">{text.clickToUpload}</p>
                        <p className="text-xs text-gray-500 mt-2 px-2">{text.supported}</p>
                    </label>
                )}

                {/* Error messages */}
                {errors.payment_proof && (
                    <div className="mt-2">
                        <p className="text-red-500 text-sm flex items-center gap-1 justify-center">
                            <AlertCircle className="w-4 h-4" />
                            {errors.payment_proof}
                        </p>
                    </div>
                )}
            </div>

            {/* Payment Information Button - Moved below file upload */}
            <div className="flex justify-center mt-4 sm:mt-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors touch-manipulation"
                >
                    <Info className="w-4 h-4 mr-2" />
                    {text.paymentInfo}
                </button>
            </div>

            {/* Payment Modal */}
            <PaymentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* File Size Modal */}
            <FileSizeModal />
        </div>
    );
};

export default PaymentUpload;