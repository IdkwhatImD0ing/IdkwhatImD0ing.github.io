import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { DailyForecast, WeatherData } from '../../models';



@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.css']
})
export class DayViewComponent implements OnInit {
  @Input() weatherData: WeatherData | null = null;
  @Output() daySelected = new EventEmitter<DailyForecast>();

  dailyForecast: DailyForecast[] = [];

  weatherIconMapping: { [key: number]: string } = {
    1000: 'clear_day',
    1100: 'mostly_clear_day',
    1101: 'partly_cloudy_day',
    1102: 'mostly_cloudy',
    1001: 'cloudy',
    2000: 'fog',
    2100: 'fog_light',
    4000: 'drizzle',
    4001: 'rain',
    4200: 'rain_light',
    4201: 'rain_heavy',
    5000: 'snow',
    5001: 'flurries',
    5100: 'snow_light',
    5101: 'snow_heavy',
    6000: 'freezing_drizzle',
    6001: 'freezing_rain',
    6200: 'freezing_rain_light',
    6201: 'freezing_rain_heavy',
    7000: 'ice_pellets',
    7101: 'ice_pellets_heavy',
    7102: 'ice_pellets_light',
    8000: 'tstorm',
  }
  // Define weather code descriptions
  weatherCodeDescriptions: { [key: number]: string } = {
    0: 'Unknown',
    1000: 'Clear',
    1100: 'Mostly Clear',
    1101: 'Partly Cloudy',
    1102: 'Mostly Cloudy',
    1001: 'Cloudy',
    2000: 'Fog',
    2100: 'Light Fog',
    4000: 'Drizzle',
    4001: 'Rain',
    4200: 'Light Rain',
    4201: 'Heavy Rain',
    5000: 'Snow',
    5001: 'Flurries',
    5100: 'Light Snow',
    5101: 'Heavy Snow',
    6000: 'Freezing Drizzle',
    6001: 'Freezing Rain',
    6200: 'Light Freezing Rain',
    6201: 'Heavy Freezing Rain',
    7000: 'Ice Pellets',
    7101: 'Heavy Ice Pellets',
    7102: 'Light Ice Pellets',
    8000: 'Thunderstorm',
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weatherData'] && changes['weatherData'].currentValue) {
      this.weatherData = changes['weatherData'].currentValue;
      if (this.weatherData) {
        this.updateData(this.weatherData);
      }
    }
  }

  ngOnInit(): void {
    if (this.weatherData) {
      this.updateData(this.weatherData);
    }
  }

  updateData(weatherData: WeatherData): void {
    this.dailyForecast = [];
    if (weatherData) {
      const dailyTimeline = weatherData.timelines.find(
        (timeline) => timeline.timestep === '1d'
      );

      dailyTimeline?.intervals.forEach((interval: any, index: number) => {
        const formattedDate = new Date(interval.startTime).toLocaleDateString('en-US', {
          weekday: 'long',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        const weatherCode = interval.values.weatherCode;
        const weatherDescription = this.weatherCodeDescriptions[weatherCode] || 'Unknown';
        const weatherIcon = this.weatherIconMapping[weatherCode] || 'unknown';
        const tempHigh = interval.values.temperatureMax;
        const tempLow = interval.values.temperatureMin;
        const windSpeed = interval.values.windSpeed;

        this.dailyForecast.push({
          index: index + 1,
          formattedDate,
          weatherDescription,
          weatherIcon,
          tempHigh,
          tempLow,
          windSpeed
        });
      });
    }
  }


  onRowClick(day: DailyForecast): void {
    this.daySelected.emit(day);
  }
}
