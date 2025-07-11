// hooks/useGoogleTranslate.js
import { useEffect, useState, useCallback } from 'react';

export const useGoogleTranslate = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [translateElement, setTranslateElement] = useState(null);

  useEffect(() => {
    // Check if Google Translate is already loaded
    if (window.google && window.google.translate) {
      initializeTranslateElement();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    if (existingScript) {
      return;
    }

    // Create and add the script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;

    // Global callback function
    window.googleTranslateElementInit = () => {
      initializeTranslateElement();
    };

    script.onerror = () => {
      console.error('Failed to load Google Translate script');
      setIsLoaded(false);
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  const initializeTranslateElement = useCallback(() => {
    try {
      if (window.google && window.google.translate) {
        const element = new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ne',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true,
          },
          'google_translate_element'
        );
        
        setTranslateElement(element);
        setIsLoaded(true);
        setCurrentLang('en');
        
        // Wait a bit for the element to be fully initialized
        setTimeout(() => {
          const selectElement = document.querySelector('select.goog-te-combo');
          if (selectElement) {
            console.log('Google Translate initialized successfully');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error initializing Google Translate:', error);
      setIsLoaded(false);
    }
  }, []);

  const changeLanguage = useCallback((langCode) => {
    if (!isLoaded) {
      console.warn('Google Translate not loaded yet');
      return false;
    }

    try {
      const selectElement = document.querySelector('select.goog-te-combo');
      if (selectElement) {
        // Clear any existing translation first if switching languages
        if (currentLang !== 'en' && langCode !== currentLang) {
          selectElement.value = 'en';
          selectElement.dispatchEvent(new Event('change'));
          
          // Wait a bit before applying new translation
          setTimeout(() => {
            if (langCode !== 'en') {
              selectElement.value = langCode;
              selectElement.dispatchEvent(new Event('change'));
            }
            setCurrentLang(langCode);
          }, 300);
        } else {
          selectElement.value = langCode;
          selectElement.dispatchEvent(new Event('change'));
          setCurrentLang(langCode);
        }
        return true;
      } else {
        console.warn('Google Translate select element not found');
        return false;
      }
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  }, [isLoaded, currentLang]);

  const resetTranslation = useCallback(() => {
    return changeLanguage('en');
  }, [changeLanguage]);

  // Function to check if translation is in progress
  const isTranslating = useCallback(() => {
    const body = document.body;
    return body && body.classList.contains('goog-te-menu-frame');
  }, []);

  return {
    isLoaded,
    currentLang,
    changeLanguage,
    resetTranslation,
    isTranslating,
  };
};