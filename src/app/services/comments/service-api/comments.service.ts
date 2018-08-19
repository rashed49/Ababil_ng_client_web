import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import * as endpoints from '../comments.api.endpoints';
import { Comment } from '../domain/comments.models';
import { RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CommentsService extends BaseService {
    constructor( private http: HttpInterceptor) {
        super();
    }

    public fetchComments(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams)});
        return this.http
            .get(endpoints.FETCH_COMMENTS, options)
            .pipe(map(this.extractData));
    }

    public postComment(comment: Comment): Observable<any> {
        return this.http.post(endpoints.POST_COMMENT, comment)
            .pipe(map(this.extractData));
    }

}
