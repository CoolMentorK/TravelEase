import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/MainStack.tsx';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  const features = [
    {
      title: t('home.smartItinerary'),
      description: t('home.smartItineraryDesc'),
      icon: '🗺️',
      action: () => navigation.navigate('Itinerary'),
    },
    {
      title: t('home.digitalWallet'),
      description: t('home.digitalWalletDesc'),
      icon: '💳',
      action: () => console.log('Wallet coming soon'),
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
        <Text style={styles.appTitle}>TravelEase</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
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

      <View style={styles.quickActions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Itinerary')}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
        >
          {t('home.planTrip')}
        </Button>

        <Button
          mode="outlined"
          onPress={() => console.log('Explore coming soon')}
          style={styles.secondaryButton}
          contentStyle={styles.buttonContent}
        >
          {t('home.exploreDestinations')}
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsButton}
          contentStyle={styles.buttonContent}
        >
          {t('home.goToSettings')}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  featuresContainer: {
    padding: 16,
  },
  featureCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
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
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  quickActions: {
    padding: 16,
    paddingBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 12,
    borderRadius: 8,
  },
  secondaryButton: {
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  settingsButton: {
  marginTop: 8,
  alignSelf: 'center',
  },
});
