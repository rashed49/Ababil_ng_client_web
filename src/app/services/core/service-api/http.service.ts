import { Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';
import { HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, timer } from "rxjs";
import { finalize } from 'rxjs/operators';
import { ApiPrefixInterceptor } from '../interceptor/api.prefix.interceptor';
import { ErrorHandlerInterceptor } from '../interceptor/error.handler.interceptor';
import { LoaderOverlayService } from '../../../common/services/app.loader.overlay.service';
import { AuthenticationService } from '../../security/authentication.service';
import { IRequestOptions } from '../domain/irequest.options.model';


class HttpInterceptorHandler implements HttpHandler {
    constructor(private next: HttpHandler, private interceptor: HttpInterceptor) { }

    handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
        return this.interceptor.intercept(request, this.next);
    }
}

export const HTTP_DYNAMIC_INTERCEPTORS = new InjectionToken<HttpInterceptor>('HTTP_DYNAMIC_INTERCEPTORS');

@Injectable()
export class HttpService extends HttpClient {

    public requestsPending: number = 0;
    public loaderVisble: boolean = false;

    constructor(
        private httpHandler: HttpHandler,
        private injector: Injector,
        @Optional() @Inject(HTTP_DYNAMIC_INTERCEPTORS) private interceptors: HttpInterceptor[] = [],
        private loaderOverlayService: LoaderOverlayService,
        private authenticationService: AuthenticationService
    ) {
        super(httpHandler);

        if (!this.interceptors) {
            this.interceptors = [
                this.injector.get(ApiPrefixInterceptor),
                this.injector.get(ErrorHandlerInterceptor)
            ];
        }
    }

    request(method?: any, url?: any, options?: IRequestOptions): any {
        const handler = this.interceptors.reduceRight(
            (next, interceptor) => new HttpInterceptorHandler(next, interceptor),
            this.httpHandler
        );
        return new HttpClient(handler).request(method, url, options);
    }

    public get(url: string, options?: IRequestOptions): Observable<any> {
        return super.get(url, this.authenticationService.setAuthToken(options));
    }

    public post(url: string, body: any, options?: IRequestOptions): Observable<any> {
        this.showLoadingModal();
        return this.interceptRequest(super.post(url, body, this.authenticationService.setAuthToken(options)));
    }

    public put(url: string, body: any, options?: IRequestOptions): Observable<any> {
        this.showLoadingModal();
        return this.interceptRequest(super.put(url, body, this.authenticationService.setAuthToken(options)));
    }

    public delete(url: string, options?: IRequestOptions): Observable<any> {
        this.showLoadingModal();
        return this.interceptRequest(super.delete(url, this.authenticationService.setAuthToken(options)));
    }

    public patch(url: string, body: any, options?: IRequestOptions): Observable<any> {
        this.showLoadingModal();
        return this.interceptRequest(super.patch(url, body, this.authenticationService.setAuthToken(options)));
    }

    public head(url: string, options?: IRequestOptions): Observable<any> {
        return super.head(url, this.authenticationService.setAuthToken(options));
    }

    public options(url: string, options?: IRequestOptions): Observable<any> {
        return super.options(url, this.authenticationService.setAuthToken(options));
    }

    interceptRequest(observable: Observable<any>): Observable<any> {
        this.requestsPending++;
        return observable
            .pipe(
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

}