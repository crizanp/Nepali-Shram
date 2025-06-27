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
  const nameInputRef = useRef(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.signup(name, email, password);

      // Set state to show email verification message
      setEmailSent(true);
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
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
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
          style={{
            background: 'linear-gradient(135deg, #003479 0%, #0054a6 40%, rgb(144, 180, 255) 70%, rgb(173, 199, 255) 100%)'
          }}>

          {/* Verification Card */}
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl">
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
                    src="/Nepalishram.png"
                    alt="Logo"
                    className="w-32 h-32 object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="text-center my-8">
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#003479' }}>VERIFY YOUR EMAIL</h2>
              <p className="text-sm text-gray-600 mb-4">
                We've sent a verification link to <strong>{email}</strong>. 
                Please check your inbox and click the link to verify your account.
              </p>
              <p className="text-sm text-gray-600">
                Didn't receive the email?{' '}
                <button 
                  onClick={handleSubmit} 
                  className="font-medium hover:underline cursor-pointer transition-colors duration-200"
                  style={{ color: '#003479' }}
                  disabled={loading}
                >
                  Resend verification email
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
      {/* Head component would go here in your Next.js app */}
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, #003479 0%, #0054a6 40%, rgb(144, 180, 255) 70%, rgb(173, 199, 255) 100%)'
        }}>

        {/* Signup Card - Made wider */}
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl">
          <div className="mb-4">
            {/* Gradient Border Wrapper */}
            <div className="w-40 h-40 mx-auto p-1 rounded-3xl"
              style={{
                background: 'linear-gradient(45deg, #003479, rgb(23, 143, 183))',
                borderRadius: '1.7rem' // 24px = rounded-3xl
              }}
            >
              {/* Inner white box */}
              <div className="w-full h-full bg-white rounded-3xl shadow-lg flex items-center justify-center">
                <img
                  src="/Nepalishram.png"
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
              <a href="/login" className="font-medium hover:underline cursor-pointer transition-colors duration-200" style={{ color: '#003479' }}>
                sign in to your existing account
              </a>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Signup Form */}
          <div className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={nameInputRef}
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all duration-200"
                style={{ focusRingColor: '#003479' }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #003479'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all duration-200"
                style={{ focusRingColor: '#003479' }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #003479'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all duration-200"
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #003479'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
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
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all duration-200"
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #003479'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
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
            </div>

            {/* Sign Up Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none cursor-pointer disabled:cursor-not-allowed"
              style={{
                backgroundColor: loading ? '#6b8cb8' : '#003479',
                ':hover': { backgroundColor: '#002050' }
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#002050';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#003479';
                }
              }}
            >
              <UserPlus className="h-5 w-5" />
              <span>{loading ? 'Creating account...' : 'SIGN UP'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}