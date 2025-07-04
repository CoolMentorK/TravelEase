import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors.ts';
import getEnvVars from '../../config.tsx';
import { MaterialIcons } from '@expo/vector-icons';

const { API_BASE_URL } = getEnvVars();

export default function ItineraryScreen() {
  const [loading, setLoading] = useState(true);
  const [itineraries, setItineraries] = useState<any[]>([]);

  const fetchItineraries = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('User not logged in');

      const decoded: any = jwtDecode(token);
      const userId = decoded.id;

      const response = await axios.get(`${API_BASE_URL}/api/itinerary/user/${userId}`);
      setItineraries(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch itineraries.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleDeleteItinerary = async (id: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this itinerary?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/api/itinerary/${id}`);
              setItineraries(prev => prev.filter(i => i._id !== id));
            } catch (err) {
              Alert.alert('Error', 'Failed to delete itinerary.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleDeleteItem = async (itineraryId: string, itemId: string) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this itinerary item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await axios.delete(
              `${API_BASE_URL}/api/itinerary/${itineraryId}/items/${itemId}`,
            );
            const updated = res.data.data;
            setItineraries(prev => prev.map(it => (it._id === itineraryId ? updated : it)));
          } catch (err) {
            Alert.alert('Error', 'Failed to delete item.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size='large' color={COLORS.primary} />
        <Text>Loading itineraries...</Text>
      </View>
    );
  }

  if (!itineraries.length) {
    return (
      <View style={styles.container}>
        <Text style={{ color: COLORS.error, textAlign: 'center', marginTop: 40 }}>
          No itineraries found.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={itineraries}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <View style={styles.itineraryCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.headerTitle}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleDeleteItinerary(item._id)}>
              <MaterialIcons name='delete' size={22} color={COLORS.error} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.date}>
            {new Date(item.startDate).toLocaleDateString()} —{' '}
            {new Date(item.endDate).toLocaleDateString()}
          </Text>

          {item.items.map((act: any, idx: number) => (
            <View key={idx} style={styles.activityCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.activityName}>{act.title}</Text>
                <TouchableOpacity onPress={() => handleDeleteItem(item._id, act._id)}>
                  <MaterialIcons name='remove-circle' size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.activityLocation}>{act.location}</Text>
              <Text style={styles.activityDesc}>{act.notes}</Text>
              <Text style={styles.activityMeta}>
                ⏰ {act.time} • ⌛ {act.duration} • 💵 ${act.price}
              </Text>
            </View>
          ))}

          <View style={styles.summarySection}>
            <Text style={styles.summaryText}>Total Cost: ${item.totalCost}</Text>
            <Text style={styles.summaryText}>Tags: {item.tags.join(', ')}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  activityCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    padding: 10,
  },
  activityDesc: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginBottom: 2,
  },
  activityLocation: {
    color: COLORS.accent,
    fontSize: 13,
    marginBottom: 2,
  },
  activityMeta: {
    color: COLORS.mediumGray,
    fontSize: 12,
  },
  activityName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  date: {
    color: COLORS.mediumGray,
    fontSize: 12,
    marginBottom: 12,
  },
  description: {
    color: COLORS.secondaryText,
    fontSize: 13,
    marginBottom: 4,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  itineraryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  summarySection: {
    borderTopColor: COLORS.lightGray,
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 10,
  },
  summaryText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    marginBottom: 2,
  },
});
