// /pages/applications/[id]/edit.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Upload,
  X,
  ArrowLeft,
  Save,
  Eye,
  FileText,
  AlertCircle
} from 'lucide-react';

import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';

export default function EditApplication() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    passportNumber: '',
    documents: {},
    termsAccepted: false,
    privacyAccepted: false,
    dataProcessingAccepted: false
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { id } = router.query;

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
        router.replace('/login');
      }
    }

    checkAuthentication();
  }, [router]);

  // Fetch application details
  // Fetch application details
  useEffect(() => {
    async function fetchApplication() {
      if (!isAuthenticated || !id) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch application details');
        }

        const data = await response.json();
        
        // Check if application can be edited
        const editableStatuses = ['submitted', 'under_review', 'pending_documents', 'rejected'];
        if (!editableStatuses.includes(data.status)) {
          alert('This application cannot be edited.');
          router.push('/applications');
          return;
        }

        setApplication(data);
        
        // Process documents to handle different data formats
        const processedDocuments = {};
        if (data.documents && typeof data.documents === 'object') {
          Object.entries(data.documents).forEach(([key, value]) => {
            if (value) {
              // If it's already a base64 string, use it directly
              if (typeof value === 'string' && value.startsWith('data:')) {
                processedDocuments[key] = value;
              }
              // If it's an object with base64Data property
              else if (typeof value === 'object' && value.base64Data) {
                processedDocuments[key] = value.base64Data;
              }
              // If it's an object with fileType and base64Data
              else if (typeof value === 'object' && value.fileType && value.base64Data) {
                processedDocuments[key] = value.base64Data;
              }
              // For other formats, keep as is
              else {
                processedDocuments[key] = value;
              }
            }
          });
        }
        
        // Pre-populate form with existing data
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          whatsappNumber: data.whatsappNumber || '',
          passportNumber: data.passportNumber || '',
          documents: processedDocuments,
          termsAccepted: data.agreements?.termsAccepted || false,
          privacyAccepted: data.agreements?.privacyAccepted || false,
          dataProcessingAccepted: data.agreements?.dataProcessingAccepted || false
        });

      } catch (error) {
        console.error('Error fetching application details:', error);
        alert('Error loading application details');
        router.push('/applications');
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [isAuthenticated, id, router]);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/login');
  }, [router]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (docType, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPEG, JPG, and PNG files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docType]: e.target.result
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove document
  const removeDocument = (docType) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: null
      }
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';

    // Check required documents
    const requiredDocuments = [
      'passport_front',
      'labor_visa_front',
      'arrival',
      'agreement_paper',
      'passport_back',
      'departure'
    ];

    const missingDocuments = requiredDocuments.filter(docType => !formData.documents[docType]);
    if (missingDocuments.length > 0) {
      newErrors.documents = `Required documents missing: ${missingDocuments.join(', ')}`;
    }

    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    if (!formData.privacyAccepted) newErrors.privacyAccepted = 'You must accept the privacy policy';
    if (!formData.dataProcessingAccepted) newErrors.dataProcessingAccepted = 'You must accept data processing terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update application');
      }

      alert('Application updated successfully!');
      router.push('/application');

    } catch (error) {
      console.error('Error updating application:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Document types configuration
  const documentTypes = [
    { key: 'passport_front', label: 'Passport Front Page', required: true },
    { key: 'passport_back', label: 'Passport Back Page', required: true },
    { key: 'valid_visa', label: 'Valid Visa', required: false },
    { key: 'labor_visa_front', label: 'Labor Visa Card (Front)', required: true },
    { key: 'labor_visa_back', label: 'Labor Visa Card (Back)', required: false },
    { key: 'arrival', label: 'Arrival Document', required: true },
    { key: 'departure', label: 'Departure Document', required: true },
    { key: 'agreement_paper', label: 'Agreement Paper', required: true },
    { key: 'previous_visa', label: 'Previous Visa', required: false },
    { key: 'further_info', label: 'Further Information', required: false }
  ];

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-900">Loading application...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-900">Application not found</p>
            <button
              onClick={() => router.push('/application')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Applications
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/application')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Application</h1>
            <p className="text-gray-600 mt-2">
              Application Number: {application.applicationNumber}
            </p>
          </div>

          {/* Status Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                <strong>Note:</strong> Editing this application will reset its status to "Submitted" and it will need to be reviewed again.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Number *
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.passportNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.passportNumber && <p className="text-red-500 text-sm mt-1">{errors.passportNumber}</p>}
                </div>
              </div>
            </div>

            {/* Documents */}
             <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
              {errors.documents && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{errors.documents}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentTypes.map((docType) => (
                  <div key={docType.key} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {docType.label}
                      {docType.required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    
                    {formData.documents[docType.key] ? (
                      <div className="space-y-2">
                        {/* Display uploaded image if it's an image file */}
                        {formData.documents[docType.key] && 
                         (typeof formData.documents[docType.key] === 'string' && formData.documents[docType.key].startsWith('data:image/')) && (
                          <div className="mb-3">
                            <img 
                              src={formData.documents[docType.key]} 
                              alt={docType.label}
                              className="w-full h-48 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div className="hidden text-sm text-gray-500 text-center py-8">
                              Image could not be loaded
                            </div>
                          </div>
                        )}
                        
                        {/* Show PDF indicator for PDF files */}
                        {formData.documents[docType.key] && 
                         (typeof formData.documents[docType.key] === 'string' && formData.documents[docType.key].startsWith('data:application/pdf')) && (
                          <div className="mb-3 p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center justify-center text-red-600">
                              <FileText className="w-8 h-8 mr-2" />
                              <span className="text-sm font-medium">PDF Document</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Show generic file indicator for other file types */}
                        {formData.documents[docType.key] && 
                         (typeof formData.documents[docType.key] === 'string' && 
                          !formData.documents[docType.key].startsWith('data:image/') && 
                          !formData.documents[docType.key].startsWith('data:application/pdf')) && (
                          <div className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-center text-gray-600">
                              <FileText className="w-8 h-8 mr-2" />
                              <span className="text-sm font-medium">Document Uploaded</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                          <span className="text-green-700 text-sm">Document uploaded</span>
                          <button
                            type="button"
                            onClick={() => removeDocument(docType.key)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(docType.key, e.target.files[0])}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500">
                          Replace current document (PDF, JPG, PNG - max 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(docType.key, e.target.files[0])}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, PNG (max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Agreements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agreements</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <label className="text-sm text-gray-700">
                      I accept the Terms and Conditions *
                    </label>
                    {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>}
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <label className="text-sm text-gray-700">
                      I accept the Privacy Policy *
                    </label>
                    {errors.privacyAccepted && <p className="text-red-500 text-sm mt-1">{errors.privacyAccepted}</p>}
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="dataProcessingAccepted"
                    checked={formData.dataProcessingAccepted}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <label className="text-sm text-gray-700">
                      I accept the Data Processing Terms *
                    </label>
                    {errors.dataProcessingAccepted && <p className="text-red-500 text-sm mt-1">{errors.dataProcessingAccepted}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/application')}
                className="px-6 py-3 cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}