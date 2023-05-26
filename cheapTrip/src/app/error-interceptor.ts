import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { ErrorComponent } from './error/error.component';
import * as fromApp from './store/app.reducer';
import * as TripDirectionActions from './trip-direction/store/trip-direction.actions';
import { Store } from '@ngrx/store';
import { AlertMessage } from './error/alertMessage.model';
import { Button } from './error/alertMessage.model';

//import { ErrorComponent } from "./error/error.component";
//ngimport { ErrorService } from "./error/error.service";

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          if (evt.body.length == 0) {
            const alertMessage = new AlertMessage(
              'warning',
              $localize`:@@oh,no:Oh no!`,
              $localize`:@@noRoute:Sorry, the data we have accumulated is nots
              enough to build a route between the indicated cities. Try changing your request.`,
              [new Button('Close', $localize`:@@Close:Close`)]
            );
            this.dialog.open(ErrorComponent, {
              data: alertMessage,
            });
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorData: AlertMessage;
        console.log('--==unknown error==-- ' + JSON.stringify(error));

        switch (true) {
          case error.status === 500:
            errorData = new AlertMessage(
              'error',
              $localize`:@@oops:oops`,
              $localize`:@@serverOffline:Sorry. We are currently working only with Latin characters. But we promise to fix it soon.`,
              [new Button('Close', $localize`:@@Close:Close`)]
            );
            break;
          case error.status >= 500:
            errorData = new AlertMessage(
              'error',
              $localize`:@@oops:oops`,
              $localize`:@@serverOffline:Pss! Our server is sleeping now. Please come back later.`,
              [new Button('Close', $localize`:@@Close:Close`)]
            );
            break;
          case error.status >= 400:
            errorData = new AlertMessage(
              'warning',
              $localize`:@@oh,no:Oh no!`,
              $localize`:@@noRoute:Sorry, the data we have accumulated is not
             enough to build a route between the indicated cities. Try changing your request.`,
              [new Button('Close', $localize`:@@Close:Close`)]
            );
            break;
          default:
            errorData = new AlertMessage('error', error.name, 'Unknown error', [
              new Button('Close', $localize`:@@Close:Close`),
            ]);
            break;
        }
        this.store.dispatch(
          new TripDirectionActions.AutocompleteFail('errorMessage')
        );

        this.dialog.open(ErrorComponent, { data: errorData });
        return throwError(error);
      })
    );
  }

  showError(title: string, message: string) {
    const alertMessage = new AlertMessage('error', title, message, [
      new Button('Close', $localize`:@@Close:Close`),
    ]);
    this.dialog.open(ErrorComponent, { data: alertMessage });
  }
}
