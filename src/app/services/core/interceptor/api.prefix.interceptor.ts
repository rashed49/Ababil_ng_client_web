import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environment/domain/environment.domain';
import { EnvironmentService } from '../../environment/service-api/environment.service';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {

  environment: Environment;

  constructor(private environmentService: EnvironmentService) {
    this.environment = this.environmentService.fetchEnvironment();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let httpOptions: any;
    if (request.headers.get('Content-Type') == null) {
      httpOptions = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }

    if (request.url.startsWith('/admin')) {
      request = request.clone({ setHeaders: httpOptions.headers, url: this.environment.adminserviceapiurl + request.url });
    }
    else if (request.url.startsWith('/')) {
      request = request.clone({ setHeaders: httpOptions.headers, url: this.environment.serviceapiurl + request.url });
    }

    return next.handle(request);
  }
}
