import pandas as pd
import numpy as np

def recommend_itinerary(location, interests, days, budget, suitable_for, dataset_path='data/destinations.csv'):
    # Input validation
    if not isinstance(location, str) or not location.strip():
        raise ValueError("Location must be a non-empty string")
    if not isinstance(interests, list) or not interests:
        raise ValueError("Interests must be a non-empty list of strings")
    if not isinstance(days, int) or days <= 0:
        raise ValueError("Days must be a positive integer")
    if not isinstance(budget, (int, float)) or budget <= 0:
        raise ValueError("Budget must be a positive number")
    if not isinstance(suitable_for, str):
        raise ValueError("Suitable_for must be a string")

    # Load dataset
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip()
    # Rename 'address/location' to 'address' for consistency
    if 'address/location' in df.columns:
        df.rename(columns={'address/location': 'address'}, inplace=True)

    # Ensure required columns exist
    required_columns = ['name', 'category', 'tags', 'description', 'duration_hours', 'cost_usd', 'suitable_for']
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"Dataset missing required column: {col}")

    # Add optional columns if missing
    optional_columns = ['distance_from_previous_km', 'address', 'opening_hours',
                        'best_time_to_visit', 'notes']
    for col in optional_columns:
        if col not in df.columns:
            df[col] = np.nan if col == 'distance_from_previous_km' else ''

    # Parse cost_usd (handle 'Free', ranges, etc.)
    def parse_cost(val):
        if isinstance(val, str):
            val = val.strip().lower()
            if val == 'free':
                return 0.0
            if '-' in val:
                try:
                    parts = val.replace('$','').split('-')
                    return (float(parts[0]) + float(parts[1])) / 2
                except:
                    return np.nan
            try:
                return float(val.replace('$',''))
            except:
                return np.nan
        return val
    df['cost_usd'] = df['cost_usd'].apply(parse_cost)
    df['duration_hours'] = pd.to_numeric(df['duration_hours'], errors='coerce')

    # Drop rows with NaN in cost_usd or duration_hours
    df = df.dropna(subset=['cost_usd', 'duration_hours'])

    # Clean and filter dataset
    df = df[df['tags'].notna() & df['tags'].apply(lambda x: isinstance(x, str))]
    df = df[df['suitable_for'].notna() & df['suitable_for'].apply(lambda x: isinstance(x, str))]

    # Normalize tags and suitable_for fields to lowercase and strip spaces
    df['tags'] = df['tags'].str.lower().str.replace(' ', '')
    df['suitable_for'] = df['suitable_for'].str.lower().str.replace(' ', '')

    interests_lower = [tag.lower().strip() for tag in interests]
    suitable_for_lower = suitable_for.lower().strip()

    # Loosened filtering logic
    filtered = df[df['tags'].apply(lambda x: any(tag in x.split(',') for tag in interests_lower))]
    if suitable_for_lower:
        filtered = filtered[filtered['suitable_for'].apply(lambda x: suitable_for_lower in x.split(',') if isinstance(x, str) else False)]

    if filtered.empty:
        # Try just interests
        filtered = df[df['tags'].apply(lambda x: any(tag in x.split(',') for tag in interests_lower))]
    if filtered.empty and suitable_for_lower:
        # Try just suitable_for
        filtered = df[df['suitable_for'].apply(lambda x: suitable_for_lower in x.split(',') if isinstance(x, str) else False)]
    if filtered.empty:
        raise ValueError("No activities match the given criteria. Try broadening your interests or suitable_for.")

    df = filtered.copy()

    # No geolocation: set distance_km to 0
    df['distance_km'] = 0

    # Normalize scoring columns
    def normalize_series(series):
        min_val, max_val = series.min(), series.max()
        if max_val == min_val:
            return pd.Series([0] * len(series), index=series.index)
        return (series - min_val) / (max_val - min_val)

    df['distance_km_norm'] = 0  # all zeros as no location distance
    df['cost_usd_norm'] = normalize_series(df['cost_usd'])
    df['distance_from_prev_norm'] = normalize_series(df['distance_from_previous_km'].fillna(0))

    # Adjust scoring weights accordingly (e.g., cost 0.6, distance_from_prev 0.4)
    df['score'] = df['cost_usd_norm'] * 0.6 + df['distance_from_prev_norm'] * 0.4

    # Filter by budget per day and reasonable duration per day (8 hours max per day)
    max_cost_per_day = budget / days
    max_duration_hours = days * 8
    df = df[(df['cost_usd'] <= max_cost_per_day + 1e-10) & (df['duration_hours'] <= max_duration_hours)]

    if df.empty:
        raise ValueError("No activities match the given criteria (after budget/time filtering). Try increasing your budget or days.")

    # Separate attractions and restaurants
    attractions = df[df['category'].str.lower().str.contains('attraction') | df['category'].str.lower().str.contains('nightlife')].copy()
    restaurants = df[df['category'].str.lower().str.contains('restaurant')].copy()

    # Sort by score (best first)
    attractions = attractions.sort_values('score')
    restaurants = restaurants.sort_values('score')

    used_attractions = set()
    used_restaurants = set()
    itinerary = []
    total_cost = 0.0
    total_duration = 0.0
    for day in range(1, days + 1):
        day_activities = []
        day_cost = 0.0
        day_duration = 0.0
        # Morning attraction
        for idx, row in attractions.iterrows():
            if row['name'] not in used_attractions and day_duration + row['duration_hours'] <= 8 and day_cost + row['cost_usd'] <= max_cost_per_day:
                day_activities.append(row)
                used_attractions.add(row['name'])
                day_cost += row['cost_usd']
                day_duration += row['duration_hours']
                break
        # Lunch restaurant
        for idx, row in restaurants.iterrows():
            if row['name'] not in used_restaurants and day_duration + row['duration_hours'] <= 8 and day_cost + row['cost_usd'] <= max_cost_per_day:
                day_activities.append(row)
                used_restaurants.add(row['name'])
                day_cost += row['cost_usd']
                day_duration += row['duration_hours']
                break
        # Afternoon attraction
        for idx, row in attractions.iterrows():
            if row['name'] not in used_attractions and day_duration + row['duration_hours'] <= 8 and day_cost + row['cost_usd'] <= max_cost_per_day:
                day_activities.append(row)
                used_attractions.add(row['name'])
                day_cost += row['cost_usd']
                day_duration += row['duration_hours']
                break
        # Dinner restaurant
        for idx, row in restaurants.iterrows():
            if row['name'] not in used_restaurants and day_duration + row['duration_hours'] <= 8 and day_cost + row['cost_usd'] <= max_cost_per_day:
                day_activities.append(row)
                used_restaurants.add(row['name'])
                day_cost += row['cost_usd']
                day_duration += row['duration_hours']
                break
        # Fill remaining time with more attractions or restaurants if possible
        for idx, row in pd.concat([attractions, restaurants]).sort_values('score').iterrows():
            if row['name'] in used_attractions or row['name'] in used_restaurants:
                continue
            if day_duration + row['duration_hours'] > 8 or day_cost + row['cost_usd'] > max_cost_per_day:
                continue
            day_activities.append(row)
            if row['category'].lower().find('restaurant') >= 0:
                used_restaurants.add(row['name'])
            else:
                used_attractions.add(row['name'])
            day_cost += row['cost_usd']
            day_duration += row['duration_hours']
        # Format output
        itinerary.append({
            'day': day,
            'activities': [
                {col: act[col] for col in ['name', 'category', 'description', 'cost_usd', 'address', 'notes', 'duration_hours', 'opening_hours', 'best_time_to_visit']}
                for act in day_activities
            ]
        })
        total_cost += day_cost
        total_duration += day_duration
    summary = {
        'total_cost_usd': total_cost,
        'total_distance_km': 0,
        'total_duration_hours': total_duration,
    }
    return {'itinerary': itinerary, 'summary': summary}