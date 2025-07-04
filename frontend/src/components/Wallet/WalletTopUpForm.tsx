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
  button: {
    backgroundColor: COLORS.accentOrange,
    borderRadius: 10,
    paddingVertical: 10,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.borderGray,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    padding: 14,
  },
  rateContainer: {
    paddingTop: 4,
  },
  rateLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  rateValue: {
    color: COLORS.success,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
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
        accessibilityLabel='Top up amount input field'
      />
      <View style={styles.rateContainer}>
        <Text style={styles.rateLabel}>You’ll receive:</Text>
        <Text style={styles.rateValue}>LKR {converted.toFixed(2)}</Text>
      </View>
      <Button
        mode='contained'
        style={styles.button}
        onPress={handleTopUp}
        contentStyle={{ paddingVertical: 4 }}>
        <Text style={styles.buttonLabel}>Top Up Wallet</Text>
      </Button>
    </View>
  );
};

export default WalletTopUpForm;
