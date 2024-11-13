import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DailyForecast, SearchResult, WeatherDetails } from '../../models';



@Component({
  selector: 'app-day-detail',
  templateUrl: './day-detail.component.html',
  styleUrls: ['./day-detail.component.css']
})
export class DayDetailComponent implements OnInit {
  @Input() dayData: DailyForecast | null = null;
  @Input() weatherData: any = null;
  @Input() searchResult: SearchResult | null = null;
  @Output() goBack = new EventEmitter<void>();

  weatherDetails: WeatherDetails | null = null;

  ngOnInit(): void {
    if (this.weatherData) {
      console.log("Weather data on init:", this.weatherData);
      console.log("Search result on init:", this.searchResult);
      console.log("Day data on init:", this.dayData);

      const dailyTimeline = this.weatherData.timelines.find(
        (timeline: any) => timeline.timestep === '1d'
      );

      if (dailyTimeline) {
        const selectedInterval = dailyTimeline.intervals.find((interval: any) => {
          const intervalDate = new Date(interval.startTime).toLocaleDateString('en-US', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
          return intervalDate === this.dayData?.formattedDate;
        });

        if (selectedInterval) {
          this.weatherDetails = {
            status: this.getStatusFromCode(selectedInterval.values.weatherCode),
            tempMax: selectedInterval.values.temperatureMax,
            tempMin: selectedInterval.values.temperatureMin,
            apparentTemp: selectedInterval.values.temperatureApparent,
            sunRise: selectedInterval.values.sunriseTime,
            sunSet: selectedInterval.values.sunsetTime,
            humidity: selectedInterval.values.humidity,
            windSpeed: selectedInterval.values.windSpeed,
            visibility: selectedInterval.values.visibility,
            cloudCover: selectedInterval.values.cloudCover,
            latitude: this.searchResult?.latitude || 0,
            longitude: this.searchResult?.longitude || 0,
          };
          console.log("this.weatherDetails", this.weatherDetails);
        }
      }

    }
  }

  getStatusFromCode(code: number): string {
    const weatherCodeDescriptions: { [key: number]: string } = {
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
    return weatherCodeDescriptions[code] || 'Unknown';
  }

  handleGoBack(): void {
    this.goBack.emit();
  }

  handlePostToX(): void {
    const city = this.searchResult?.city || '';
    const state = this.searchResult?.state || '';

    const formattedDate = this.dayData?.formattedDate || '';
    const temp = this.weatherDetails?.tempMax || '';
    const summary = this.weatherDetails?.status || '';

    const tweetText = `The temperature in ${city}, ${state} on ${formattedDate} is ${temp}°F. The weather conditions are ${summary} #CSCI571WeatherSearch`;

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
  }
}
