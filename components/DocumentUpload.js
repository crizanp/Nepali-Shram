// components/DocumentUpload.js

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, X, Eye, AlertCircle } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const DocumentUpload = ({ formData, errors, onFileChange, onRemoveFile, onUpdateErrors, onUpdateFormData }) => {
    const { isNepali } = useTranslation();
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [currentFileName, setCurrentFileName] = useState('');
    const [currentFileType, setCurrentFileType] = useState('');
   const applicationMode = formData.applicationMode || 'renew';  // Changed default from '' to 'renew'
const passportType = formData.passportType || 'red';
    const text = {
        title: isNepali ? 'कागजात अपलोड गर्नुहोस्' : 'Document Upload',
        applicationMode: isNepali ? 'आवेदन प्रकार' : 'Application Type',
        newApplication: isNepali ? 'नयाँ आवेदन' : 'New Application',
        renewApplication: isNepali ? 'नवीकरण आवेदन' : 'Renew Application',
        passportType: isNepali ? 'पासपोर्ट प्रकार' : 'Passport Type',
        greenPassport: isNepali ? 'हरियो पासपोर्ट (MRP)' : 'Green Passport (MRP)',
        redPassport: isNepali ? 'रातो पासपोर्ट' : 'Red Passport',
        clickToUpload: isNepali ? 'अपलोड गर्न क्लिक गर्नुहोस्' : 'Click to upload',
        supported: isNepali ? 'समर्थित: PDF, JPG, PNG (अधिकतम 2MB)' : 'Supported: PDF, JPG, PNG (Max 2MB)',
        view: isNepali ? 'हेर्नुहोस्' : 'View',
        replace: isNepali ? 'फेरि अपलोड गर्नुहोस्' : 'Replace',
        remove: isNepali ? 'हटाउनुहोस्' : 'Remove',
        notAvailable: isNepali ? 'कागजात हेर्न उपलब्ध छैन' : 'Document not available for viewing',
        popupAlert: isNepali ? 'कागजात हेर्न पपअप अनुमति दिनुहोस्' : 'Please allow popups to view the document',
        errorOpen: isNepali ? 'कागजात खोल्न त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।' : 'Error opening document. Please try again.',
        fileSizeError: isNepali ? 'फाइल २MB भन्दा कम हुनुपर्छ' : 'File must be less than 2MB',
        fileSizeModalTitle: isNepali ? 'फाइल साइज त्रुटि' : 'File Size Error',
        fileSizeModalMessage: isNepali ? 'चयन गरिएको फाइल २MB भन्दा बढी छ। कृपया फाइल कम्प्रेस गर्नुहोस् र फेरि प्रयास गर्नुहोस्।' : 'The selected file is larger than 2MB. Please compress the file and try again.',
        compressionLinkPdf: isNepali ? 'PDF कम्प्रेसनको लागि यहाँ क्लिक गर्नुहोस्' : 'Compress PDF ',
        compressionLinkImage: isNepali ? 'इमेज कम्प्रेसनको लागि यहाँ क्लिक गर्नुहोस्' : 'Compress Image',
        close: isNepali ? 'बन्द गर्नुहोस्' : 'Close',
        fileName: isNepali ? 'फाइल नाम' : 'File Name',
        required: isNepali ? 'आवश्यक' : 'Required',
        optional: isNepali ? 'वैकल्पिक' : 'Optional'
    };

    // Get document configuration based on application mode and passport type
    const getDocumentConfig = () => {
        const baseConfig = isNepali
            ? [
                { name: 'passport_front', label: 'पासपोर्ट अगाडिको पाना', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'passport_back', label: 'पासपोर्ट पछाडिको पाना', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'valid_visa', label: 'वैध भिसा', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'labor_visa_front', label: 'लेबर भिसा अगाडिको पाना', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'labor_visa_back', label: 'लेबर भिसा पछाडिको पाना', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'arrival', label: 'आगमन कागजात', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'agreement_paper', label: 'सम्झौता कागजात', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'previous_visa', label: 'अघिल्लो भिसा', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'departure', label: 'प्रस्थान कागजात', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'further_info', label: 'थप जानकारी', accept: '.pdf,.jpg,.jpeg,.png' }
            ]
            : [
                { name: 'passport_front', label: 'Passport Front', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'passport_back', label: 'Passport Back', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'valid_visa', label: 'Valid Visa', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'labor_visa_front', label: 'Labor Visa Card (Front)', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'labor_visa_back', label: 'Labor Visa Card (Back)', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'arrival', label: 'Arrival', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'agreement_paper', label: 'Agreement Paper', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'previous_visa', label: 'Previous Visa', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'departure', label: 'Departure', accept: '.pdf,.jpg,.jpeg,.png' },
                { name: 'further_info', label: 'Further Info', accept: '.pdf,.jpg,.jpeg,.png' }
            ];

        // Set required fields based on application mode and passport type
        return baseConfig.map(doc => {
            let required = false;

            // Common requirements for both application types
            if (doc.name === 'passport_front') required = true;
            if (doc.name === 'valid_visa') required = true;

            // New application specific requirements
            if (applicationMode === 'new') {
                if (doc.name === 'agreement_paper') required = true;
                if (doc.name === 'passport_back' && passportType === 'green') required = true;
            }
            // Renew application specific requirements
            else if (applicationMode === 'renew') {
                if (doc.name === 'labor_visa_front') required = true;
                if (doc.name === 'labor_visa_back') required = true;
                if (doc.name === 'arrival') required = true;
                if (doc.name === 'passport_back' && passportType === 'green') required = true;
            }

            return { ...doc, required };
        });
    };

    const documentConfig = getDocumentConfig();
    const validateDocuments = useCallback(() => {
        const newErrors = {};
        const config = getDocumentConfig();

        config.forEach(doc => {
            if (doc.required && !formData[doc.name]) {
                const errorKey = doc.name;
                newErrors[errorKey] = isNepali
                    ? `${doc.label} आवश्यक छ`
                    : `${doc.label} is required`;
            }
        });

        // Update parent component errors
        if (Object.keys(newErrors).length > 0) {
            onUpdateErrors(newErrors);
            return false;
        }

        // Clear any existing errors if validation passes
        onUpdateErrors({});
        return true;
    }, [applicationMode, passportType, formData, isNepali, onUpdateErrors]);
    // Add this useEffect after the existing useEffect
    useEffect(() => {
        // Expose validation function to parent component
        const element = document.querySelector('[data-document-upload]');
        if (element) {
            element._validateDocuments = validateDocuments;
        }
    }, [validateDocuments]);

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
            : 'https://nepalishram.com/image-compression';

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
        <div className="space-y-6" data-document-upload>
            <div className="flex items-center mb-6">
                <Upload className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">{text.title}</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{text.applicationMode}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['new', 'renew'].map((mode) => (
                        <label key={mode} className="cursor-pointer">
                            <input
                                type="radio"
                                name="applicationMode"
                                value={mode}
                                checked={applicationMode === mode}
                                onChange={(e) => onUpdateFormData({ applicationMode: e.target.value })}
                                className="sr-only"
                            />
                            <div className={`border p-4 rounded-lg ${applicationMode === mode ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                                <div className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${applicationMode === mode ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                        {applicationMode === mode && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {mode === 'new' ? text.newApplication : text.renewApplication}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
                <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                        <Upload className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{text.passportType}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['green', 'red'].map((type) => (
                        <label key={type} className="cursor-pointer">
                            <input
                                type="radio"
                                name="passportType"
                                value={type}
                                checked={passportType === type}
                                onChange={(e) => onUpdateFormData({ passportType: e.target.value })}
                                className="sr-only"
                            />
                            <div className={`border p-4 rounded-lg ${passportType === type ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                                <div className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${passportType === type ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                        {passportType === type && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {type === 'green' ? text.greenPassport : text.redPassport}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentConfig.map((doc) => (
                    <div key={doc.name} className="relative">
                        <input
                            type="file"
                            name={doc.name}
                            onChange={handleFileChange}
                            accept={doc.accept}
                            className="hidden"
                            id={doc.name}
                        />

                        {formData[doc.name] ? (
                            <div className="relative">
                                {/* Preview */}
                                <div className={`h-48 rounded-lg overflow-hidden border-2 ${doc.required ? 'border-green-300' : 'border-blue-300'} bg-white`}>
                                    {formData[doc.name].type?.startsWith('image/') ? (
                                        <img
                                            src={formData[doc.name].base64}
                                            alt={doc.label}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-red-100">
                                            <FileText className="w-16 h-16 text-red-600 mb-2" />
                                            <p className="text-sm font-medium text-red-800 text-center px-2">
                                                {formData[doc.name].name}
                                            </p>
                                            <p className="text-xs text-red-600">PDF Document</p>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-900">
                                        {doc.label}
                                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                                        {!doc.required && <span className="text-gray-500 ml-1">({text.optional})</span>}
                                    </div>
                                    <button
                                        onClick={() => onRemoveFile(doc.name)}
                                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full"
                                        type="button"
                                        title={text.remove}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleViewDocument(formData[doc.name], doc.label)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                        type="button"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        {text.view}
                                    </button>
                                    <label
                                        htmlFor={doc.name}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 cursor-pointer"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {text.replace}
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor={doc.name}
                                className={`block border-2 border-dashed rounded-lg p-6 h-48 text-center hover:border-blue-400 transition-colors cursor-pointer flex flex-col items-center justify-center ${doc.required ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <Upload className={`w-12 h-12 mb-4 ${doc.required ? 'text-red-400' : 'text-gray-400'}`} />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {doc.label}
                                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                                    {/* {!doc.required && <span className="text-gray-500 text-sm ml-1">({text.optional})</span>} */}
                                </h3>
                                <p className="text-sm text-blue-600 font-medium">{text.clickToUpload}</p>
                                <p className="text-xs text-gray-500 mt-2">{text.supported}</p>
                                {doc.required && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{text.required}</p>
                                )}
                            </label>
                        )}

                        {/* Error messages */}
                        {errors[doc.name] && (
                            <div className="mt-2">
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors[doc.name]}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* File Size Modal */}
            <FileSizeModal />
        </div>
    );
};

export default DocumentUpload;