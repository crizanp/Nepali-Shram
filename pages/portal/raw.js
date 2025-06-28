import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    User,
    Upload,
    FileText,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    X,
    Check
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useRouter } from 'next/router';

export default function ApplicationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

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

        // Step 2: Documents
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

    useEffect(() => {
        async function checkAuthentication() {
            try {
                // Check if we're in the browser environment
                if (typeof window === 'undefined') {
                    setLoading(false);
                    return;
                }
                const token = localStorage.getItem('token');
                // If no token exists, redirect to login immediately
                if (!token) {
                    console.log('No token found, redirecting to login');
                    router.replace('/login');
                    return;
                }
                // Verify the token with the server
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Token verification failed3');
                }

                const userData = await response.json();

                // If we reach here, user is authenticated
                setUser(userData);
                setIsAuthenticated(true);

            } catch (error) {
                console.error('Authentication error:', error);

                // Clear invalid token and redirect to login
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
                router.replace('/login');

            } finally {
                setLoading(false);
            }
        }

        checkAuthentication();
    }, [router]);

    // Memoize utility functions to prevent recreation
    const capitalizeWords = useCallback((str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }, []);

    // Handle logout - memoized to prevent recreation
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        router.replace('/login');
    }, [router]);

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

    // Handle file uploads - memoized to prevent recreation
    const handleFileChange = useCallback((e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));

            // Clear error when file is selected
            setErrors(prev => {
                if (prev[name]) {
                    return { ...prev, [name]: '' };
                }
                return prev;
            });
        }
    }, []);

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
                // Here you would typically send the data to your API
                console.log('Form submitted:', formData);
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
            {/* Progress Line with Steps */}
            <div className="relative flex justify-between items-center">
                {[1, 2, 3, 4].map((step, index) => (
                    <div key={step} className="flex flex-col items-center flex-1 relative">
                        {/* Step Circle */}
                        <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300
            ${currentStep >= step ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-900'}`}>
                            {currentStep > step ? <Check className="w-5 h-5" /> : step}
                        </div>

                        {/* Step Label */}
                        <div className={`mt-2 text-xs text-center w-20 sm:w-auto
            ${currentStep >= step ? 'text-blue-900 font-bold' : 'text-gray-500'}`}>
                            {step === 1 && 'User Details'}
                            {step === 2 && 'Documents'}
                            {step === 3 && 'Agreement'}
                            {step === 4 && 'Submit'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ), [currentStep]);


    // Step 1: User Details - memoized component
    const Step1 = useMemo(() => (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                {/* <User className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2> */}
            </div>

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
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 text-gray-900 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 s placeholder-gray-500 text-lg text-gray-900 ${errors.nationality ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.passportNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.experience ? 'border-red-500' : 'border-gray-300'
                        }`}
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

    // Step 2: Document Upload - memoized component
    const Step2 = useMemo(() => (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <Upload className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Document Upload</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentConfig.map((doc) => (
                    <div key={doc.name} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{doc.label} *</h3>

                        <input
                            type="file"
                            name={doc.name}
                            onChange={handleFileChange}
                            accept={doc.accept}
                            className="hidden"
                            id={doc.name}
                        />

                        <label
                            htmlFor={doc.name}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload File
                        </label>

                        {formData[doc.name] && (
                            <p className="text-sm text-green-600 mt-2">
                                ✓ {formData[doc.name].name}
                            </p>
                        )}

                        {errors[doc.name] && (
                            <p className="text-red-500 text-sm mt-2">{errors[doc.name]}</p>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                            Supported formats: PDF, JPG, PNG (Max 5MB)
                        </p>
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
                <div className="border rounded-lg p-4">
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleInputChange}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                            <label className="text-sm font-medium text-gray-900">
                                Terms and Conditions *
                            </label>
                            <p className="text-sm text-gray-900 mt-1">
                                I agree to the terms and conditions of the Nepali Shram Portal. I understand that providing false information may result in rejection of my application.
                            </p>
                        </div>
                    </div>
                    {errors.termsAccepted && <p className="text-red-500 text-sm mt-2 ml-7">{errors.termsAccepted}</p>}
                </div>

                <div className="border rounded-lg p-4">
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            name="privacyAccepted"
                            checked={formData.privacyAccepted}
                            onChange={handleInputChange}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                            <label className="text-sm font-medium text-gray-900">
                                Privacy Policy *
                            </label>
                            <p className="text-sm text-gray-900 mt-1">
                                I consent to the collection, processing, and storage of my personal data in accordance with the privacy policy.
                            </p>
                        </div>
                    </div>
                    {errors.privacyAccepted && <p className="text-red-500 text-sm mt-2 ml-7">{errors.privacyAccepted}</p>}
                </div>

                <div className="border rounded-lg p-4">
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            name="dataProcessingAccepted"
                            checked={formData.dataProcessingAccepted}
                            onChange={handleInputChange}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                            <label className="text-sm font-medium text-gray-900">
                                Data Processing Agreement *
                            </label>
                            <p className="text-sm text-gray-900 mt-1">
                                I authorize the processing of my data for employment purposes and understand that my information may be shared with relevant authorities and employers.
                            </p>
                        </div>
                    </div>
                    {errors.dataProcessingAccepted && <p className="text-red-500 text-sm mt-2 ml-7">{errors.dataProcessingAccepted}</p>}
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

    // Show loading screen while checking authentication
    if (loading) {
        return (
            <>
                <Navbar user={user} onLogout={handleLogout} />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-900">Verifying authentication...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // If not authenticated after loading, show nothing (redirect is happening)
    if (!isAuthenticated || !user) {
        return (
            <>
                <Navbar user={user} onLogout={handleLogout} />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <p className="text-gray-900">Redirecting to login...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar user={user} onLogout={handleLogout} />
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
                            {currentStep === 3 && Step3}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            <button
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-lg font-medium ${currentStep === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 bg-white hover:bg-gray-50'
                                    }`}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </button>

                            {currentStep < 3 ? (
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
            </div>
            <Footer />
        </>
    );
}