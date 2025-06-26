import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { topUpWallet } from '../../services/walletService.ts';
import { convertUSDToLKR } from '../../utils/currency.ts';
import { COLORS } from '../../constants/colors.ts';

interface Props {
  onTopUpSuccess: () => void;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderColor: COLORS.borderGray, // Use COLORS.borderGray from colors.ts
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 12,
    padding: 12,
  },
  rateContainer: {
    marginBottom: 12,
  },
  rateLabel: {
    color: COLORS.mediumGray, // Use COLORS.mediumGray for #555
    fontSize: 14,
  },
  rateValue: {
    color: COLORS.success, // Use COLORS.success for #2e7d32
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const WalletTopUpForm: React.FC<Props> = ({ onTopUpSuccess }) => {
  const [amount, setAmount] = useState('');

  const handleTopUp = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid number.');
      return;
    }

    try {
      await topUpWallet(num);
      Alert.alert('Success', 'Wallet topped up successfully!');
      setAmount('');
      onTopUpSuccess();
    } catch {
      Alert.alert('Error', 'Top-up failed.');
    }
  };

  const converted = convertUSDToLKR(parseFloat(amount) || 0);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Enter amount in USD'
        keyboardType='numeric'
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.rateContainer}>
        <Text style={styles.rateLabel}>You’ll receive:</Text>
        <Text style={styles.rateValue}>LKR {converted.toFixed(2)}</Text>
      </View>
      <Button mode='contained' onPress={handleTopUp}>
        <Text>Top Up Wallet</Text>
      </Button>
    </View>
  );
};

export default WalletTopUpForm;
