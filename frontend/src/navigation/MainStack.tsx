import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen.tsx';
import LoginScreen from '../screens/LoginScreen.tsx';
import SignupScreen from '../screens/SignupScreen.tsx';
import ItineraryScreen from '../screens/ItineraryScreen.tsx';
import SettingsScreen from '../screens/SettingsScreen.tsx';
import WalletScreen from '../screens/Wallet/WalletScreen.tsx';
import PaymentScreen from '../screens/Wallet/PaymentScreen.tsx';
import TransactionHistoryScreen from '../screens/Wallet/TransactionHistoryScreen.tsx';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  Itinerary: undefined;
  Settings: undefined;
  Wallet: undefined;
  Payment: undefined;
  Transactions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
      <Stack.Screen name='Home' component={HomeScreen} options={{ title: 'TravelEase' }} />
      <Stack.Screen
        name='Itinerary'
        component={ItineraryScreen}
        options={{ title: 'My Itinerary' }}
      />
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name='Wallet' component={WalletScreen} options={{ title: 'My Wallet' }} />
        <Stack.Screen name='Payment' component={PaymentScreen} options={{ title: 'Pay Vendor' }} />
        <Stack.Screen
            name='Transactions'
            component={TransactionHistoryScreen}
            options={{ title: 'Transaction History' }}
        />

    </Stack.Navigator>
  );
}
