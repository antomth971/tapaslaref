import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import { Slot } from "expo-router";
import Navbar from '@/components/navbar';
import { AuthProvider } from '@/hooks/providers/AuthProvider';
import { LanguageProvider } from '@/hooks/providers/LangageProvider';
import { ThemeProvider } from '@/hooks/providers/ThemeProvider';
import GoogleReCaptchaProviderWrapper from '@/hooks/providers/CaptchaProvider.web';

export default function App() {
const isWeb = Platform.OS === 'web';
  return (
    <LanguageProvider>
      <ThemeProvider>
      <AuthProvider>
        {isWeb && <GoogleReCaptchaProviderWrapper />}
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{
            flex: 1,
          }}>
            <Navbar />
            <Slot />
          </View>
        </SafeAreaView>
        { isWeb && <GoogleReCaptchaProviderWrapper /> }
      </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
