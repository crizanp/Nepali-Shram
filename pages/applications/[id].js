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
} from 'lucide-react';

import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

export default function ApplicationDetails() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      submitted: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: 'Submitted' },
      under_review: { icon: AlertCircle, color: 'bg-blue-100 text-blue-800', text: 'Under Review' },
      approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { icon: XCircle, color: 'bg-red-100 text-red-800', text: 'Rejected' },
      pending_documents: { icon: FileText, color: 'bg-orange-100 text-orange-800', text: 'Pending Documents' },
      withdrawn: { icon: XCircle, color: 'bg-gray-100 text-gray-800', text: 'Withdrawn' }
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
        // Handle PDF viewing
        const url = URL.createObjectURL(blob);
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.location.href = url;
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else {
          alert('Please allow popups to view the document');
        }
      } else if (fileType.startsWith('image/')) {
        // Handle image viewing
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
                <img src="${base64}" alt="${documentName}" onload="document.title='${documentName} - Loaded'" onerror="document.body.innerHTML='<p>Error loading image</p>'" />
              </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          alert('Please allow popups to view the document');
        }
      } else {
        // For other file types, just download
        downloadDocument(documentType);
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Error viewing document. Please try again.');
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
      alert('Error downloading document.');
    }
  };

  // Format date with error handling
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Get document display name
  const getDocumentDisplayName = (docType) => {
    const displayNames = {
      'passport_front': 'Passport Front',
      'passport_back': 'Passport Back',
      'valid_visa': 'Valid Visa',
      'labor_visa_front': 'Labor Visa Card (Front)',
      'labor_visa_back': 'Labor Visa Card (Back)',
      'arrival': 'Arrival',
      'departure': 'Departure',
      'agreement_paper': 'Agreement Paper',
      'previous_visa': 'Previous Visa',
      'further_info': 'Further Info'
    };
    return displayNames[docType] || docType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Safe render function for potentially undefined values
  const safeRender = (value) => {
    if (value === null || value === undefined) return 'Not provided';
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
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-900">Loading application details...</p>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
           
            <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600 mt-2">
              Application Number: {safeRender(application.applicationNumber)}
            </p>
          </div>

          {/* Status Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
            <div className="flex items-center justify-between">
              <div>
                {getStatusBadge(application.status)}
              </div>
              <div className="text-sm text-gray-600">
                <div>Submitted: {formatDate(application.submittedAt)}</div>
                {application.lastUpdated && (
                  <div>Last Updated: {formatDate(application.lastUpdated)}</div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="text-gray-900">{safeRender(application.fullName)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{safeRender(application.email)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900">{safeRender(application.phone)}</p>
                </div>
              </div>
              <div className='flex items-center'>
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Passport Number </p>
                  <p className="text-gray-900">{safeRender(application.passportNumber)}</p></div>
              </div>
              <div className='flex items-center'>
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Whatsapp Number </p>
                  <p className="text-gray-900">{safeRender(application.whatsappNumber)}</p></div>
              </div>
            </div>
          </div>


          {/* Documents */}
         {application.documents && typeof application.documents === 'object' && Object.keys(application.documents).length > 0 && (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
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
          {docInfo && docInfo.fileType === 'application/pdf' && (
            <div className="mb-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-center text-red-600">
                <FileText className="w-8 h-8 mr-2" />
                <span className="text-sm font-medium">PDF Document</span>
              </div>
            </div>
          )}
          
          {/* Download button */}
          <button
            onClick={() => downloadDocument(docType)}
            className="w-full inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
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