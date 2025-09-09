import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { Slot } from "expo-router";
import Navbar from '@/components/navbar';
import { AuthProvider } from '@/hooks/providers/AuthProvider';
import { LanguageProvider } from '@/hooks/providers/LangageProvider';
import { ThemeProvider } from '@/hooks/providers/ThemeProvider';
import GoogleReCaptchaProviderWrapper from '@/hooks/providers/CaptchaProvider.web';

export default function App() {
 
  return (
    <LanguageProvider>
      <ThemeProvider>
      <AuthProvider>
        <GoogleReCaptchaProviderWrapper>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{
              flex: 1,
            }}>
            <Navbar />
            <Slot />
          </View>
        </SafeAreaView>
        </GoogleReCaptchaProviderWrapper>
      </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
