import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Trash2,
  Edit 
} from 'lucide-react';

import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  // Navigate to application details page
  const viewApplication = (applicationId) => {
    router.push(`/applications/${applicationId}`);
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
 const editApplication = (applicationId) => {
    router.push(`/applications/${applicationId}/edit`);
  };
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
          <div className="bg-blue-100 border border-blue-300 rounded-xl p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-700 mt-2">View and manage your submitted applications</p>

            <div className="mt-4 text-sm text-blue-800">
              <p className="font-medium">Note:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>You can submit a new application <span className="font-semibold">after your current application is approved</span>.</li>
                <li>You can <span className="font-semibold">edit your application</span> until it's approved.</li>
              </ul>
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
                            className="text-blue-600 cursor-pointer hover:text-blue-900 inline-flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          {/* Replace withdraw button with edit button */}
                          {['submitted', 'under_review', 'pending_documents', 'rejected'].includes(application.status) && (
                            <button
                              onClick={() => editApplication(application._id)}
                              className="text-green-600 cursor-pointer hover:text-green-900 inline-flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
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

      <Footer />
    </div>
  );
}