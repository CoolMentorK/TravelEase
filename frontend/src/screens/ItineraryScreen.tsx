import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { FAB, Text, Card, Chip, IconButton, Searchbar, Snackbar } from 'react-native-paper';
import ItineraryCard from '../components/ItineraryCard.tsx';
import ItineraryInput, { ItineraryFormData } from '../components/ItineraryInput.tsx';
import { itineraryApi, ItineraryItem } from '../services/api.tsx';

export default function ItineraryScreen() {
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItineraryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inputVisible, setInputVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const categories = ['All', 'Attraction', 'Restaurant', 'Hotel', 'Transport', 'Shopping', 'Other'];

  // Load sample data on mount (will be replaced with API call)
  useEffect(() => {
    loadItineraryData();
  }, []);

  const loadItineraryData = async () => {
    setLoading(true);
    try {
      // For now, use sample data. Later this will be an API call
      const sampleData: ItineraryItem[] = [
        {
          id: '1',
          title: 'Sigiriya Rock Fortress',
          location: 'Sigiriya, Central Province',
          time: '08:00 AM',
          duration: '3 hours',
          category: 'Attraction',
          price: 'LKR 5,000',
          rating: 4.8,
        },
        {
          id: '2',
          title: 'Traditional Sri Lankan Lunch',
          location: 'Kandy City',
          time: '12:00 PM',
          duration: '1 hour',
          category: 'Restaurant',
          price: 'LKR 1,200',
          rating: 4.5,
        },
        {
          id: '3',
          title: 'Temple of the Tooth',
          location: 'Kandy',
          time: '02:00 PM',
          duration: '2 hours',
          category: 'Attraction',
          price: 'LKR 1,500',
          rating: 4.7,
        },
      ];
      setItineraryItems(sampleData);
      setFilteredItems(sampleData);
    } catch (error) {
      showSnackbar('Failed to load itinerary data');
      console.error('Error loading itinerary data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, itineraryItems]);

  const filterItems = () => {
    let filtered = itineraryItems;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
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
        rating: Math.floor(Math.random() * 2) + 4, // Random rating for demo
      };

      // In a real app, this would be an API call
      // await itineraryApi.addItemToItinerary(itineraryId, newItem);
      
      setItineraryItems(prev => [...prev, newItem]);
      showSnackbar('Item added successfully');
    } catch (error) {
      showSnackbar('Failed to add item');
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

        // In a real app, this would be an API call
        // await itineraryApi.updateItineraryItem(itineraryId, editingItem.id, updatedItem);
        
        setItineraryItems(prev =>
          prev.map(item =>
            item.id === editingItem.id
              ? updatedItem
              : item
          )
        );
        setEditingItem(null);
        showSnackbar('Item updated successfully');
      } catch (error) {
        showSnackbar('Failed to update item');
        console.error('Error updating item:', error);
      }
    }
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this itinerary item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, this would be an API call
              // await itineraryApi.deleteItineraryItem(itineraryId, itemId);
              
              setItineraryItems(prev => prev.filter(item => item.id !== itemId));
              showSnackbar('Item deleted successfully');
            } catch (error) {
              showSnackbar('Failed to delete item');
              console.error('Error deleting item:', error);
            }
          },
        },
      ]
    );
  };

  const handleItemPress = (item: ItineraryItem) => {
    // Navigate to item details (to be implemented)
    console.log('Item pressed:', item);
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
      <Text style={styles.headerTitle}>My Itinerary</Text>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{itineraryItems.length}</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>LKR {getTotalCost().toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Cost</Text>
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
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item}
            onPress={() => setSelectedCategory(item)}
            style={styles.categoryChip}
            mode="outlined"
          >
            {item}
          </Chip>
        )}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No itinerary items yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button to add your first activity
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <Searchbar
        placeholder="Search activities..."
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
            onPress={() => handleItemPress(item)}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  categoryFilter: {
    marginBottom: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginHorizontal: 4,
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
  snackbar: {
    backgroundColor: '#4CAF50',
  },
}); 