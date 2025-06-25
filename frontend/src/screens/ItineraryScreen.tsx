import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { FAB, Text, Chip, Searchbar, Snackbar } from 'react-native-paper';
import ItineraryCard from '../components/ItineraryCard.tsx';
import ItineraryInput, { ItineraryFormData } from '../components/ItineraryInput.tsx';
import { itineraryApi, ItineraryItem } from '../services/api.tsx';
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

  const categoryKeys = ['all', 'attraction', 'restaurant', 'hotel', 'transport', 'shopping', 'other'];
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
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
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
          prev.map(item =>
            item.id === editingItem.id ? updatedItem : item
          )
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
    Alert.alert(
      t('itinerary.delete_title'),
      t('itinerary.delete_message'),
      [
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
      ]
    );
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
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item.key}
            onPress={() => setSelectedCategory(item.key)}
            style={styles.categoryChip}
            mode="outlined"
          >
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
        keyExtractor={(item) => item.id}
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
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setInputVisible(true)}
      />
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
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  header: { 
    backgroundColor: '#4CAF50', 
    padding: 20, 
    paddingTop: 40 },
  headerTitle: { 
    fontSize: 28,
    fontWeight: 'bold', 
    color: 'white', 
    marginBottom: 16 
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
  },
  stat: { 
    alignItems: 'center'
  },
  statNumber: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  statLabel: { 
    fontSize: 12, 
    color: 'rgba(255, 255, 255, 0.8)', 
    marginTop: 4 
  },
  searchbar: { 
    margin: 16, 
    elevation: 2 
  },
  categoryFilter: { 
    marginBottom: 8 
  },
  categoryList: { 
    paddingHorizontal: 16 
  },
  categoryChip: { 
    marginHorizontal: 4 
  },
  listContainer: { 
    paddingBottom: 80 
  },
  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 60 
  },
  emptyTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#666', 
    marginBottom: 8 
  },
  emptySubtitle: { 
    fontSize: 16, 
    color: '#999', 
    textAlign: 'center' 
  },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#4CAF50' },
  snackbar: { backgroundColor: '#4CAF50' },
});