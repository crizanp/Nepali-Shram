import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from '../../context/TranslationContext';
import { 
  Calendar, 
  Eye,
  ChevronLeft,
  Clock,
  Share2,
  FileText
} from 'lucide-react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isNepali } = useTranslation();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Translations
  const text = {
    backToNews: isNepali ? 'समाचारमा फर्कनुहोस्' : 'Back to News',
    views: isNepali ? 'पटक हेरिएको' : 'views',
    relatedNews: isNepali ? 'सम्बन्धित समाचार' : 'Related News',
    publishedOn: isNepali ? 'प्रकाशन मिति' : 'Published on',
    readTime: isNepali ? 'पढ्ने समय' : 'Read time',
    minutes: isNepali ? 'मिनेट' : 'minutes',
    share: isNepali ? 'साझा गर्नुहोस्' : 'Share',
    category: isNepali ? 'श्रेणी' : 'Category',
    laborRights: isNepali ? 'श्रमिक अधिकार' : 'Labor Rights',
    readMore: isNepali ? 'थप पढ्नुहोस्' : 'Read more',
    articleNotFound: isNepali ? 'लेख फेला परेन' : 'Article not found',
    loading: isNepali ? 'लोड हुँदै...' : 'Loading...',
    redirecting: isNepali ? 'पुनः निर्देशन गर्दै...' : 'Redirecting...'
  };

  // Mock news data - replace with API call later
  const mockNews = [
    {
      id: 1,
      slug: 'qatar-minimum-wage-increase',
      title: isNepali ? 'कतारमा नेपाली श्रमिकहरूको न्यूनतम ज्याला बढाइयो' : 'Minimum wage for Nepali workers in Qatar increased',
      content: isNepali ? 
        'कतार सरकारले नेपाली श्रमिकहरूको न्यूनतम ज्याला मासिक १००० रियाल (करिब ३०,००० रुपैयाँ) बाट बढाएर १२०० रियाल (करिब ३६,००० रुपैयाँ) पुर्याएको छ। यो निर्णय अर्को महिनादेखि लागू हुनेछ।\n\nयो वृद्धिले नेपाली श्रमिकहरूको जीवनयात्रामा सुधार ल्याउने अपेक्षा गरिएको छ। कतारमा कार्यरत नेपाली श्रमिकहरूको संख्या करिब ४ लाख रहेको छ।\n\nनेपाली दूतावास कतारले यस निर्णयलाई स्वागत गर्दै भनेको छ कि यसले नेपाली श्रमिकहरूको आर्थिक स्थितिमा सुधार ल्याउनेछ।' :
        'The Government of Qatar has increased the minimum wage for Nepali workers from QAR 1000 (approximately NPR 30,000) to QAR 1200 (approximately NPR 36,000) per month. This decision will be implemented from next month.\n\nThis increase is expected to improve the living standards of Nepali workers. The number of Nepali workers in Qatar is approximately 400,000.\n\nThe Nepalese Embassy in Qatar has welcomed this decision, stating that it will improve the economic situation of Nepali workers.',
      publishedAt: '2024-12-15T10:30:00Z',
      views: 1250,
      featured: true,
      readTime: 3,
      category: 'Labor Rights'
    },
    {
      id: 2,
      slug: 'malaysia-work-permit-policy',
      title: isNepali ? 'मलेसियामा नेपाली श्रमिकहरूको लागि नयाँ कार्य अनुमति नीति' : 'New work permit policy for Nepali workers in Malaysia',
      content: isNepali ? 
        'मलेसिया सरकारले नेपाली श्रमिकहरूको लागि नयाँ कार्य अनुमति नीति घोषणा गरेको छ। यो नीति अनुसार अब नेपाली श्रमिकहरूले अधिक सहजताका साथ कार्य अनुमति प्राप्त गर्न सक्नेछन्।' :
        'The Government of Malaysia has announced a new work permit policy for Nepali workers. According to this policy, Nepali workers will now be able to obtain work permits more easily.',
      publishedAt: '2024-12-14T15:45:00Z',
      views: 980,
      featured: false,
      readTime: 2,
      category: 'Policy Updates'
    },
    {
      id: 3,
      slug: 'dubai-safety-regulations',
      title: isNepali ? 'दुबईमा नेपाली श्रमिकहरूको सुरक्षा सम्बन्धी नयाँ नियम' : 'New safety regulations for Nepali workers in Dubai',
      content: isNepali ? 
        'दुबई सरकारले नेपाली श्रमिकहरूको सुरक्षा सम्बन्धी नयाँ नियम जारी गरेको छ। यस नियम अनुसार सबै कम्पनीहरूले आफ्ना कर्मचारीहरूको लागि उचित सुरक्षा उपकरणहरू उपलब्ध गराउनु पर्नेछ।' :
        'The Government of Dubai has issued new safety regulations for Nepali workers. According to these regulations, all companies must provide appropriate safety equipment for their employees.',
      publishedAt: '2024-12-13T08:20:00Z',
      views: 1520,
      featured: true,
      readTime: 4,
      category: 'Safety & Health'
    },
    {
      id: 4,
      slug: 'skill-development-program',
      title: isNepali ? 'नेपाली श्रमिकहरूको लागि नयाँ स्किल डेভलपमेन्ट कार्यक्रम' : 'New skill development program for Nepali workers',
      content: isNepali ? 
        'नेपाल सरकारले नेपाली श्रमिकहरूको लागि नयाँ स्किल डेभलपमेन्ट कार्यक्रम सुरु गरेको छ। यो कार्यक्रम मार्फत श्रमिकहरूले विभिन्न प्राविधिक सीपहरू सिक्न सक्नेछन्।' :
        'The Government of Nepal has launched a new skill development program for Nepali workers. Through this program, workers will be able to learn various technical skills.',
      publishedAt: '2024-12-12T14:15:00Z',
      views: 2100,
      featured: false,
      readTime: 3,
      category: 'Training & Development'
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

  // Load article data after authentication
  useEffect(() => {
    if (slug && isAuthenticated) {
      const article = mockNews.find(article => article.slug === slug);
      setSelectedArticle(article);
      setLoading(false);
    }
  }, [slug, isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/login');
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{text.loading}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{text.articleNotFound}</h1>
            <button
              onClick={() => router.push('/news')}
              className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              {text.backToNews}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedArticles = mockNews
    .filter(article => article.id !== selectedArticle.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* Breadcrumb */}
      <div className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/news')}
            className="cursor-pointer inline-flex items-center text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {text.backToNews}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
              {text.category}
            </span>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {selectedArticle.title}
          </h1>

          <div className="flex flex-wrap items-center text-gray-600 gap-6 pb-6 border-b border-gray-200">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {text.publishedOn} {formatDate(selectedArticle.publishedAt)}
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {selectedArticle.readTime} {text.minutes}
              </span>
            </div>
            
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {selectedArticle.views.toLocaleString()} {text.views}
              </span>
            </div>

            <button className="cursor-pointer flex items-center text-sm text-red-600 hover:text-red-800 ml-auto">
              <Share2 className="w-4 h-4 mr-1" />
              {text.share}
            </button>
          </div>
        </header>

        {/* Article Content */}
        <article className="mb-12">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed text-lg">
              {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

       
      </div>
       {/* Related News */}
        {relatedArticles.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <section className="border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{text.relatedNews}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => router.push(`/news/${article.slug}`)}
                    className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                          {text.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {article.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.readTime} {text.minutes}</span>
                        <span className="text-red-600 font-medium group-hover:text-red-800">
                          {text.readMore} →
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      <Footer />
    </div>
  );
}