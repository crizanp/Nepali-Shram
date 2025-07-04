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

    // Step 2: Documents - Updated to match DocumentUpload component
    passport: null,
    passportBack: null,
    visa: null,
    visad: null,
    laborVisaFront: null,
    laborVisaBack: null,
    arrival: null,
    departure: null,
    agreementPaper: null,
    furtherInfo: null,

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
// Updated file handling functions for Cloudinary upload
const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    if (!file) return;
    
    // Clear any existing error for this field
    setErrors(prev => ({
        ...prev,
        [fieldName]: null
    }));
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        setErrors(prev => ({
            ...prev,
            [fieldName]: `File size must be less than 10MB`
        }));
        return;
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
            ...prev,
            [fieldName]: `Please upload a PDF, JPG, or PNG file`
        }));
        return;
    }
    
    try {
        // Show loading state
        setFormData(prev => ({
            ...prev,
            [fieldName]: {
                name: file.name,
                type: file.type,
                size: file.size,
                uploading: true,
                previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
            }
        }));

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', `applications/${user.id}`);

        // Upload to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const result = await response.json();
        
        // Update form data with Cloudinary response
        setFormData(prev => ({
            ...prev,
            [fieldName]: {
                name: file.name,
                type: file.type,
                size: file.size,
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                bytes: result.bytes,
                uploading: false,
                previewUrl: file.type.startsWith('image/') ? result.secure_url : null
            }
        }));
        
        console.log(`File uploaded for ${fieldName}:`, {
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            url: result.secure_url
        });
        
    } catch (error) {
        console.error('Error uploading file:', error);
        setErrors(prev => ({
            ...prev,
            [fieldName]: 'Error uploading file. Please try again.'
        }));
        
        // Clear the failed upload
        setFormData(prev => ({
            ...prev,
            [fieldName]: null
        }));
    }
}, [user.id]);

// Updated file removal function
const handleRemoveFile = useCallback(async (fieldName) => {
    const fileData = formData[fieldName];
    
    // Clean up preview URL if it exists
    if (fileData?.previewUrl && fileData.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(fileData.previewUrl);
    }
    
    // If file was uploaded to Cloudinary, delete it
    if (fileData?.publicId) {
        try {
            // Call your backend API to delete from Cloudinary
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ publicId: fileData.publicId })
            });
        } catch (error) {
            console.error('Error deleting file from Cloudinary:', error);
        }
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

   // Updated validation function for Step 2
const validateStep2 = useCallback(() => {
    const newErrors = {};

    // Required documents
    const requiredDocs = ['passport', 'visa', 'laborVisaFront', 'laborVisaBack', 'arrival', 'agreementPaper'];
    
    requiredDocs.forEach(docName => {
        if (!formData[docName] || !formData[docName].url) {
            const docConfig = {
                passport: 'Passport Front',
                visa: 'Valid Visa',
                laborVisaFront: 'Labor Visa card (front)',
                laborVisaBack: 'Labor Visa card (back)',
                arrival: 'Arrival document',
                agreementPaper: 'Agreement Paper'
            };
            newErrors[docName] = `${docConfig[docName]} is required`;
        }
    });

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
// Updated handleSubmit function for Cloudinary URLs
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
            
            // Document data - Updated to send Cloudinary URLs and metadata
            documents: {
                passport: formData.passport ? {
                    url: formData.passport.url,
                    publicId: formData.passport.publicId,
                    fileName: formData.passport.name,
                    fileType: formData.passport.format || formData.passport.type,
                    fileSize: formData.passport.bytes || formData.passport.size
                } : null,
                
                visa: formData.visa ? {
                    url: formData.visa.url,
                    publicId: formData.visa.publicId,
                    fileName: formData.visa.name,
                    fileType: formData.visa.format || formData.visa.type,
                    fileSize: formData.visa.bytes || formData.visa.size
                } : null,
                
                laborVisaFront: formData.laborVisaFront ? {
                    url: formData.laborVisaFront.url,
                    publicId: formData.laborVisaFront.publicId,
                    fileName: formData.laborVisaFront.name,
                    fileType: formData.laborVisaFront.format || formData.laborVisaFront.type,
                    fileSize: formData.laborVisaFront.bytes || formData.laborVisaFront.size
                } : null,
                
                laborVisaBack: formData.laborVisaBack ? {
                    url: formData.laborVisaBack.url,
                    publicId: formData.laborVisaBack.publicId,
                    fileName: formData.laborVisaBack.name,
                    fileType: formData.laborVisaBack.format || formData.laborVisaBack.type,
                    fileSize: formData.laborVisaBack.bytes || formData.laborVisaBack.size
                } : null,
                
                arrival: formData.arrival ? {
                    url: formData.arrival.url,
                    publicId: formData.arrival.publicId,
                    fileName: formData.arrival.name,
                    fileType: formData.arrival.format || formData.arrival.type,
                    fileSize: formData.arrival.bytes || formData.arrival.size
                } : null,
                
                agreementPaper: formData.agreementPaper ? {
                    url: formData.agreementPaper.url,
                    publicId: formData.agreementPaper.publicId,
                    fileName: formData.agreementPaper.name,
                    fileType: formData.agreementPaper.format || formData.agreementPaper.type,
                    fileSize: formData.agreementPaper.bytes || formData.agreementPaper.size
                } : null,
                
                // Optional documents
                passportBack: formData.passportBack ? {
                    url: formData.passportBack.url,
                    publicId: formData.passportBack.publicId,
                    fileName: formData.passportBack.name,
                    fileType: formData.passportBack.format || formData.passportBack.type,
                    fileSize: formData.passportBack.bytes || formData.passportBack.size
                } : null,
                
                visad: formData.visad ? {
                    url: formData.visad.url,
                    publicId: formData.visad.publicId,
                    fileName: formData.visad.name,
                    fileType: formData.visad.format || formData.visad.type,
                    fileSize: formData.visad.bytes || formData.visad.size
                } : null,
                
                departure: formData.departure ? {
                    url: formData.departure.url,
                    publicId: formData.departure.publicId,
                    fileName: formData.departure.name,
                    fileType: formData.departure.format || formData.departure.type,
                    fileSize: formData.departure.bytes || formData.departure.size
                } : null,
                
                furtherInfo: formData.furtherInfo ? {
                    url: formData.furtherInfo.url,
                    publicId: formData.furtherInfo.publicId,
                    fileName: formData.furtherInfo.name,
                    fileType: formData.furtherInfo.format || formData.furtherInfo.type,
                    fileSize: formData.furtherInfo.bytes || formData.furtherInfo.size
                } : null
            },
            
            // Metadata
            userAgent: navigator.userAgent
        };

        console.log('Submitting application with data:', {
            ...submissionData,
            documents: Object.keys(submissionData.documents).reduce((acc, key) => {
                acc[key] = submissionData.documents[key] ? 'file_data_present' : null;
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
            passportBack: null,
            visa: null,
            visad: null,
            laborVisaFront: null,
            laborVisaBack: null,
            arrival: null,
            departure: null,
            agreementPaper: null,
            furtherInfo: null,
            termsAccepted: false,
            privacyAccepted: false,
            dataProcessingAccepted: false
        });
        setCurrentStep(1);
        setErrors({});

        // Redirect to applications page
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