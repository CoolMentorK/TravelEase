import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { FAB, Text, Chip, Searchbar, Snackbar } from 'react-native-paper';
import ItineraryCard from '../components/ItineraryCard.tsx';
import type { ItineraryFormData } from '../components/ItineraryInput.tsx';
import ItineraryInput from '../components/ItineraryInput.tsx';
import type { ItineraryItem } from '../services/api.tsx';
import { itineraryApi } from '../services/api.tsx';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/colors.ts';
import { useRoute } from '@react-navigation/native';

export default function ItineraryScreen() {
  const { t } = useTranslation();
  const route = useRoute();
  // @ts-ignore
  const plannedItinerary = route.params?.plannedItinerary;

  // Default itinerary if none is passed
  const defaultItinerary = {
    itinerary: [
      {
        day: 1,
        activities: [
          {
            address: 'Unawatuna',
            best_time_to_visit: 'Evening',
            category: 'attraction',
            cost_usd: 0.0,
            description: 'Well-known for swimming and nightlife',
            duration_hours: 4,
            name: 'Unawatuna Beach',
            notes: 'Beach bars and events',
            opening_hours: 'All day',
          },
          {
            address: 'Galle Fort',
            best_time_to_visit: 'Evening',
            category: 'nightlife',
            cost_usd: 15.0,
            description: 'Trendy rooftop bar with burgers and drinks',
            duration_hours: 2,
            name: 'Rocket Burger Rooftop',
            notes: 'Live music',
            opening_hours: '5pm-12am',
          },
          {
            address: 'Galle Fort',
            best_time_to_visit: 'Evening',
            category: 'nightlife',
            cost_usd: 22.0,
            description: 'Modern bar with seafood and cocktails',
            duration_hours: 2,
            name: 'The Tuna & The Crab',
            notes: 'Signature cocktails',
            opening_hours: '12pm-11pm',
          },
        ],
      },
    ],
    metadata: {
      num_activities: 3,
      processing_time_ms: 60.0,
    },
    summary: {
      total_cost_usd: 37.0,
      total_distance_km: 0,
      total_duration_hours: 8.0,
    },
  };

  const itineraryToShow = plannedItinerary || defaultItinerary;

  // Modern planned itinerary display (always)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trip</Text>
      </View>
      <FlatList
        data={itineraryToShow.itinerary}
        keyExtractor={item => `day-${item.day}`}
        renderItem={({ item }) => (
          <View style={styles.daySection}>
            <Text style={styles.dayTitle}>Day {item.day}</Text>
            {item.activities.map((act: any, idx: number) => (
              <View key={idx} style={styles.activityCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.activityName}>{act.name}</Text>
                  <Text style={styles.activityCategory}>{act.category}</Text>
                </View>
                <Text style={styles.activityDesc}>{act.description}</Text>
                <View style={styles.cardDetailsRow}>
                  <Text style={styles.activityDetail}>Address: {act.address}</Text>
                  <Text style={styles.activityDetail}>Best Time: {act.best_time_to_visit}</Text>
                </View>
                <View style={styles.cardDetailsRow}>
                  <Text style={styles.activityDetail}>Opening Hours: {act.opening_hours}</Text>
                  <Text style={styles.activityDetail}>Duration: {act.duration_hours} hours</Text>
                </View>
                <Text style={styles.activityDetail}>Notes: {act.notes}</Text>
                <Text style={styles.activityCost}>Cost: ${act.cost_usd.toFixed(2)} USD</Text>
              </View>
            ))}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>Total Cost: ${itineraryToShow.summary.total_cost_usd.toFixed(2)} USD</Text>
            <Text style={styles.summaryText}>Total Duration: {itineraryToShow.summary.total_duration_hours} hours</Text>
            <Text style={styles.summaryText}>Total Distance: {itineraryToShow.summary.total_distance_km} km</Text>
            <Text style={styles.summaryText}>Number of Activities: {itineraryToShow.metadata.num_activities}</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  stat: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    minWidth: 90,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statNumber: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.secondaryText,
    fontSize: 13,
    marginTop: 4,
  },
  searchbar: {
    elevation: 2,
    margin: 18,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  categoryFilter: {
    marginBottom: 10,
  },
  categoryList: {
    paddingHorizontal: 18,
  },
  categoryChip: {
    marginHorizontal: 4,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 20,
  },
  categoryChipSelected: {
    marginHorizontal: 4,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 20,
  },
  categoryChipText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 90,
  },
  fab: {
    backgroundColor: COLORS.accent,
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 20,
    borderRadius: 32,
    elevation: 4,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: COLORS.secondaryText,
    fontSize: 16,
    textAlign: 'center',
  },
  snackbar: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  daySection: {
    marginTop: 18,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  activityName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  activityCategory: {
    fontSize: 13,
    color: COLORS.accent,
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 2,
  },
  activityDetail: {
    fontSize: 13,
    color: COLORS.mediumGray,
  },
  activityCost: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: 'bold',
    marginTop: 4,
  },
  summarySection: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
});

// test