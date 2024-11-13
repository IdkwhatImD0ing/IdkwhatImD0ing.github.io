// src/app/daily-temp-chart/daily-temp-chart.component.ts
import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);

interface WeatherData {
  timelines: any[];
}

@Component({
  selector: 'app-daily-temp-chart',
  templateUrl: './daily-temp-chart.component.html',
  styleUrls: ['./daily-temp-chart.component.css']
})
export class DailyTempChartComponent implements OnInit {
  @Input() weatherData: WeatherData | null = null;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

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


  ngOnInit(): void {
    if (this.weatherData) {
      const dailyData = this.weatherData.timelines.find(
        (timeline: any) => timeline.timestep === '1d',
      );
      const temperatureData = dailyData.intervals.map((interval: any) => {
        const time = new Date(interval.startTime).getTime();
        const tempMin = interval.values.temperatureMin;
        const tempMax = interval.values.temperatureMax;
        return [time, tempMin, tempMax];
      });

      this.chartOptions = {
        chart: {
          type: 'arearange',
          scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 1,
          },
        },
        title: {
          text: 'Temperature Ranges (Min, Max)',
          align: 'center',
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: '',
          },
        },
        yAxis: {
          title: {
            text: '',
          },
        },
        tooltip: {
          shared: true,
          valueSuffix: '°',
          xDateFormat: '%Y-%m-%d',
        },
        legend: {
          enabled: false,
        },
        series: [
          {
            name: 'Temperature Range',
            type: 'arearange',
            data: temperatureData,
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#ef9f34'], // High temperature color
                [1, '#79aef8'], // Low temperature color
              ],
            },
            fillOpacity: 0.3,
            lineWidth: 1,
            marker: {
              enabled: true,
              fillColor: '#79aef8',
              lineColor: '#79aef8',
              lineWidth: 1,
              symbol: 'circle',
              radius: 4,
            },
          },
        ],
        credits: {
          enabled: false,
        },
      };
    }
  }
}
