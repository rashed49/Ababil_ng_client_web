import { Request, XHRBackend, XHRConnection, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiXHRBackend extends XHRBackend {

    createConnection(request: Request): XHRConnection {
        //too lazy to use switch case
        // if (request.url.startsWith('/document')) {
        //     request.url = environment.documentServiceApiUrl + request.url;
        // }
        //  if (request.url.startsWith('/profiles')) {
        //     request.url = environment.documentServiceApiUrl + request.url;
        // }
        if (request.url.startsWith('/oauth')) {
            request.url = environment.legacyAbabilTokenServiceUrl + request.url;
        }
        else if (request.url.startsWith('/admin')) {
            request.url = environment.adminserviceapiurl + request.url;
        }
        else if (request.url.startsWith('/')) {
            request.url = environment.serviceapiurl + request.url;
        }
        if (request.headers.get('Content-Type') == null) {
            request.headers.append('Content-Type', 'application/json');
        }
        // else if (request.headers.get('Content-Type') == 'application/octet-stream') {
        //     request.headers.append('Content-Type', 'application/octet-stream');
        // }
        return super.createConnection(request);
    }
}
