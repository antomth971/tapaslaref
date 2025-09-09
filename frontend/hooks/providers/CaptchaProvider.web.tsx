import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { useLanguage } from '@/hooks/providers/LangageProvider';

const reCaptchaKey = process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY as string;

export default function GoogleReCaptchaProviderWrapper({ children }: { children: React.ReactElement | React.ReactElement[] }) {
  const { locale } = useLanguage();

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={reCaptchaKey}
      language={locale}
    >
      <>{children}</>
    </GoogleReCaptchaProvider>
  );
}