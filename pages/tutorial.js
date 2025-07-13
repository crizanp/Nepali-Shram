import React, { useState } from 'react';
import { 
  ArrowRight, 
  Globe, 
  UserPlus, 
  Mail, 
  Lock, 
  CheckCircle, 
  LogIn,
  FileText,
  Upload,
  Clock,
  User,
  Phone,
  CreditCard,
  Eye,
  Edit3,
  Bell,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  BookOpen,
  Shield,
  Star,
  Award,
  HelpCircle
} from 'lucide-react';
import Navbar from '@/components/navbar';

export default function NepaliShramTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState('en');

  const text = {
  en: {
    title: "How to Use Nepali Shram Platform",
    subtitle: "Complete step-by-step guide to get started",
    steps: "Steps",
    overview: "Overview",
    getStarted: "Get Started",
    nextStep: "Next Step",
    prevStep: "Previous Step",
    playTutorial: "Play Tutorial",
    pauseTutorial: "Pause Tutorial",
    stepCounter: "Step {current} of {total}",
    
    steps_data: [
      {
        title: "Visit Nepali Shram Website",
        description: "Go to nepalishram.com and click the 'Portal' button in the top right corner",
        details: [
          "Open your web browser",
          "Navigate to nepalishram.com",
          "Look for the 'Portal' button in the top right corner",
          "Click on the Portal button to access the application system"
        ]
      },
      {
        title: "Create Your Account",
        description: "Sign up for a new account if you don't have one",
        details: [
          "Click on 'Create Account' or 'Sign Up'",
          "Fill in your full name",
          "Enter a valid email address",
          "Create a strong password",
          "Confirm your password",
          "Accept terms and conditions"
        ]
      },
      {
        title: "Verify Your Email",
        description: "Check your email and verify your account",
        details: [
          "Check your email inbox",
          "Look for verification email from Nepali Shram",
          "Click the verification link in the email",
          "Your account will be activated",
          "You can now proceed to login"
        ]
      },
      {
        title: "Login to Your Account",
        description: "Access your account using your credentials",
        details: [
          "Go back to the portal login page",
          "Enter your registered email address",
          "Enter your password",
          "Click 'Login' button",
          "You'll be redirected to the dashboard"
        ]
      },
      {
        title: "Dashboard Overview",
        description: "Familiarize yourself with the main dashboard",
        details: [
          "New Application: Start a new application",
          "Your Status: Check application status",
          "Profile: Manage your profile information",
          "Tutorial: Access help and guidance",
          "View or Edit: Modify existing applications",
          "News: Read latest updates and announcements"
        ]
      },
      {
        title: "Start New Application",
        description: "Begin your application process",
        details: [
          "Click on 'New Application' from dashboard",
          "Follow the 5-step process:",
          "Step 1: User Details - Personal Information",
          "Step 2: Documents - Upload required documents",
          "Step 3: Payment Proof - Submit payment verification",
          "Step 4: Review - Check all information",
          "Step 5: Agreement - Accept terms and submit"
        ]
      },
      {
        title: "Fill Personal Information",
        description: "Complete your personal details",
        details: [
          "Enter your full name",
          "Provide valid email address",
          "Add phone number (required)",
          "Include WhatsApp number (optional)",
          "Enter passport number",
          "Click 'Next' to proceed"
        ]
      },
      {
        title: "Upload Documents",
        description: "Submit required documents",
        details: [
          "Passport Front (Required) - PDF, JPG, PNG (Max 10MB)",
          "Valid Visa - PDF, JPG, PNG (Max 10MB)",
          "Labor Visa Card (Front) - Required",
          "Labor Visa Card (Back) - Required",
          "Ensure all documents are clear and readable",
          "Click 'Next' after uploading all documents"
        ]
      },
      {
        title: "Track Your Application",
        description: "Monitor your application status",
        details: [
          "Go to 'Your Status' from dashboard",
          "Check current application status",
          "View application number for reference",
          "See submission date",
          "Use 'View Application' to see details",
          "Use 'Edit Application' if changes needed (before approval)"
        ]
      },
      {
        title: "Managing Applications",
        description: "View and manage your submitted applications",
        details: [
          "Access 'My Applications' section",
          "View all submitted applications",
          "Check status: Submitted, Approved, or Rejected",
          "Edit applications before approval",
          "Submit new applications only after current one is approved",
          "Keep track of application numbers for reference"
        ]
      }
    ]
  },
  np: {
    title: "नेपाली श्रम प्लेटफर्म कसरी प्रयोग गर्ने",
    subtitle: "सुरु गर्नको लागि पूर्ण चरणबद्ध गाइड",
    steps: "चरणहरू",
    overview: "सिंहावलोकन",
    getStarted: "सुरु गर्नुहोस्",
    nextStep: "अर्को चरण",
    prevStep: "अघिल्लो चरण",
    playTutorial: "ट्यूटोरियल खेल्नुहोस्",
    pauseTutorial: "ट्यूटोरियल रोक्नुहोस्",
    stepCounter: "चरण {current} को {total}",
    
    steps_data: [
      {
        title: "नेपाली श्रम वेबसाइट भ्रमण गर्नुहोस्",
        description: "nepalishram.com मा जानुहोस् र माथिको दाहिने कुनामा 'Portal' बटनमा क्लिक गर्नुहोस्",
        details: [
          "आफ्नो वेब ब्राउजर खोल्नुहोस्",
          "nepalishram.com मा जानुहोस्",
          "माथिको दाहिने कुनामा 'Portal' बटन खोज्नुहोस्",
          "आवेदन प्रणालीमा पहुँच गर्न Portal बटनमा क्लिक गर्नुहोस्"
        ]
      },
      {
        title: "आफ्नो खाता सिर्जना गर्नुहोस्",
        description: "यदि तपाईंसँग खाता छैन भने नयाँ खाताको लागि साइन अप गर्नुहोस्",
        details: [
          "'खाता सिर्जना गर्नुहोस्' वा 'साइन अप' मा क्लिक गर्नुहोस्",
          "आफ्नो पूरा नाम भर्नुहोस्",
          "मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्",
          "बलियो पासवर्ड सिर्जना गर्नुहोस्",
          "आफ्नो पासवर्ड पुष्टि गर्नुहोस्",
          "नियम र सर्तहरू स्वीकार गर्नुहोस्"
        ]
      },
      {
        title: "आफ्नो इमेल प्रमाणीकरण गर्नुहोस्",
        description: "आफ्नो इमेल जाँच गर्नुहोस् र आफ्नो खाता प्रमाणीकरण गर्नुहोस्",
        details: [
          "आफ्नो इमेल इनबक्स जाँच गर्नुहोस्",
          "नेपाली श्रमबाट प्रमाणीकरण इमेल खोज्नुहोस्",
          "इमेलमा प्रमाणीकरण लिंकमा क्लिक गर्नुहोस्",
          "तपाईंको खाता सक्रिय हुनेछ",
          "अब तपाईं लगइन गर्न सक्नुहुन्छ"
        ]
      },
      {
        title: "आफ्नो खातामा लगइन गर्नुहोस्",
        description: "आफ्नो प्रमाणपत्र प्रयोग गरेर आफ्नो खातामा पहुँच गर्नुहोस्",
        details: [
          "पोर्टल लगइन पृष्ठमा फर्किनुहोस्",
          "आफ्नो दर्ता गरिएको इमेल ठेगाना प्रविष्ट गर्नुहोस्",
          "आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्",
          "'लगइन' बटनमा क्लिक गर्नुहोस्",
          "तपाईंलाई ड्यासबोर्डमा रिडिरेक्ट गरिनेछ"
        ]
      },
      {
        title: "ड्यासबोर्ड सिंहावलोकन",
        description: "मुख्य ड्यासबोर्डसँग परिचित हुनुहोस्",
        details: [
          "नयाँ आवेदन: नयाँ आवेदन सुरु गर्नुहोस्",
          "तपाईंको स्थिति: आवेदन स्थिति जाँच गर्नुहोस्",
          "प्रोफाइल: तपाईंको प्रोफाइल जानकारी व्यवस्थापन गर्नुहोस्",
          "ट्यूटोरियल: सहायता र मार्गदर्शन पहुँच गर्नुहोस्",
          "हेर्नुहोस् वा सम्पादन गर्नुहोस्: अवस्थित आवेदनहरू परिमार्जन गर्नुहोस्",
          "समाचार: नवीनतम अपडेट र घोषणाहरू पढ्नुहोस्"
        ]
      },
      {
        title: "नयाँ आवेदन सुरु गर्नुहोस्",
        description: "आफ्नो आवेदन प्रक्रिया सुरु गर्नुहोस्",
        details: [
          "ड्यासबोर्डबाट 'नयाँ आवेदन' मा क्लिक गर्नुहोस्",
          "५-चरण प्रक्रिया पछ्याउनुहोस्:",
          "चरण १: प्रयोगकर्ता विवरण - व्यक्तिगत जानकारी",
          "चरण २: कागजातहरू - आवश्यक कागजातहरू अपलोड गर्नुहोस्",
          "चरण ३: भुक्तानी प्रमाण - भुक्तानी प्रमाणीकरण पेश गर्नुहोस्",
          "चरण ४: समीक्षा - सबै जानकारी जाँच गर्नुहोस्",
          "चरण ५: सम्झौता - नियमहरू स्वीकार गर्नुहोस् र पेश गर्नुहोस्"
        ]
      },
      {
        title: "व्यक्तिगत जानकारी भर्नुहोस्",
        description: "आफ्नो व्यक्तिगत विवरणहरू पूरा गर्नुहोस्",
        details: [
          "आफ्नो पूरा नाम प्रविष्ट गर्नुहोस्",
          "मान्य इमेल ठेगाना प्रदान गर्नुहोस्",
          "फोन नम्बर थप्नुहोस् (आवश्यक)",
          "WhatsApp नम्बर समावेश गर्नुहोस् (वैकल्पिक)",
          "पासपोर्ट नम्बर प्रविष्ट गर्नुहोस्",
          "अगाडि बढ्न 'अर्को' मा क्लिक गर्नुहोस्"
        ]
      },
      {
        title: "कागजातहरू अपलोड गर्नुहोस्",
        description: "आवश्यक कागजातहरू पेश गर्नुहोस्",
        details: [
          "पासपोर्ट अगाडि (आवश्यक) - PDF, JPG, PNG (अधिकतम 10MB)",
          "मान्य भिसा - PDF, JPG, PNG (अधिकतम 10MB)",
          "श्रम भिसा कार्ड (अगाडि) - आवश्यक",
          "श्रम भिसा कार्ड (पछाडि) - आवश्यक",
          "सबै कागजातहरू स्पष्ट र पढ्न योग्य छन् भनेर सुनिश्चित गर्नुहोस्",
          "सबै कागजातहरू अपलोड गरेपछि 'अर्को' मा क्लिक गर्नुहोस्"
        ]
      },
      {
        title: "आफ्नो आवेदन ट्र्याक गर्नुहोस्",
        description: "आफ्नो आवेदन स्थिति निगरानी गर्नुहोस्",
        details: [
          "ड्यासबोर्डबाट 'तपाईंको स्थिति' मा जानुहोस्",
          "हालको आवेदन स्थिति जाँच गर्नुहोस्",
          "सन्दर्भको लागि आवेदन नम्बर हेर्नुहोस्",
          "पेशी मिति हेर्नुहोस्",
          "विवरण हेर्न 'आवेदन हेर्नुहोस्' प्रयोग गर्नुहोस्",
          "परिवर्तन आवश्यक भएमा 'आवेदन सम्पादन गर्नुहोस्' प्रयोग गर्नुहोस् (अनुमोदन अघि)"
        ]
      },
      {
        title: "आवेदनहरू व्यवस्थापन गर्नुहोस्",
        description: "आफ्ना पेश गरिएका आवेदनहरू हेर्नुहोस् र व्यवस्थापन गर्नुहोस्",
        details: [
          "'मेरा आवेदनहरू' खण्डमा पहुँच गर्नुहोस्",
          "सबै पेश गरिएका आवेदनहरू हेर्नुहोस्",
          "स्थिति जाँच गर्नुहोस्: पेश गरिएको, अनुमोदित, वा अस्वीकृत",
          "अनुमोदन अघि आवेदनहरू सम्पादन गर्नुहोस्",
          "हालको आवेदन अनुमोदन भएपछि मात्र नयाँ आवेदन पेश गर्नुहोस्",
          "सन्दर्भको लागि आवेदन नम्बरहरूको ट्र्याक राख्नुहोस्"
        ]
      }
    ]
  }
};

  const currentText = text[language];

  const nextStep = () => {
    if (currentStep < currentText.steps_data.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Auto-advance steps every 10 seconds when playing
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < currentText.steps_data.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            clearInterval(interval);
            return prev;
          }
        });
      }, 10000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-50">
      {/* Header */}
            <Navbar user="No Login" onLogout={() => {}} />      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{currentText.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{currentText.subtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              {currentText.stepCounter.replace('{current}', currentStep + 1).replace('{total}', currentText.steps_data.length)}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / currentText.steps_data.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / currentText.steps_data.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-red-600" />
                {currentText.steps}
              </h3>
              <div className="space-y-2">
                {currentText.steps_data.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      index === currentStep 
                        ? 'bg-red-100 border-l-4 border-red-600 text-red-800' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                        index === currentStep 
                          ? 'bg-red-600 text-white' 
                          : index < currentStep 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </span>
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Step Header */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{currentStep + 1}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentText.steps_data[currentStep].title}</h2>
                    <p className="text-gray-600 mt-1">{currentText.steps_data[currentStep].description}</p>
                  </div>
                </div>
              </div>

              {/* Step Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Instructions:</h3>
                <div className="space-y-3">
                  {currentText.steps_data[currentStep].details.map((detail, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Examples based on step */}
              {currentStep === 0 && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">What to look for:</h4>
                  <div className="bg-red-600 text-white p-4 rounded-lg text-center">
                    <Globe className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Nepali Shram</p>
                    <p className="text-sm opacity-90">Look for the Portal button →</p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Registration Form Fields:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Full Name</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Email Address</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Password</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Application Process Steps:</h4>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="bg-red-600 text-white p-3 rounded-lg">
                      <User className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs">User Details</p>
                    </div>
                    <div className="bg-gray-300 text-gray-700 p-3 rounded-lg">
                      <FileText className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs">Documents</p>
                    </div>
                    <div className="bg-gray-300 text-gray-700 p-3 rounded-lg">
                      <CreditCard className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs">Payment</p>
                    </div>
                    <div className="bg-gray-300 text-gray-700 p-3 rounded-lg">
                      <Eye className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs">Review</p>
                    </div>
                    <div className="bg-gray-300 text-gray-700 p-3 rounded-lg">
                      <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs">Agreement</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 7 && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Required Documents:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-red-200">
                      <Upload className="w-6 h-6 text-red-600 mb-2" />
                      <p className="font-medium text-red-600">Passport Front *</p>
                      <p className="text-sm text-gray-600">Required</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-red-200">
                      <Upload className="w-6 h-6 text-red-600 mb-2" />
                      <p className="font-medium text-red-600">Valid Visa</p>
                      <p className="text-sm text-gray-600">Required</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                      <Upload className="w-6 h-6 text-green-600 mb-2" />
                      <p className="font-medium text-green-600">Labor Visa (Front) *</p>
                      <p className="text-sm text-gray-600">Required</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                      <Upload className="w-6 h-6 text-purple-600 mb-2" />
                      <p className="font-medium text-purple-600">Labor Visa (Back)</p>
                      <p className="text-sm text-gray-600">Required</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                    currentStep === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>{currentText.prevStep}</span>
                </button>

                <button
                  onClick={nextStep}
                  disabled={currentStep === currentText.steps_data.length - 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                    currentStep === currentText.steps_data.length - 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <span>{currentText.nextStep}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}