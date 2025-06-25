import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';

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

export default function ItineraryCard({ item, onPress, onEdit, onDelete }: ItineraryCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'attraction': return '#FF6B6B';
      case 'restaurant': return '#4ECDC4';
      case 'hotel': return '#45B7D1';
      case 'transport': return '#96CEB4';
      default: return '#A8A8A8';
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
              <IconButton
                icon="pencil"
                size={20}
                onPress={onEdit}
                iconColor="#666"
              />
            )}
            {onDelete && (
              <IconButton
                icon="delete"
                size={20}
                onPress={onDelete}
                iconColor="#FF6B6B"
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
            mode="outlined"
            textStyle={{ color: getCategoryColor(item.category) }}
            style={[styles.categoryChip, { borderColor: getCategoryColor(item.category) }]}
          >
            {item.category}
          </Chip>
          {item.price && (
            <Text style={styles.price}>{item.price}</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
  },
  details: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeContainer: {
    marginRight: 24,
  },
  timeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  durationContainer: {
    marginRight: 24,
  },
  durationLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  duration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryChip: {
    backgroundColor: 'transparent',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
}); 