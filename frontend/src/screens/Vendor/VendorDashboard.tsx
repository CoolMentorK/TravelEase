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
    Keyboard
} from 'react-native';

export default function VendorDashboardScreen() {
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([
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

    const [summary, setSummary] = useState({
        totalEarnings: 87200,
        productsSold: 38,
        feedbackCount: 17,
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
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

        const updated = products.map((p) =>
            p.id === selectedProduct.id
                ? { ...p, title: editTitle, category: editCategory, price: Number(editPrice) }
                : p
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
                {transactions.map((t) => (
                    <View key={t.id} style={styles.listItem}>
                        <Text style={styles.itemTitle}>{t.product}</Text>
                        <Text style={styles.itemSub}>LKR {t.amount} • {t.date}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Recent Feedback</Text>
                {feedback.map((f) => (
                    <View key={f.id} style={styles.listItem}>
                        <Text style={styles.itemTitle}>{f.tourist} rated {f.rating} ⭐</Text>
                        <Text style={styles.itemSub}>"{f.comment}"</Text>
                    </View>
                ))}
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Your Products/Services</Text>
                    <TouchableOpacity onPress={() => alert('Add product form (mock)')}>
                        <Text style={styles.plusButton}>＋</Text>
                    </TouchableOpacity>
                </View>

                {products.map((p) => (
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
                            style={styles.editButton}
                        >
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Edit Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalBackdrop}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Edit Product</Text>

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Title"
                                value={editTitle}
                                onChangeText={setEditTitle}
                            />
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Category"
                                value={editCategory}
                                onChangeText={setEditCategory}
                            />
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Price"
                                value={editPrice}
                                onChangeText={setEditPrice}
                                keyboardType="numeric"
                            />

                            <TouchableOpacity
                                style={[styles.modalCloseButton, { backgroundColor: '#4FB993' }]}
                                onPress={handleSaveEdit}
                            >
                                <Text style={styles.modalCloseText}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalCloseText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    heading: {
        fontSize: 26,
        fontWeight: '700',
        color: '#005F8D',
        textAlign: 'center',
        marginBottom: 24,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 8,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#E6F4F1',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    summaryTitle: {
        fontSize: 14,
        color: '#4FB993',
        fontWeight: '600',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#121212',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F2994A',
        marginBottom: 12,
    },
    listItem: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 8,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#005F8D',
    },
    itemSub: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    editButton: {
        marginTop: 6,
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: '#F2C94C',
        borderRadius: 8,
    },
    editButtonText: {
        fontSize: 13,
        color: '#121212',
        fontWeight: '600',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#999',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    plusButton: {
        fontSize: 24,
        color: '#4FB993',
        fontWeight: 'bold',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#005F8D',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: '#F0F0F0',
    },
    modalCloseButton: {
        backgroundColor: '#F2994A',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    modalCloseText: {
        color: '#fff',
        fontWeight: '600',
    },
});
