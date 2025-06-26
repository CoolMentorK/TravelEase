import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { COLORS } from '../../constants/colors.ts';

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
}

interface Feedback {
  id: string;
  tourist: string;
  rating: number;
  comment: string;
}

interface Transaction {
  id: string;
  amount: number;
  date: string;
  product: string;
}

interface Summary {
  totalEarnings: number;
  productsSold: number;
  feedbackCount: number;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.orangeAccent,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  container: {
    backgroundColor: COLORS.lightBackground,
    padding: 16,
  },
  editButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editButtonText: {
    color: COLORS.darkBackground,
    fontSize: 13,
    fontWeight: '600',
  },
  heading: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  itemSub: {
    color: COLORS.location,
    fontSize: 14,
    marginTop: 2,
  },
  itemTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  listItem: {
    borderBottomColor: COLORS.borderLightest,
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingBottom: 8,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 18,
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: COLORS.backdrop,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalCloseButton: {
    alignItems: 'center',
    backgroundColor: COLORS.orangeAccent,
    borderRadius: 8,
    marginTop: 8,
    padding: 12,
  },
  modalCloseText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    width: '100%',
  },
  modalInput: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.borderLight,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  modalSaveButton: {
    backgroundColor: COLORS.greenAccent,
  },
  modalTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  plusButton: {
    color: COLORS.greenAccent,
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: COLORS.summaryBackground,
    borderRadius: 12,
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryTitle: {
    color: COLORS.greenAccent,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    color: COLORS.darkBackground,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default function VendorDashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'p1',
      title: 'Tuk-Tuk Safari – Ella',
      category: 'Transport',
      price: 4500,
    },
    {
      id: 'p2',
      title: 'Jungle BBQ Dinner',
      category: 'Food',
      price: 3200,
    },
    {
      id: 'p3',
      title: 'Beach Hut Stay – Mirissa',
      category: 'Accommodation',
      price: 8800,
    },
  ]);

  const [summary] = useState<Summary>({
    totalEarnings: 87200,
    productsSold: 38,
    feedbackCount: 17,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setFeedback([
        {
          id: '1',
          tourist: 'Emily',
          rating: 5,
          comment: 'Amazing tuk-tuk tour around Kandy!',
        },
        {
          id: '2',
          tourist: 'Alex',
          rating: 4,
          comment: 'Good service, a bit late but worth it.',
        },
      ]);

      setTransactions([
        {
          id: '1',
          amount: 5500,
          date: '2025-06-24',
          product: 'Dambulla Cave Tour',
        },
        {
          id: '2',
          amount: 3200,
          date: '2025-06-22',
          product: 'Local Lunch Experience',
        },
      ]);

      setLoading(false);
    }, 800);
  }, []);

  const handleSaveEdit = () => {
    if (!selectedProduct) return;

    const updated = products.map(p =>
      p.id === selectedProduct.id
        ? { ...p, title: editTitle, category: editCategory, price: Number(editPrice) }
        : p,
    );

    setProducts(updated);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Ceylon Adventure Tours</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>💰 Earnings</Text>
          <Text style={styles.summaryValue}>LKR {summary.totalEarnings}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📦 Sold</Text>
          <Text style={styles.summaryValue}>{summary.productsSold}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>⭐ Reviews</Text>
          <Text style={styles.summaryValue}>4.5</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>
        {transactions.map(t => (
          <View key={t.id} style={styles.listItem}>
            <Text style={styles.itemTitle}>{t.product}</Text>
            <Text style={styles.itemSub}>
              LKR {t.amount} • {t.date}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Feedback</Text>
        {feedback.map(f => (
          <View key={f.id} style={styles.listItem}>
            <Text style={styles.itemTitle}>
              {f.tourist} rated {f.rating} ⭐
            </Text>
            <Text style={styles.itemSub}>&quot;{f.comment}&quot;</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Your Products/Services</Text>
          <TouchableOpacity onPress={() => Alert.alert('Add Product', 'Add product form (mock)')}>
            <Text style={styles.plusButton}>＋</Text>
          </TouchableOpacity>
        </View>

        {products.map(p => (
          <View key={p.id} style={styles.listItem}>
            <Text style={styles.itemTitle}>{p.title}</Text>
            <Text style={styles.itemSub}>
              {p.category} • LKR {p.price}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedProduct(p);
                setEditTitle(p.title);
                setEditCategory(p.category);
                setEditPrice(String(p.price));
                setModalVisible(true);
              }}
              style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal visible={modalVisible} animationType='slide' transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit Product</Text>

              <TextInput
                style={styles.modalInput}
                placeholder='Title'
                value={editTitle}
                onChangeText={setEditTitle}
              />
              <TextInput
                style={styles.modalInput}
                placeholder='Category'
                value={editCategory}
                onChangeText={setEditCategory}
              />
              <TextInput
                style={styles.modalInput}
                placeholder='Price'
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType='numeric'
              />

              <TouchableOpacity
                style={[styles.modalCloseButton, styles.modalSaveButton]}
                onPress={handleSaveEdit}>
                <Text style={styles.modalCloseText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}
