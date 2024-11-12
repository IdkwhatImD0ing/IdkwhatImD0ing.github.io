// src/app/results/results.component.ts
import { Component, Input, OnInit } from '@angular/core';

interface SearchResult {
  city: string;
  state: string;
  weatherData: any;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnInit {
  @Input() searchResult: SearchResult | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  getTitle(): string {
    if (this.searchResult) {
      return `Forecast at ${this.searchResult.city}, ${this.searchResult.state}`;
    }
    return 'Forecast Details';
  }

  onFavorite(): void {
    // Implement favorite logic (e.g., save to a favorites list)
    console.log('Favorite button clicked');
    alert('Added to favorites!');
  }

  onDetails(): void {
    // Implement details logic (e.g., show more information)
    console.log('Details button clicked');
    alert('Showing detailed information!');
  }

  onDaySelected(date: string): void {
    console.log('Day selected:', date);
    // Implement day selection logic (e.g., fetch and display weather data for the selected day)
  }

  goBack(): void {
    console.log('Going back to search');
    // Implement go back logic (e.g., navigate to the search page)
  }

  postToX(): void {
    console.log('Posting to X');
    // Implement post to X logic (e.g., share the weather data on X)
  }
}
