import { Response,URLSearchParams} from '@angular/http';
import { HttpParams } from '@angular/common/http';

export interface PathParameters {
  [parameterName: string]: any;
}

export class BaseService{

    protected extractData(res: Response) {
       return res.text() === '' ? res.status : res.json();
    }

    protected getUrlSearchParams(params: Map<string, string>): URLSearchParams {
        let urlParams = new URLSearchParams();
        params.forEach((value: string, key: string) => {
             urlParams.append(key, value);
        });
        return urlParams;
    }

    protected getHttpParams(params: Map<string, string>): HttpParams {
        let httpParams = new HttpParams();
        params.forEach((value: string, key: string) => {
            httpParams = httpParams.set(key, value);
        });
        return httpParams;
    }

     // experimenting don't know which way to go
    protected create(url: string, parameters: PathParameters) {
        const placeholders = url.match(/({[a-zA-Z]*})/g);
        placeholders.forEach((placeholder: string) => {
        const key = placeholder.substr(1, placeholder.length - 2);
        const value = parameters[key];
        if (!value) {
             throw new Error(`Parameter ${key} was not provided`);
        }
        if(typeof value != 'string' && typeof value != 'number'){
            throw new Error(`Value of Parameter ${key} should be either number or string`);
        }
        url = url.replace(placeholder, encodeURIComponent(value+""));
        });
        return url;
    }

}
