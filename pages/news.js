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
    Tag
} from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function NewsPage() {
    const router = useRouter();
    const { isNepali } = useTranslation();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    
    const articlesPerPage = 8;

    // Translations
    const text = {
        pageTitle: isNepali ? 'समाचार' : 'News',
        subtitle: isNepali ? 'नेपाली श्रम सम्बन्धी नवीनतम जानकारी र अपडेटहरू' : 'Latest information and updates on Nepali labor',
        readMore: isNepali ? 'पूरा पढ्नुहोस्' : 'Read More',
        publishedOn: isNepali ? 'प्रकाशित मिति' : 'Published on',
        loadingNews: isNepali ? 'समाचार लोड गर्दै...' : 'Loading news...',
        previous: isNepali ? 'अघिल्लो' : 'Previous',
        next: isNepali ? 'अर्को' : 'Next',
        page: isNepali ? 'पृष्ठ' : 'Page',
        of: isNepali ? 'को' : 'of',
        totalArticles: isNepali ? 'जम्मा' : 'Total',
        articles: isNepali ? 'समाचारहरू' : 'articles',
        category: isNepali ? 'श्रेणी' : 'Category',
        redirecting: isNepali ? 'पुनः निर्देशन गर्दै...' : 'Redirecting...'
    };

    // Mock news data with categories
    const mockNews = [
        {
            id: 1,
            slug: 'qatar-minimum-wage-increase',
            title: isNepali ? 'कतारमा नेपाली श्रमिकहरूको न्यूनतम ज्याला वृद्धि' : 'Minimum wage increase for Nepali workers in Qatar',
            content: isNepali ?
                'कतार सरकारले नेपाली श्रमिकहरूको न्यूनतम ज्याला मासिक १००० रियाल (करिब ३०,००० रुपैयाँ) बाट बढाएर १२०० रियाल (करिब ३६,००० रुपैयाँ) पुर्याएको छ। यो निर्णय अर्को महिनादेखि लागू हुनेछ।' :
                'The Government of Qatar has increased the minimum wage for Nepali workers from QAR 1000 (approximately NPR 30,000) to QAR 1200 (approximately NPR 36,000) per month. This decision will be implemented from next month.',
            excerpt: isNepali ?
                'कतार सरकारले नेपाली श्रमिकहरूको न्यूनतम ज्याला मासिक १००० रियाल बाट बढाएर १२०० रियाल पुर्याएको छ।' :
                'The Government of Qatar has increased the minimum wage for Nepali workers from QAR 1000 to QAR 1200 per month.',
            publishedAt: '2024-12-15T10:30:00Z',
            category: isNepali ? 'ज्याला नीति' : 'Wage Policy'
        },
        {
            id: 2,
            slug: 'malaysia-work-permit-policy',
            title: isNepali ? 'मलेसियामा नेपाली श्रमिकहरूको लागि नयाँ कार्य अनुमति नीति' : 'New work permit policy for Nepali workers in Malaysia',
            content: isNepali ?
                'मलेसिया सरकारले नेपाली श्रमिकहरूको लागि नयाँ कार्य अनुमति नीति घोषणा गरेको छ। यो नीति अनुसार अब नेपाली श्रमिकहरूले अधिक सहजताका साथ कार्य अनुमति प्राप्त गर्न सक्नेछन्।' :
                'The Government of Malaysia has announced a new work permit policy for Nepali workers. According to this policy, Nepali workers will now be able to obtain work permits more easily.',
            excerpt: isNepali ?
                'मलेसिया सरकारले नेपाली श्रमिकहरूको लागि नयाँ कार्य अनुमति नीति घोषणा गरेको छ।' :
                'The Government of Malaysia has announced a new work permit policy for Nepali workers.',
            publishedAt: '2024-12-14T15:45:00Z',
            category: isNepali ? 'कार्य अनुमति' : 'Work Permit'
        },
        {
            id: 3,
            slug: 'dubai-safety-regulations',
            title: isNepali ? 'दुबईमा नेपाली श्रमिकहरूको सुरक्षा सम्बन्धी नयाँ नियम' : 'New safety regulations for Nepali workers in Dubai',
            content: isNepali ?
                'दुबई सरकारले नेपाली श्रमिकहरूको सुरक्षा सम्बन्धी नयाँ नियम जारी गरेको छ। यस नियम अनुसार सबै कम्पनीहरूले आफ्ना कर्मचारीहरूको लागि उचित सुरक्षा उपकरणहरू उपलब्ध गराउनु पर्नेछ।' :
                'The Government of Dubai has issued new safety regulations for Nepali workers. According to these regulations, all companies must provide appropriate safety equipment for their employees.',
            excerpt: isNepali ?
                'दुबई सरकारले नेपाली श्रमिकहरूको सुरक्षा सम्बन्धी नयाँ नियम जारी गरेको छ।' :
                'The Government of Dubai has issued new safety regulations for Nepali workers.',
            publishedAt: '2024-12-13T08:20:00Z',
            category: isNepali ? 'सुरक्षा नीति' : 'Safety Policy'
        },
        {
            id: 4,
            slug: 'skill-development-program',
            title: isNepali ? 'नेपाली श्रमिकहरूको लागि नयाँ सीप विकास कार्यक्रम' : 'New skill development program for Nepali workers',
            content: isNepali ?
                'नेपाल सरकारले नेपाली श्रमिकहरूको लागि नयाँ सीप विकास कार्यक्रम सुरु गरेको छ। यो कार्यक्रम मार्फत श्रमिकहरूले विभिन्न प्राविधिक सीपहरू सिक्न सक्नेछन्।' :
                'The Government of Nepal has launched a new skill development program for Nepali workers. Through this program, workers will be able to learn various technical skills.',
            excerpt: isNepali ?
                'नेपाल सरकारले नेपाली श्रमिकहरूको लागि नयाँ सीप विकास कार्यक्रम सुरु गरेको छ।' :
                'The Government of Nepal has launched a new skill development program for Nepali workers.',
            publishedAt: '2024-12-12T14:15:00Z',
            category: isNepali ? 'सीप विकास' : 'Skill Development'
        },
        {
            id: 5,
            slug: 'saudi-arabia-insurance-policy',
            title: isNepali ? 'साउदी अरेबियामा नेपाली श्रमिकहरूको बिमा नीति' : 'Insurance policy for Nepali workers in Saudi Arabia',
            content: isNepali ?
                'साउदी अरेबिया सरकारले नेपाली श्रमिकहरूको लागि अनिवार्य बिमा नीति घोषणा गरेको छ। यो नीति अनुसार सबै नेपाली श्रमिकहरूको स्वास्थ्य बिमा हुनुपर्नेछ।' :
                'The Government of Saudi Arabia has announced mandatory insurance policy for Nepali workers. According to this policy, all Nepali workers must have health insurance.',
            excerpt: isNepali ?
                'साउदी अरेबिया सरकारले नेपाली श्रमिकहरूको लागि अनिवार्य बिमा नीति घोषणा गरेको छ।' :
                'The Government of Saudi Arabia has announced mandatory insurance policy for Nepali workers.',
            publishedAt: '2024-12-11T11:30:00Z',
            category: isNepali ? 'बिमा नीति' : 'Insurance Policy'
        },
        {
            id: 6,
            slug: 'kuwait-holiday-policy',
            title: isNepali ? 'कुवेतमा नेपाली श्रमिकहरूको छुट्टी नीति परिवर्तन' : 'Holiday policy changes for Nepali workers in Kuwait',
            content: isNepali ?
                'कुवेत सरकारले नेपाली श्रमिकहरूको छुट्टी नीति परिवर्तन गरेको छ। नयाँ नीति अनुसार श्रमिकहरूले वर्षमा कम्तिमा ३० दिन छुट्टी पाउनेछन्।' :
                'The Government of Kuwait has changed the holiday policy for Nepali workers. According to the new policy, workers will get at least 30 days of leave per year.',
            excerpt: isNepali ?
                'कुवेत सरकारले नेपाली श्रमिकहरूको छुट्टी नीति परिवर्तन गरेको छ।' :
                'The Government of Kuwait has changed the holiday policy for Nepali workers.',
            publishedAt: '2024-12-10T09:45:00Z',
            category: isNepali ? 'छुट्टी नीति' : 'Holiday Policy'
        },
        {
            id: 7,
            slug: 'remittance-guidelines',
            title: isNepali ? 'रेमिट्यान्स पठाउने नयाँ दिशानिर्देश' : 'New remittance guidelines',
            content: isNepali ?
                'नेपाल राष्ट्र बैंकले रेमिट्यान्स पठाउने नयाँ दिशानिर्देश जारी गरेको छ। यो दिशानिर्देश अनुसार रेमिट्यान्स पठाउने प्रक्रिया अझ सरल र सुरक्षित बनाइएको छ।' :
                'Nepal Rastra Bank has issued new remittance guidelines. According to these guidelines, the remittance process has been made simpler and more secure.',
            excerpt: isNepali ?
                'नेपाल राष्ट्र बैंकले रेमिट्यान्स पठाउने नयाँ दिशानिर्देश जारी गरेको छ।' :
                'Nepal Rastra Bank has issued new remittance guidelines.',
            publishedAt: '2024-12-09T16:20:00Z',
            category: isNepali ? 'रेमिट्यान्स' : 'Remittance'
        },
        {
            id: 8,
            slug: 'japan-visa-update',
            title: isNepali ? 'जापान जाने नेपाली श्रमिकहरूको भिसा अपडेट' : 'Visa update for Nepali workers going to Japan',
            content: isNepali ?
                'जापान सरकारले नेपाली श्रमिकहरूको लागि भिसा प्रक्रिया सरल बनाएको छ। नयाँ प्रक्रिया अनुसार भिसा अप्रुभलको समय घटाइएको छ।' :
                'The Government of Japan has simplified the visa process for Nepali workers. According to the new process, visa approval time has been reduced.',
            excerpt: isNepali ?
                'जापान सरकारले नेपाली श्रमिकहरूको लागि भिसा प्रक्रिया सरल बनाएको छ।' :
                'The Government of Japan has simplified the visa process for Nepali workers.',
            publishedAt: '2024-12-08T13:10:00Z',
            category: isNepali ? 'भिसा' : 'Visa'
        }
    ];

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

    // Filter articles based on search
    const filteredArticles = mockNews;

    // Pagination
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    const startIndex = (currentPage - 1) * articlesPerPage;
    const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNepali) {
            return date.toLocaleDateString('ne-NP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle pagination
    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle article click
    const handleArticleClick = (slug) => {
        router.push(`/news/${slug}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-600">{text.loadingNews}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* News Grid */}
                        <div className="space-y-6">
                            {currentArticles.map((article) => (
                                <div
                                    key={article.id}
                                    onClick={() => handleArticleClick(article.slug)}
                                    className="bg-white border border-red-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer p-6"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <Tag className="w-3 h-3 mr-1" />
                                                {article.category}
                                            </span>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(article.publishedAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                                        {article.title}
                                    </h3>

                                    <p className="text-gray-700 mb-4 leading-relaxed">
                                        {article.excerpt}
                                    </p>

                                    <div className="flex items-center text-red-600 hover:text-red-800 transition-colors">
                                        <span className="text-sm font-medium">{text.readMore}</span>
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}