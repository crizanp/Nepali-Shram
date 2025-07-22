import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { authApi } from '../utils/api';
import { Eye, EyeOff, Lock, LogIn, Mail, RefreshCw } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const emailInputRef = useRef(null);
  const recaptchaRef = useRef();

  const router = useRouter();

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      setError('Please verify that you are not a robot.');
      return;
    }
    setLoading(true);
    setError('');
    setUnverifiedEmail('');
    setVerificationMessage('');

    try {
      const data = await authApi.login(email, password, rememberMe);
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);

      // Check if the error is about unverified email
      if (errorMessage.includes('verify your email')) {
        setUnverifiedEmail(email);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    setVerificationMessage('');
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: unverifiedEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setVerificationMessage('Verification email sent! Please check your inbox and click the verification link.');
      setUnverifiedEmail(''); // Hide the resend section after success
    } catch (err) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResendingVerification(false);
    }
  };

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-0 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, #003479 0%, #0054a6 40%, rgb(144, 180, 255) 70%, rgb(173, 199, 255) 100%)'
        }}>

        {/* Login Card */}
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
                  src="/assets/Nepalishram.png"
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
              <Link href="/signup" className="font-medium hover:underline cursor-pointer transition-colors duration-200" style={{ color: '#003479' }}>
                create a new account
              </Link>
            </p>
          </div>

          {error && !unverifiedEmail && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {verificationMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4" role="alert">
              <span className="block sm:inline">{verificationMessage}</span>
            </div>
          )}

          {/* Email Verification Alert */}
          {unverifiedEmail && (
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg mb-4" role="alert">
              <div className="mb-3">
                <strong>Email Verification Required</strong>
                <p className="text-sm mt-1">
                  Please verify your email address before signing in. We have sent a verification link to <strong>{unverifiedEmail}</strong>.
                </p>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="inline-flex items-center space-x-2 text-orange-700 hover:text-orange-800 font-medium text-sm hover:underline cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${resendingVerification ? 'animate-spin' : ''}`} />
                <span>{resendingVerification ? 'Sending...' : 'Resend verification email'}</span>
              </button>
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
            <div className="flex items-center justify-between flex-wrap gap-2 text-sm">
              <label htmlFor="remember-me" className="flex items-center cursor-pointer text-gray-900">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded mr-2 cursor-pointer"
                  style={{ accentColor: '#003479' }}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="text-[#003479] font-medium hover:underline transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* reCAPTCHA */}
            <div className="my-4 flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LcN-IorAAAAAMM0BaQOFo0YC24pWQIp0hdZ1pqI"
                onChange={handleCaptchaChange}
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none cursor-pointer disabled:cursor-not-allowed"
              style={{
                backgroundColor: loading ? '#6b8cb8' : '#003479',
                ':hover': { backgroundColor: '#002050' }
              }}
            >
              <LogIn className="h-5 w-5" />
              <span>{loading ? 'Signing in...' : 'SIGN IN'}</span>
            </button>
          </div>

          {/* Additional Help */}
          {unverifiedEmail && (
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Having trouble with email verification?{' '}
                <Link
                  href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                  className="font-medium hover:underline cursor-pointer transition-colors duration-200"
                  style={{ color: '#003479' }}
                >
                  Go to verification page
                </Link>
              </p>
            </div>
          )}
           {/* Direct WhatsApp Contact */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Need help? Contact us directly on WhatsApp for quick assistance.
         <a
              href="https://wa.me/9779708023083"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-[#25D366] font-medium hover:underline"
            >
            Chat on WhatsApp
          </a>
        </div>
        </div>
       
      </div>
    </>
  );
}