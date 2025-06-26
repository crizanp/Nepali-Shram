import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { authApi } from '../utils/api'; // Update path as needed
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- Add this line
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);

  const router = useRouter();

  // Login component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Modify your authApi.login to accept rememberMe
      const data = await authApi.login(email, password, rememberMe);

      // Store token in localStorage or cookies
      localStorage.setItem('token', data.token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
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

        {/* Logo at the top */}


        {/* Login Card - Made wider */}
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
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#003479' }}>SIGN IN</h2>
            <p className="text-sm text-gray-600">
              Or{' '}
              <a href="/signup" className="font-medium hover:underline cursor-pointer transition-colors duration-200" style={{ color: '#003479' }}>
                create a new account
              </a>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Login Form */}
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

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded cursor-pointer"
                  style={{ accentColor: '#003479' }}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="font-medium hover:underline cursor-pointer transition-colors duration-200" style={{ color: '#003479' }}>
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
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
              <LogIn className="h-5 w-5" />
              <span>{loading ? 'Signing in...' : 'SIGN IN'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}