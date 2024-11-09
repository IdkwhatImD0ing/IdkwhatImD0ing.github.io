import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface GeocodingResponse {
  results: any[];
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReverseGeocodingService {
  private apiKey: string = environment.googleApiKey;

  constructor(private http: HttpClient) { }

  /**
   * Perform reverse geocoding to get address details from coordinates
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @returns Observable containing address components
   */
  reverseGeocode(latitude: number, longitude: number): Observable<{ street: string; city: string; state: string }> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}`;

    return this.http.get<GeocodingResponse>(url).pipe(
      map(response => {
        if (response.status === 'OK' && response.results.length > 0) {
          const addressComponents = response.results[0].address_components;
          const streetNumber = this.getComponent(addressComponents, 'street_number');
          const route = this.getComponent(addressComponents, 'route');
          const street = `${streetNumber} ${route}`.trim();
          const city = this.getComponent(addressComponents, 'locality');
          const state = this.getComponent(addressComponents, 'administrative_area_level_1');
          return { street, city, state };
        } else {
          throw new Error('No results found');
        }
      }),
      catchError(error => {
        console.error('Reverse Geocoding error:', error);
        return of({ street: '', city: '', state: '' });
      })
    );
  }

  /**
   * Helper method to extract a specific component from address components
   * @param components - Address components array
   * @param type - The type of component to extract
   * @returns The value of the specified component or an empty string
   */
  private getComponent(components: any[], type: string): string {
    const component = components.find(c => c.types.includes(type));
    return component ? component.long_name : '';
  }
}
