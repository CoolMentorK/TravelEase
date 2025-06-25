import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { sendPayment } from '../../services/walletService.ts';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 12,
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
});

const PaymentScreen = () => {
  const [vendorId, setVendorId] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    const amt = parseFloat(amount);
    if (!vendorId || amt <= 0 || isNaN(amt)) {
      Alert.alert('Invalid Input', 'Vendor ID and amount are required.');
      return;
    }

    try {
      await sendPayment(vendorId, amt);
      Alert.alert('Success', 'Payment sent successfully!');
      setVendorId('');
      setAmount('');
    } catch (err) {
      Alert.alert('Error', 'Payment failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan & Pay</Text>

      <TextInput
        style={styles.input}
        placeholder='Vendor ID'
        value={vendorId}
        onChangeText={setVendorId}
      />

      <TextInput
        style={styles.input}
        placeholder='Amount (LKR)'
        keyboardType='numeric'
        value={amount}
        onChangeText={setAmount}
      />

      <Button title='Send Payment' onPress={handlePayment} />
    </View>
  );
};

export default PaymentScreen;
