import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface GeocodeResponse {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      }
    }
  }[];
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {
  private apiKey: string = environment.googleApiKey;

  constructor(private http: HttpClient) { }

  geocodeAddress(address: string): Observable<{ lat: number, lng: number } | null> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;

    return this.http.get<GeocodeResponse>(url).pipe(
      map(response => {
        if (response.status === 'OK' && response.results.length > 0) {
          const location = response.results[0].geometry.location;
          return {
            lat: location.lat,
            lng: location.lng
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Geocoding error:', error);
        throw error;
      })
    );
  }
}
