import { useState } from 'react';
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

  const services = [
    {
      id: 1,
      title: 'New Application',
      icon: FileText,
      bgColor: 'bg-blue-900',
      iconColor: 'text-blue-600',
      description: 'Start a new application'
    },
    {
      id: 2,
      title: 'Your Status',
      icon: Clock,
      bgColor: 'bg-blue-900',
      iconColor: 'text-green-600',
      description: 'Check application status'
    },
    {
      id: 3,
      title: 'Profile',
      icon: User,
      bgColor: 'bg-blue-900',
      iconColor: 'text-red-600',
      description: 'Manage your profile'
    },
    {
      id: 4,
      title: 'Tutorial',
      icon: BookOpen,
      bgColor: 'bg-blue-900',
      iconColor: 'text-yellow-600',
      description: 'Learn how to use services'
    },
    {
      id: 5,
      title: 'View or Edit',
      icon: Edit,
      bgColor: 'bg-blue-900',
      iconColor: 'text-purple-600',
      description: 'View or edit applications'
    },
    {
      id: 6,
      title: 'Settings',
      icon: Settings,
      bgColor: 'bg-blue-900',
      iconColor: 'text-teal-600',
      description: 'Configure your preferences'
    }
  ];
  const handleCardClick = (serviceTitle) => {
    console.log(`Clicked on: ${serviceTitle}`);
    // Add your navigation logic here
  };

  return (
    <div className="">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              onClick={() => handleCardClick(service.title)}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                ${service.bgColor} 
                rounded-2xl p-6 cursor-pointer transition-all duration-300 ease-in-out
                hover:shadow-lg hover:scale-105 hover:-translate-y-1
                border border-gray-100
                ${hoveredCard === service.id ? 'shadow-xl' : 'shadow-sm'}
              `}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon Container */}
                <div className={`
                  w-20 h-20 rounded-full bg-white flex items-center justify-center
                  transition-transform duration-300
                  ${hoveredCard === service.id ? 'scale-110' : 'scale-100'}
                  shadow-sm
                `}>
                  <IconComponent 
                    className={`w-10 h-10 ${service.iconColor}`} 
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-semibold text-gray-100">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-lg text-gray-200 leading-relaxed">
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