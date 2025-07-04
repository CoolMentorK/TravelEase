import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors.ts';
import getEnvVars from '../../config.tsx';

const { API_BASE_URL, AI_API_URL } = getEnvVars();

interface PlanTripFormProps {
  onCancel: () => void;
  navigation: any; // You can improve this typing if you're using TS with navigation types
}

export interface PlanTripFormData {
  location: string;
  interests: string[];
  days: number;
  budget: number;
  suitable_for: string;
}

interface Activity {
  address: string;
  best_time_to_visit: string;
  category: string;
  cost_usd: number;
  description: string;
  duration_hours: number;
  name: string;
  notes: string;
  opening_hours: string;
}

interface ItineraryDay {
  day: number;
  activities: Activity[];
}

interface ApiResponse {
  itinerary: ItineraryDay[];
  metadata: {
    num_activities: number;
    processing_time_ms: number;
  };
  summary: {
    total_cost_usd: number;
    total_distance_km: number;
    total_duration_hours: number;
  };
}

const styles = StyleSheet.create({
  activityCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
  },
  activityDetail: {
    color: '#333',
    fontSize: 14,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 20,
    padding: 20,
  },
  error: {
    color: COLORS.errorTextPlan,
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  itineraryContainer: {
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  saveButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default function PlanTripForm({ onCancel, navigation }: PlanTripFormProps) {
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');
  const [days, setDays] = useState('1');
  const [budget, setBudget] = useState('');
  const [suitableFor, setSuitableFor] = useState('');
  const [error, setError] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [selectedItems, setSelectedItems] = useState<Activity[]>([]);

  const handleSubmit = async () => {
    if (!location || !interests || !days || !budget || !suitableFor) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setItinerary(null);
    setSelectedItems([]);

    const requestData: PlanTripFormData = {
      location,
      interests: interests
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      days: parseInt(days, 10),
      budget: parseFloat(budget),
      suitable_for: suitableFor,
    };

    try {
      const response = await fetch(`${AI_API_URL}/api/itinerary/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error('Failed to fetch itinerary.');

      const data: ApiResponse = await response.json();
      setItinerary(data.itinerary);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    }
  };

  const toggleSelect = (activity: Activity) => {
    setSelectedItems(prev =>
      prev.some(item => item.name === activity.name)
        ? prev.filter(item => item.name !== activity.name)
        : [...prev, activity],
    );
  };

  const handleSaveItinerary = async () => {
    if (!selectedItems.length) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');

      const response = await fetch(`${API_BASE_URL}/api/itinerary/save-generated`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location,
          interests: interests.split(',').map(i => i.trim()),
          days: parseInt(days),
          budget: parseFloat(budget),
          suitable_for: suitableFor,
          itinerary: [
            {
              day: 1,
              activities: selectedItems,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error('Failed to save itinerary.');

      Alert.alert('Success', 'Itinerary saved successfully!');
      setSelectedItems([]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save itinerary.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Plan My Trip</Text>
        <TextInput
          label='Location'
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          mode='outlined'
        />
        <TextInput
          label='Interests (comma separated)'
          value={interests}
          onChangeText={setInterests}
          style={styles.input}
          mode='outlined'
        />
        <TextInput
          label='Days'
          value={days}
          onChangeText={setDays}
          style={styles.input}
          mode='outlined'
          keyboardType='numeric'
        />
        <TextInput
          label='Budget (USD)'
          value={budget}
          onChangeText={setBudget}
          style={styles.input}
          mode='outlined'
          keyboardType='numeric'
        />
        <TextInput
          label='Suitable For'
          value={suitableFor}
          onChangeText={setSuitableFor}
          style={styles.input}
          mode='outlined'
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.buttonRow}>
          <Button mode='outlined' onPress={onCancel} style={styles.button}>
            Cancel
          </Button>
          <Button mode='contained' onPress={handleSubmit} style={styles.button}>
            Plan Trip
          </Button>
        </View>
      </View>

      {itinerary && (
        <View style={styles.itineraryContainer}>
          <Text style={styles.title}>Recommendations</Text>
          {itinerary.map(day => (
            <View key={day.day}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 8 }}>
                Day {day.day}
              </Text>
              {day.activities.map((activity, index) => {
                const isSelected = selectedItems.some(item => item.name === activity.name);
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.activityCard}
                    onPress={() => toggleSelect(activity)}>
                    <Text style={styles.activityTitle}>
                      {isSelected ? '✅ ' : ''}
                      {activity.name}
                    </Text>
                    <Text style={styles.activityDetail}>📍 {activity.address}</Text>
                    <Text style={styles.activityDetail}>
                      🕓 {activity.best_time_to_visit} ({activity.opening_hours})
                    </Text>
                    <Text style={styles.activityDetail}>💲 ${activity.cost_usd}</Text>
                    <Text style={styles.activityDetail}>⏱️ {activity.duration_hours} hrs</Text>
                    <Text style={styles.activityDetail}>📝 {activity.description}</Text>
                    <Text style={styles.activityDetail}>🔖 {activity.notes}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
          {selectedItems.length > 0 && (
            <Button mode='contained' onPress={handleSaveItinerary} style={styles.saveButton}>
              Save Selected Itinerary
            </Button>
          )}
        </View>
      )}
    </ScrollView>
  );
}
