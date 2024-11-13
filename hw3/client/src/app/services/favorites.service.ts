import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UuidService } from './uuid.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient, private uuidService: UuidService) { }

  checkFavorite(city: string, state: string): Observable<any> {
    const uuid = this.uuidService.getUUID();
    const params = new HttpParams()
      .set('uuid', uuid)
      .set('city', city)
      .set('state', state);

    return this.http.get(`${this.apiUrl}/favorites/check`, { params });
  }

  addFavorite(city: string, state: string, longitude: number, latitude: number): Observable<any> {
    const uuid = this.uuidService.getUUID();
    const body = { uuid, city, state, longitude, latitude };
    return this.http.post(`${this.apiUrl}/favorites/add`, body);
  }

  removeFavorite(city: string, state: string): Observable<any> {
    const uuid = this.uuidService.getUUID();
    const body = { uuid, city, state };
    return this.http.request('delete', `${this.apiUrl}/favorites/remove`, { body });
  }

  listFavorites(): Observable<any> {
    const uuid = this.uuidService.getUUID();
    const params = new HttpParams().set('uuid', uuid);
    return this.http.get(`${this.apiUrl}/favorites`, { params });
  }
}
