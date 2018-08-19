import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import * as NgSso from './ngsso';
import {environment} from '../../../../environments/environment';

@Injectable()
export class NgSsoService {
    
    private access_token: string;
    private sso: NgSso.Instance;

    constructor() {
        this.sso = NgSso(environment.ngSsoConfiguration);
    }

    init(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.sso.init({flow: NgSso.FlowType.STANDARD, responseMode: NgSso.ResponseMode.QUERY })
                .success(result => {
                    this.access_token = result.token;
                    observer.next(result.authenticated);
                    observer.complete();
                })
                .error(error => {
                    observer.next(false);
                    observer.complete();
                });
        });
    }

    authenticated(): boolean {
        return this.sso.authenticated;
    }

    accessToken(): string {
        return this.access_token;
    }

    account() : Observable<NgSso.Account> {
        return new Observable<NgSso.Account>(observer => {
            this.sso.account().success(function (account) {
                observer.next(account);
                observer.complete();
            });
        });
    }

    login(prompt? : boolean) : void {
        this.sso.login(prompt);
    }

    logout() : void {
        this.sso.logout();
    }

    changePassword(): void {
        this.sso.changePassword();
    }

    switchBranch(): void {
        this.sso.switchBranch();
    }

}

@Injectable()
export class NgSsoGuard implements CanActivate {

    constructor(private ssoService: NgSsoService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        return this.ssoService.init();
    }

}