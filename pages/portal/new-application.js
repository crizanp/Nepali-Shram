import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ProgressIndicator from '@/components/ProgressIndicator';
import UserDetailsForm from '@/components/UserDetailsForm';
import DocumentUpload from '@/components/DocumentUpload';
import ApplicationReview from '@/components/ApplicationReview';
import AgreementForm from '@/components/AgreementForm';

export default function ApplicationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    // Form data state
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
                    console.log('No token found, redirecting to login');
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
                    throw new Error('Token verification failed');
                }

                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);

            } catch (error) {
                console.error('Authentication error:', error);
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

    // File handling functions
    // Enhanced file handling function for your React component
const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    if (!file) return;
    
    // Clear any existing error for this field
    setErrors(prev => ({
        ...prev,
        [fieldName]: null
    }));
    
    // Validate file size (10MB limit for documents, 5MB for photos)
    const maxSize = fieldName === 'photo' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
        setErrors(prev => ({
            ...prev,
            [fieldName]: `File size must be less than ${fieldName === 'photo' ? '5MB' : '10MB'}`
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
        const typeText = fieldName === 'photo' ? 'JPG or PNG' : 'PDF, JPG, or PNG';
        setErrors(prev => ({
            ...prev,
            [fieldName]: `Please upload a ${typeText} file`
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
            [fieldName]: 'Error processing file. Please try again.'
        }));
    }
}, []);

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
    
    console.log(`File removed for ${fieldName}`);
}, [formData]);

    // Validation functions
    const validateStep1 = useCallback(() => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
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

    // Navigation handlers
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
            // Clear errors when moving to next step
            setErrors({});
        }
    }, [currentStep, validateStep1, validateStep2]);

    const handlePrevious = useCallback(() => {
        setCurrentStep(prev => prev - 1);
        // Clear errors when going back
        setErrors({});
    }, []);

    // Form submission
   // Updated handleSubmit function in your React component
const handleSubmit = useCallback(async () => {
    if (!validateStep3()) {
        return;
    }

    setSubmitting(true);
    
    try {
        const submissionData = {
            // Basic form data
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            dateOfBirth: formData.dateOfBirth,
            nationality: formData.nationality,
            passportNumber: formData.passportNumber,
            experience: formData.experience,
            
            // Agreement data
            termsAccepted: formData.termsAccepted,
            privacyAccepted: formData.privacyAccepted,
            dataProcessingAccepted: formData.dataProcessingAccepted,
            
            // Document data - Send complete document objects
            documents: {
                passport: formData.passport?.base64 || null,
                photo: formData.photo?.base64 || null,
                certificate: formData.certificate?.base64 || null,
                experience_letter: formData.experience_letter?.base64 || null
            },
            
            // Metadata
            userAgent: navigator.userAgent
        };

        console.log('Submitting application with data:', {
            ...submissionData,
            documents: Object.keys(submissionData.documents).reduce((acc, key) => {
                acc[key] = submissionData.documents[key] ? 'base64_data_present' : null;
                return acc;
            }, {})
        });

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

        // Show success message with application number
        alert(`Application submitted successfully! Your application number is: ${result.applicationNumber}. You will receive a confirmation email shortly.`);

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

        // Redirect to applications page or success page
        router.push('/applications');

    } catch (error) {
        console.error('Submission error:', error);
        alert(`Error submitting application: ${error.message}. Please check your connection and try again.`);
    } finally {
        setSubmitting(false);
    }
}, [validateStep3, formData, router]);

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

    // Render current step component
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <UserDetailsForm
                        formData={formData}
                        errors={errors}
                        onInputChange={handleInputChange}
                    />
                );
            case 2:
                return (
                    <DocumentUpload
                        formData={formData}
                        errors={errors}
                        onFileChange={handleFileChange}
                        onRemoveFile={handleRemoveFile}
                    />
                );
            case 3:
                return (
                    <ApplicationReview
                        formData={formData}
                        onGoToStep={goToStep}
                    />
                );
            case 4:
                return (
                    <AgreementForm
                        formData={formData}
                        errors={errors}
                        onUpdate={updateFormData}
                        onErrorsUpdate={updateErrors}
                        onInputChange={handleInputChange}
                    />
                );
            default:
                return null;
        }
    };

    // Get step title
    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return 'Personal Details';
            case 2:
                return 'Document Upload';
            case 3:
                return 'Review Application';
            case 4:
                return 'Terms & Conditions';
            default:
                return 'Application Form';
        }
    };

    // Loading screen
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

    // Not authenticated screen
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
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Application</h1>
                            <p className="text-gray-500 text-sm mt-1">Please complete all steps to submit your application</p>
                        </div>

                        {/* Progress Indicator */}
                        <ProgressIndicator currentStep={currentStep} />

                        {/* Current Step Content */}
                        <div className="mb-8">
                            {renderCurrentStep()}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                            <button
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className={`inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium transition-colors ${
                                    currentStep === 1
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                        : 'text-gray-700 cursor-pointer bg-white hover:bg-gray-50 hover:border-gray-400'
                                }`}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </button>
                            
                            <div className="flex items-center space-x-4">
                               
                                
                                {currentStep < 4 ? (
                                    <button
                                        onClick={handleNext}
                                        className="inline-flex items-center cursor-pointer px-6 py-3 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Next
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md text-sm font-medium text-white transition-colors shadow-sm ${
                                            submitting
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                                        }`}
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Submit Application
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    );
}