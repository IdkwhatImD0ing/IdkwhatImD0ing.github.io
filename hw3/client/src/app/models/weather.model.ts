interface DailyForecast {
    index: number;
    formattedDate: string;
    weatherDescription: string;
    weatherIcon: string;
    tempHigh: number;
    tempLow: number;
    windSpeed: number;
}

interface WeatherDetails {
    status: string;
    tempMax: number;
    tempMin: number;
    apparentTemp: number;
    sunRise: string;
    sunSet: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    cloudCover: number;
    latitude: number;
    longitude: number;
}

interface WeatherData {
    timelines: any[];
}

export type { DailyForecast, WeatherDetails, WeatherData };
