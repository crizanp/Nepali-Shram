import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import ProgressIndicator from '@/components/ProgressIndicator';
import UserDetailsForm from '@/components/UserDetailsForm';
import DocumentUpload from '@/components/DocumentUpload';
import ApplicationReview from '@/components/ApplicationReview';
import AgreementForm from '@/components/AgreementForm';
import PaymentUpload from '@/components/PaymentUpload';

const ApplicationFormDisplay = ({
    currentStep,
    formData,
    errors,
    submitting,
    text,
    user,
    handleInputChange,
    handleFileChange,
    handleRemoveFile,
    goToStep,
    updateFormData,
    updateErrors,
    handleNext,
    handlePrevious,
    handleSubmit
}) => {
    // Render current step component
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <UserDetailsForm
                        formData={formData}
                        errors={errors}
                        onInputChange={handleInputChange}
                        userEmail={user?.email}
                    />
                );
            case 2:
                return (
                    <DocumentUpload
                        formData={formData}
                        errors={errors}
                        onFileChange={handleFileChange}
                        onRemoveFile={handleRemoveFile}
                        onUpdateErrors={updateErrors}
                        onUpdateFormData={updateFormData}  // Add this line
                    />
                );
            case 3:
                return (
                    <PaymentUpload
                        formData={formData}
                        errors={errors}
                        onFileChange={handleFileChange}
                        onRemoveFile={handleRemoveFile}
                    />
                );
            case 4:
                return (
                    <ApplicationReview
                        formData={formData}
                        onGoToStep={goToStep}
                    />
                );
            case 5:
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

    return (
        <>
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
                    className={`inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium transition-colors ${currentStep === 1
                            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                            : 'text-gray-700 cursor-pointer bg-white hover:bg-gray-50 hover:border-gray-400'
                        }`}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {text.previous}
                </button>

                <div className="flex items-center space-x-4">
                    {currentStep < 5 ? (
                        <button
                            onClick={handleNext}
                            className="inline-flex items-center cursor-pointer px-6 py-3 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            {text.next}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md text-sm font-medium text-white transition-colors shadow-sm ${submitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                                }`}
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {text.submitting}
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    {text.submitApplication}
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ApplicationFormDisplay;