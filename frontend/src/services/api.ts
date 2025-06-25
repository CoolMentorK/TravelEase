import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export interface ItineraryItem {
  id: string;
  title: string;
  location: string;
  time: string;
  duration: string;
  category: string;
  price?: string;
  rating?: number;
  notes?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  items: ItineraryItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Itinerary API functions
export const itineraryApi = {
  // Get all itineraries
  getItineraries: async (): Promise<Itinerary[]> => {
    try {
      const response = await api.get<ApiResponse<Itinerary[]>>('/itineraries');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch itineraries:', error);
      throw error;
    }
  },

  // Create new itinerary
  createItinerary: async (itinerary: Partial<Itinerary>): Promise<Itinerary> => {
    try {
      const response = await api.post<ApiResponse<Itinerary>>('/itineraries', itinerary);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create itinerary:', error);
      throw error;
    }
  },

  // Update itinerary
  updateItinerary: async (id: string, updates: Partial<Itinerary>): Promise<Itinerary> => {
    try {
      const response = await api.put<ApiResponse<Itinerary>>(`/itineraries/${id}`, updates);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update itinerary:', error);
      throw error;
    }
  },

  // Delete itinerary
  deleteItinerary: async (id: string): Promise<void> => {
    try {
      await api.delete(`/itineraries/${id}`);
    } catch (error) {
      console.error('Failed to delete itinerary:', error);
      throw error;
    }
  },
};

export default api; 