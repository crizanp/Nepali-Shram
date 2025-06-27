import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { authApi } from '../utils/api';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authApi.forgotPassword(email);
      
      setMessage('If an account with that email exists, we have sent a password reset link.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  return (
    <>
      {/* Head component would go here in your Next.js app */}
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, #003479 0%, #0054a6 40%, rgb(144, 180, 255) 70%, rgb(173, 199, 255) 100%)'
        }}>

        {/* Forgot Password Card - Made wider */}
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

          <div className="text-center my-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#003479' }}>FORGOT PASSWORD</h2>
            <p className="text-sm text-gray-600">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          {/* Forgot Password Form */}
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={emailInputRef}
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

            {/* Send Reset Link Button */}
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
              <Send className="h-5 w-5" />
              <span>{loading ? 'Sending...' : 'SEND RESET LINK'}</span>
            </button>

            {/* Back to Login Link */}
            <div className="text-center pt-2">
              <a href="/login" className="inline-flex items-center space-x-2 font-medium hover:underline cursor-pointer transition-colors duration-200" style={{ color: '#003479' }}>
                <ArrowLeft className="h-4 w-4" />
                <span>Back to login</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}