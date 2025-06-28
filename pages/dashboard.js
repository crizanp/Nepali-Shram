import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/navbar'; // Import the new Navbar component
import {
  User,
  Settings,
  CreditCard
} from 'lucide-react';
import ServicesContainer from '@/components/card';
import Footer from '@/components/footer';
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    async function checkAuthentication() {
      try {
        // Check if we're in the browser environment
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
        const token = localStorage.getItem('token');
        // If no token exists, redirect to login immediately
        if (!token) {
          console.log('No token found, redirecting to login');
          router.replace('/login');
          return;
        }
        // Verify the token with the server
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Token verification failed2');
        }

        const userData = await response.json();

        // If we reach here, user is authenticated
        setUser(userData);
        setIsAuthenticated(true);

      } catch (error) {
        console.error('Authentication error:', error);

        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        router.replace('/login');

      } finally {
        setLoading(false);
      }
    }

    checkAuthentication();
  }, [router]);
  function capitalizeWords(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/login');
  };



  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after loading, show nothing (redirect is happening)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Only render dashboard if user is authenticated
  return (
    <>
      <div className="min-h-screen bg-red-50">
        <Head>
          <title>Dashboard | Nepali Shram Portal</title>
        </Head>

        {/* Use the new Navbar component */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Main Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8 px-2">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Welcome back, {user?.name && capitalizeWords(user.name)}. Please click any of this to get started.
            </p>
          </header>
          <ServicesContainer />
        </div>
      </div>
      <Footer />
    </>
  );
}