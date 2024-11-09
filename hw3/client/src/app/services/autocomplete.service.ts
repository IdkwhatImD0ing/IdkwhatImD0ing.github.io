import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface AutocompletePrediction {
  description: string;
  terms: { value: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  private apiKey: string = environment.googleApiKey;

  constructor(private http: HttpClient) { }

  /**
   * Fetch city predictions from Google Places Autocomplete API
   * @param input - The user input for city
   * @returns Observable of string array containing city names
   */
  getCityPredictions(input: string): Observable<string[]> {
    if (!input.trim()) {
      return of([]);
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(cities)&key=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.status === 'OK') {
          return response.predictions.map((pred: AutocompletePrediction) => {
            const city = pred.terms[0]?.value || '';
            const state = pred.terms[1]?.value || '';
            return city;
          });
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.error('Autocomplete API error:', error);
        return of([]);
      })
    );
  }
}
