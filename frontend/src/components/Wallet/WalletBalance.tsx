import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors.ts';

interface Props {
  balance: number;
}

const styles = StyleSheet.create({
  amount: {
    color: COLORS.success,
    fontSize: 28,
    fontWeight: '700',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.borderGray,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    paddingHorizontal: 24,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 6,
  },
});

const WalletBalance: React.FC<Props> = ({ balance }) => (
  <View style={styles.container}>
    <Text style={styles.label}>Current Balance</Text>
    <Text style={styles.amount}>LKR {balance.toFixed(2)}</Text>
  </View>
);

export default WalletBalance;
