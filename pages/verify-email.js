import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function VerifyEmail() {
  const router = useRouter();
  const [status, setStatus] = useState('Verifying your email...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const { token } = router.query;

      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email?token=${token}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        setStatus('Email verified successfully! Redirecting to login...');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        setStatus('');
        setError(err.message);
      }
    };

    verifyEmail();
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Verify Email | My App</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {status && (
            <div className="text-center text-gray-900 text-xl">
              {status}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
}