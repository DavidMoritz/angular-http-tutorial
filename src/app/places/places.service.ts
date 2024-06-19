import { Injectable, inject, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places');
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places').pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces)
      })
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();

    if (!prevPlaces.some((p) => p.id === place.id)) {
      this.userPlaces.set([...prevPlaces, place]);
    } else {
    }

    return this.httpClient
      .put('http://localhost:3000/user-places', {
        placeId: place.id
      })
      .pipe(
        catchError((error) => {
          const message = 'Failed to stoare selected place';
          this.userPlaces.set(prevPlaces);
          this.errorService.showError(message);
          return throwError(() => new Error(message));
        })
      );
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(map((resData) => resData.places));
  }
}
