import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponseBase, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../common/notification/notification.service';
import { NgSsoService } from '../../security/ngoauth/ngsso.service';

export declare class IHttpErrorResponse extends HttpResponseBase implements Error {
  readonly name: string;
  readonly message: string;
  readonly error: IError | null;
  readonly ok: boolean;

  constructor(init: {
    error?: IError;
    headers?: HttpHeaders;
    status?: number;
    statusText?: string;
    url?: string;
  });
}

class IError {
  code?: string;
  error?: string;
  exception?: string;
  message?: string;
  module?: string;
  path?: string;
  status?: number;
  timestamp?: number
}

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService,
    private ngSsoService: NgSsoService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.handleError(error)));
  }

  private handleError(errorResponse: IHttpErrorResponse): Observable<HttpEvent<any>> {
    switch (errorResponse.status) {
      case 401:
        if (environment.auth === 'NGSSO') {
          this.ngSsoService.logout();
        }
        break;

      // case 404:
      //   break;

      default:
        if (!errorResponse.status) {
          this.notificationService.showNetErrorMessage(errorResponse.message);
        } else if (!errorResponse.error.message || errorResponse.error.message === '') {
          this.notificationService.sendSuperErrorMessage('message.error.unhandled', "Whatever!!");
        } else {
          if (errorResponse.error.code == '00040001') {
            this.notificationService.showValidationErrorMessage(errorResponse.error.error);
          } else {
            this.notificationService.sendSuperErrorMessage(errorResponse.error.code, errorResponse.error.message);
          }
        }

        return throwError(errorResponse);
    }
  }

}