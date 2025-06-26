import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

interface PlanTripFormProps {
  onPlanTrip: (data: PlanTripFormData) => void;
  onCancel: () => void;
}

export interface PlanTripFormData {
  location: string;
  interests: string[];
  days: number;
  budget: number;
  suitable_for: string;
}

export default function PlanTripForm({ onPlanTrip, onCancel }: PlanTripFormProps) {
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');
  const [days, setDays] = useState('1');
  const [budget, setBudget] = useState('');
  const [suitableFor, setSuitableFor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!location || !interests || !days || !budget || !suitableFor) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    onPlanTrip({
      location,
      interests: interests
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      days: parseInt(days, 10),
      budget: parseFloat(budget),
      suitable_for: suitableFor,
    });
  };

  return (
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
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
