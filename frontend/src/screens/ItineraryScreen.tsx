import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { COLORS } from '../constants/colors.ts';
import { useRoute } from '@react-navigation/native';

// Define types for itinerary data
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

interface Day {
  day: number;
  activities: Activity[];
}

interface Itinerary {
  itinerary: Day[];
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

type RouteParams = {
  plannedItinerary?: Itinerary;
};

const styles = StyleSheet.create({
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 10,
    padding: 14,
  },
  activityCategory: {
    color: COLORS.accent,
    fontSize: 13,
    marginBottom: 2,
  },
  activityCost: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  activityDesc: {
    color: COLORS.secondaryText,
    fontSize: 14,
    marginBottom: 2,
  },
  activityDetail: {
    color: COLORS.mediumGray,
    fontSize: 13,
  },
  activityName: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: 'bold',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  daySection: {
    marginBottom: 8,
    marginHorizontal: 16,
    marginTop: 18,
  },
  dayTitle: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  header: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    padding: 24,
    paddingTop: 48,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 18,
  },
  listContent: {
    paddingBottom: 40,
  },
  summarySection: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
  },
  summaryText: {
    color: COLORS.text,
    fontSize: 15,
    marginBottom: 2,
  },
  summaryTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default function ItineraryScreen() {
  const route = useRoute<RouteParams>();
  const plannedItinerary = route.params?.plannedItinerary;

  // Default itinerary if none is passed
  const defaultItinerary: Itinerary = {
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
            {item.activities.map((act: Activity, idx: number) => (
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
            <Text style={styles.summaryText}>
              Total Cost: ${itineraryToShow.summary.total_cost_usd.toFixed(2)} USD
            </Text>
            <Text style={styles.summaryText}>
              Total Duration: {itineraryToShow.summary.total_duration_hours} hours
            </Text>
            <Text style={styles.summaryText}>
              Total Distance: {itineraryToShow.summary.total_distance_km} km
            </Text>
            <Text style={styles.summaryText}>
              Number of Activities: {itineraryToShow.metadata.num_activities}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
