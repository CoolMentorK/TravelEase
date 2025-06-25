import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen.tsx';
import ItineraryScreen from '../screens/ItineraryScreen.tsx';
import SettingsScreen from '../screens/SettingsScreen.tsx';
import WalletScreen from '../screens/Wallet/WalletScreen.tsx';

export type RootStackParamList = {
    Home: undefined;
    Itinerary: undefined;
    Settings: undefined;
    Wallet: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={HomeScreen} options={{ title: 'TravelEase' }} />
            <Stack.Screen
                name='Itinerary'
                component={ItineraryScreen}
                options={{ title: 'My Itinerary' }}
            />
            <Stack.Screen name='Settings' component={SettingsScreen} />
            <Stack.Screen name='Wallet' component={WalletScreen} options={{ title: 'My Wallet' }} />
        </Stack.Navigator>
    );
}
