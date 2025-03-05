import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  Settings, 
  CreditCard, 
  Bell 
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      async function loadUserFromLocalStorage() {
        try {
          const token = localStorage.getItem('token');
          
          if (token) {
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
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem('token');
          setUser(null);
          if (window.location.pathname !== '/login') {
            router.push('/login');
          }
        } finally {
          setLoading(false);
        }
      }
      
      loadUserFromLocalStorage();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const quickActions = [
    { 
      icon: <User className="h-6 w-6 text-blue-500" />, 
      title: 'Profile', 
      description: 'Manage your account',
      onClick: () => router.push('/profile')
    },
    { 
      icon: <Settings className="h-6 w-6 text-green-500" />, 
      title: 'Settings', 
      description: 'Configure preferences',
      onClick: () => router.push('/settings')
    },
    { 
      icon: <CreditCard className="h-6 w-6 text-purple-500" />, 
      title: 'Billing', 
      description: 'View your subscription',
      onClick: () => router.push('/billing')
    }
  ];

  const recentActivity = [
    { 
      type: 'Profile Update', 
      date: 'March 1, 2025', 
      description: 'Updated profile information' 
    },
    { 
      type: 'Password Change', 
      date: 'February 15, 2025', 
      description: 'Changed account password' 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Dashboard | Professional App</title>
      </Head>

      {/* Top Navigation */}
      <nav className="bg-white shadow-md text-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600">CZ App</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <span className="mr-3 text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome back, {user?.name}. Here&apos;s an overview of your account.</p>
          </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  onClick={action.onClick}
                  className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  {action.icon}
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-gray-800">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-800">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Joined</span>
                <span className="font-medium text-gray-800">January 2025</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}