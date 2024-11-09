// results.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnChanges {
  @Input() results: any; // Define a proper interface based on your search results

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results']) {
      console.log('Results updated:', this.results);
      // Implement any additional logic when results change
    }
  }
}
