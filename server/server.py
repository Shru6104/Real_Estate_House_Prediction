from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import util

app = Flask(__name__)

# Enable CORS for the entire app
CORS(app)

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    try:
        locations = util.get_location_names()
        print(f"Locations loaded: {locations}")  # Log locations for debugging
        response = jsonify({
            'locations': locations
        })
        return response
    except Exception as e:
        print(f"Error loading locations: {str(e)}")  # Log error if any
        return jsonify({'error': f"Error loading locations: {str(e)}"}), 500


@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    try:
        # Get JSON data from request
        data = request.get_json()
        print(f"Received data: {data}")  # Log the incoming data

        # Validate incoming data
        if 'total_sqft' not in data or 'location' not in data or 'bhk' not in data or 'bath' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        # Extract values from data
        total_sqft = float(data['total_sqft'])
        location = data['location'].lower()  # Ensure the location is lowercase
        bhk = int(data['bhk'])
        bath = int(data['bath'])

        # Call utility function to get the estimated price
        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)

        if estimated_price is None:
            print("Estimated price is None.")  # Log if price calculation fails
            return jsonify({'error': 'Could not calculate estimated price. Please check the data.'}), 400

        # Return estimated price
        response = jsonify({
            'estimated_price': estimated_price
        })
        return response

    except Exception as e:
        print(f"Error in predicting home price: {str(e)}")  # Log the error
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


if __name__ == "__main__":
    # Load saved artifacts (columns and model) when starting the server
    print("Starting Python Flask Server for Home Price Prediction...")
    util.load_saved_artifacts()
    app.run(debug=True)



