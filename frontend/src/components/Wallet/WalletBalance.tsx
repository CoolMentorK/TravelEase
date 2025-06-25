import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors.ts';

interface Props {
  balance: number;
}

const styles = StyleSheet.create({
  amount: {
    color: COLORS.success,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  container: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
  },
  label: {
    color: COLORS.mediumGray,
    fontSize: 16,
  },
});

const WalletBalance: React.FC<Props> = ({ balance }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Balance:</Text>
      <Text style={styles.amount}>LKR {balance.toFixed(2)}</Text>
    </View>
  );
};

export default WalletBalance;
