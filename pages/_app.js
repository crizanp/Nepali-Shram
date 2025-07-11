import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { TranslationProvider } from '@/context/TranslationContext';
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/6870e04b381fd5a1d89bda97/1ivseoabi';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nepali Shram Portal</title>
      </Head>
      <TranslationProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </TranslationProvider>
    </>
  );
}

export default MyApp;
