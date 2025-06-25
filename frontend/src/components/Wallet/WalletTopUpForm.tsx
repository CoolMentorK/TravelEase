import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { topUpWallet } from '../../services/walletService.ts';

interface Props {
  onTopUpSuccess: () => void;
}

const COLORS = {
  border: '#ccc',
} as const;

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

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Enter amount in USD'
        keyboardType='numeric'
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />
      <Button title='Top Up Wallet' onPress={handleTopUp} />
    </View>
  );
};

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
});

export default WalletTopUpForm;
