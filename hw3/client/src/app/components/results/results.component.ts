import { Component, Input, OnInit, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
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
  weatherData: any = null;
  selectedDay: DailyForecast | null = null;
  selectedTab: string = 'dayView';
  isFirstRender: boolean = true;
  mainViewState: 'active' | 'inactive' = 'active';
  detailViewState: 'active' | 'inactive' = 'inactive';
  isFavorite: boolean = false;
  errorMessage: string = '';

  constructor(private favoritesService: FavoritesService, private http: HttpClient) { }

  ngOnInit(): void {
    // Initial fetch if searchResult is already set
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
    this.http.get(`http://localhost:3000/get_weather?latitude=${latitude}&longitude=${longitude}`)
      .subscribe({
        next: (weatherData) => {
          console.log("Weather data fetched:", weatherData);
          this.weatherData = weatherData;
        },
        error: (error) => {
          console.error('Error fetching weather:', error);
          alert('Failed to fetch weather information.');
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
    alert('Showing detailed information!');
  }

  onDaySelected(day: DailyForecast): void {
    this.mainViewState = 'inactive';
    this.detailViewState = 'active';
    setTimeout(() => {
      this.selectedDay = day;

    }, 100);
  }

  goBack(): void {
    this.detailViewState = 'inactive';
    this.mainViewState = 'active';

    setTimeout(() => {
      this.selectedDay = null;

    }, 100);
  }

  postToX(): void {
    alert('Posted to X!');
  }

  selectTab(tab: string): void {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
    }
  }
}
