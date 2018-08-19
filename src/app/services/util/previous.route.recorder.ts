import {Injectable} from '@angular/core';
import {Router,CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class PreviousRouteRecorder implements CanDeactivate<any> {
  constructor(private router: Router) {
  }
  canDeactivate(component: any): Observable<boolean> | boolean {
    localStorage.setItem('previousRoute', this.router.url);
    return true;
  }
}