import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/navigation/MainStack.tsx';

export type RootStackParamList = {
  Home: undefined;
};

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </PaperProvider>
  );
}
