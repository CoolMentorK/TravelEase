import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import type { Transaction } from '../../services/walletService.ts';
import { getTransactions } from '../../services/walletService.ts';
import { COLORS } from '../../constants/colors.ts';

const styles = StyleSheet.create({
  amount: {
    color: COLORS.success,
  },
  container: {
    padding: 16,
  },
  date: {
    color: COLORS.mediumGray,
    fontSize: 12,
  },
  item: {
    backgroundColor: COLORS.lightestGray,
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  type: {
    fontWeight: 'bold',
  },
  vendor: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontStyle: 'italic',
  },
});

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err: unknown) {
      console.error(
        'Failed to load transactions:',
        err instanceof Error ? err.message : 'Unknown error',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-void
    void loadTransactions(); // Suppress ESLint warning for ignored promise
  }, []);

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.item}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.amount}>LKR {item.amountLKR.toFixed(2)}</Text>
      <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
      {item.vendorId && <Text style={styles.vendor}>Vendor ID: {item.vendorId}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {loading ? (
        <ActivityIndicator accessibilityLabel='Loading transactions' />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default TransactionHistoryScreen;
