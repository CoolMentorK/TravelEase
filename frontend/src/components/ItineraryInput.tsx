import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Chip, Portal, Modal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface ItineraryInputProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: ItineraryFormData) => void;
  initialData?: Partial<ItineraryFormData>;
}

export interface ItineraryFormData {
  title: string;
  location: string;
  time: string;
  duration: string;
  category: string;
  price?: string;
  notes?: string;
}

const categories = ['attraction', 'restaurant', 'hotel', 'transport', 'shopping', 'other'];

export default function ItineraryInput({ visible, onDismiss, onSubmit, initialData }: ItineraryInputProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ItineraryFormData>({
    title: initialData?.title || '',
    location: initialData?.location || '',
    time: initialData?.time || '',
    duration: initialData?.duration || '',
    category: initialData?.category || 'attraction',
    price: initialData?.price || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Partial<ItineraryFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ItineraryFormData> = {};
    if (!formData.title.trim()) newErrors.title = t('itinerary.title_required');
    if (!formData.location.trim()) newErrors.location = t('itinerary.location_required');
    if (!formData.time.trim()) newErrors.time = t('itinerary.time_required');
    if (!formData.duration.trim()) newErrors.duration = t('itinerary.duration_required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onDismiss();
      setFormData({
        title: '',
        location: '',
        time: '',
        duration: '',
        category: 'attraction',
        price: '',
        notes: '',
      });
      setErrors({});
    }
  };

  const updateFormData = (field: keyof ItineraryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>{t('itinerary.add_item')}</Text>

          <TextInput
            label={t('itinerary.title_label')}
            value={formData.title}
            onChangeText={(text) => updateFormData('title', text)}
            style={styles.input}
            error={!!errors.title}
            mode="outlined"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          <TextInput
            label={t('itinerary.location_label')}
            value={formData.location}
            onChangeText={(text) => updateFormData('location', text)}
            style={styles.input}
            error={!!errors.location}
            mode="outlined"
          />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

          <View style={styles.row}>
            <TextInput
              label={t('itinerary.time_label')}
              value={formData.time}
              onChangeText={(text) => updateFormData('time', text)}
              style={[styles.input, styles.halfInput]}
              error={!!errors.time}
              mode="outlined"
              placeholder={t('itinerary.time_placeholder')}
            />
            <TextInput
              label={t('itinerary.duration_label')}
              value={formData.duration}
              onChangeText={(text) => updateFormData('duration', text)}
              style={[styles.input, styles.halfInput]}
              error={!!errors.duration}
              mode="outlined"
              placeholder={t('itinerary.duration_placeholder')}
            />
          </View>
          {(errors.time || errors.duration) && (
            <Text style={styles.errorText}>{errors.time || errors.duration}</Text>
          )}

          <Text style={styles.sectionTitle}>{t('itinerary.category_label')}</Text>
          <View style={styles.categoryContainer}>
            {categories.map((categoryKey) => (
              <Chip
                key={categoryKey}
                selected={formData.category === categoryKey}
                onPress={() => updateFormData('category', categoryKey)}
                style={styles.categoryChip}
                mode="outlined"
              >
                {t(`itinerary.${categoryKey}`)}
              </Chip>
            ))}
          </View>

          <TextInput
            label={t('itinerary.price_label')}
            value={formData.price}
            onChangeText={(text) => updateFormData('price', text)}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            placeholder={t('itinerary.price_placeholder')}
          />

          <TextInput
            label={t('itinerary.notes_label')}
            value={formData.notes}
            onChangeText={(text) => updateFormData('notes', text)}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder={t('itinerary.notes_placeholder')}
          />

          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={onDismiss} style={[styles.button, styles.cancelButton]}>
              {t('itinerary.cancel_button')}
            </Button>
            <Button mode="contained" onPress={handleSubmit} style={[styles.button, styles.submitButton]}>
              {t('itinerary.submit_button')}
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 8,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryChip: {
    margin: 4,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: '#666',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
});