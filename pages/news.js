import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from '../context/TranslationContext';
import {
    Calendar,
    Clock,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    FileText,
    Tag,
    Construction,
    Hammer,
    HardHat,
    Settings,
    Wrench,
    AlertCircle,
    Bell,
    Sparkles
} from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function NewsPage() {
    const router = useRouter();
    const { isNepali } = useTranslation();
    
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    
    // Translations
    const text = {
        pageTitle: isNepali ? 'समाचार' : 'News',
        subtitle: isNepali ? 'नेपाली श्रम सम्बन्धी नवीनतम जानकारी र अपडेटहरू' : 'Latest information and updates on Nepali labor',
        comingSoon: isNepali ? 'छिट्टै आउँदैछ' : 'Coming Soon',
        underConstruction: isNepali ? 'निर्माणाधीन' : 'Under Construction',
        workingHard: isNepali ? 'हामी यो सुविधा निर्माण गर्न कडा मेहनत गरिरहेका छौं' : 'We are working hard to build this feature',
        newsFeature: isNepali ? 'समाचार सेवा' : 'News Feature',
        description: isNepali ? 
            'नेपाली श्रमिकहरूको लागि नवीनतम समाचार, नीति अपडेट र महत्वपूर्ण जानकारीहरू प्रदान गर्न हामी काम गरिरहेका छौं।' :
            'We are working to provide the latest news, policy updates and important information for Nepali workers.',
        features: isNepali ? 'आउने सुविधाहरू' : 'Upcoming Features',
        feature1: isNepali ? 'नवीनतम श्रम नीति समाचार' : 'Latest labor policy news',
        feature2: isNepali ? 'देश अनुसार समाचार वर्गीकरण' : 'Country-wise news categorization',
        feature3: isNepali ? 'व्यक्तिगत समाचार सिफारिश' : 'Personalized news recommendations',
        feature4: isNepali ? 'रियल-टाइम अपडेट' : 'Real-time updates',
        notifyMe: isNepali ? 'मलाई सूचित गर्नुहोस्' : 'Notify Me',
        getNotified: isNepali ? 'तयार हुने बित्तिकै सूचना पाउनुहोस्' : 'Get notified when ready',
        redirecting: isNepali ? 'पुनः निर्देशन गर्दै...' : 'Redirecting...',
        expectedLaunch: isNepali ? 'अपेक्षित सुरुवात' : 'Expected Launch',
        launchDate: isNepali ? 'जनवरी २०२५' : 'January 2025'
    };

    // Authentication check - moved to top level
    useEffect(() => {
        async function checkAuthentication() {
            try {
                if (typeof window === 'undefined') {
                    setAuthLoading(false);
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
                setAuthLoading(false);
            }
        }

        checkAuthentication();
    }, [router]);

    // Simulate loading for news content
    useEffect(() => {
        if (isAuthenticated) {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        router.replace('/login');
    };

    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">{text.redirecting}</p>
                </div>
            </div>
        );
    }

    // Show redirect message if not authenticated
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">{text.redirecting}</p>
                </div>
            </div>
        );
    }

    // Animation component for floating icons
    const FloatingIcon = ({ icon: Icon, className, delay = 0 }) => (
        <div 
            className={`absolute opacity-20 animate-bounce ${className}`}
            style={{ animationDelay: `${delay}s`, animationDuration: '3s' }}
        >
            <Icon className="w-8 h-8 text-red-300" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
            <Navbar user={user} onLogout={handleLogout} />

            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{text.pageTitle}</h1>
                        <p className="text-lg text-gray-600">{text.subtitle}</p>
                    </div>
                </div>
            </div>

            {/* Coming Soon Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center relative">
                    {/* Floating Construction Icons */}
                    <FloatingIcon icon={Hammer} className="top-0 left-10" delay={0} />
                    <FloatingIcon icon={HardHat} className="top-20 right-16" delay={1} />
                    <FloatingIcon icon={Wrench} className="top-40 left-32" delay={2} />
                    <FloatingIcon icon={Settings} className="top-60 right-8" delay={0.5} />
                    
                    {/* Main Construction Icon */}
                    <div className="mb-8 relative">
                        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-2xl animate-pulse">
                            <Construction className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute inset-0 w-32 h-32 mx-auto bg-red-500 rounded-full opacity-20 animate-ping"></div>
                    </div>

                    {/* Coming Soon Text */}
                    <div className="mb-8">
                        <h2 className="text-4xl mb-4 py-4 my-4 md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                            {text.comingSoon}
                        </h2>
                        <div className="flex items-center justify-center space-x-2 ">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            <span className="text-xl font-semibold text-red-600">{text.underConstruction}</span>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {text.workingHard}
                        </p>
                    </div>         
                  
                </div>
            </div>

            <Footer />
        </div>
    );
}