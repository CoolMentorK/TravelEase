import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { topUpWallet } from '../../services/walletService.ts';
import { convertUSDToLKR } from '../../utils/currency.ts';

interface Props {
  onTopUpSuccess: () => void;
}

const COLORS = {
  border: '#ccc',
} as const;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderColor: COLORS.border,
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
    color: '#555',
    fontSize: 14,
  },
  rateValue: {
    color: '#2e7d32',
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

      {/* 👇 Conversion Display */}
      <View style={styles.rateContainer}>
        <Text style={styles.rateLabel}>You’ll receive:</Text>
        <Text style={styles.rateValue}>LKR {converted.toFixed(2)}</Text>
      </View>

      <Button title='Top Up Wallet' onPress={handleTopUp} />
    </View>
  );
};

export default WalletTopUpForm;
