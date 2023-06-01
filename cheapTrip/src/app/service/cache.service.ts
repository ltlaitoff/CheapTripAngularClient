import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { IJsonTravelData } from '../trip-direction/trip-direction.model';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  public loaded = new ReplaySubject<boolean>();
  public locations = new ReplaySubject<any>();
  public trasport = new ReplaySubject<any>();

  async initialize() {
    console.time('[Cache] CacheService initialize');

    await Promise.all([this.loadLocations(), this.loadTransport()]).then(() => {
      this.loaded.next(true);
    });

    console.timeEnd('[Cache] CacheService initialize');
  }

  private async loadLocations() {
    const response = await fetch('assets/new_json/locations.json');
    const responseJson = await response.json();

    sessionStorage.setItem('locations', JSON.stringify(responseJson));
    this.locations.next(responseJson);
  }

  private async loadTransport() {
    const response = await fetch('assets/new_json/transport.json');
    const responseJson = await response.json();

    sessionStorage.setItem('transportationTypes', JSON.stringify(responseJson));
    this.trasport.next(responseJson);
  }

  private log(...messages: unknown[]) {
    console.log(`[Cache]: `, ...messages);
  }
}
