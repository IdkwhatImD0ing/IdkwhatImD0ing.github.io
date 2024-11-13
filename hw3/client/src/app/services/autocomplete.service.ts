import { Injectable, NgZone } from '@angular/core';
import { Observable, from } from 'rxjs';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  private autocompleteService: any;

  constructor(private ngZone: NgZone) {
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  getCityPredictions(input: string): Observable<string[]> {
    if (!input.trim()) {
      return from(Promise.resolve([]));
    }

    return from(new Promise<string[]>((resolve, reject) => {
      this.autocompleteService.getPlacePredictions(
        {
          input: input,
          types: ['(cities)']
        },
        (predictions: any[], status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            const cities = predictions.map(pred => pred.description);
            this.ngZone.run(() => resolve(cities));
          } else {
            resolve([]);
          }
        }
      );
    }));
  }
}
