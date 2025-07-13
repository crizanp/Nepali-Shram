import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare
} from 'lucide-react';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useTranslation } from '../context/TranslationContext';

export default function StatusPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDetails, setShowDetails] = useState({});
  const router = useRouter();
  const { isNepali } = useTranslation();

  // Translation texts
  const text = {
    // Header
    applicationStatus: isNepali ? 'आवेदन स्थिति' : 'Application Status',
    checkStatus: isNepali ? 'आफ्ना आवेदनहरूको स्थिति जाँच गर्नुहोस्' : 'Check the status of your applications',
    
    // Search
    searchPlaceholder: isNepali ? 'आवेदन नम्बर खोज्नुहोस्...' : 'Search by application number...',
    clearSearch: isNepali ? 'खाली गर्नुहोस्' : 'Clear Search',
    
    // Loading
    loadingApplications: isNepali ? 'आवेदनहरू लोड हुँदैछ...' : 'Loading applications...',
    searching: isNepali ? 'खोजिरहेको छ...' : 'Searching...',
    
    // Notes
    note: isNepali ? 'टिप्पणी:' : 'Note:',
    noteText1: isNepali ? 'तपाईंको आवेदनको स्थिति यहाँ नियमित रूपमा अद्यावधिक हुनेछ।' : 'Your application status will be updated here regularly.',
    noteText2: isNepali ? 'कुनै प्रश्न भएमा सम्पर्क गर्नुहोस्।' : 'Contact us if you have any questions.',
    
    // Empty states
    noApplicationsFound: isNepali ? 'कुनै आवेदन फेला परेन' : 'No Applications Found',
    noApplicationsText: isNepali ? 'तपाईंले अहिलेसम्म कुनै आवेदन पेश गर्नुभएको छैन।' : 'You haven\'t submitted any applications yet.',
    noSearchResults: isNepali ? 'खोजको परिणाम फेला परेन' : 'No search results found',
    noSearchResultsText: isNepali ? 'तपाईंले खोजेको आवेदन नम्बर फेला परेन। कृपया नम्बर जाँच गरेर फेरि प्रयास गर्नुहोस्।' : 'The application number you searched for was not found. Please check the number and try again.',
    submitFirstApplication: isNepali ? 'आफ्नो पहिलो आवेदन पेश गर्नुहोस्' : 'Submit Your First Application',
    
    // Application details
    applicationNumber: isNepali ? 'आवेदन नम्बर' : 'Application Number',
    fullName: isNepali ? 'पूरा नाम' : 'Full Name',
    email: isNepali ? 'इमेल' : 'Email',
    phone: isNepali ? 'फोन' : 'Phone',
    status: isNepali ? 'स्थिति' : 'Status',
    submittedDate: isNepali ? 'पेश गरिएको मिति' : 'Submitted Date',
    lastUpdated: isNepali ? 'अन्तिम अद्यावधिक' : 'Last Updated',
    
    // Status badges
    statusSubmitted: isNepali ? 'पेश गरिएको' : 'Submitted',
    statusUnderReview: isNepali ? 'समीक्षाधीन' : 'Under Review',
    statusApproved: isNepali ? 'स्वीकृत' : 'Approved',
    statusRejected: isNepali ? 'अस्वीकृत' : 'Rejected',
    statusPendingDocuments: isNepali ? 'कागजात बाँकी' : 'Pending Documents',
    statusWithdrawn: isNepali ? 'फिर्ता लिइएको' : 'Withdrawn',
    
    // Actions
    showDetails: isNepali ? 'विवरण देखाउनुहोस्' : 'Show Details',
    hideDetails: isNepali ? 'विवरण लुकाउनुहोस्' : 'Hide Details',
    viewApplication: isNepali ? 'आवेदन हेर्नुहोस्' : 'View Application',
    
    // Admin notes
    adminNotes: isNepali ? 'प्रशासकीय टिप्पणी' : 'Admin Notes',
    noAdminNotes: isNepali ? 'कुनै प्रशासकीय टिप्पणी छैन' : 'No admin notes available',
    
    // Application count
    applicationsCount: isNepali ? 'आवेदनहरू' : 'Applications',
    totalApplications: isNepali ? 'कुल आवेदनहरू' : 'Total Applications',
    
    // Error messages
    fetchError: isNepali ? 'आवेदनहरू ल्याउनमा त्रुटि भयो। कृपया पृष्ठ रिफ्रेस गर्नुहोस्।' : 'Error fetching applications. Please refresh the page.'
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
        setFilteredApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        alert(text.fetchError);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [isAuthenticated, text.fetchError]);

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setSearching(true);
    
    setTimeout(() => {
      if (value.trim() === '') {
        setFilteredApplications(applications);
      } else {
        const filtered = applications.filter(app => 
          app.applicationNumber.toLowerCase().includes(value.toLowerCase()) ||
          app.fullName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredApplications(filtered);
      }
      setSearching(false);
    }, 300);
  }, [applications]);

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredApplications(applications);
  };

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
      submitted: { 
        icon: Clock, 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        text: text.statusSubmitted 
      },
      under_review: { 
        icon: AlertCircle, 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        text: text.statusUnderReview 
      },
      approved: { 
        icon: CheckCircle, 
        color: 'bg-green-100 text-green-800 border-green-200', 
        text: text.statusApproved 
      },
      rejected: { 
        icon: XCircle, 
        color: 'bg-red-100 text-red-800 border-red-200', 
        text: text.statusRejected 
      },
      pending_documents: { 
        icon: FileText, 
        color: 'bg-orange-100 text-orange-800 border-orange-200', 
        text: text.statusPendingDocuments 
      },
      withdrawn: { 
        icon: XCircle, 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        text: text.statusWithdrawn 
      }
    };

    const config = statusConfig[status] || statusConfig.submitted;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-4 h-4 mr-1.5" />
        {config.text}
      </span>
    );
  };

  // Toggle details visibility
  const toggleDetails = (applicationId) => {
    setShowDetails(prev => ({
      ...prev,
      [applicationId]: !prev[applicationId]
    }));
  };

  // Navigate to application details page
  const viewApplication = (applicationId) => {
    router.push(`/applications/${applicationId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) {
      return isNepali ? 'मिति उपलब्ध छैन' : 'Date not available';
    }

    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return isNepali ? 'अमान्य मिति' : 'Invalid date';
      }

      return date.toLocaleDateString(isNepali ? 'ne-NP' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'for date:', dateString);
      return isNepali ? 'मिति त्रुटि' : 'Date error';
    }
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
            <h1 className="text-3xl font-bold text-gray-900">{text.applicationStatus}</h1>
            <p className="text-gray-700 mt-2">{text.checkStatus}</p>

            <div className="mt-4 text-sm text-red-800">
              <p className="font-medium">{text.note}</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>{text.noteText1}</li>
                <li>{text.noteText2}</li>
              </ul>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={text.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {text.clearSearch}
                </button>
              )}
            </div>
            
            {searching && (
              <div className="mt-3 text-center text-gray-500">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-red-500 mr-2"></div>
                  {text.searching}
                </div>
              </div>
            )}
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? text.noSearchResults : text.noApplicationsFound}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? text.noSearchResultsText : text.noApplicationsText}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push('/portal/new-application')}
                  className="bg-red-600 cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {text.submitFirstApplication}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {text.totalApplications}: {filteredApplications.length}
                </h2>
              </div>

              {/* Applications Grid */}
              <div className="grid gap-6">
                {filteredApplications.map((application) => (
                  <div key={application._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Application Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.applicationNumber}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {application.fullName}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(application.submittedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(application.status)}
                          <button
                            onClick={() => toggleDetails(application._id)}
                            className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            {showDetails[application._id] ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-1" />
                                {text.hideDetails}
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-1" />
                                {text.showDetails}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Application Details */}
                    {showDetails[application._id] && (
                      <div className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Personal Information */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                            
                            <div className="flex items-center text-sm">
                              <User className="w-4 h-4 text-gray-400 mr-3" />
                              <span className="text-gray-600 w-24">{text.fullName}:</span>
                              <span className="text-gray-900 font-medium">{application.fullName}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <Mail className="w-4 h-4 text-gray-400 mr-3" />
                              <span className="text-gray-600 w-24">{text.email}:</span>
                              <span className="text-gray-900">{application.email}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <Phone className="w-4 h-4 text-gray-400 mr-3" />
                              <span className="text-gray-600 w-24">{text.phone}:</span>
                              <span className="text-gray-900">{application.phone}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                              <span className="text-gray-600 w-24">{text.lastUpdated}:</span>
                              <span className="text-gray-900">{formatDate(application.updatedAt)}</span>
                            </div>
                          </div>

                          {/* Admin Notes */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              {text.adminNotes}
                            </h4>
                            
                            {application.adminNotes && application.adminNotes.length > 0 ? (
                              <div className="space-y-3">
                                {application.adminNotes.map((note, index) => (
                                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-700">{note.note}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic bg-white p-3 rounded-lg border border-gray-200">
                                {text.noAdminNotes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => viewApplication(application._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            {text.viewApplication}
                          </button>
                        </div>
                      </div>
                    )}
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