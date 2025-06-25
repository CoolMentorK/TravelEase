import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors.ts'; // Import centralized colors

interface Props {
  balance: number;
}

const WalletBalance: React.FC<Props> = ({ balance }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Balance:</Text>
      <Text style={styles.amount}>LKR {balance.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  amount: {
    color: COLORS.success, // Use centralized color
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  container: {
    backgroundColor: COLORS.lightGray, // Use centralized color
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
  },
  label: {
    color: COLORS.mediumGray, // Use centralized color
    fontSize: 16,
  },
});

export default WalletBalance;
