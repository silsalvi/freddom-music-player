import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';

import { catchError, finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpError } from '../models/http-error-response.model';

@Injectable()
export class FreedomInterceptor implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((httpError: HttpErrorResponse) => {
        let errorMsg = '';
        if (httpError.error instanceof ErrorEvent) {
          errorMsg = `Error: ${httpError.error.message}`;
        } else if (httpError.error instanceof Blob) {
          errorMsg = 'Il video non è disponibile';
        } else {
          errorMsg = `Error Code: ${httpError.status},  Message: `;
        }

        return throwError(errorMsg);
      }),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
