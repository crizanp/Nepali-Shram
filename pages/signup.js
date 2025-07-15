import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { authApi } from '../utils/api';
import { Eye, EyeOff, Lock, UserPlus, Mail, User } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const nameInputRef = useRef(null);

  const router = useRouter();

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  // Get validation errors
  const nameError = touched.name ? validateName(name) : '';
  const emailError = touched.email ? validateEmail(email) : '';
  const passwordError = touched.password ? validatePassword(password) : '';
  const confirmPasswordError = touched.confirmPassword ? validateConfirmPassword(confirmPassword, password) : '';

  // Check if form is valid
  const isFormValid = () => {
    return !validateName(name) &&
      !validateEmail(email) &&
      !validatePassword(password) &&
      !validateConfirmPassword(confirmPassword, password) &&
      name.trim() &&
      email.trim() &&
      password &&
      confirmPassword;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // SIGNUP FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show validation errors
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validate all fields
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(confirmPassword, password);

    if (nameErr || emailErr || passwordErr || confirmPasswordErr) {
      setError('Please fix the errors below before submitting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting signup for:', email);
      const response = await authApi.signup(name, email, password);
      console.log('Signup successful:', response);
      setEmailSent(true);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  // SEPARATE RESEND VERIFICATION FUNCTION
  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendMessage('');
    setError('');

    try {
      console.log('Attempting to resend verification email to:', email);

      // Call the resend verification API endpoint
      const response = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }

      console.log('Resend verification successful:', data);
      setResendMessage('Verification email sent successfully! Please check your inbox.');
    } catch (err) {
      console.error('Resend verification error:', err);
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // If email has been sent, show verification instructions
  if (emailSent) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-0 sm:px-6 lg:px-8"
          style={{
            background: 'linear-gradient(135deg, #003479 0%, #0054a6 40%, rgb(144, 180, 255) 70%, rgb(173, 199, 255) 100%)'
          }}>

          {/* Verification Card */}
          <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-xl">
            <div className="mb-4">
              {/* Gradient Border Wrapper */}
              <div className="w-40 h-40 mx-auto p-1 rounded-3xl"
                style={{
                  background: 'linear-gradient(45deg, #003479, rgb(23, 143, 183))',
                  borderRadius: '1.7rem'
                }}
              >
                {/* Inner white box */}
                <div className="w-full h-full bg-white rounded-3xl shadow-lg flex items-center justify-center">
                  <img
                    src="/assets/Nepalishram.png"
                    alt="Logo"
                    className="w-32 h-32 object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="text-center my-8">
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#003479' }}>VERIFY YOUR EMAIL</h2>
              <p className="text-sm text-gray-600 mb-4">
                We have sent a verification link to <strong>{email}</strong>.
                Please check your inbox and click the link to verify your account.
              </p>

              {/* Show success message if resend was successful */}
              {resendMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {resendMessage}
                </div>
              )}

              {/* Show error message if resend failed */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <p className="text-sm text-gray-600">
                Did not receive the email?{' '}
                <button
                  onClick={handleResendVerification}
                  className="font-medium hover:underline cursor-pointer transition-colors duration-200"
                  style={{ color: '#003479' }}
                  disabled={resendLoading}
                >
                  {resendLoading ? 'Sending...' : 'Resend verification email'}
                </button>
              </p>
            </div>

            <button
              onClick={() => router.push('/login')}
              className="w-full text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
              style={{ backgroundColor: '#003479' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#002050'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#003479'}
            >
              <span>BACK TO SIGN IN</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-0 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, #003479 0%, #0054a6 40%, rgb(144, 180, 255) 70%, rgb(173, 199, 255) 100%)'
        }}>

        {/* Signup Card */}
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xl">
          <div className="mb-4">
            {/* Gradient Border Wrapper */}
            <div className="w-40 h-40 mx-auto p-1 rounded-3xl"
              style={{
                background: 'linear-gradient(45deg, #003479, rgb(23, 143, 183))',
                borderRadius: '1.7rem'
              }}
            >
              {/* Inner white box */}
              <div className="w-full h-full bg-white rounded-3xl shadow-lg flex items-center justify-center">
                <img
                  src="/assets//Nepalishram.png"
                  alt="Logo"
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#003479' }}>SIGN UP</h2>
            <p className="text-sm text-gray-600">
              Or{' '}
              <Link href="/login" className="font-medium hover:underline cursor-pointer transition-colors duration-200" style={{ color: '#003479' }}>
                sign in to your existing account
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className={`h-5 w-5 ${nameError ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                ref={nameInputRef}
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all duration-200 ${nameError ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                onFocus={(e) => e.target.style.boxShadow = nameError ? '0 0 0 2px #ef4444' : '0 0 0 2px #003479'}
                onBlur={(e) => {
                  handleBlur('name');
                  e.target.style.boxShadow = 'none';
                }}
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-600">{nameError}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 ${emailError ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all duration-200 ${emailError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                onFocus={(e) => e.target.style.boxShadow = emailError ? '0 0 0 2px #ef4444' : '0 0 0 2px #003479'}
                onBlur={(e) => {
                  handleBlur('email');
                  e.target.style.boxShadow = 'none';
                }}
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${passwordError ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all duration-200 ${passwordError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                onFocus={(e) => e.target.style.boxShadow = passwordError ? '0 0 0 2px #ef4444' : '0 0 0 2px #003479'}
                onBlur={(e) => {
                  handleBlur('password');
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors duration-200 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${confirmPasswordError ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Confirm Password *"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all duration-200 ${confirmPasswordError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                onFocus={(e) => e.target.style.boxShadow = confirmPasswordError ? '0 0 0 2px #ef4444' : '0 0 0 2px #003479'}
                onBlur={(e) => {
                  handleBlur('confirmPassword');
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors duration-200 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
              {confirmPasswordError && (
                <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className={`w-full text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none cursor-pointer disabled:cursor-not-allowed ${!isFormValid() ? 'opacity-50' : ''
                }`}
              style={{
                backgroundColor: loading ? '#6b8cb8' : (isFormValid() ? '#003479' : '#9ca3af'),
              }}
              onMouseEnter={(e) => {
                if (!loading && isFormValid()) {
                  e.target.style.backgroundColor = '#002050';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && isFormValid()) {
                  e.target.style.backgroundColor = '#003479';
                }
              }}
            >
              <UserPlus className="h-5 w-5" />
              <span>{loading ? 'Creating account...' : 'SIGN UP'}</span>
            </button>
          </form>

          {/* Password Requirements */}
          <div className="mt-4 text-xs text-gray-500">
            <p className="mb-1">Password must contain at least 6 characters</p>
          </div>
        </div>
      </div>
    </>
  );
}