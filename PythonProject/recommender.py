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

    # Load and clean dataset
    data = pd.read_csv(dataset_path)
    data.columns = data.columns.str.strip()
    if 'address/location' in data.columns:
        data.rename(columns={'address/location': 'address'}, inplace=True)

    required_columns = ['name', 'category', 'tags', 'description', 'duration_hours', 'cost_usd', 'suitable_for']
    for col in required_columns:
        if col not in data.columns:
            raise ValueError(f"Dataset missing required column: {col}")

    optional_columns = ['distance_from_previous_km', 'address', 'opening_hours',
                        'best_time_to_visit', 'notes']
    for col in optional_columns:
        if col not in data.columns:
            data[col] = np.nan if col == 'distance_from_previous_km' else ''

    def parse_cost(val):
        if isinstance(val, str):
            val = val.strip().lower()
            if val == 'free':
                return 0.0
            if '-' in val:
                try:
                    parts = val.replace('$', '').split('-')
                    return (float(parts[0]) + float(parts[1])) / 2
                except ValueError:
                    return np.nan
            try:
                return float(val.replace('$', ''))
            except ValueError:
                return np.nan
        return val

    data['cost_usd'] = data['cost_usd'].apply(parse_cost)
    data['duration_hours'] = pd.to_numeric(data['duration_hours'], errors='coerce')
    data = data.dropna(subset=['cost_usd', 'duration_hours'])

    # Clean and filter
    data = data[data['tags'].notna() & data['tags'].apply(lambda x: isinstance(x, str))]
    data = data[data['suitable_for'].notna() & data['suitable_for'].apply(lambda x: isinstance(x, str))]
    data['tags'] = data['tags'].str.lower().str.replace(' ', '')
    data['suitable_for'] = data['suitable_for'].str.lower().str.replace(' ', '')

    interests_lower = [tag.lower().strip() for tag in interests]
    suitable_for_lower = suitable_for.lower().strip()

    filtered_df = data[data['tags'].apply(lambda x: any(tag in x.split(',') for tag in interests_lower))]
    if suitable_for_lower:
        filtered_df = filtered_df[filtered_df['suitable_for'].apply(
            lambda x: suitable_for_lower in x.split(',') if isinstance(x, str) else False)]

    if filtered_df.empty:
        filtered_df = data[data['tags'].apply(lambda x: any(tag in x.split(',') for tag in interests_lower))]
    if filtered_df.empty and suitable_for_lower:
        filtered_df = data[data['suitable_for'].apply(
            lambda x: suitable_for_lower in x.split(',') if isinstance(x, str) else False)]
    if filtered_df.empty:
        raise ValueError("No activities match the given criteria. Try broadening your interests or suitable_for.")

    # Normalize scoring columns
    filtered_df = filtered_df.copy()
    filtered_df['distance_km'] = 0

    def normalize_series(series):
        min_val, max_val = series.min(), series.max()
        if max_val == min_val:
            return pd.Series([0] * len(series), index=series.index)
        return (series - min_val) / (max_val - min_val)

    filtered_df['distance_km_norm'] = 0
    filtered_df['cost_usd_norm'] = normalize_series(filtered_df['cost_usd'])
    filtered_df['distance_from_prev_norm'] = normalize_series(filtered_df['distance_from_previous_km'].fillna(0))
    filtered_df['score'] = filtered_df['cost_usd_norm'] * 0.6 + filtered_df['distance_from_prev_norm'] * 0.4

    # Budget and time filtering
    max_cost_per_day = budget / days
    max_total_duration = days * 8
    filtered_df = filtered_df[
        (filtered_df['cost_usd'] <= max_cost_per_day + 1e-10) &
        (filtered_df['duration_hours'] <= max_total_duration)
        ]
    if filtered_df.empty:
        raise ValueError("No activities match the given criteria (after budget/time filtering). Try increasing your budget or days.")

    # Separate categories
    attractions_df = filtered_df[filtered_df['category'].str.lower().str.contains('attraction|nightlife')].copy()
    restaurants_df = filtered_df[filtered_df['category'].str.lower().str.contains('restaurant')].copy()
    attractions_df = attractions_df.sort_values('score')
    restaurants_df = restaurants_df.sort_values('score')

    used_attractions = set()
    used_restaurants = set()
    itinerary = []
    total_cost = 0.0
    total_duration = 0.0

    def add_activity(source_df, used_names_set, remaining_duration, remaining_budget):
        for _, row in source_df.iterrows():
            if row['name'] in used_names_set:
                continue
            if remaining_duration >= row['duration_hours'] and remaining_budget >= row['cost_usd']:
                used_names_set.add(row['name'])
                return row, row['cost_usd'], row['duration_hours']
        return None, 0.0, 0.0


    for day_num in range(1, days + 1):
        day_activities = []
        day_cost = 0.0
        day_duration = 0.0

        # Add one activity from each category
        for category_df, used_set in [
            (attractions_df, used_attractions),
            (restaurants_df, used_restaurants),
            (attractions_df, used_attractions),
            (restaurants_df, used_restaurants)
        ]:
            activity, cost, duration = add_activity(category_df, used_set, 8 - day_duration, max_cost_per_day - day_cost)
            if activity is not None:
                day_activities.append(activity)
                day_cost += cost
                day_duration += duration

        # Fill with more
        for _, option in pd.concat([attractions_df, restaurants_df]).sort_values('score').iterrows():
            name = option['name']
            if name in used_attractions or name in used_restaurants:
                continue
            if day_duration + option['duration_hours'] > 8 or day_cost + option['cost_usd'] > max_cost_per_day:
                continue
            day_activities.append(option)
            if 'restaurant' in option['category'].lower():
                used_restaurants.add(name)
            else:
                used_attractions.add(name)
            day_cost += option['cost_usd']
            day_duration += option['duration_hours']

        formatted_activities = [
            {col: act[col] for col in ['name', 'category', 'description', 'cost_usd', 'address',
                                       'notes', 'duration_hours', 'opening_hours', 'best_time_to_visit']}
            for _, act in pd.DataFrame(day_activities).iterrows()
        ]

        itinerary.append({
            'day': day_num,
            'activities': formatted_activities
        })

        total_cost += day_cost
        total_duration += day_duration

    summary = {
        'total_cost_usd': total_cost,
        'total_distance_km': 0,
        'total_duration_hours': total_duration
    }

    return {
        'itinerary': itinerary,
        'summary': summary
    }
