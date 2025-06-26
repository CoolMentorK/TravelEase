import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';
import { COLORS } from '../constants/colors.ts';

interface ItineraryItem {
  id: string;
  title: string;
  location: string;
  time: string;
  duration: string;
  category: string;
  price?: string;
  rating?: number;
}

interface ItineraryCardProps {
  item: ItineraryItem;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
  },
  card: {
    borderRadius: 12,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  categoryChip: {
    backgroundColor: COLORS.transparent, // Use COLORS.transparent
    borderWidth: 1, // Ensure border is visible for outlined Chip
  },
  content: {
    padding: 16,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  duration: {
    color: COLORS.textPrimary, // Use COLORS.textPrimary
    fontSize: 14,
    fontWeight: '600',
  },
  durationContainer: {
    marginRight: 24,
  },
  durationLabel: {
    color: COLORS.textSecondary, // Use COLORS.textSecondary
    fontSize: 12,
    marginBottom: 2,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  location: {
    color: COLORS.location, // Use COLORS.location
    fontSize: 14,
  },
  price: {
    color: COLORS.price, // Use COLORS.price
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: COLORS.textPrimary, // Use COLORS.textPrimary
    fontSize: 14,
    fontWeight: '600',
  },
  timeContainer: {
    marginRight: 24,
  },
  timeLabel: {
    color: COLORS.textSecondary, // Use COLORS.textSecondary
    fontSize: 12,
    marginBottom: 2,
  },
  title: {
    color: COLORS.textPrimary, // Use COLORS.textPrimary
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  titleContainer: {
    flex: 1,
  },
});

export default function ItineraryCard({ item, onPress, onEdit, onDelete }: ItineraryCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'attraction':
        return COLORS.categoryAttraction;
      case 'restaurant':
        return COLORS.categoryRestaurant;
      case 'hotel':
        return COLORS.categoryHotel;
      case 'transport':
        return COLORS.categoryTransport;
      default:
        return COLORS.categoryDefault;
    }
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
          <View style={styles.actions}>
            {onEdit && (
              <IconButton icon='pencil' size={20} onPress={onEdit} iconColor={COLORS.location} />
            )}
            {onDelete && (
              <IconButton
                icon='delete'
                size={20}
                onPress={onDelete}
                iconColor={COLORS.categoryAttraction}
              />
            )}
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Time</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Duration</Text>
            <Text style={styles.duration}>{item.duration}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Chip
            mode='outlined'
            textStyle={{ color: getCategoryColor(item.category) }}
            style={[styles.categoryChip, { borderColor: getCategoryColor(item.category) }]}>
            {item.category}
          </Chip>
          {item.price && <Text style={styles.price}>{item.price}</Text>}
        </View>
      </Card.Content>
    </Card>
  );
}
