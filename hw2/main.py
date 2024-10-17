from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)


# Enable CORS for all routes
CORS(app)

cache = {}


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/get_weather', methods=['GET'])
def get_weather():
    try:
        print(request.args)
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
        startTime = request.args.get('startTime')
        endTime = request.args.get('endTime')
        if (latitude, longitude, startTime, endTime) in cache:
            return jsonify(cache[(latitude, longitude, startTime, endTime)])
        
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
       
        units = "imperial"
        timesteps = ["1h", "1d"]
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
        
        if startTime and endTime:
            params["startTime"] = startTime
            params["endTime"] = endTime
        print(startTime)
        print(endTime)
        print(params)

        api_url = 'https://api.tomorrow.io/v4/timelines'
        
        response = requests.get(api_url, params=params)

        if response.status_code == 200:
            cache[(latitude, longitude, startTime, endTime)] = response.json()['data']
            return jsonify(response.json()['data'])
        else:
            print(response.json())
            return jsonify({'error': 'Failed to fetch weather data.'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

