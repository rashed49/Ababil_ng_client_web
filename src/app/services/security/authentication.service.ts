import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { NgSsoService } from "./ngoauth/ngsso.service";
import { Environment } from '../environment/domain/environment.domain';
import { EnvironmentService } from "../environment/service-api/environment.service";
import { Subject } from "rxjs";
import { Account } from './ngoauth/ngsso';
import { IRequestOptions } from "../core/domain/irequest.options.model";

@Injectable()
export class AuthenticationService {

    private environment: Environment;
    private accountSource = new Subject<Account>();
    account$ = this.accountSource.asObservable();

    constructor(
        private environmentService: EnvironmentService,
        private ngSsoService: NgSsoService) {

        this.environment = this.environmentService.fetchEnvironment();
    }

    authenticated(): boolean {
        switch (this.environment.auth) {
            case 'NGSSO':
                return this.ngSsoService.authenticated();

            default:
        }
    }

    accessToken(): string {
        switch (this.environment.auth) {
            case 'NGSSO':
                return this.ngSsoService.accessToken();

            default:
        }
    }

    account() {
        switch (this.environment.auth) {
            case 'NGSSO':
                this.ngSsoService.account().subscribe(account => {
                    this.accountSource.next(account);
                });
                break;

            default:
        }
    }

    login(prompt?: boolean) {
        switch (this.environment.auth) {
            case 'NGSSO':
                this.ngSsoService.login(prompt);
                break;

            default:
        }
    }

    logout(): void {
        switch (this.environment.auth) {
            case 'NGSSO':
                this.ngSsoService.logout();
                break;

            default:
        }
    }

    changePassword(): void {
        switch (this.environment.auth) {
            case 'NGSSO':
                this.ngSsoService.changePassword();
                break;

            default:
        }
    }

    switchBranch(): void {
        switch (this.environment.auth) {
            case 'NGSSO':
                this.ngSsoService.switchBranch();
                break;

            default:
        }
    }

    setAuthToken(options?: IRequestOptions) {
        if (!options) options = new IRequestOptions();
        if (!options.headers) options.headers = new HttpHeaders();

        switch (this.environment.auth) {
            case 'NGSSO':
                this.ngSsoService.authenticated()
                    ? options.headers = options.headers.set('Authorization', 'Bearer ' + this.ngSsoService.accessToken())
                    : this.ngSsoService.login(true);
                break;

            default:
        }
        return options;
    }

}