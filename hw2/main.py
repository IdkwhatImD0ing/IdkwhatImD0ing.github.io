from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)


# Enable CORS for all routes
CORS(app)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/get_weather', methods=['GET'])
def get_weather():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    
    if not latitude or not longitude:
        return jsonify({'error': 'Both latitude (lat) and longitude (lon) parameters are required.'}), 400

    # Our requirements from doc
    fields = [
        "temperature",
        "temperatureApparent",
        "temperatureMin",
        "temperatureMax",
        "windSpeed",
        "windDirection",
        "humidity",
        "pressureSeaLevel",
        "uvIndex",
        "weatherCode",
        "precipitationProbability",
        "precipitationType",
        "sunriseTime",
        "sunsetTime",
        "visibility",
        "moonPhase",
        "cloudCover"
    ]
    timesteps = ["1h", "1d"]
    units = "imperial"
    timezone = "America/New_York"
    location = f"{latitude},{longitude}"
    
    params = {
        "apikey": "2kx6qbSm5Iz5XGiUlYKUj9rXnyVyQq35",
        "fields": fields,
        "timesteps": timesteps,
        "units": units,
        "timezone": timezone,
        "location": location
    }

    api_url = 'https://api.tomorrow.io/v4/timelines'
    
    response = requests.get(api_url, params=params)

    if response.status_code == 200:
        return jsonify(response.json()['data'])
    else:
        return jsonify({'error': 'Failed to fetch weather data.'}), 500

if __name__ == "__main__":
    app.run(debug=True)

