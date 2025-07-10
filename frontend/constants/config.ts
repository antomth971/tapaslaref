
import AsyncStorage from '@react-native-async-storage/async-storage';

const getConfig = async () => {
  const token = await AsyncStorage.getItem('token')
  
  return {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : '',
    },
    withCredentials: true,
  }
}

export default getConfig;