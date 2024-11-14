import { Component } from '@angular/core';
import { SearchResult } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  searchResult: SearchResult | null = null;
  activeTab = 1;
  errorMessage: string = '';

  onSearchCompleted(result: SearchResult): void {
    this.searchResult = result;
    this.activeTab = 1;
  }

  onFavoriteSelected(favorite: any): void {
    console.log("Favorite selected:", favorite);
    this.searchResult = {
      city: favorite.city,
      state: favorite.state,
      longitude: favorite.longitude,
      latitude: favorite.latitude,
    };
    this.activeTab = 1;
  }

  onResultsLoaded(): void {
    this.activeTab = 1;
  }

  onClear(): void {
    this.searchResult = null;
    this.activeTab = 1;
  }

  setErrorMessage(message: any): void {
    this.errorMessage = message;
  }
}
