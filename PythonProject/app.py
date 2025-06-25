import pandas as pd
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from recommender import recommend_itinerary
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

DATASET_PATH = os.path.join(os.path.dirname(__file__), 'data', 'destinations.csv')

def convert_types(obj):
    if isinstance(obj, dict):
        return {k: convert_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_types(i) for i in obj]
    elif isinstance(obj, (np.integer, )):
        return int(obj)
    elif isinstance(obj, (np.floating, )):
        return float(obj)
    else:
        return obj

@app.route('/api/itinerary/suggest', methods=['POST'])
def suggest_itinerary():
    start_time = time.time()
    data = request.json
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400

    try:
        location = data.get('location', '').strip()
        interests = data.get('interests', [])
        days = int(data.get('days', 1))
        budget = float(data.get('budget', 100))
        suitable_for = data.get('suitable_for', '').strip()

        if not location:
            return jsonify({'error': 'Location is required'}), 400
        if not interests or not isinstance(interests, list):
            return jsonify({'error': 'At least one interest is required'}), 400

        itinerary = recommend_itinerary(location, interests, days, budget, suitable_for, dataset_path=DATASET_PATH)
        itinerary = convert_types(itinerary)
        response = {
            'itinerary': itinerary['itinerary'],
            'summary': itinerary['summary'],
            'metadata': {
                'num_activities': sum(len(day['activities']) for day in itinerary['itinerary']),
                'processing_time_ms': (time.time() - start_time) * 1000
            }
        }
        return jsonify(response), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except FileNotFoundError as fnf:
        return jsonify({'error': str(fnf)}), 500
    except Exception as e:
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
