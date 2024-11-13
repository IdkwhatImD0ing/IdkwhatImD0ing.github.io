import { Component } from '@angular/core';
import { SearchResult } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Weather App';
  searchResult: SearchResult | null = null;


  onSearchCompleted(result: SearchResult): void {
    console.log('Search completed:', result);
    this.searchResult = result;
  }
}


