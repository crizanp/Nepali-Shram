import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { 
  Eye, 
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
  Trash2
} from 'lucide-react';

// Mock Navbar and Footer components
const Navbar = ({ user, onLogout }) => (
  <nav className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">Application Portal</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
          <button
            onClick={onLogout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p>&copy; 2025 Application Portal. All rights reserved.</p>
    </div>
  </footer>
);

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [withdrawing, setWithdrawing] = useState(null);
  const router = useRouter();

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

  // Fetch applications
  useEffect(() => {
    async function fetchApplications() {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        alert('Error fetching applications. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [isAuthenticated]);

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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  // View application details
  const viewApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${applicationId}`, {
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
      setSelectedApplication(data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
      alert('Error fetching application details.');
    }
  };

  // Download document
  const downloadDocument = async (applicationId, documentType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${applicationId}/download/${documentType}`, {
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
      a.download = `${documentType}_${applicationId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error downloading document.');
    }
  };

  // Withdraw application
  const withdrawApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    setWithdrawing(applicationId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${applicationId}/withdraw`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to withdraw application');
      }

      // Update the application status in the list
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: 'withdrawn' } : app
      ));

      alert('Application withdrawn successfully.');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setWithdrawing(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-900">Loading applications...</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-2">View and manage your submitted applications</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/apply')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Application
              </button>
            </div>
          </div>

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-gray-600 mb-4">You haven't submitted any applications yet.</p>
              <button
                onClick={() => router.push('/apply')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Your First Application
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Applications ({applications.length})
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {application.applicationNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {application.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(application.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(application.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => viewApplication(application._id)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          {['submitted', 'under_review'].includes(application.status) && (
                            <button
                              onClick={() => withdrawApplication(application._id)}
                              disabled={withdrawing === application._id}
                              className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              {withdrawing === application._id ? 'Withdrawing...' : 'Withdraw'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Application Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Application Number:</span>
                      <span className="ml-2">{selectedApplication.applicationNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Full Name:</span>
                      <span className="ml-2">{selectedApplication.fullName}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{selectedApplication.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{selectedApplication.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Address:</span>
                      <span className="ml-2">{selectedApplication.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Date of Birth:</span>
                      <span className="ml-2">{new Date(selectedApplication.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Additional Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Nationality:</span>
                      <span className="ml-2">{selectedApplication.nationality}</span>
                    </div>
                    <div>
                      <span className="font-medium">Passport Number:</span>
                      <span className="ml-2">{selectedApplication.passportNumber}</span>
                    </div>
                    <div>
                      <span className="font-medium">Experience:</span>
                      <span className="ml-2">{selectedApplication.experience}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Documents */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Application Status</h4>
                  <div className="space-y-2">
                    <div>{getStatusBadge(selectedApplication.status)}</div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Submitted:</span>
                      <span className="ml-2">{formatDate(selectedApplication.submittedAt)}</span>
                    </div>
                    {selectedApplication.lastUpdated && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Last Updated:</span>
                        <span className="ml-2">{formatDate(selectedApplication.lastUpdated)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedApplication.documents || {}).map(([docType, docInfo]) => (
                      <div key={docType} className="flex items-center justify-between">
                        <span className="text-sm capitalize">
                          {docType.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => downloadDocument(selectedApplication._id, docType)}
                          className="text-blue-600 hover:text-blue-900 text-sm inline-flex items-center"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}