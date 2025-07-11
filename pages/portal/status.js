import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Mail,
  Phone,
  Edit,
  Plus,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';

import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

export default function ApplicationStatus() {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  // Fetch status data
  const fetchStatusData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch status data');
      }

      const data = await response.json();
      setStatusData(data);
    } catch (error) {
      console.error('Error fetching status data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchStatusData();
  }, [fetchStatusData]);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/login');
  }, [router]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchStatusData();
  };

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

  // Format date
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

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-900">Loading application status...</p>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Application Status</h1>
                <p className="text-gray-600 mt-2">
                  View your current application status and permissions
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusData && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Status Summary</h3>
                  <p className="text-gray-700">{statusData.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Current Application Details */}
          {statusData && statusData.hasApplications && statusData.latestApplication && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Application</h2>
              
              {/* Application Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Application Number</p>
                    <p className="text-lg font-medium text-gray-900">
                      {statusData.latestApplication.applicationNumber}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="mt-1">
                      {getStatusBadge(statusData.latestApplication.status)}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Submitted Date</p>
                    <p className="text-gray-900">
                      {formatDate(statusData.latestApplication.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-gray-900">{statusData.latestApplication.fullName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{statusData.latestApplication.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900">{statusData.latestApplication.phone}</p>
                  </div>
                </div>
              </div>

              {/* Application Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.push(`/application/details/${statusData.latestApplication.id}`)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </button>

                  {statusData.canEdit && (
                    <button
                      onClick={() => router.push(`/application/edit/${statusData.latestApplication.id}`)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Application
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Permissions & Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Actions</h2>
            
            <div className="space-y-4">
              {/* Submit New Application */}
              <div className={`p-4 rounded-lg border ${statusData?.canSubmitNew ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Plus className={`w-5 h-5 mr-3 ${statusData?.canSubmitNew ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <p className={`font-medium ${statusData?.canSubmitNew ? 'text-green-900' : 'text-gray-500'}`}>
                        Submit New Application
                      </p>
                      <p className={`text-sm ${statusData?.canSubmitNew ? 'text-green-700' : 'text-gray-500'}`}>
                        {statusData?.canSubmitNew 
                          ? 'You can submit a new application' 
                          : 'You cannot submit a new application until your current one is approved'}
                      </p>
                    </div>
                  </div>
                  {statusData?.canSubmitNew && (
                    <button
                      onClick={() => router.push('/application/submit')}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Submit New
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>

              {/* Edit Current Application */}
              <div className={`p-4 rounded-lg border ${statusData?.canEdit ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Edit className={`w-5 h-5 mr-3 ${statusData?.canEdit ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <p className={`font-medium ${statusData?.canEdit ? 'text-blue-900' : 'text-gray-500'}`}>
                        Edit Current Application
                      </p>
                      <p className={`text-sm ${statusData?.canEdit ? 'text-blue-700' : 'text-gray-500'}`}>
                        {statusData?.canEdit 
                          ? 'You can edit your current application' 
                          : statusData?.hasApplications 
                            ? 'Current application cannot be edited' 
                            : 'No application available to edit'}
                      </p>
                    </div>
                  </div>
                  {statusData?.canEdit && statusData?.latestApplication && (
                    <button
                      onClick={() => router.push(`/application/edit/${statusData.latestApplication.id}`)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Edit
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>

              {/* View All Applications */}
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">View All Applications</p>
                      <p className="text-sm text-gray-600">
                        {statusData?.hasApplications 
                          ? `You have ${statusData.allApplications || 1} application(s) in total` 
                          : 'View your application history'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/application')}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}