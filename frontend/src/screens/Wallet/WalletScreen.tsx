import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import WalletBalance from '../../components/Wallet/WalletBalance.tsx';
import WalletTopUpForm from '../../components/Wallet/WalletTopUpForm.tsx';
import { getBalance } from '../../services/walletService.ts';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
  },
});

const WalletScreen = () => {
  const [balance, setBalance] = useState<number>(0);

  const loadBalance = async () => {
    try {
      const fetchedBalance = await getBalance();
      setBalance(fetchedBalance);
    } catch {
      Alert.alert('Error', 'Failed to load wallet balance');
    }
  };

  useEffect(() => {
    loadBalance().catch(() => {
      // Handle any unexpected errors (already handled in loadBalance, so this can be empty)
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Wallet</Text>
      <WalletBalance balance={balance} />
      <WalletTopUpForm onTopUpSuccess={loadBalance} />
    </ScrollView>
  );
};

export default WalletScreen;
