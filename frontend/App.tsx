import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/navigation/MainStack.tsx';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n.ts'; 

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <PaperProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </PaperProvider>
    </I18nextProvider>
  );
}