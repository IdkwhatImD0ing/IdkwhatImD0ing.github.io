import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import WindBarb from 'highcharts/modules/windbarb';
WindBarb(Highcharts);

@Component({
  selector: 'app-meteogram',
  templateUrl: './meteogram.component.html',
  styleUrls: ['./meteogram.component.css']
})
export class MeteogramComponent implements OnInit {
  @Input() weatherData: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
    if (this.weatherData) {
      this.parseData();
    }
  }

  parseData(): void {
    const hourlyData = this.weatherData.timelines.find(
      (timeline: any) => timeline.timestep === '1h'
    );

    if (!hourlyData) {
      // Handle error
      return;
    }

    const temperatures: any[] = [];
    const humidities: any[] = [];
    const pressures: any[] = [];
    const winds: any[] = [];

    hourlyData.intervals.forEach((interval: any) => {
      const time = new Date(interval.startTime).getTime();
      const temp = interval.values.temperature;
      const humidity = interval.values.humidity;
      const pressure = interval.values.pressureSeaLevel;
      const windSpeed = interval.values.windSpeed;
      const windDirection = interval.values.windDirection;

      temperatures.push([time, temp]);
      humidities.push([time, humidity]);
      pressures.push([time, pressure]);
      winds.push({
        x: time,
        value: windSpeed,
        direction: windDirection
      });
    });

    this.chartOptions = {
      chart: {
        type: 'spline',
        height: 400,
        scrollablePlotArea: {
          minWidth: 720,
        },
        marginBottom: 70,
        marginRight: 40,
        marginTop: 50,
        plotBorderWidth: 1,
        alignTicks: false,
      },
      title: {
        text: 'Hourly Weather (For Next 5 Days)',
        align: 'center',
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<small>{point.x:%A, %b %e, %H:%M}</small><br/>',
        pointFormat:
          '<b>{series.name}</b>: {point.y}{series.tooltipOptions.valueSuffix}<br/>',
      },
      xAxis: [
        {
          type: 'datetime',
          tickInterval: 8 * 36e5, // two hours
          minorTickInterval: 36e5, // one hour
          tickLength: 0,
          gridLineWidth: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)',
          startOnTick: false,
          endOnTick: false,
          minPadding: 0,
          maxPadding: 0,
          offset: 30,
          showLastLabel: true,
          labels: {
            format: '{value:%H}',
          },
          crosshair: true,
        },
        {
          linkedTo: 0,
          type: 'datetime',
          tickInterval: 24 * 3600 * 1000,
          labels: {
            format:
              '<span style="font-size: 12px; font-weight: bold;">{value:%a}</span>, {value:%b} {value:%d}',
            align: 'left',
            x: 3,
            y: 8,
          },
          opposite: true,
          tickLength: 20,
          gridLineWidth: 1,
        },
      ],
      yAxis: [
        {
          title: {
            text: '',
          },
          labels: {
            format: '{value}°',
            style: {
              fontSize: '10px',
            },
            x: -3,
          },
          plotLines: [
            {
              value: 0,
              color: '#BBBBBB',
              width: 1,
              zIndex: 2,
            },
          ],
          maxPadding: 0.3,
          minRange: 8,
          tickInterval: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)',
        },
        {
          title: {
            text: '',
          },
          labels: {
            format: '{value} mm',
            style: {
              fontSize: '10px',
            },
          },
          min: 0,
          gridLineWidth: 0,
          opposite: false,
        },
        {
          title: {
            text: 'inHg',
            offset: 0,
            align: 'high',
            rotation: 0,
            style: {
              fontSize: '10px',
              color: 'orange',
            },
            textAlign: 'left',
          },
          labels: {
            style: {
              fontSize: '8px',
              color: 'orange',
              fontWeight: 'bold',
            },
            y: 2,
            x: 3,
          },
          gridLineWidth: 0,
          opposite: true,
          showLastLabel: true,
        },
      ],
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          pointPlacement: 'between',
        },
      },
      series: [
        {
          name: 'Temperature',
          data: temperatures,
          type: 'spline',
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
          zIndex: 1,
          color: '#FF3333',
          negativeColor: '#48AFE8',
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} °F</b><br/>',
          },
        },
        {
          name: 'Humidity',
          color: '#48AFE8',
          data: humidities,
          type: 'column',
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.point.index % 2 === 0) {
                return `${Math.round(this.y ?? 0)}`;
              } else {
                return null;
              }
            },
            style: {
              fontSize: '10px',
              color: 'darkgrey',
              textShadow: '1px 1px 2px black',
              fontWeight: 'normal',
            },
          },
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} %</b><br/>',
          },
        },
        {
          name: 'Air Pressure',
          color: 'orange',
          data: pressures,
          type: 'spline',
          marker: {
            enabled: false,
          },
          dashStyle: 'ShortDot',
          yAxis: 2,
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} inHg</b><br/>',
          },
        },
        {
          name: 'Wind',
          type: 'windbarb',
          data: winds,
          color: Highcharts.getOptions()?.colors?.[1],
          lineWidth: 1.5,
          vectorLength: 18,
          yOffset: -15,
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.value} mph</b><br/>',
          },
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }
}
