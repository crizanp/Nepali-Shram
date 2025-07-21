//portal/new-application.js

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useTranslation } from '@/context/TranslationContext';
import ApplicationStatusDisplay from '@/components/ApplicationStatusDisplay';
import ApplicationFormDisplay from '@/components/ApplicationFormDisplay';
export default function ApplicationForm() {
    const { isNepali } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [statusLoading, setStatusLoading] = useState(true);

    // Translation object
    const text = {
        // Main headers
        applicationStatus: isNepali ? 'तपाईंको आवेदनको स्थिति' : 'Your Application Status',
        newApplication: isNepali ? 'नयाँ आवेदन' : 'New Application',
        processingMessage: isNepali ? 'तपाईंको आवेदन हाल प्रक्रियामा छ' : 'Your application is currently being processed',
        completeSteps: isNepali ? 'कृपया आफ्नो आवेदन पेश गर्न सबै चरणहरू पूरा गर्नुहोस्' : 'Please complete all steps to submit your application',

        // Loading messages
        verifyingAuth: isNepali ? 'प्रमाणीकरण जाँच गर्दै...' : 'Verifying authentication...',
        redirectingLogin: isNepali ? 'लगइनमा रिडिरेक्ट गर्दै...' : 'Redirecting to login...',
        checkingStatus: isNepali ? 'आवेदनको स्थिति जाँच गर्दै...' : 'Checking application status...',

        // Application status
        applicationSubmitted: isNepali ? 'आवेदन पेश गरियो' : 'Application Submitted',
        waitForApproval: isNepali ? 'तपाईंले आवेदन पेश गर्नुभएको छ। कृपया अनुमोदनको लागि पर्खनुहोस्।' : 'You have submitted an application. Please wait for approval.',
        applicationNumber: isNepali ? 'आवेदन नम्बर' : 'Application Number',
        status: isNepali ? 'स्थिति' : 'Status',
        submittedOn: isNepali ? 'पेश गरिएको मिति' : 'Submitted On',

        // Status values
        submitted: isNepali ? 'पेश गरिएको' : 'SUBMITTED',
        underReview: isNepali ? 'समीक्षामा' : 'UNDER REVIEW',
        pendingDocuments: isNepali ? 'कागजातहरू बाँकी' : 'PENDING DOCUMENTS',

        // Buttons
        viewApplication: isNepali ? 'आवेदन हेर्नुहोस्' : 'View Application',
        editApplication: isNepali ? 'आवेदन सम्पादन गर्नुहोस्' : 'Edit Application',
        previous: isNepali ? 'अघिल्लो' : 'Previous',
        next: isNepali ? 'अर्को' : 'Next',
        submitting: isNepali ? 'पेश गर्दै...' : 'Submitting...',
        submitApplication: isNepali ? 'पेश गर्नुहोस्' : 'Submit',

        // Step titles
        personalDetails: isNepali ? 'व्यक्तिगत विवरण' : 'Personal Details',
        documentUpload: isNepali ? 'कागजात अपलोड' : 'Document Upload',
        reviewApplication: isNepali ? 'आवेदन समीक्षा' : 'Review Application',
        termsConditions: isNepali ? 'नियम र सर्तहरू' : 'Terms & Conditions',
        applicationForm: isNepali ? 'आवेदन फारम' : 'Application Form',

        // Success/Error messages
        submissionSuccess: isNepali ? 'आवेदन सफलतापूर्वक पेश गरियो!' : 'Application submitted successfully!',
        applicationNumberIs: isNepali ? 'तपाईंको आवेदन नम्बर छ:' : 'Your application number is:',
        submissionError: isNepali ? 'आवेदन पेश गर्न त्रुटि:' : 'Error submitting application:',

        // Authentication messages
        noToken: isNepali ? 'कुनै टोकन फेला परेन, लगइनमा रिडिरेक्ट गर्दै' : 'No token found, redirecting to login',
        tokenFailed: isNepali ? 'टोकन प्रमाणीकरण असफल' : 'Token verification failed',
        authError: isNepali ? 'प्रमाणीकरण त्रुटि:' : 'Authentication error:',

        // File handling messages
        fileSizeError: isNepali ? 'फाइल साइज १०एमबी भन्दा कम हुनुपर्छ' : 'File size must be less than 10MB',
        fileTypeError: isNepali ? 'कृपया PDF, JPG, वा PNG फाइल अपलोड गर्नुहोस्' : 'Please upload a PDF, JPG, or PNG file',
        photoTypeError: isNepali ? 'कृपया JPG वा PNG फाइल अपलोड गर्नुहोस्' : 'Please upload a JPG or PNG file',
        fileProcessError: isNepali ? 'फाइल प्रक्रिया गर्न त्रुटि। कृपया फेरि प्रयास गर्नुहोस्।' : 'Error processing file. Please try again.',
        fileRemoved: isNepali ? 'फाइल हटाइयो' : 'File removed',

        // Validation messages
        fullNameRequired: isNepali ? 'पूरा नाम आवश्यक छ' : 'Full name is required',
        emailRequired: isNepali ? 'इमेल आवश्यक छ' : 'Email is required',
        emailInvalid: isNepali ? 'इमेल अमान्य छ' : 'Email is invalid',
        phoneRequired: isNepali ? 'फोन नम्बर आवश्यक छ' : 'Phone number is required',
        passportRequired: isNepali ? 'पासपोर्ट नम्बर आवश्यक छ' : 'Passport number is required',

        // Document validation messages
        passportFrontRequired: isNepali ? 'पासपोर्ट अगाडि आवश्यक छ' : 'Passport Front is required',
        laborVisaRequired: isNepali ? 'श्रम भिसा कार्ड (अगाडि) आवश्यक छ' : 'Labor Visa card(front) is required',
        arrivalRequired: isNepali ? 'आगमन आवश्यक छ' : 'Arrival is required',
        agreementRequired: isNepali ? 'सम्झौता पत्र आवश्यक छ' : 'Agreement Paper is required',
        passportBackRequired: isNepali ? 'पासपोर्ट पछाडि आवश्यक छ' : 'Passport back is required',
        departureRequired: isNepali ? 'प्रस्थान आवश्यक छ' : 'Departure is required',

        paymentProof: isNepali ? 'भुक्तानी प्रमाण' : 'Payment Proof',
        paymentProofRequired: isNepali ? 'भुक्तानी प्रमाण आवश्यक छ' : 'Payment proof is required',

        // Button texts that are currently hardcoded:
        viewApplication: isNepali ? 'आवेदन हेर्नुहोस्' : 'View Application',
        editApplication: isNepali ? 'आवेदन सम्पादन गर्नुहोस्' : 'Edit Application',

        // Navigation button texts:
        previous: isNepali ? 'अघिल्लो' : 'Previous',
        next: isNepali ? 'अर्को' : 'Next',
        submitting: isNepali ? 'पेश गर्दै...' : 'Submitting...',
        submitApplication: isNepali ? 'पेश गर्नुहोस्' : 'Submit',

        // Additional status text:
        submittedOn: isNepali ? 'पेश गरिएको मिति' : 'Submitted On',

        // Agreement validation messages
        acceptTerms: isNepali ? 'तपाईंले नियम र सर्तहरू स्वीकार गर्नुपर्छ' : 'You must accept the terms and conditions',
        acceptPrivacy: isNepali ? 'तपाईंले गोपनीयता नीति स्वीकार गर्नुपर्छ' : 'You must accept the privacy policy',
        acceptDataProcessing: isNepali ? 'तपाईंले डेटा प्रक्रिया सर्तहरू स्वीकार गर्नुपर्छ' : 'You must accept data processing terms'
    };

    // Form data state
    const [formData, setFormData] = useState({
        // Step 1: User Details - Only the 5 fields you want
        fullName: '',
        email: '',
        phone: '',
        whatsappNumber: '', // Optional field
        passportNumber: '',
        // Add these two lines for document upload selections
        applicationMode: '',
        passportType: '',

        // Step 2: Documents - Keep as is
        payment_proof: null,
        passport_front: null,
        valid_visa: null,
        labor_visa_front: null,
        labor_visa_back: null,
        arrival: null,
        agreement_paper: null,
        passport_back: null,
        previous_visa: null,
        departure: null,
        further_info: null,

        // Step 3: Agreement - Keep as is
        termsAccepted: false,
        privacyAccepted: false,
        dataProcessingAccepted: false
    });

    const [errors, setErrors] = useState({});

    // Authentication check
    useEffect(() => {
        async function checkAuthentication() {
            try {
                if (typeof window === 'undefined') {
                    setLoading(false);
                    return;
                }

                const token = localStorage.getItem('token');
                if (!token) {
                    console.log(text.noToken);
                    router.replace('/login');
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(text.tokenFailed);
                }

                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);

            } catch (error) {
                console.error(text.authError, error);
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
                router.replace('/login');
            } finally {
                setLoading(false);
            }
        }

        checkAuthentication();
    }, [router, text.noToken, text.tokenFailed, text.authError]);

    useEffect(() => {
        async function checkApplicationStatus() {
            if (!isAuthenticated || !user) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/status`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const statusData = await response.json();
                    setApplicationStatus(statusData);
                }
            } catch (error) {
                console.error('Error checking application status:', error);
            } finally {
                setStatusLoading(false);
            }
        }

        checkApplicationStatus();
    }, [isAuthenticated, user]);

    // Pre-fill form data with user information
    useEffect(() => {
        if (user && isAuthenticated) {
            setFormData(prev => ({
                ...prev,
                email: user.email || prev.email,
                fullName: user.name || prev.fullName
            }));
        }
    }, [user, isAuthenticated]);

    // Handle logout
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        router.replace('/login');
    }, [router]);

    // Handle form data updates
    const updateFormData = useCallback((updates) => {
        setFormData(prev => ({ ...prev, ...updates }));
    }, []);

    // Handle errors updates
    const updateErrors = useCallback((newErrors) => {
        setErrors(newErrors);
    }, []);

    // Enhanced file handling function
    const handleFileChange = useCallback(async (e) => {
        const file = e.target.files[0];
        const fieldName = e.target.name;

        if (!file) return;

        // Clear any existing error for this field
        setErrors(prev => ({
            ...prev,
            [fieldName]: null
        }));

        // Validate file size (10MB limit for all documents)
        const maxSize = 10 * 1024 * 1024; // 10MB for all files
        if (file.size > maxSize) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: text.fileSizeError
            }));
            return;
        }

        // Validate file type based on document type
        let allowedTypes = [];
        if (fieldName === 'photo') {
            allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        } else {
            allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        }

        if (!allowedTypes.includes(file.type)) {
            const typeText = fieldName === 'photo' ? text.photoTypeError : text.fileTypeError;
            setErrors(prev => ({
                ...prev,
                [fieldName]: typeText
            }));
            return;
        }

        try {
            // Convert file to base64
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(file);
            });

            // Update form data with file information
            setFormData(prev => ({
                ...prev,
                [fieldName]: {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    base64: base64,
                    lastModified: file.lastModified,
                    // Add preview URL for images
                    previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
                }
            }));

            console.log(`File uploaded for ${fieldName}:`, {
                name: file.name,
                type: file.type,
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
            });

        } catch (error) {
            console.error('Error processing file:', error);
            setErrors(prev => ({
                ...prev,
                [fieldName]: text.fileProcessError
            }));
        }
    }, [text.fileSizeError, text.photoTypeError, text.fileTypeError, text.fileProcessError]);

    // Enhanced file removal function
    const handleRemoveFile = useCallback((fieldName) => {
        // Clean up preview URL if it exists
        if (formData[fieldName]?.previewUrl) {
            URL.revokeObjectURL(formData[fieldName].previewUrl);
        }

        setFormData(prev => ({
            ...prev,
            [fieldName]: null
        }));

        // Clear any errors for this field
        setErrors(prev => ({
            ...prev,
            [fieldName]: null
        }));

        // Clear the file input
        const fileInput = document.querySelector(`input[name="${fieldName}"]`);
        if (fileInput) {
            fileInput.value = '';
        }

        console.log(`${text.fileRemoved} for ${fieldName}`);
    }, [formData, text.fileRemoved]);

    // Validation functions
    const validateStep1 = useCallback(() => {
        const newErrors = {};

        // Required fields
        if (!formData.fullName.trim()) newErrors.fullName = text.fullNameRequired;

        if (!formData.email.trim()) {
            newErrors.email = text.emailRequired;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = text.emailInvalid;
        }

        if (!formData.phone.trim()) newErrors.phone = text.phoneRequired;
        if (!formData.passportNumber.trim()) newErrors.passportNumber = text.passportRequired;

        // WhatsApp Number is optional - no validation needed

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, text.fullNameRequired, text.emailRequired, text.emailInvalid, text.phoneRequired, text.passportRequired]);

    const validateStep2 = useCallback(() => {
        // Get the DocumentUpload component's validation function
const documentUploadElement = document.querySelector('[data-document-upload]');
if (documentUploadElement && documentUploadElement._validateDocuments) {
    return documentUploadElement._validateDocuments();
}

        // Fallback validation - check required documents based on current settings
        const newErrors = {};

        // Get current application mode and passport type from DocumentUpload state
        // Since we can't directly access the state, we'll check the radio buttons
        const applicationModeElement = document.querySelector('input[name="applicationMode"]:checked');
        const passportTypeElement = document.querySelector('input[name="passportType"]:checked');

        const applicationMode = applicationModeElement ? applicationModeElement.value : 'new';
        const passportType = passportTypeElement ? passportTypeElement.value : 'green';

        // Check required documents based on mode and type
        if (!formData.passport_front) {
            newErrors.passport_front = text.passportFrontRequired;
        }
        if (!formData.valid_visa) {
            newErrors.valid_visa = text.laborVisaRequired;
        }

        if (applicationMode === 'new') {
            if (!formData.agreement_paper) {
                newErrors.agreement_paper = text.agreementRequired;
            }
            if (passportType === 'green' && !formData.passport_back) {
                newErrors.passport_back = text.passportBackRequired;
            }
        } else if (applicationMode === 'renew') {
            if (!formData.labor_visa_front) {
                newErrors.labor_visa_front = text.laborVisaRequired;
            }
            if (!formData.labor_visa_back) {
                newErrors.labor_visa_back = text.laborVisaRequired;
            }
            if (!formData.arrival) {
                newErrors.arrival = text.arrivalRequired;
            }
            if (passportType === 'green' && !formData.passport_back) {
                newErrors.passport_back = text.passportBackRequired;
            }
        }

        console.log('validateStep2 - formData:', formData);
        console.log('validateStep2 - newErrors:', newErrors);

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, text]);
    const validateStep3 = useCallback(() => {
        const newErrors = {};

        if (!formData.payment_proof) {
            newErrors.payment_proof = text.paymentProofRequired;  // <- Use the new translation
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, text.paymentProofRequired]);
    // Change validateStep3 to validateStep4
    const validateStep4 = useCallback(() => {
        const newErrors = {};

        if (!formData.termsAccepted) newErrors.termsAccepted = text.acceptTerms;
        if (!formData.privacyAccepted) newErrors.privacyAccepted = text.acceptPrivacy;
        if (!formData.dataProcessingAccepted) newErrors.dataProcessingAccepted = text.acceptDataProcessing;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, text.acceptTerms, text.acceptPrivacy, text.acceptDataProcessing]);

    // Navigation handlers
    const handleNext = useCallback(() => {
        let isValid = false;

        if (currentStep === 1) {
            isValid = validateStep1();
        } else if (currentStep === 2) {
            isValid = validateStep2();
        } else if (currentStep === 3) {
            isValid = validateStep3();  // Add this validation
        } else if (currentStep === 4) {
            isValid = true; // No validation needed for review step
        }

        if (isValid) {
            setCurrentStep(prev => prev + 1);
            setErrors({});
        }
    }, [currentStep, validateStep1, validateStep2, validateStep3]);

    const handlePrevious = useCallback(() => {
        setCurrentStep(prev => prev - 1);
        // Clear errors when going back
        setErrors({});
    }, []);

    // Form submission
    const handleSubmit = useCallback(async () => {
        if (!validateStep4()) {
            return;
        }

        setSubmitting(true);

        try {
            const submissionData = {
                // Basic form data - Only the 5 fields you want
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                whatsappNumber: formData.whatsappNumber, // Optional
                passportNumber: formData.passportNumber,

                // Agreement data
                termsAccepted: formData.termsAccepted,
                privacyAccepted: formData.privacyAccepted,
                dataProcessingAccepted: formData.dataProcessingAccepted,

                // Document data
                documents: {
                    passport_front: formData.passport_front?.base64 || null,
                    valid_visa: formData.valid_visa?.base64 || null,
                    labor_visa_front: formData.labor_visa_front?.base64 || null,
                    labor_visa_back: formData.labor_visa_back?.base64 || null,
                    arrival: formData.arrival?.base64 || null,
                    agreement_paper: formData.agreement_paper?.base64 || null,
                    passport_back: formData.passport_back?.base64 || null,
                    previous_visa: formData.previous_visa?.base64 || null,
                    departure: formData.departure?.base64 || null,
                    further_info: formData.further_info?.base64 || null,
                    payment_proof: formData.payment_proof?.base64 || null,

                },

                // Metadata
                userAgent: navigator.userAgent
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Submission failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Application submitted successfully:', result);
            const applicationNumber = result.applicationNumber || result.application_number || result.id || 'N/A';

            alert(`${text.submissionSuccess} `);

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                whatsappNumber: '',
                passportNumber: '',
                passport_front: null,
                valid_visa: null,
                labor_visa_front: null,
                labor_visa_back: null,
                arrival: null,
                agreement_paper: null,
                passport_back: null,
                previous_visa: null,
                departure: null,
                further_info: null,
                termsAccepted: false,
                privacyAccepted: false,
                dataProcessingAccepted: false
            });

            setCurrentStep(1);
            setErrors({});
            router.push('/application');

        } catch (error) {
            console.error('Submission error:', error);
            alert(`${text.submissionError} ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    }, [validateStep3, formData, router, text.submissionSuccess, text.applicationNumberIs, text.submissionError]);

    // Step navigation from review
    const goToStep = useCallback((step) => {
        setCurrentStep(step);
        setErrors({});
    }, []);

    // Handle input changes for Step 1
    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    }, [errors]);

    // Loading screen
    if (loading) {
        return (
            <>
                <Navbar user={user} onLogout={handleLogout} />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-900">{text.verifyingAuth}</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Not authenticated screen
    if (!isAuthenticated || !user) {
        return (
            <>
                <Navbar user={user} onLogout={handleLogout} />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <p className="text-gray-900">{text.redirectingLogin}</p>
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
                <div className="max-w-4xl mx-auto sm:px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {applicationStatus?.hasApplications && !applicationStatus?.canSubmitNew
                                    ? text.applicationStatus
                                    : text.newApplication
                                }
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {applicationStatus?.hasApplications && !applicationStatus?.canSubmitNew
                                    ? text.processingMessage
                                    : text.completeSteps
                                }
                            </p>
                        </div>

                        {/* Status Loading */}
                        {statusLoading && (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">{text.checkingStatus}</p>
                            </div>
                        )}
                        {/* Application Status Message (when user has pending application) */}
                        {!statusLoading && applicationStatus?.hasApplications && !applicationStatus?.canSubmitNew && (
                            <ApplicationStatusDisplay
                                applicationStatus={applicationStatus}
                                text={text}
                            />
                        )}


                        {/* Regular Form (when user can submit new application) */}
                        {!statusLoading && (applicationStatus?.canSubmitNew || !applicationStatus?.hasApplications) && (
                            <ApplicationFormDisplay
                                currentStep={currentStep}
                                formData={formData}
                                errors={errors}
                                submitting={submitting}
                                text={text}
                                user={user}
                                handleInputChange={handleInputChange}
                                handleFileChange={handleFileChange}
                                handleRemoveFile={handleRemoveFile}
                                goToStep={goToStep}
                                updateFormData={updateFormData}
                                updateErrors={updateErrors}
                                handleNext={handleNext}
                                handlePrevious={handlePrevious}
                                handleSubmit={handleSubmit}
                            />
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>)
}