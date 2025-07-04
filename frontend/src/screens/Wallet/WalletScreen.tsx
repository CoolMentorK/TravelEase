import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import WalletBalance from '../../components/Wallet/WalletBalance.tsx';
import WalletTopUpForm from '../../components/Wallet/WalletTopUpForm.tsx';
import { getBalance } from '../../services/walletService.ts';

// Design Tokens (centralize these in theme file ideally)
const COLORS = {
  background: '#F5F5F5',
  textPrimary: '#121212',
  textSecondary: '#4F4F4F',
  primaryBlue: '#005F8D',
  accentOrange: '#F2994A',
  cardBackground: '#FFFFFF',
  border: '#E0E0E0',
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  screen: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  sectionCard: {
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    marginBottom: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
  },
});

const WalletScreen = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadBalance = async () => {
    setLoading(true);
    try {
      const fetchedBalance = await getBalance();
      setBalance(fetchedBalance);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error loading balance:', err.response?.data || err.message);
      } else {
        console.error('Error loading balance:', err);
      }
      Alert.alert('Error', 'Failed to load wallet balance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Wallet</Text>

      {loading ? (
        <ActivityIndicator size='large' color={COLORS.primaryBlue} />
      ) : (
        <>
          <View style={styles.sectionCard}>
            <WalletBalance balance={balance} />
          </View>

          <View style={styles.sectionCard}>
            <WalletTopUpForm onTopUpSuccess={loadBalance} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default WalletScreen;
