import { Component, Input, OnInit, AfterViewInit, SimpleChanges, OnChanges, Output, EventEmitter, input } from '@angular/core';
import { SearchResult, DailyForecast } from '../../models';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { FavoritesService } from '../../services/favorites.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  animations: [
    trigger('mainViewAnimation', [
      state('active', style({ transform: 'translateX(0%)' })),
      state('inactive', style({ transform: 'translateX(-100%)' })),

      transition('inactive => active', [
        animate('100ms ease-in-out')
      ]),

      transition('active => inactive', [
        animate('100ms ease-in-out')
      ]),

      transition('void => active', [
        style({ transform: 'translateX(-100%)' }),
        animate('100ms ease-in-out')
      ]),

      transition('active => void', [
        animate('100ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ]),

    trigger('detailViewAnimation', [
      state('active', style({ transform: 'translateX(0%)' })),
      state('inactive', style({ transform: 'translateX(100%)' })),

      transition('inactive => active', [
        animate('100ms ease-in-out')
      ]),

      transition('active => inactive', [
        animate('100ms ease-in-out')
      ]),

      transition('void => active', [
        style({ transform: 'translateX(100%)' }),
        animate('100ms ease-in-out')
      ]),

      transition('active => void', [
        animate('100ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ]),
  ]

})
export class ResultsComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() searchResult: SearchResult | null = null;
  @Input() errorMessage: string = '';
  @Output() resultsLoaded = new EventEmitter<void>();
  @Output() setErrorMessage = new EventEmitter<string>();
  weatherData: any = null;
  selectedDay: DailyForecast | null = null;
  selectedTab: string = 'dayView';
  isFirstRender: boolean = true;
  mainViewState: 'active' | 'inactive' = 'active';
  detailViewState: 'active' | 'inactive' = 'inactive';
  isFavorite: boolean = false;

  previousDay: DailyForecast | null = null;
  isLoading: boolean = false;
  progressValue: number = 0;
  progressInterval: any;

  constructor(private favoritesService: FavoritesService, private http: HttpClient) { }

  ngOnInit(): void {
    if (this.searchResult) {
      this.fetchWeatherData(this.searchResult.latitude, this.searchResult.longitude);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResult'] && changes['searchResult'].currentValue) {
      const newSearchResult: SearchResult = changes['searchResult'].currentValue;
      this.fetchWeatherData(newSearchResult.latitude, newSearchResult.longitude);
      this.checkIfFavorite();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isFirstRender = false;
      this.checkIfFavorite();
    }, 0);
  }

  fetchWeatherData(latitude: number, longitude: number): void {
    this.isLoading = true;
    this.progressValue = 0;
    console.log("Fetching weather data...");
    this.resultsLoaded.emit();
    if (this.selectedDay) {
      this.selectedDay = null;
      this.mainViewState = 'active';
      this.detailViewState = 'inactive';
    }

    this.progressInterval = setInterval(() => {
      if (this.progressValue < 90) {
        this.progressValue += 10;
      }
    }, 100);

    this.http.get(`https://express-server-205907697136.us-central1.run.app/get_weather?latitude=${latitude}&longitude=${longitude}`)
      .subscribe({
        next: (weatherData) => {
          clearInterval(this.progressInterval);
          this.progressValue = 100;
          this.setErrorMessage.emit('');

          setTimeout(() => {
            this.isLoading = false;



            console.log("Weather data fetched:", weatherData);
            this.weatherData = weatherData;
          }, 500);
        },
        error: (error) => {
          clearInterval(this.progressInterval);
          this.progressValue = 0;
          this.isLoading = false;
          console.error('Error fetching weather:', error);
          this.setErrorMessage.emit('An error occurred please try again later.');
        }
      });
  }

  getTitle(): string {
    return this.searchResult ? `Forecast at ${this.searchResult.city}, ${this.searchResult.state}` : 'Forecast Details';
  }

  checkIfFavorite(): void {
    if (this.searchResult && this.searchResult.city && this.searchResult.state) {
      this.favoritesService.checkFavorite(this.searchResult.city, this.searchResult.state).subscribe((response) => {
        this.isFavorite = response.isFavorite;
      });
    }
  }

  onFavorite(): void {
    if (this.searchResult && this.searchResult.city && this.searchResult.state) {
      if (this.isFavorite) {
        this.favoritesService.removeFavorite(this.searchResult.city, this.searchResult.state).subscribe(() => {
          this.isFavorite = false;
        });
      } else {
        this.favoritesService.addFavorite(this.searchResult.city, this.searchResult.state, this.searchResult.longitude, this.searchResult.latitude).subscribe(() => {
          this.isFavorite = true;
        });
      }
    }
  }

  onDetails(): void {
    console.log(this.weatherData?.timelines[0].intervals[0].values);
    if (!this.previousDay) {
      const newDay = {
        index: 1,
        formattedDate: new Date(this.weatherData?.timelines[0].intervals[0].startTime).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }),
        weatherDescription: this.weatherData?.timelines[0].intervals[0].values.weatherCode,
        weatherIcon: this.weatherData?.timelines[0].intervals[0].values.weatherCode,
        tempHigh: this.weatherData?.timelines[0].intervals[0].values.temperatureMax,
        tempLow: this.weatherData?.timelines[0].intervals[0].values.temperatureMin,
        windSpeed: this.weatherData?.timelines[0].intervals[0].values.windSpeed,
      }
      console.log("Default day selected:", newDay);
      this.onDaySelected(newDay);
    }
    else {
      this.onDaySelected(this.previousDay);
    }
  }

  onDaySelected(day: DailyForecast): void {
    this.mainViewState = 'inactive';
    this.detailViewState = 'active';
    console.log(day);
    setTimeout(() => {
      this.selectedDay = day;
      this.previousDay = day;

    }, 100);
  }

  goBack(): void {
    this.detailViewState = 'inactive';
    this.mainViewState = 'active';

    setTimeout(() => {
      this.selectedDay = null;

    }, 100);
  }



  selectTab(tab: string): void {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
    }
  }
}
