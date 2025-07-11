import { AuthProvider } from '@/context/AuthContext';
import { TranslationProvider } from '@/context/TranslationContext';
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
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