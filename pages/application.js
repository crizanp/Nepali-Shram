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
  Edit,
  Languages
} from 'lucide-react';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useTranslation } from '../context/TranslationContext';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [withdrawing, setWithdrawing] = useState(null);
  const router = useRouter();
  const { isNepali } = useTranslation();

  // Translation texts
  const text = {
    // Header and navigation
    myApplications: isNepali ? 'मेरा आवेदनहरू' : 'My Applications',
    viewAndManage: isNepali ? 'तपाईंका पेश गरिएका आवेदनहरू हेर्नुहोस् र व्यवस्थापन गर्नुहोस्' : 'View and manage your submitted applications',
    
    // Loading
    loadingApplications: isNepali ? 'आवेदनहरू लोड हुँदैछ...' : 'Loading applications...',
    
    // Notes
    note: isNepali ? 'टिप्पणी:' : 'Note:',
    noteText1: isNepali ? 'तपाईंले नयाँ आवेदन पेश गर्न सक्नुहुन्छ' : 'You can submit a new application',
    noteText1Bold: isNepali ? 'तपाईंको हालको आवेदन स्वीकृत भएपछि' : 'after your current application is approved',
    noteText2: isNepali ? 'तपाईंले आफ्नो आवेदन' : 'You can',
    noteText2Bold: isNepali ? 'सम्पादन गर्न सक्नुहुन्छ' : 'edit your application',
    noteText2End: isNepali ? 'स्वीकृत नभएसम्म।' : 'until it\'s approved.',
    
    // Empty state
    noApplicationsFound: isNepali ? 'कुनै आवेदन फेला परेन' : 'No Applications Found',
    noApplicationsText: isNepali ? 'तपाईंले अहिलेसम्म कुनै आवेदन पेश गर्नुभएको छैन।' : 'You haven\'t submitted any applications yet.',
    submitFirstApplication: isNepali ? 'आफ्नो पहिलो आवेदन पेश गर्नुहोस्' : 'Submit Your First Application',
    
    // Table headers
    applicationNumber: isNepali ? 'आवेदन नम्बर' : 'Application Number',
    fullName: isNepali ? 'पूरा नाम' : 'Full Name',
    status: isNepali ? 'स्थिति' : 'Status',
    submitted: isNepali ? 'पेश गरिएको' : 'Submitted',
    actions: isNepali ? 'कार्यहरू' : 'Actions',
    
    // Status badges
    statusSubmitted: isNepali ? 'पेश गरिएको' : 'Submitted',
    statusUnderReview: isNepali ? 'समीक्षाधीन' : 'Under Review',
    statusApproved: isNepali ? 'स्वीकृत' : 'Approved',
    statusRejected: isNepali ? 'अस्वीकृत' : 'Rejected',
    statusPendingDocuments: isNepali ? 'कागजात बाँकी' : 'Pending Documents',
    statusWithdrawn: isNepali ? 'फिर्ता लिइएको' : 'Withdrawn',
    
    // Action buttons
    view: isNepali ? 'हेर्नुहोस्' : 'View',
    edit: isNepali ? 'सम्पादन गर्नुहोस्' : 'Edit',
    withdraw: isNepali ? 'फिर्ता लिनुहोस्' : 'Withdraw',
    
    // Confirmation and alerts
    withdrawConfirm: isNepali ? 'के तपाईं यो आवेदन फिर्ता लिन निश्चित हुनुहुन्छ? यो कार्य पूर्ववत गर्न सकिँदैन।' : 'Are you sure you want to withdraw this application? This action cannot be undone.',
    withdrawSuccess: isNepali ? 'आवेदन सफलतापूर्वक फिर्ता लिइयो।' : 'Application withdrawn successfully.',
    withdrawError: isNepali ? 'त्रुटि:' : 'Error:',
    fetchError: isNepali ? 'आवेदनहरू ल्याउनमा त्रुटि भयो। कृपया पृष्ठ रिफ्रेस गर्नुहोस्।' : 'Error fetching applications. Please refresh the page.',
    
    // Application count
    applicationsCount: isNepali ? 'आवेदनहरू' : 'Applications'
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
        alert(text.fetchError);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [isAuthenticated, text.fetchError]);

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
      submitted: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: text.statusSubmitted },
      under_review: { icon: AlertCircle, color: 'bg-red-100 text-red-800', text: text.statusUnderReview },
      approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: text.statusApproved },
      rejected: { icon: XCircle, color: 'bg-red-100 text-red-800', text: text.statusRejected },
      pending_documents: { icon: FileText, color: 'bg-orange-100 text-orange-800', text: text.statusPendingDocuments },
      withdrawn: { icon: XCircle, color: 'bg-gray-100 text-gray-800', text: text.statusWithdrawn }
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
    if (!confirm(text.withdrawConfirm)) {
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

      alert(text.withdrawSuccess);
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert(`${text.withdrawError} ${error.message}`);
    } finally {
      setWithdrawing(null);
    }
  };

  const editApplication = (applicationId) => {
    router.push(`/applications/${applicationId}/edit`);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(isNepali ? 'ne-NP' : 'en-US', {
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
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-900">{text.loadingApplications}</p>
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
          <div className="bg-red-100 border border-red-300 rounded-xl p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{text.myApplications}</h1>
            <p className="text-gray-700 mt-2">{text.viewAndManage}</p>

            <div className="mt-4 text-sm text-red-800">
              <p className="font-medium">{text.note}</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>
                  {text.noteText1} <span className="font-semibold">{text.noteText1Bold}</span>.
                </li>
                <li>
                  {text.noteText2} <span className="font-semibold">{text.noteText2Bold}</span> {text.noteText2End}
                </li>
              </ul>
            </div>
          </div>

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{text.noApplicationsFound}</h3>
              <p className="text-gray-600 mb-4">{text.noApplicationsText}</p>
              <button
                onClick={() => router.push('/apply')}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                {text.submitFirstApplication}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {text.applicationsCount} ({applications.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {text.applicationNumber}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {text.fullName}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {text.status}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {text.submitted}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {text.actions}
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
                            className="text-red-600 cursor-pointer hover:text-red-900 inline-flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {text.view}
                          </button>
                          {/* Edit button for editable statuses */}
                          {['submitted', 'under_review', 'pending_documents', 'rejected'].includes(application.status) && (
                            <button
                              onClick={() => editApplication(application._id)}
                              className="text-green-600 cursor-pointer hover:text-green-900 inline-flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              {text.edit}
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