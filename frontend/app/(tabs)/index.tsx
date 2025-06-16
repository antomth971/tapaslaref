import { View, Text } from 'react-native';


export default function HomeScreen() {
  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>
        Welcome to the Home Screen!
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10 }}>
        This is the main entry point of the app.
      </Text>
    </View>
  );
}