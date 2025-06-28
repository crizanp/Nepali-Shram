import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    User,
    Upload,
    FileText,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    X,
    Check,
    Eye,
    Download
} from 'lucide-react';

export default function ApplicationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    // Form data state - moved to top level
    const [formData, setFormData] = useState({
        // Step 1: User Details
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        nationality: '',
        passportNumber: '',
        experience: '',

        // Step 2: Documents (now storing base64 data)
        passport: null,
        photo: null,
        certificate: null,
        experience_letter: null,

        // Step 3: Agreement
        termsAccepted: false,
        privacyAccepted: false,
        dataProcessingAccepted: false
    });

    const [errors, setErrors] = useState({});

    // Convert file to base64
    const convertToBase64 = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }, []);

    // Handle logout - memoized to prevent recreation
    const handleLogout = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    // Handle input changes - memoized to prevent recreation
    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        setErrors(prev => {
            if (prev[name]) {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            }
            return prev;
        });
    }, []);

    // Handle file uploads with base64 conversion
    const handleFileChange = useCallback(async (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            try {
                const base64Data = await convertToBase64(files[0]);

                setFormData(prev => ({
                    ...prev,
                    [name]: {
                        file: files[0],
                        base64: base64Data,
                        name: files[0].name,
                        size: files[0].size,
                        type: files[0].type
                    }
                }));

                // Clear error when file is selected
                setErrors(prev => {
                    if (prev[name]) {
                        return { ...prev, [name]: '' };
                    }
                    return prev;
                });
            } catch (error) {
                console.error('Error converting file to base64:', error);
                setErrors(prev => ({
                    ...prev,
                    [name]: 'Error processing file. Please try again.'
                }));
            }
        }
    }, [convertToBase64]);

    // Validation functions - memoized
    const validateStep1 = useCallback(() => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
        if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
        if (!formData.experience.trim()) newErrors.experience = 'Experience is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const validateStep2 = useCallback(() => {
        const newErrors = {};

        if (!formData.passport) newErrors.passport = 'Passport copy is required';
        if (!formData.photo) newErrors.photo = 'Photo is required';
        if (!formData.certificate) newErrors.certificate = 'Certificate is required';
        if (!formData.experience_letter) newErrors.experience_letter = 'Experience letter is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const validateStep3 = useCallback(() => {
        const newErrors = {};

        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'You must accept the privacy policy';
        if (!formData.dataProcessingAccepted) newErrors.dataProcessingAccepted = 'You must accept data processing terms';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Handle next step - memoized
    const handleNext = useCallback(() => {
        let isValid = false;

        if (currentStep === 1) {
            isValid = validateStep1();
        } else if (currentStep === 2) {
            isValid = validateStep2();
        } else if (currentStep === 3) {
            isValid = true; // No validation needed for review step
        }

        if (isValid) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep, validateStep1, validateStep2]);

    // Handle previous step - memoized
    const handlePrevious = useCallback(() => {
        setCurrentStep(prev => prev - 1);
    }, []);

    // Handle form submission - memoized
    const handleSubmit = useCallback(async () => {
        if (validateStep3()) {
            try {
                // Prepare data for submission with base64
                const submissionData = {
                    ...formData,
                    // Convert document objects to just base64 strings for API
                    passport: formData.passport?.base64,
                    photo: formData.photo?.base64,
                    certificate: formData.certificate?.base64,
                    experience_letter: formData.experience_letter?.base64
                };

                console.log('Form submitted with base64 data:', submissionData);
                alert('Application submitted successfully!');

                // Reset form
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    address: '',
                    dateOfBirth: '',
                    nationality: '',
                    passportNumber: '',
                    experience: '',
                    passport: null,
                    photo: null,
                    certificate: null,
                    experience_letter: null,
                    termsAccepted: false,
                    privacyAccepted: false,
                    dataProcessingAccepted: false
                });
                setCurrentStep(1);
                setErrors({});
            } catch (error) {
                console.error('Submission error:', error);
                alert('Error submitting application. Please try again.');
            }
        }
    }, [validateStep3, formData]);

    // Progress indicator - memoized component
    const ProgressIndicator = useMemo(() => (
        <div className="w-full px-4 mb-8">
            <div className="relative flex justify-between items-center">
                {[1, 2, 3, 4].map((step, index) => (
                    <div key={step} className="flex flex-col items-center flex-1 relative">
                        <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300
            ${currentStep >= step ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-900'}`}>
                            {currentStep > step ? <Check className="w-5 h-5" /> : step}
                        </div>

                        <div className={`mt-2 text-xs text-center w-20 sm:w-auto
            ${currentStep >= step ? 'text-blue-900 font-bold' : 'text-gray-500'}`}>
                            {step === 1 && 'User Details'}
                            {step === 2 && 'Documents'}
                            {step === 3 && 'Review'}
                            {step === 4 && 'Agreement'}
                            {step === 5 && 'Submit'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ), [currentStep]);

    // Step 1: User Details - memoized component
    const Step1 = useMemo(() => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Date of Birth *
                    </label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Nationality *
                    </label>
                    <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.nationality ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your nationality"
                    />
                    {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Passport Number *
                    </label>
                    <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.passportNumber ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your passport number"
                    />
                    {errors.passportNumber && <p className="text-red-500 text-sm mt-1">{errors.passportNumber}</p>}
                </div>
            </div>

            <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Address *
                </label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your complete address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Work Experience *
                </label>
                <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.experience ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Describe your work experience"
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
            </div>
        </div>
    ), [formData, errors, handleInputChange]);

    // Document configuration - memoized to prevent recreation
    const documentConfig = useMemo(() => [
        { name: 'passport', label: 'Passport Copy', accept: '.pdf,.jpg,.jpeg,.png' },
        { name: 'photo', label: 'Passport Size Photo', accept: '.jpg,.jpeg,.png' },
        { name: 'certificate', label: 'Educational Certificate', accept: '.pdf,.jpg,.jpeg,.png' },
        { name: 'experience_letter', label: 'Experience Letter', accept: '.pdf,.jpg,.jpeg,.png' }
    ], []);

    // Step 2: Document Upload - modified component with view and replace buttons
    const Step2 = useMemo(() => (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <Upload className="w-4 h-4 text-blue-500 mr-2" />
                <h2 className="font-semibold text-gray-900">Document Upload</h2>
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
                            // Document uploaded - show as background with buttons below
                            <div className="relative">
                                <div className="h-48 rounded-lg overflow-hidden border-2 border-green-300">
                                    {formData[doc.name].type.startsWith('image/') ? (
                                        // Show image as background
                                        <img
                                            src={formData[doc.name].base64}
                                            alt={doc.label}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : formData[doc.name].type === 'application/pdf' ? (
                                        // Show PDF icon with filename for PDFs
                                        <div className="w-full h-full bg-red-100 flex flex-col items-center justify-center">
                                            <FileText className="w-16 h-16 text-red-600 mb-2" />
                                            <p className="text-sm font-medium text-red-800">{formData[doc.name].name}</p>
                                            <p className="text-xs text-red-600">PDF Document</p>
                                        </div>
                                    ) : (
                                        // Show generic file icon for other types
                                        <div className="w-full h-full bg-blue-100 flex flex-col items-center justify-center">
                                            <FileText className="w-16 h-16 text-blue-600 mb-2" />
                                            <p className="text-sm font-medium text-blue-800">{formData[doc.name].name}</p>
                                            <p className="text-xs text-blue-600">{formData[doc.name].type}</p>
                                        </div>
                                    )}

                                    {/* Document label at top */}
                                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-900">
                                        {doc.label}
                                    </div>

                                    {/* Remove button at bottom right */}
                                    <button
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                [doc.name]: null
                                            }));
                                        }}
                                        className="absolute cursor-pointer top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-colors shadow-lg"
                                        title="Remove document"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* View and Replace buttons below the card */}
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => {
                                            if (formData[doc.name].type === 'application/pdf') {
                                                // For PDF files, create a blob URL
                                                try {
                                                    const base64Data = formData[doc.name].base64.split(',')[1];
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
                                                // For images, create a new window with the image
                                                const newWindow = window.open('', '_blank');
                                                newWindow.document.write(`
                                                <html>
                                                    <head><title>${doc.label}</title></head>
                                                    <body style="margin:0;padding:20px;background:#f0f0f0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                                                        <img src="${formData[doc.name].base64}" style="max-width:90vw;max-height:90vh;object-fit:contain;box-shadow:0 4px 8px rgba(0,0,0,0.1);" alt="${doc.label}" />
                                                    </body>
                                                </html>
                                            `);
                                                newWindow.document.close();
                                            }
                                        }}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-600 cursor-pointer text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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
                            // No document uploaded - show upload area
                            <label
                                htmlFor={doc.name}
                                className="block border-2 border-dashed border-gray-300 rounded-lg p-6 h-48 text-center hover:border-blue-400 transition-colors cursor-pointer flex flex-col items-center justify-center"
                            >
                                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{doc.label} *</h3>
                                <p className="text-sm text-blue-600 font-medium">Click to upload</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Supported: PDF, JPG, PNG (Max 5MB)
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
    ), [formData, errors, handleFileChange, documentConfig]);
    // Step 3: Agreement - memoized component
    const Step3 = useMemo(() => (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Terms & Agreement</h2>
            </div>

            <div className="space-y-4">
                <div
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleInputChange({
                        target: {
                            name: 'termsAccepted',
                            type: 'checkbox',
                            checked: !formData.termsAccepted
                        }
                    })}
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={() => { }} // Handled by div click
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded pointer-events-none"
                            />
                        </div>
                        <div className="ml-3 flex-1">
                            <label className="text-lg font-semibold text-gray-900 cursor-pointer">
                                Terms and Conditions *
                            </label>
                            <p className="text-sm text-gray-700 mt-1">
                                I agree to the terms and conditions of the Nepali Shram Portal. I understand that providing false information may result in rejection of my application.
                            </p>
                        </div>
                    </div>
                    {errors.termsAccepted && <p className="text-red-500 text-sm mt-2 ml-8">{errors.termsAccepted}</p>}
                </div>

                <div
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleInputChange({
                        target: {
                            name: 'privacyAccepted',
                            type: 'checkbox',
                            checked: !formData.privacyAccepted
                        }
                    })}
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            <input
                                type="checkbox"
                                name="privacyAccepted"
                                checked={formData.privacyAccepted}
                                onChange={() => { }} // Handled by div click
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded pointer-events-none"
                            />
                        </div>
                        <div className="ml-3 flex-1">
                            <label className="text-lg font-semibold text-gray-900 cursor-pointer">
                                Privacy Policy *
                            </label>
                            <p className="text-sm text-gray-700 mt-1">
                                I consent to the collection, processing, and storage of my personal data in accordance with the privacy policy.
                            </p>
                        </div>
                    </div>
                    {errors.privacyAccepted && <p className="text-red-500 text-sm mt-2 ml-8">{errors.privacyAccepted}</p>}
                </div>

                <div
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleInputChange({
                        target: {
                            name: 'dataProcessingAccepted',
                            type: 'checkbox',
                            checked: !formData.dataProcessingAccepted
                        }
                    })}
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            <input
                                type="checkbox"
                                name="dataProcessingAccepted"
                                checked={formData.dataProcessingAccepted}
                                onChange={() => { }} // Handled by div click
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded pointer-events-none"
                            />
                        </div>
                        <div className="ml-3 flex-1">
                            <label className="text-lg font-semibold text-gray-900 cursor-pointer">
                                Agreement *
                            </label>
                            <p className="text-sm text-gray-700 mt-1">
                                I authorize the processing of my data for employment purposes and understand that my information may be shared with relevant authorities and employers.
                            </p>
                        </div>
                    </div>
                    {errors.dataProcessingAccepted && <p className="text-red-500 text-sm mt-2 ml-8">{errors.dataProcessingAccepted}</p>}
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Application Summary</h3>
                <div className="text-sm text-blue-800 space-y-1">
                    <p>• Personal information completed</p>
                    <p>• Documents uploaded successfully</p>
                    <p>• All agreements accepted</p>
                </div>
            </div>
        </div>
    ), [formData, errors, handleInputChange]);
    const Step4 = useMemo(() => (
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
                                        onClick={() => {
                                            if (formData[doc.name].type === 'application/pdf') {
                                                try {
                                                    const base64Data = formData[doc.name].base64.split(',')[1];
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
                                                    <head><title>${doc.label}</title></head>
                                                    <body style="margin:0;padding:20px;background:#f0f0f0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                                                        <img src="${formData[doc.name].base64}" style="max-width:90vw;max-height:90vh;object-fit:contain;box-shadow:0 4px 8px rgba(0,0,0,0.1);" alt="${doc.label}" />
                                                    </body>
                                                </html>
                                            `);
                                                newWindow.document.close();
                                            }
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
                <h3 className="text-sm font-medium text-blue-900 mb-2">Need to make changes?</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentStep(1)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    >
                        Edit Personal Information
                    </button>
                    <span className="text-blue-600">•</span>
                    <button
                        onClick={() => setCurrentStep(2)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    >
                        Edit Documents
                    </button>
                </div>
            </div>
        </div>
    ), [formData, documentConfig]);
    return (
        <>
        <div className="min-h-screen bg-red-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Application</h1>
                        <p className="text-gray-900">Please complete all steps to submit your application</p>
                    </div>

                    {ProgressIndicator}

                    <div className="mb-8">
                        {currentStep === 1 && Step1}
                        {currentStep === 2 && Step2}
                        {currentStep === 3 && Step4}
                        {currentStep === 4 && Step3}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-lg font-medium ${currentStep === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 cursor-pointer bg-white hover:bg-gray-50'
                                }`}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous
                        </button>
                        {currentStep < 4 ? (
                            <button
                                onClick={handleNext}
                                className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent rounded-md text-lg font-medium text-white bg-blue-900 hover:bg-blue-700"
                            >
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="inline-flex items-center px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Submit Application
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div></>
    );
}