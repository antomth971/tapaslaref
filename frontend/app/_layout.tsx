import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { Slot } from "expo-router";
import Navbar from '@/components/navbar';
import { AuthProvider } from '@/hooks/providers/AuthProvider';
import { LanguageProvider } from '@/hooks/providers/LangageProvider';

export default function App() {
  const insets = useSafeAreaInsets();
  return (
    <LanguageProvider>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{
            flex: 1,
            paddingTop: insets.top,
          }}>
            <Navbar />
            <Slot />
          </View>
        </SafeAreaView>
      </AuthProvider>
    </LanguageProvider>
  );
}
