import { Component } from '@angular/core';

interface SearchResult {
  city: string;
  state: string;
  weatherData: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Weather App';
  searchResult: SearchResult | null = null;


  onSearchCompleted(result: SearchResult): void {
    this.searchResult = result;
    console.log(this.searchResult);
  }
}


