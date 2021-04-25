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
import { ModalComponent } from '../modal/modal.component';
import { DialogService } from 'primeng';

@Injectable()
export class FreedomInterceptor implements HttpInterceptor {
  constructor(
    private spinner: NgxSpinnerService,
    private dialogService: DialogService
  ) {}

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
          errorMsg = `Codice Errore: ${httpError.status}<br /><br />Messaggio: ${httpError.message}`;
        }
        this.dialogService.open(ModalComponent, {
          data: { message: errorMsg },
          header: 'Avviso',
          style: { width: '70vh' },
        });
        return throwError(errorMsg);
      }),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
