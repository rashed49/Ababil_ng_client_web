import { ApplicationContext } from './../../application.context';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
//import * as fromRoot from '../../store';
import {Store} from '@ngrx/store';
import {LOGOUT_SUCCESS} from '../../store/security/security.action';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private applicationContext:ApplicationContext) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    
    let authToken = this.applicationContext.getAuthToken();
    //validate auth token to be implemented
    if(authToken==null){
         this.router.navigate(['not-found']);
         return of(false); 
    }else{
         return of(true);
    }

    //return of(true);
  }
}