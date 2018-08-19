import { ApplicationContext } from './../../application.context';
import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import {Observable} from 'rxjs';
//import * as fromRoot from '../../store';
import {Store} from '@ngrx/store';
import {LOGOUT_SUCCESS} from '../../store/security/security.action';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class RefreshGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor(private router: Router,private applicationContext:ApplicationContext) {}

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate() ?
      true :
      confirm('Your session will expire. Are you sure you want to refresh?');
  }


}