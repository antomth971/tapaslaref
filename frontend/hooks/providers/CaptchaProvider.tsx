import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { useLanguage } from '@/hooks/providers/LangageProvider';
import { Platform } from 'react-native';
const reCaptchaKey = process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY as string;
const isWeb = Platform.OS === 'web';

export default function GoogleReCaptchaProviderWrapper({ children }: { children: React.ReactElement | React.ReactElement[] }) {
  const { locale } = useLanguage();
  if (!isWeb) {
    return <>{children}</>;
  }
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={reCaptchaKey}
      language={locale}
      key={locale}
    >
      <>{children}</>
    </GoogleReCaptchaProvider>
  );
}