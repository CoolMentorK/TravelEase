import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAccessToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('No access token found');
  return token;
};

export const saveAccessToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('accessToken', token);
};
