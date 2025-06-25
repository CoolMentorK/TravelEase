import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { FAB, Text, Chip, Searchbar, Snackbar } from 'react-native-paper';
import ItineraryCard from '../components/ItineraryCard.tsx';
import type { ItineraryFormData } from '../components/ItineraryInput.tsx';
import ItineraryInput from '../components/ItineraryInput.tsx';
import type { ItineraryItem } from '../services/api.tsx';
import { itineraryApi } from '../services/api.tsx';
import { useTranslation } from 'react-i18next';

export default function ItineraryScreen() {
  const { t } = useTranslation();
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItineraryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inputVisible, setInputVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const categoryKeys = [
    'all',
    'attraction',
    'restaurant',
    'hotel',
    'transport',
    'shopping',
    'other',
  ];
  const categories = categoryKeys.map(key => ({ key, label: t(`itinerary.${key}`) }));

  useEffect(() => {
    loadItineraryData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, itineraryItems]);

  const loadItineraryData = async () => {
    setLoading(true);
    try {
      const sampleData: ItineraryItem[] = [
        {
          id: '1',
          title: 'Sigiriya Rock Fortress',
          location: 'Sigiriya, Central Province',
          time: '08:00 AM',
          duration: '3 hours',
          category: 'attraction',
          price: 'LKR 5,000',
          rating: 4.8,
        },
        {
          id: '2',
          title: 'Traditional Sri Lankan Lunch',
          location: 'Kandy City',
          time: '12:00 PM',
          duration: '1 hour',
          category: 'restaurant',
          price: 'LKR 1,200',
          rating: 4.5,
        },
        {
          id: '3',
          title: 'Temple of the Tooth',
          location: 'Kandy',
          time: '02:00 PM',
          duration: '2 hours',
          category: 'attraction',
          price: 'LKR 1,500',
          rating: 4.7,
        },
      ];
      setItineraryItems(sampleData);
      setFilteredItems(sampleData);
    } catch (error) {
      showSnackbar(t('itinerary.load_failed'));
      console.error('Error loading itinerary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = itineraryItems;

    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category.toLowerCase() === selectedCategory);
    }

    setFilteredItems(filtered);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAddItem = async (data: ItineraryFormData) => {
    try {
      const newItem: ItineraryItem = {
        id: Date.now().toString(),
        ...data,
        rating: Math.floor(Math.random() * 2) + 4,
      };
      setItineraryItems(prev => [...prev, newItem]);
      showSnackbar(t('itinerary.item_added'));
    } catch (error) {
      showSnackbar(t('itinerary.add_failed'));
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = (item: ItineraryItem) => {
    setEditingItem(item);
    setInputVisible(true);
  };

  const handleUpdateItem = async (data: ItineraryFormData) => {
    if (editingItem) {
      try {
        const updatedItem: ItineraryItem = {
          ...editingItem,
          ...data,
        };
        setItineraryItems(prev =>
          prev.map(item => (item.id === editingItem.id ? updatedItem : item)),
        );
        setEditingItem(null);
        showSnackbar(t('itinerary.item_updated'));
      } catch (error) {
        showSnackbar(t('itinerary.update_failed'));
        console.error('Error updating item:', error);
      }
    }
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(t('itinerary.delete_title'), t('itinerary.delete_message'), [
      { text: t('itinerary.cancel'), style: 'cancel' },
      {
        text: t('itinerary.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            setItineraryItems(prev => prev.filter(item => item.id !== itemId));
            showSnackbar(t('itinerary.item_deleted'));
          } catch (error) {
            showSnackbar(t('itinerary.delete_failed'));
            console.error('Error deleting item:', error);
          }
        },
      },
    ]);
  };

  const getTotalCost = () => {
    return itineraryItems
      .filter(item => item.price)
      .reduce((total, item) => {
        const price = parseInt(item.price?.replace(/[^0-9]/g, '') || '0');
        return total + price;
      }, 0);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{t('itinerary.my_itinerary')}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{itineraryItems.length}</Text>
          <Text style={styles.statLabel}>{t('itinerary.items')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>LKR {getTotalCost().toLocaleString()}</Text>
          <Text style={styles.statLabel}>{t('itinerary.total_cost')}</Text>
        </View>
      </View>
    </View>
  );

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item.key}
            onPress={() => setSelectedCategory(item.key)}
            style={styles.categoryChip}
            mode='outlined'>
            {item.label}
          </Chip>
        )}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{t('itinerary.empty_title')}</Text>
      <Text style={styles.emptySubtitle}>{t('itinerary.empty_subtitle')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <Searchbar
        placeholder={t('itinerary.search_activities')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      {renderCategoryFilter()}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ItineraryCard
            item={item}
            onPress={() => console.log('Item pressed:', item)}
            onEdit={() => handleEditItem(item)}
            onDelete={() => handleDeleteItem(item.id)}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
      />
      <FAB icon='plus' style={styles.fab} onPress={() => setInputVisible(true)} />
      <ItineraryInput
        visible={inputVisible}
        onDismiss={() => {
          setInputVisible(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleUpdateItem : handleAddItem}
        initialData={editingItem || undefined}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryChip: {
    marginHorizontal: 4,
  },
  categoryFilter: {
    marginBottom: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptySubtitle: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#666',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fab: { backgroundColor: '#4CAF50', bottom: 0, margin: 16, position: 'absolute', right: 0 },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  searchbar: {
    elevation: 2,
    margin: 16,
  },
  snackbar: { backgroundColor: '#4CAF50' },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

// test
