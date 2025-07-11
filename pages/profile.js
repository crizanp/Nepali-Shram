import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Eye,
  EyeOff,
  Lock,
  Shield,
  AlertCircle,
  Check
} from 'lucide-react';

export default function ProfilePage() {
  const { isNepali } = useTranslation();
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    nationality: '',
    emergencyContact: '',
    emergencyPhone: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Translations
  const text = {
    title: isNepali ? 'मेरो प्रोफाइल' : 'My Profile',
    personalInfo: isNepali ? 'व्यक्तिगत जानकारी' : 'Personal Information',
    contactInfo: isNepali ? 'सम्पर्क जानकारी' : 'Contact Information',
    emergencyInfo: isNepali ? 'आपातकालीन सम्पर्क' : 'Emergency Contact',
    security: isNepali ? 'सुरक्षा' : 'Security',
    name: isNepali ? 'नाम' : 'Full Name',
    email: isNepali ? 'इमेल' : 'Email',
    phone: isNepali ? 'फोन नम्बर' : 'Phone Number',
    address: isNepali ? 'ठेगाना' : 'Address',
    dateOfBirth: isNepali ? 'जन्म मिति' : 'Date of Birth',
    nationality: isNepali ? 'राष्ट्रियता' : 'Nationality',
    emergencyContact: isNepali ? 'आपातकालीन सम्पर्क व्यक्ति' : 'Emergency Contact Person',
    emergencyPhone: isNepali ? 'आपातकालीन फोन' : 'Emergency Phone',
    bio: isNepali ? 'बायो' : 'Bio',
    edit: isNepali ? 'सम्पादन गर्नुहोस्' : 'Edit Profile',
    save: isNepali ? 'सेभ गर्नुहोस्' : 'Save Changes',
    cancel: isNepali ? 'रद्द गर्नुहोस्' : 'Cancel',
    changePassword: isNepali ? 'पासवर्ड परिवर्तन गर्नुहोस्' : 'Change Password',
    currentPassword: isNepali ? 'हालको पासवर्ड' : 'Current Password',
    newPassword: isNepali ? 'नयाँ पासवर्ड' : 'New Password',
    confirmPassword: isNepali ? 'पासवर्ड पुष्टि गर्नुहोस्' : 'Confirm Password',
    changePhoto: isNepali ? 'फोटो परिवर्तन गर्नुहोस्' : 'Change Photo',
    uploadPhoto: isNepali ? 'फोटो अपलोड गर्नुहोस्' : 'Upload Photo',
    loading: isNepali ? 'लोड हुँदै...' : 'Loading...',
    success: isNepali ? 'सफलतापूर्वक अपडेट भयो' : 'Successfully updated',
    error: isNepali ? 'त्रुटि देखा पर्यो' : 'An error occurred',
    passwordMismatch: isNepali ? 'पासवर्डहरू मेल खाएनन्' : 'Passwords do not match',
    required: isNepali ? 'आवश्यक' : 'Required',
    optional: isNepali ? 'वैकल्पिक' : 'Optional',
    redirecting: isNepali ? 'लगइनमा रिडिरेक्ट गर्दै...' : 'Redirecting to login...',
    unauthorized: isNepali ? 'अनधिकृत पहुँच' : 'Unauthorized access'
  };

  // Initialize form data from auth context
  useEffect(() => {
    if (user) {
      console.log('User data:', user); // Debug log
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: formatDateForInput(user.dateOfBirth || user.date_of_birth), // Handle both field names
        nationality: user.nationality || '',
        emergencyContact: user.emergencyContact || user.emergency_contact, // Handle both field names
        emergencyPhone: user.emergencyPhone || user.emergency_phone, // Handle both field names
        bio: user.bio || ''
      });

      // Set profile photo if it exists
      if (user.profilePhoto || user.profile_photo) {
        setPhotoPreview(user.profilePhoto || user.profile_photo);
      }
    }
  }, [user]);


  // Redirect if not authenticated
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      }
    }
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.name || !formData.email) {
        setMessage({ type: 'error', text: text.required });
        setLoading(false);
        return;
      }

      // Prepare update data with proper field names
      const updateData = {
        name: formData.name.trim(),
        phone: formData.phone ? formData.phone.trim() : null,
        address: formData.address ? formData.address.trim() : null,
        dateOfBirth: formData.dateOfBirth || null,
        nationality: formData.nationality ? formData.nationality.trim() : null,
        emergencyContact: formData.emergencyContact ? formData.emergencyContact.trim() : null,
        emergencyPhone: formData.emergencyPhone ? formData.emergencyPhone.trim() : null,
        bio: formData.bio ? formData.bio.trim() : null,
        profilePhoto: photoPreview || null // Use photoPreview which contains the base64 string
      };

      console.log('Sending update data:', updateData);

      // Use the updateProfile function from AuthContext
      const result = await updateProfile(updateData);

      if (result.success) {
        setEditing(false);
        setProfilePhoto(null);
        // Don't clear photoPreview here - let it stay to show the updated photo
        setMessage({ type: 'success', text: result.message || text.success });
      } else {
        setMessage({ type: 'error', text: result.error || text.error });
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: text.error });
    } finally {
      setLoading(false);
    }
  };
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      // Format to YYYY-MM-DD for HTML date input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };
  const handlePasswordSave = async () => {
    try {
      setLoading(true);

      // Validate passwords
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setMessage({ type: 'error', text: text.required });
        setLoading(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage({ type: 'error', text: text.passwordMismatch });
        setLoading(false);
        return;
      }

      // Make API call to change password
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`, {
        method: 'PUT', // Make sure this is PUT, not POST
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ type: 'success', text: data.message || text.success });
      } else {
        setMessage({ type: 'error', text: data.message || text.error });
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ type: 'error', text: text.error });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      // Format for display (you can customize this)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date display formatting error:', error);
      return dateString; // Return original if formatting fails
    }
  };
  const capitalizeWords = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Show loading state if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{text.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-red-50">
        <Head>
          <title>{text.title} | {isNepali ? 'नेपाली श्रम' : 'Nepali Shram'}</title>
        </Head>

        <Navbar user={user} onLogout={handleLogout} />

        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              {message.text && (
                <div className={`mt-4 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                  {message.type === 'success' ? <Check className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                  {message.text}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Photo Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto">
                        {photoPreview || user?.profilePhoto || user?.profile_photo ? (
                          <img
                            src={photoPreview || user?.profilePhoto || user?.profile_photo}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {editing && (
                        <label className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-2 cursor-pointer hover:bg-red-600 transition-colors">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    {editing && <p className="mt-2 text-sm text-gray-500">{text.changePhoto}</p>}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      {text.personalInfo}
                    </h2>
                    {!editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="cursor-pointer text-red-600 hover:text-red-800 flex items-center"
                        disabled={loading}
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        {text.edit}
                      </button>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {text.name} *
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                          />
                        ) : (
                          <p className="text-gray-900">{capitalizeWords(user?.name)}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {text.dateOfBirth}
                        </label>
                        {editing ? (
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {user?.dateOfBirth || user?.date_of_birth
                              ? formatDateForDisplay(user?.dateOfBirth || user?.date_of_birth)
                              : '-'
                            }
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {text.nationality}
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        ) : (
                          <p className="text-gray-900">{user?.nationality || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {text.bio}
                      </label>
                      {editing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder={`${text.bio} (${text.optional})`}
                        />
                      ) : (
                        <p className="text-gray-900">{user?.bio || '-'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      {text.contactInfo}
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {text.email} *
                        </label>
                        {editing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                          />
                        ) : (
                          <p className="text-gray-900">{user?.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {text.phone}
                        </label>
                        {editing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        ) : (
                          <p className="text-gray-900">{user?.phone || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {text.address}
                      </label>
                      {editing ? (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.address || '-'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      {text.emergencyInfo}
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {text.emergencyContact}
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        ) : (
                          <p className="text-gray-900">{user?.emergency_contact || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {text.emergencyPhone}
                        </label>
                        {editing ? (
                          <input
                            type="tel"
                            name="emergencyPhone"
                            value={formData.emergencyPhone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        ) : (
                          <p className="text-gray-900">{user?.emergency_phone || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      {text.security}
                    </h2>
                  </div>
                  <div className="p-6">
                    {!changingPassword ? (
                      <button
                        onClick={() => setChangingPassword(true)}
                        className="cursor-pointer flex items-center text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {text.changePassword}
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {text.currentPassword}
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="cursor-pointer absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {text.newPassword}
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="cursor-pointer absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {text.confirmPassword}
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="cursor-pointer absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {(editing || changingPassword) && (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setChangingPassword(false);
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
                          dateOfBirth: user?.dateOfBirth || '',
                          nationality: user?.nationality || '',
                          emergencyContact: user?.emergencyContact || '',
                          emergencyPhone: user?.emergencyPhone || '',
                          bio: user?.bio || ''
                        });
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setProfilePhoto(null);
                        setPhotoPreview(null);
                      }}
                      className="cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      {text.cancel}
                    </button>
                    <button
                      onClick={editing ? handleSave : handlePasswordSave}
                      className="cursor-pointer px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {text.save}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}