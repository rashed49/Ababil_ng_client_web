import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import { RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../../http.interceptor';
import { NotificationService } from '../../../common/notification/notification.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as endpoints from '../command.api.endpoints';
import { Command } from '../domain/command.model';

@Injectable()
export class CommandService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchAllCommands(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_ALL_COMMANDS, options)
            .pipe(map(this.extractData));

    }

    public updateCommandMappings(commands: Command[]): Observable<any> {
        return this.http.put(endpoints.UPDATE_COMMAND_MAPPINGS, commands)
            .pipe(map(this.extractData));
    }
}