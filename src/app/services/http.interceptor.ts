import { Router } from '@angular/router';
import { ApplicationContext } from './../application.context';
import { environment } from './../../environments/environment';
import { Http, RequestOptions, RequestOptionsArgs, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, timer } from "rxjs";
import { catchError, finalize } from 'rxjs/operators';
import { ApiXHRBackend } from './api.xhr.backend';
import { NotificationService } from '../common/notification/notification.service';
import { AuthService } from 'angular-spa';
import { LoaderOverlayService } from '../common/services/app.loader.overlay.service';
import { Headers } from '@angular/http';
import { NgSsoService } from './security/ngoauth/ngsso.service';

declare var $: any;

/**
* @deprecated
* export HttpService instead of HttpInterceptor
* Use getHttpParams() insted of getUrlSearchParams()
* You don't need .pipe(map(this.extractData)) anymore
* For detail use you can visit Inland Remittance Charge Service
*/
@Injectable()
export class HttpInterceptor extends Http {

    public requestsPending: number = 0;
    public loaderVisble: boolean = false;

    constructor(
        backend: ApiXHRBackend,
        options: RequestOptions,
        public http: Http,
        private notificationService: NotificationService,
        private ngSsoService: NgSsoService,
        private authService: AuthService,
        private loaderOverlayService: LoaderOverlayService,
        private applicationContext: ApplicationContext,
        private router: Router
    ) {
        super(backend, options);
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.get(url, this.setAuthToken(options))
            .pipe(catchError(this.handleError));
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        this.showLoadingModal();
        return this.interceptRequest(super.post(url, body, this.setAuthToken(options)));
    }

    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        this.showLoadingModal();
        return this.interceptRequest(super.put(url, body, this.setAuthToken(options)));
    }

    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        this.showLoadingModal();
        return this.interceptRequest(super.delete(url, this.setAuthToken(options)));
    }

    public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        this.showLoadingModal();
        return this.interceptRequest(super.patch(url, body, this.setAuthToken(options)));
    }

    public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.head(url, this.setAuthToken(options));
    }

    public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.options(url, this.setAuthToken(options)).pipe(catchError(this.handleError));
    }

    public handleError = (error: any) => {
        switch (error.status) {
            case 401:
                if (environment.auth === 'KEYCLOAK') {
                    this.authService.logout();
                } else if (environment.auth === 'NGSSO') {
                    this.ngSsoService.logout();
                } else if (environment.auth === 'LEGACY-ABABIL') {
                    this.applicationContext.setAuthToken(null);
                    this.applicationContext.setTokenData(null);
                    this.router.navigate(['not-found']);
                } else {
                    //is this real life or is this fantasy?? 
                }
                break;

            // case 404:
            //     break;

            default:
                if (!error._body || error._body === '') {
                    this.notificationService.sendSuperErrorMessage('message.error.unhandled', "Whatever!!");
                } else {
                    let code = JSON.parse(error._body)['code'];

                    if (code == '00040001') {
                        this.notificationService.showValidationErrorMessage(JSON.parse(error._body)['errors']);
                    } else {
                        this.notificationService.sendSuperErrorMessage(JSON.parse(error._body)['code'], JSON.parse(error._body)['message']);
                    }
                }
                return throwError(error);
        }
    }

    interceptRequest(observable: Observable<Response>): Observable<Response> {
        this.requestsPending++;
        return observable
            .pipe(
                catchError(this.handleError),
                finalize(() => {
                    timer(100).subscribe(t => this.hideLoadingModal());
                })
            );
    }

    showLoadingModal() {
        if (!this.loaderVisble) {
            this.loaderVisble = true;
            this.loaderOverlayService.show();
        }
        this.loaderVisble = true;
    }

    hideLoadingModal() {
        this.requestsPending--;
        if (this.requestsPending <= 0) {
            if (this.loaderVisble) {
                this.loaderOverlayService.hide();
            }
            this.loaderVisble = false;
        }
    }

    setAuthToken(options?: RequestOptionsArgs) {
        if (!options) options = new RequestOptions();
        if (!options.headers) options.headers = new Headers();
        if (environment.auth === 'KEYCLOAK') {
            if (this.authService.keycloak.authenticated) {
                options.headers.set('Authorization', 'bearer ' + this.authService.keycloak.token);
            } else {
                this.authService.login();
            }
        } else if (environment.auth === 'NGSSO') {
            if (this.ngSsoService.authenticated()) {
                options.headers.set('Authorization', 'Bearer ' + this.ngSsoService.accessToken());
            } else {
                this.ngSsoService.login(true);
            }
        } else if (environment.auth === 'LEGACY-ABABIL') {
            if (this.applicationContext.getAuthToken() == null) {
                this.router.navigate(['not-found']);
            } else {
                options.headers.set('Authorization', 'Bearer ' + this.applicationContext.getAuthToken().access_token);
            }
        }
        return options;
    }

}
