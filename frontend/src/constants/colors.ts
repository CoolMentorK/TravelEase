export const COLORS = {
  primary: '#155B7F', // Deep blue for headers/titles
  accent: '#F2C94C', // Start of orange gradient, also logo text decoration
  accentGradient: ['#F6B042', '#F2994A'], // Orange gradient for buttons
  background: '#fff', // White background
  surface: '#fff',
  text: '#212121',
  secondaryText: '#757575',
  inputBorder: '#D1D5DB', // Muted blue/gray for input borders
  icon: '#7B8D9E', // Muted blue/gray for icons
  link: '#2AB3B1', // Teal/blue-green for links
  success: '#2e7d32', // Success text color
  error: '#d32f2f',
  lightGray: '#f0f0f0', // Modal input background
  mediumGray: '#555', // Gray text color
  borderGray: '#ccc', // Border color for inputs (from WalletTopUpForm)
  // Colors from ItineraryCard
  textPrimary: '#333', // Primary text color
  textSecondary: '#999', // Secondary text color, also loading text
  location: '#666', // Location text color, also item subtext
  price: '#4CAF50', // Price text color
  categoryAttraction: '#FF6B6B', // Attraction category color
  categoryRestaurant: '#4ECDC4', // Restaurant category color
  categoryHotel: '#45B7D1', // Hotel category color
  categoryTransport: '#96CEB4', // Transport category color
  categoryDefault: '#A0A0A0', // Default category color, also dark mode placeholder
  transparent: 'transparent', // Transparent background
  // Colors from ItineraryInput
  white: '#fff', // Modal background, also input background, button text
  cancelBorder: '#666', // Cancel button border
  errorText: '#FF6B6B', // Error text color
  submitButton: '#4CAF50', // Submit button background
  // Colors from PlanTripForm
  errorTextPlan: 'red', // Error text color for PlanTripForm
  // Colors from HomeScreen
  subtitleText: 'rgba(255,255,255,0.85)', // Subtitle text color
  // Colors from LoginScreen/SignupScreen
  black: '#000000', // Shadow color, social button border/icon
  darkBackground: '#121212', // Dark mode background
  lightBackground: '#F5F5F5', // Light mode background
  blueDark: '#007AB8', // Dark mode logo
  orangeDark: '#FFAA5A', // Dark mode button
  orangeAccent: '#F2994A', // Light mode button, vendor link
  grayLight: '#E0E0E0', // Dark mode title, Google icon
  greenAccent: '#4FB993', // Dark mode borders, forgot text, plus button
  darkSurface: '#2A2A2A', // Dark mode input/social button background
  borderLight: '#DDD', // Light mode input border
  // Colors from SettingsScreen
  danger: '#e74c3c', // Logout button background
  // Colors from VendorDashboardScreen
  borderLightest: '#EEE', // List item border
  backdrop: 'rgba(0,0,0,0.3)', // Modal backdrop
  summaryBackground: '#E6F4F1', // Summary card background
  // Colors from VendorLoginScreen
  inputBackground: '#F9F9F9', // Input container background
  inputBorderLight: '#D1D1D1', // Input container border
  // Colors from TransactionHistoryScreen
  lightestGray: '#f8f8f8', // Transaction item background
} as const;
