import React from 'react';
import { Eye, User, FileText, CheckCircle, X } from 'lucide-react';

const ApplicationReview = ({ formData, onEditStep }) => {
    const documentConfig = [
        { name: 'passport', label: 'Passport Copy' },
        { name: 'photo', label: 'Passport Size Photo' },
        { name: 'certificate', label: 'Educational Certificate' },
        { name: 'experience_letter', label: 'Experience Letter' }
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
                alert('Error opening PDF. Please try again.');
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
                <h2 className="text-xl font-semibold text-gray-900">Review Your Application</h2>
            </div>

            {/* Personal Information Review */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.fullName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.phone}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.dateOfBirth}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nationality</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.nationality}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.passportNumber}</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">{formData.address}</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Work Experience</label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border whitespace-pre-wrap">{formData.experience}</p>
                    </div>
                </div>
            </div>

            {/* Documents Review */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Uploaded Documents
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
                                            {(formData[doc.name].size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleViewDocument(formData[doc.name], doc.label)}
                                        className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium"
                                    >
                                        View
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-red-600">Not uploaded</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Options */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-900 mb-2">Need to make changes?</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEditStep(1)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm font-medium underline"
                    >
                        Edit Personal Information
                    </button>
                    <span className="text-blue-600">•</span>
                    <button
                        onClick={() => onEditStep(2)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm font-medium underline"
                    >
                        Edit Documents
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationReview;