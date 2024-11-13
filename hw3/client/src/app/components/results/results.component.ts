import { Component, Input, OnInit } from '@angular/core';
import { SearchResult, DailyForecast } from '../../models';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  animations: [
    trigger('slideOutLeft', [
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ResultsComponent implements OnInit {
  @Input() searchResult: SearchResult | null = null;
  selectedDay: DailyForecast | null = null;
  selectedTab: string = 'dayView';

  constructor() { }

  ngOnInit(): void { }

  getTitle(): string {
    return this.searchResult ? `Forecast at ${this.searchResult.city}, ${this.searchResult.state}` : 'Forecast Details';
  }

  onFavorite(): void {
    alert('Added to favorites!');
  }

  onDetails(): void {
    alert('Showing detailed information!');
  }

  onDaySelected(day: DailyForecast): void {
    this.selectedDay = day;
  }

  goBack(): void {
    this.selectedDay = null;
  }

  postToX(): void {
    alert('Posted to X!');
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}
