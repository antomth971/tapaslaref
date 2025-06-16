import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <View>
        <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>
          This screen doesn't exist.
        </Text>
      </View>
    </>
  );
}