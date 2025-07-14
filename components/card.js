import { useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import {
  FileText,
  Clock,
  User,
  BookOpen,
  Edit,
  Settings
} from 'lucide-react';

export default function ServicesContainer() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const { isNepali } = useTranslation();

  // Translations defined right in the component
  const text = {
    services: {
      newApplication: {
        title: isNepali ? 'नयाँ आवेदन' : 'New Application',
        description: isNepali ? 'नयाँ आवेदन सुरु गर्नुहोस्' : 'Start a new application'
      },
      yourStatus: {
        title: isNepali ? 'तपाईंको स्थिति' : 'Your Status',
        description: isNepali ? 'आवेदन स्थिति जाँच गर्नुहोस्' : 'Check application status'
      },
      profile: {
        title: isNepali ? 'प्रोफाइल' : 'Profile',
        description: isNepali ? 'आफ्नो प्रोफाइल व्यवस्थापन गर्नुहोस्' : 'Manage your profile'
      },
      tutorial: {
        title: isNepali ? 'ट्यूटोरियल' : 'Tutorial',
        description: isNepali ? 'सेवाहरू कसरी प्रयोग गर्ने सिक्नुहोस्' : 'Learn how to use services'
      },
      viewEdit: {
        title: isNepali ? 'हेर्नुहोस् वा सम्पादन गर्नुहोस्' : 'View or Edit',
        description: isNepali ? 'आवेदनहरू हेर्नुहोस् वा सम्पादन गर्नुहोस्' : 'View or edit applications'
      },
      settings: {
        title: isNepali ? 'सेटिङहरू' : 'Settings',
        description: isNepali ? 'आफ्नो प्राथमिकताहरू कन्फिगर गर्नुहोस्' : 'Configure your preferences'
      }
    }
  };

  const services = [
    {
      id: 1,
      title: text.services.newApplication.title,
      icon: FileText,
      bgColor: 'bg-blue-900',
      iconColor: 'text-blue-600',
      description: text.services.newApplication.description,
      link: 'portal/new-application'
    },
    {
      id: 2,
      title: text.services.yourStatus.title,
      icon: Clock,
      bgColor: 'bg-blue-900',
      iconColor: 'text-green-600',
      description: text.services.yourStatus.description,
      link: 'status'
    },
    {
      id: 3,
      title: text.services.profile.title,
      icon: User,
      bgColor: 'bg-blue-900',
      iconColor: 'text-red-600',
      description: text.services.profile.description,
      link: 'profile'
    },
    {
      id: 4,
      title: text.services.tutorial.title,
      icon: BookOpen,
      bgColor: 'bg-blue-900',
      iconColor: 'text-yellow-600',
      description: text.services.tutorial.description,
      link: 'tutorial'
    },
    {
      id: 5,
      title: text.services.viewEdit.title,
      icon: Edit,
      bgColor: 'bg-blue-900',
      iconColor: 'text-purple-600',
      description: text.services.viewEdit.description,
      link: 'application'
    },
    {
      id: 6,
      title: isNepali ? 'समाचार' : 'News',
      icon: FileText, 
      bgColor: 'bg-blue-900',
      iconColor: 'text-teal-600',
      description: isNepali ? 'नवीनतम समाचारहरू पढ्नुहोस्' : 'Read the latest news',
      link: 'news'
    }
  ];

  const handleCardClick = (service) => {
    console.log(`Navigating to: ${service.link}`);
    window.location.href = service.link;
  };

  return (
    <div className="w-full">
      {/* Responsive grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              onClick={() => handleCardClick(service)}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                ${service.bgColor}
                rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 cursor-pointer 
                transition-all duration-300 ease-in-out
                hover:shadow-lg hover:scale-105 hover:-translate-y-1
                border border-gray-100
                ${hoveredCard === service.id ? 'shadow-xl' : 'shadow-sm'}
                min-h-[140px] sm:min-h-[160px] lg:min-h-[200px]
                flex flex-col justify-center
              `}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(service);
                }
              }}
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 lg:space-y-4">
                {/* Responsive icon container */}
                <div className={`
                  w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 
                  rounded-full bg-white flex items-center justify-center
                  transition-transform duration-300
                  ${hoveredCard === service.id ? 'scale-110' : 'scale-100'}
                  shadow-sm
                `}>
                  <IconComponent
                    className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${service.iconColor}`}
                  />
                </div>

                {/* Responsive title */}
                <h3 className="text-sm sm:text-base lg:text-xl xl:text-2xl font-semibold text-gray-100 leading-tight">
                  {service.title}
                </h3>

                {/* Responsive description - hidden on very small screens */}
                <p className="text-xs sm:text-sm lg:text-base text-gray-200 leading-relaxed hidden sm:block">
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}