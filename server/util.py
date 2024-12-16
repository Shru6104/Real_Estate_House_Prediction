import json
import pickle
import numpy as np

__locations = None
__data_columns = None
__model = None


def get_estimated_price(location, total_sqft, bath, bhk):
    try:
        # Try to get the index of the location in the data columns
        loc_index = __data_columns.index(location.lower())
    except:
        # If location is not found, set the index to -1 (invalid location)
        loc_index = -1

    # Prepare input data for the model
    x = np.zeros(len(__data_columns))
    x[0] = total_sqft  # Square footage
    x[1] = bath  # Number of bathrooms
    x[2] = bhk  # Number of bedrooms

    # If location is found, set the appropriate index to 1
    if loc_index >= 0:
        x[loc_index] = 1
    else:
        return "Location not found. Please choose a valid location."

    # Return the predicted price, rounded to 2 decimal places
    return round(__model.predict([x])[0], 2)


def load_saved_artifacts():
    print("loading saved artifacts...start")
    global __data_columns
    global __locations

    with open("C:/Users/SHRUTI/Downloads/BHP/server/artifacts/columns.json", "r") as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]  # first 3 columns are sqft, bath, bhk

    global __model
    if __model is None:
        with open('C:/Users/SHRUTI/Downloads/BHP/server/artifacts/banglore_home_prices_model.pickle', 'rb') as f:
            __model = pickle.load(f)
    print("loading saved artifacts...done")

def get_location_names():
    return __locations

def get_data_columns():
    return __data_columns

if __name__ == '__main__':
    load_saved_artifacts()
    print(get_location_names())
    print(get_estimated_price('Indira Nagar', 1000, 3, 3))

