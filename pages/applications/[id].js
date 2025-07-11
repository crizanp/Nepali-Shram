import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Eye,
  Globe,
} from 'lucide-react';

import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useTranslation } from '../../context/TranslationContext'; // Use the same context as ApplicationReview

export default function ApplicationDetails() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isNepali, toggleLanguage } = useTranslation(); // Use the shared context
  const router = useRouter();
  const { id } = router.query;

  // Translation object - moved inside component to access isNepali
  const t = {
    // Page titles and headers
    applicationDetails: isNepali ? 'आवेदन विवरण' : 'Application Details',
    applicationNumber: isNepali ? 'आवेदन नम्बर' : 'Application Number',
    loadingMessage: isNepali ? 'आवेदन विवरण लोड हुँदैछ...' : 'Loading application details...',
    applicationNotFound: isNepali ? 'आवेदन फेला परेन' : 'Application not found',
    backToApplications: isNepali ? 'आवेदनहरूमा फर्कनुहोस्' : 'Back to Applications',
    
    // Status section
    status: isNepali ? 'स्थिति' : 'Status',
    submitted: isNepali ? 'पेश गरिएको' : 'Submitted',
    lastUpdated: isNepali ? 'अन्तिम अपडेट' : 'Last Updated',
    
    // Status badges
    statusSubmitted: isNepali ? 'पेश गरिएको' : 'Submitted',
    statusUnderReview: isNepali ? 'समीक्षाधीन' : 'Under Review',
    statusApproved: isNepali ? 'अनुमोदित' : 'Approved',
    statusRejected: isNepali ? 'अस्वीकृत' : 'Rejected',
    statusPendingDocuments: isNepali ? 'कागजातहरू बाँकी' : 'Pending Documents',
    statusWithdrawn: isNepali ? 'फिर्ता लिइएको' : 'Withdrawn',
    
    // Personal information
    personalInformation: isNepali ? 'व्यक्तिगत जानकारी' : 'Personal Information',
    fullName: isNepali ? 'पूरा नाम' : 'Full Name',
    email: isNepali ? 'इमेल' : 'Email',
    phone: isNepali ? 'फोन' : 'Phone',
    passportNumber: isNepali ? 'पासपोर्ट नम्बर' : 'Passport Number',
    whatsappNumber: isNepali ? 'व्हाट्सएप नम्बर' : 'WhatsApp Number',
    
    // Documents section
    documents: isNepali ? 'कागजातहरू' : 'Documents',
    download: isNepali ? 'डाउनलोड गर्नुहोस्' : 'Download',
    view: isNepali ? 'हेर्नुहोस्' : 'View',
    pdfDocument: isNepali ? 'PDF कागजात' : 'PDF Document',
    
    // Document types
    passportFront: isNepali ? 'पासपोर्ट अगाडिको पाना' : 'Passport Front',
    passportBack: isNepali ? 'पासपोर्ट पछाडिको पाना' : 'Passport Back',
    validVisa: isNepali ? 'वैध भिसा' : 'Valid Visa',
    laborVisaFront: isNepali ? 'लेबर भिसा कार्ड (अगाडि)' : 'Labor Visa Card (Front)',
    laborVisaBack: isNepali ? 'लेबर भिसा कार्ड (पछाडि)' : 'Labor Visa Card (Back)',
    arrival: isNepali ? 'आगमन' : 'Arrival',
    departure: isNepali ? 'प्रस्थान' : 'Departure',
    agreementPaper: isNepali ? 'सम्झौता कागजात' : 'Agreement Paper',
    previousVisa: isNepali ? 'अघिल्लो भिसा' : 'Previous Visa',
    furtherInfo: isNepali ? 'थप जानकारी' : 'Further Info',
    paymentProof: isNepali ? 'भुक्तानी प्रमाण' : 'Payment Proof',
    
    // General messages
    notProvided: isNepali ? 'उपलब्ध छैन' : 'Not provided',
    notAvailable: isNepali ? 'उपलब्ध छैन' : 'Not available',
    invalidDate: isNepali ? 'अमान्य मिति' : 'Invalid date',
    
    // Errors
    errorViewing: isNepali ? 'कागजात हेर्न त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।' : 'Error viewing document. Please try again.',
    errorDownloading: isNepali ? 'कागजात डाउनलोड गर्न त्रुटि भयो।' : 'Error downloading document.',
    allowPopups: isNepali ? 'कागजात हेर्न पप-अप अनुमति दिनुहोस्' : 'Please allow popups to view the document',
    imageLoadError: isNepali ? 'छवि लोड गर्न सकिएन' : 'Image could not be loaded',
    
    // Language toggle
    switchToNepali: isNepali ? 'नेपालीमा' : 'नेपाली',
    switchToEnglish: isNepali ? 'English' : 'English',
  };

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
        setApplication(data);
      } catch (error) {
        console.error('Error fetching application details:', error);
        router.push('/application');
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

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: t.statusSubmitted },
      under_review: { icon: AlertCircle, color: 'bg-red-100 text-red-800', text: t.statusUnderReview },
      approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: t.statusApproved },
      rejected: { icon: XCircle, color: 'bg-red-100 text-red-800', text: t.statusRejected },
      pending_documents: { icon: FileText, color: 'bg-orange-100 text-orange-800', text: t.statusPendingDocuments },
      withdrawn: { icon: XCircle, color: 'bg-gray-100 text-gray-800', text: t.statusWithdrawn }
    };

    const config = statusConfig[status] || statusConfig.submitted;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {config.text}
      </span>
    );
  };

  // View document function
  const viewDocument = async (documentType, documentName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${id}/view/${documentType}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }

      const blob = await response.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      const fileType = blob.type;

      if (fileType === 'application/pdf') {
        const url = URL.createObjectURL(blob);
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.location.href = url;
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else {
          alert(t.allowPopups);
        }
      } else if (fileType.startsWith('image/')) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>${documentName}</title>
                <style>
                  body { 
                    margin: 0; 
                    padding: 20px; 
                    background: #f0f0f0; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    min-height: 100vh; 
                  }
                  img { 
                    max-width: 90vw; 
                    max-height: 90vh; 
                    object-fit: contain; 
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1); 
                  }
                </style>
              </head>
              <body>
                <img src="${base64}" alt="${documentName}" onload="document.title='${documentName} - Loaded'" onerror="document.body.innerHTML='<p>${t.imageLoadError}</p>'" />
              </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          alert(t.allowPopups);
        }
      } else {
        downloadDocument(documentType);
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert(t.errorViewing);
    }
  };

  // Download document
  const downloadDocument = async (documentType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${id}/download/${documentType}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentType}_${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert(t.errorDownloading);
    }
  };

  // Format date with error handling
  const formatDate = (dateString) => {
    if (!dateString) return t.notAvailable;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return t.invalidDate;

      if (isNepali) {
        // For Nepali, you might want to use Nepali date format
        return date.toLocaleDateString('ne-NP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return t.invalidDate;
    }
  };

  // Get document display name
  const getDocumentDisplayName = (docType) => {
    const displayNames = {
      'passport_front': t.passportFront,
      'passport_back': t.passportBack,
      'valid_visa': t.validVisa,
      'labor_visa_front': t.laborVisaFront,
      'labor_visa_back': t.laborVisaBack,
      'arrival': t.arrival,
      'departure': t.departure,
      'agreement_paper': t.agreementPaper,
      'previous_visa': t.previousVisa,
      'further_info': t.furtherInfo,
      'payment_proof': t.paymentProof
    };
    return displayNames[docType] || docType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Safe render function for potentially undefined values
  const safeRender = (value) => {
    if (value === null || value === undefined) return t.notProvided;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-900">{t.loadingMessage}</p>
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
            <p className="text-gray-900">{t.applicationNotFound}</p>
            <button
              onClick={() => router.push('/application')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              {t.backToApplications}
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Language Toggle and Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t.applicationDetails}</h1>
                <p className="text-gray-600 mt-2">
                  {t.applicationNumber}: {safeRender(application.applicationNumber)}
                </p>
              </div>
              
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.status}</h2>
            <div className="flex items-center justify-between">
              <div>
                {getStatusBadge(application.status)}
              </div>
              <div className="text-sm text-gray-600">
                <div>{t.submitted}: {formatDate(application.submittedAt)}</div>
                {application.lastUpdated && (
                  <div>{t.lastUpdated}: {formatDate(application.lastUpdated)}</div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.personalInformation}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t.fullName}</p>
                  <p className="text-gray-900">{safeRender(application.fullName)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t.email}</p>
                  <p className="text-gray-900">{safeRender(application.email)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t.phone}</p>
                  <p className="text-gray-900">{safeRender(application.phone)}</p>
                </div>
              </div>
              <div className='flex items-center'>
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t.passportNumber}</p>
                  <p className="text-gray-900">{safeRender(application.passportNumber)}</p>
                </div>
              </div>
              <div className='flex items-center'>
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t.whatsappNumber}</p>
                  <p className="text-gray-900">{safeRender(application.whatsappNumber)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          {application.documents && typeof application.documents === 'object' && Object.keys(application.documents).length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.documents}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(application.documents).map(([docType, docInfo]) => (
                  <div key={docType} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-3">
                      <FileText className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-gray-900 font-medium">
                        {getDocumentDisplayName(docType)}
                      </span>
                    </div>

                    {/* Display image directly if it's an image file */}
                    {docInfo && docInfo.fileType && docInfo.fileType.startsWith('image/') && docInfo.base64Data && (
                      <div className="mb-3">
                        <img
                          src={docInfo.base64Data}
                          alt={getDocumentDisplayName(docType)}
                          className="w-full max-h-[200px] object-contain rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="hidden text-sm text-gray-500 text-center py-8">
                          {t.imageLoadError}
                        </div>
                      </div>
                    )}

                    {/* Show PDF indicator for PDF files */}
                    {docInfo && docInfo.fileType === 'application/pdf' && (
                      <div className="mb-3 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-center text-red-600">
                          <FileText className="w-8 h-8 mr-2" />
                          <span className="text-sm font-medium">{t.pdfDocument}</span>
                        </div>
                      </div>
                    )}

                    {/* Download button */}
                    <button
                      onClick={() => downloadDocument(docType)}
                      className="w-full inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t.download}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}