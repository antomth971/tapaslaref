import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { Slot } from "expo-router";

export default function App() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{
        flex: 1,
        paddingTop: insets.top, 
      }}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}
