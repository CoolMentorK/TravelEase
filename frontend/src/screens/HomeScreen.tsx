import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button, Title, Paragraph, Portal, Modal, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/MainStack.tsx';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/colors.ts';
import PlanTripForm, { PlanTripFormData } from '../components/PlanTripForm';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>; // Update to include all routes

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [planTripVisible, setPlanTripVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const features = [
    {
      title: t('My Trips'),
      description: t('Smart Itinerary'),
      icon: '🗺️',
      action: () => navigation.navigate('Itinerary'),
    },
    {
      title: t('home.digitalWallet'),
      description: t('home.digitalWalletDesc'),
      icon: '💳',
      action: () => navigation.navigate('Wallet'),
    },
    {
      title: t('home.offlineMaps'),
      description: t('home.offlineMapsDesc'),
      icon: '📱',
      action: () => console.log('Offline maps coming soon'),
    },
    {
      title: t('home.localInsights'),
      description: t('home.localInsightsDesc'),
      icon: '🌟',
      action: () => console.log('Local insights coming soon'),
    },
  ];

  // Mock itinerary response
  const mockItineraryResponse = {
    itinerary: [
      {
        day: 1,
        activities: [
          {
            address: 'Unawatuna',
            best_time_to_visit: 'Evening',
            category: 'attraction',
            cost_usd: 0.0,
            description: 'Well-known for swimming and nightlife',
            duration_hours: 4,
            name: 'Unawatuna Beach',
            notes: 'Beach bars and events',
            opening_hours: 'All day',
          },
          {
            address: 'Galle Fort',
            best_time_to_visit: 'Evening',
            category: 'nightlife',
            cost_usd: 15.0,
            description: 'Trendy rooftop bar with burgers and drinks',
            duration_hours: 2,
            name: 'Rocket Burger Rooftop',
            notes: 'Live music',
            opening_hours: '5pm-12am',
          },
          {
            address: 'Galle Fort',
            best_time_to_visit: 'Evening',
            category: 'nightlife',
            cost_usd: 22.0,
            description: 'Modern bar with seafood and cocktails',
            duration_hours: 2,
            name: 'The Tuna & The Crab',
            notes: 'Signature cocktails',
            opening_hours: '12pm-11pm',
          },
        ],
      },
    ],
    metadata: {
      num_activities: 3,
      processing_time_ms: 60.0,
    },
    summary: {
      total_cost_usd: 37.0,
      total_distance_km: 0,
      total_duration_hours: 8.0,
    },
  };

  const handlePlanTrip = (formData: PlanTripFormData) => {
    setPlanTripVisible(false);
    // Simulate API call delay
    setTimeout(() => {
      navigation.navigate('Itinerary', { plannedItinerary: mockItineraryResponse });
    }, 500);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.profileMenuWrapper}>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity style={styles.profileButton} onPress={openMenu}>
                <MaterialCommunityIcons name='account-circle' color={COLORS.surface} size={32} />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate('Settings');
              }}
              title={t('home.goToSettings')}
              leadingIcon='cog'
            />
          </Menu>
        </View>
        <Text style={styles.appTitle}>TravelEase</Text>
        <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      </View>
      <View style={styles.planTripContainer}>
        <Button
          mode='contained'
          onPress={() => setPlanTripVisible(true)}
          style={styles.planTripButton}
          contentStyle={styles.planTripButtonContent}>
          {t('home.planTrip')}
        </Button>
      </View>
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Card key={index} style={styles.featureCard} onPress={feature.action}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Title style={styles.featureTitle}>{feature.title}</Title>
              <Paragraph style={styles.featureDescription}>{feature.description}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>
      <Portal>
        <Modal visible={planTripVisible} onDismiss={() => setPlanTripVisible(false)} contentContainerStyle={styles.modalContainer}>
          <PlanTripForm onPlanTrip={handlePlanTrip} onCancel={() => setPlanTripVisible(false)} />
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 10,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    position: 'relative',
  },
  profileMenuWrapper: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 2,
  },
  profileButton: {
    marginLeft: 0,
  },
  appTitle: {
    color: COLORS.surface,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  welcomeText: {
    color: COLORS.surface,
    fontSize: 18,
    marginBottom: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 4,
  },
  planTripContainer: {
    alignItems: 'center',
    marginVertical: 18,
  },
  planTripButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 24,
    elevation: 3,
    minWidth: 180,
  },
  planTripButtonContent: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  featuresContainer: {
    padding: 16,
  },
  featureCard: {
    borderRadius: 14,
    elevation: 3,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  cardContent: {
    alignItems: 'center',
    padding: 20,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.text,
  },
  featureDescription: {
    color: COLORS.secondaryText,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    margin: 24,
    borderRadius: 18,
    padding: 16,
    elevation: 6,
  },
});
