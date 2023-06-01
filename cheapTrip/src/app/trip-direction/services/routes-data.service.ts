import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { CacheService } from 'src/app/service/cache.service';
import {
  IJsonTravelData,
  IJsonPartlyRoute,
  IJsonPartlyRouteItem,
  IRecievedRouts,
} from '../trip-direction.model';
import { IRout } from '../trip-direction.model';

import { combineLatest } from 'rxjs';
import { throwError } from 'rxjs';
import { deepObjectClone } from '../helpers/deep-object-clone.helper';
import config from '../config/trip-direction.config';
import { getDirectRouteFileById } from '../helpers/get-direct-route-file-by-id.helper';

@Injectable({ providedIn: 'root' })
export class RoutesDataService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getPathMap(
    startPoint: string,
    endPoint: string
  ): Observable<IRecievedRouts[]> {
    const startPointNumber = Number(startPoint);
    const endPointNumber = Number(endPoint);

    return forkJoin([
      this.getTravelData(startPointNumber, endPointNumber),
      this.getRouteTravelData(startPoint, endPoint, 'flying'),
      this.getRouteTravelData(startPoint, endPoint, 'fixed'),
      this.getRouteTravelData(startPoint, endPoint, 'mixed'),
    ]).pipe(
      map(([travelData, flyingData, groundData, mixedData]) => {
        const pathMap = [
          ...travelData,
          ...flyingData,
          ...groundData,
          ...mixedData,
        ];

        console.log('pathMap: ', pathMap);

        return pathMap;
      })
    );
  }

  async getTravelData(
    startPoint: number,
    endPoint: number
  ): Promise<IRecievedRouts[]> {
    console.time('RoutesDataService ~ getTravelData ~ GetTransportAndLocation');

    let subscribe = new Subscription();

    return new Promise(async resolve => {
      subscribe = combineLatest(
        this.cacheService.locations,
        this.cacheService.trasport,
        (locations, transportType) => ({ locations, transportType })
      ).subscribe(({ locations, transportType }) => {
        subscribe.unsubscribe();

        console.time('RoutesDataService ~ getTravelData');

        const result = this.getDirectRoutesByPoints(startPoint, endPoint).then(
          data => {
            if (data.length > 0) {
              console.log('getTravelData data:', data);

              let result: IRecievedRouts[] = [];

              for (let i = 0; i < data.length; i++) {
                result.push({
                  duration_minutes: data[i].duration,
                  euro_price: data[i].price,
                  routeType: 'direct_routes',
                  direct_paths: [
                    {
                      duration_minutes: String(data[i].duration),
                      euro_price: data[i].price,
                      from: locations[data[i].from].name,
                      to: locations[data[i].to].name,
                      transportation_type:
                        transportType[data[i].transport].name,
                    },
                  ],
                });
              }
              console.timeEnd('RoutesDataService ~ getTravelData');

              return result;
            }

            return [];
          }
        );

        resolve(result);
      });
    });
  }

  private async getRouteTravelData(
    startPoint: string,
    endPoint: string,
    type: 'flying' | 'fixed' | 'mixed'
  ): Promise<IRecievedRouts[]> {
    console.time(
      `trip-direction/data.service.ts ~ DataService ~ getRouteTravelData ${type}`
    );

    let subscribe = new Subscription();

    return new Promise(async resolve => {
      subscribe = combineLatest(
        this.cacheService.locations,
        this.cacheService.trasport,
        (locations, transportType) => ({
          locations,
          transportType,
        })
      ).subscribe(({ locations, transportType }) => {
        const result = this.getRouteData({ startPoint, endPoint, type }).then(
          data => {
            const result: IRecievedRouts[] = [];

            if (!data || data === null) return result;

            const directPaths: IRout[] = data.travel_data.map(travelData => ({
              duration_minutes: String(travelData.duration),
              euro_price: travelData.price,
              from: locations[travelData.from].name,
              to: locations[travelData.to].name,
              transportation_type: transportType[travelData.transport].name,
            }));

            result.push({
              duration_minutes: data.duration,
              euro_price: data.price,
              routeType: `${type}_routes`,
              direct_paths: directPaths,
            });

            console.log(result);
            return result;
          }
        );

        console.timeEnd(
          `trip-direction/data.service.ts ~ DataService ~ getRouteTravelData ${type}`
        );

        resolve(result);

        subscribe.unsubscribe();
      });
    });
  }

  private async getDirectRoutesByPoints(
    startPoint: number,
    endPoint: number
  ): Promise<IJsonTravelData[]> {
    return this.http
      .get<IJsonPartlyRoute>(
        `${config.ROUTES_FOLDER}/direct_routes/${startPoint}.json`
      )
      .pipe(catchError(this.errorHandler))
      .toPromise()
      .then((directRoutes: any) => {
        if (directRoutes === null) return;

        console.time('RoutesDataService ~ getDirectRoutesByPoints');

        const directRoutesValues: IJsonTravelData[] =
          Object.values(directRoutes);

        const directRoutesForOutput: IJsonTravelData[] = directRoutesValues
          .filter((el: IJsonTravelData) => el.to === Number(endPoint))
          .map(item => {
            return { ...item, from: startPoint };
          });

        console.timeEnd('RoutesDataService ~ getDirectRoutesByPoints');

        return directRoutesForOutput;
      })
      .catch(() => null);
  }

  private getRouteData({
    startPoint,
    endPoint,
    type,
  }: {
    startPoint: string;
    endPoint: string;
    type: 'flying' | 'fixed' | 'mixed';
  }): Promise<IJsonPartlyRouteItem | null> {
    console.time(
      `trip-direction/data.service.ts ~ DataService ~ getRouteData ~ ${type}`
    );

    return this.http
      .get<IJsonPartlyRoute>(this.getRouteDataLink(type, startPoint))
      .pipe(catchError(this.errorHandler))
      .toPromise()
      .then(async (routes): Promise<IJsonPartlyRouteItem | undefined> => {
        const route = routes[`${endPoint}`];

        if (route == undefined) return;

        const clonedRoute: IJsonPartlyRouteItem = deepObjectClone(route);

        clonedRoute.travel_data = await Promise.all(
          clonedRoute.direct_routes.map(async directRouteId => {
            return await this.getDirectRouteById(directRouteId);
          })
        );

        console.timeEnd(
          `trip-direction/data.service.ts ~ DataService ~ getRouteData ~ ${type}`
        );

        return clonedRoute;
      })
      .catch(() => null);
  }

  private getDirectRouteById(id: string) {
    const directRouteFileId = getDirectRouteFileById(id);

    return this.http
      .get<IJsonPartlyRoute>(
        `${config.ROUTES_FOLDER}/direct_routes/${directRouteFileId}.json`
      )
      .pipe(catchError(this.errorHandler))
      .toPromise()
      .then(directRoutes => {
        const directRouteInfo = directRoutes[id];

        if (directRouteInfo == undefined) return;

        return {
          ...directRouteInfo,
          from: directRouteFileId,
        };
      });
  }

  private getRouteDataLink(
    type: 'flying' | 'fixed' | 'mixed',
    startPoint: string
  ) {
    return `${config.ROUTES_FOLDER}/${config.ROUTE_FOLDER[type]}/${startPoint}.json`;
  }

  private errorHandler(error: HttpErrorResponse) {
    console.log('error');

    if (error.status === 404) return Promise.reject();

    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
