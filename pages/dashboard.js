import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from '../context/TranslationContext';
import Navbar from '../components/navbar';
import ServicesContainer from '@/components/card';
import Footer from '@/components/footer';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { isNepali } = useTranslation();

  // Translations with dynamic name handling
  const text = {
    title: isNepali ? 'ड्यासबोर्ड' : 'Dashboard',
    welcome: (name) => isNepali 
      ? `फिर्ता स्वागत छ, ${name}। सुरु गर्न यी मध्ये कुनै एकमा क्लिक गर्नुहोस्।`
      : `Welcome back, ${name}. Please click any of this to get started.`,
    verifyingAuth: isNepali ? 'प्रमाणीकरण जाँच गर्दै...' : 'Verifying authentication...',
    redirecting: isNepali ? 'लगइनमा रिडिरेक्ट गर्दै...' : 'Redirecting to login...'
  };

  useEffect(() => {
    async function checkAuthentication() {
      try {
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
       
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center w-full max-w-sm">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base px-4 leading-relaxed">
            {text.verifyingAuth}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center w-full max-w-sm">
          <p className="text-gray-600 text-sm sm:text-base px-4 leading-relaxed">
            {text.redirecting}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-red-50">
        <Head>
          <title>{text.title} | {isNepali ? 'नेपाली श्रम' : 'Nepali Shram'}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Navbar user={user} onLogout={handleLogout} />
        
        {/* Main content with responsive padding and spacing */}
        <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
          <header className="mb-6 sm:mb-8 px-1 sm:px-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
              {text.title}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-full break-words">
              {text.welcome(user?.name ? capitalizeWords(user.name) : 'User')}
            </p>
          </header>
          
          {/* Services container with responsive wrapper */}
          <div className="w-full">
            <ServicesContainer />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
}