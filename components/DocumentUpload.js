// Updated DocumentUpload component with Cloudinary upload
import React from 'react';
import { Upload, FileText, X, Eye } from 'lucide-react';

const DocumentUpload = ({ formData, errors, onFileChange, onRemoveFile }) => {
    const documentConfig = [
        { name: 'passport', label: 'Passport Front', accept: '.pdf,.jpg,.jpeg,.png' },
        { name: 'visa', label: 'Valid Visa', accept: '.pdf,.jpg,.jpeg,.png' },
        { name: 'laborVisaFront', label: 'Labor Visa card(front)', accept: '.pdf,.jpg,.jpeg,.png' },
        { name: 'laborVisaBack', label: 'Labor Visa card(back)', accept: '.pdf,.jpg,.jpeg,.png' },
        { name: 'arrival', label: 'Arrival', accept: '.pdf,.jpg,.jpeg,.png' },
        { name: 'agreementPaper', label: 'Agreement Paper', accept: '.pdf,.jpg,.jpeg,.png' },
        // Optional fields
        { name: 'passportBack', label: 'Passport back (If MRP passport not needed)', accept: '.pdf,.jpg,.jpeg,.png' },
        { name: 'visad', label: 'Previous Visa', accept: '.pdf,.jpg,.jpeg,.png' },
        { name: 'departure', label: 'Departure', accept: '.pdf,.jpg,.jpeg,.png' },
        { name: 'furtherInfo', label: 'Further Info', accept: '.pdf,.jpg,.jpeg,.png' },
    ];

    const handleViewDocument = (document, label) => {
        if (!document || !document.url) {
            alert('Document not available for viewing');
            return;
        }

        try {
            // Open Cloudinary URL directly
            const newWindow = window.open(document.url, '_blank');
            if (!newWindow) {
                alert('Please allow popups to view the document');
            }
        } catch (error) {
            console.error('Error viewing document:', error);
            alert('Error opening document. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <Upload className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Document Upload</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentConfig.map((doc) => (
                    <div key={doc.name} className="relative">
                        <input
                            type="file"
                            name={doc.name}
                            onChange={onFileChange}
                            accept={doc.accept}
                            className="hidden"
                            id={doc.name}
                        />

                        {formData[doc.name] ? (
                            <div className="relative">
                                <div className="h-48 rounded-lg overflow-hidden border-2 border-green-300 bg-white">
                                    {formData[doc.name].type && formData[doc.name].type.startsWith('image/') ? (
                                        <img
                                            src={formData[doc.name].url || formData[doc.name].previewUrl}
                                            alt={doc.label}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : formData[doc.name].type === 'application/pdf' ? (
                                        <div className="w-full h-full bg-red-100 flex flex-col items-center justify-center">
                                            <FileText className="w-16 h-16 text-red-600 mb-2" />
                                            <p className="text-sm font-medium text-red-800 text-center px-2">
                                                {formData[doc.name].name}
                                            </p>
                                            <p className="text-xs text-red-600">PDF Document</p>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-blue-100 flex flex-col items-center justify-center">
                                            <FileText className="w-16 h-16 text-blue-600 mb-2" />
                                            <p className="text-sm font-medium text-blue-800 text-center px-2">
                                                {formData[doc.name].name}
                                            </p>
                                            <p className="text-xs text-blue-600">{formData[doc.name].type}</p>
                                        </div>
                                    )}

                                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-900">
                                        {doc.label}
                                    </div>

                                    <button
                                        onClick={() => onRemoveFile(doc.name)}
                                        className="absolute cursor-pointer top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-colors shadow-lg"
                                        title="Remove document"
                                        type="button"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleViewDocument(formData[doc.name], doc.label)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 cursor-pointer text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                        type="button"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View
                                    </button>
                                    <label
                                        htmlFor={doc.name}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Replace
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor={doc.name}
                                className="block border-2 border-dashed border-gray-300 rounded-lg p-6 h-48 text-center hover:border-blue-400 transition-colors cursor-pointer flex flex-col items-center justify-center"
                            >
                                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {doc.label} {['passport', 'visa', 'laborVisaFront', 'laborVisaBack', 'arrival', 'agreementPaper'].includes(doc.name) ? '*' : ''}
                                </h3>
                                <p className="text-sm text-blue-600 font-medium">Click to upload</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Supported: PDF, JPG, PNG (Max 10MB)
                                </p>
                            </label>
                        )}

                        {errors[doc.name] && (
                            <p className="text-red-500 text-sm mt-2">{errors[doc.name]}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentUpload;