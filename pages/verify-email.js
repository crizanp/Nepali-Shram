import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { authApi } from '../utils/api';
import { Mail, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function VerifyEmail() {
  const router = useRouter();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'expired', 'resend'
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const { token, email } = router.query;

      // If no token but email is provided, show resend form
      if (!token && email) {
        setResendEmail(decodeURIComponent(email));
        setStatus('resend');
        setMessage('');
        return;
      }

      if (!token) {
        setStatus('resend');
        setMessage('');
        return;
      }

      try {
        setStatus('verifying');
        setMessage('Verifying your email...');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email?token=${token}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          
          // Check if token is expired
          if (errorData.code === 'TOKEN_EXPIRED' || errorData.message.includes('expired')) {
            setStatus('expired');
            setMessage('Your verification link has expired.');
            
            // Try to extract email from token or error response
            if (errorData.email) {
              setResendEmail(errorData.email);
            }
          } else {
            throw new Error(errorData.message);
          }
          return;
        }

        const data = await response.json();
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to login...');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage('');
        setError(err.message || 'An error occurred during verification');
      }
    };

    if (router.isReady) {
      verifyEmail();
    }
  }, [router, router.query, router.isReady]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      // FIXED: Changed from resendVerification to resendVerificationEmail
      await authApi.resendVerificationEmail(resendEmail);
      setResendSuccess(true);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: '#003479' }}></div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#003479' }}>VERIFYING EMAIL</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#10b981' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#003479' }}>EMAIL VERIFIED</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: '#003479' }}></div>
              <span>Redirecting to login...</span>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#003479' }}>VERIFICATION FAILED</h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <button
              onClick={() => setStatus('resend')}
              className="inline-flex items-center space-x-2 font-medium hover:underline cursor-pointer transition-colors duration-200"
              style={{ color: '#003479' }}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try sending a new verification email</span>
            </button>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#003479' }}>LINK EXPIRED</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => setStatus('resend')}
              className="inline-flex items-center space-x-2 font-medium hover:underline cursor-pointer transition-colors duration-200"
              style={{ color: '#003479' }}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Send a new verification email</span>
            </button>
          </div>
        );

      case 'resend':
        return (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#003479' }}>VERIFY YOUR EMAIL</h2>
              <p className="text-gray-600">
                Enter your email address to receive a new verification link.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                Verification email sent! Please check your inbox and spam folder.
              </div>
            )}

            <form onSubmit={handleResendVerification} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all duration-200"
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #003479'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !resendEmail.trim()}
                className="w-full text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor: loading ? '#6b8cb8' : '#003479',
                }}
                onMouseEnter={(e) => {
                  if (!loading && resendEmail.trim()) {
                    e.target.style.backgroundColor = '#002050';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && resendEmail.trim()) {
                    e.target.style.backgroundColor = '#003479';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    <span  className='text-sm'>SEND VERIFICATION EMAIL</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-4">
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center space-x-2 font-medium hover:underline cursor-pointer transition-colors duration-200"
                style={{ color: '#003479' }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to login</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Verify Email | Your App</title>
        <meta name="description" content="Verify your email address to complete your account setup." />
      </Head>
      
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-0 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, #003479 0%, #0054a6 40%, rgb(144, 180, 255) 70%, rgb(173, 199, 255) 100%)'
        }}>

        {/* Verification Card */}
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xl">
          <div className="mb-6">
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

          {renderContent()}
        </div>
      </div>
    </>
  );
}