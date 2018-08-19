import { BaseComponent } from './../common/components/base.component';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthenticationService } from '../services/security/authentication.service';
import { Environment } from '../services/environment/domain/environment.domain';
import { EnvironmentService } from '../services/environment/service-api/environment.service';

@Component({
    selector: 'inline-profile',
    templateUrl: './app.profile.component.html',
    animations: [
        trigger('menu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class InlineProfileComponent extends BaseComponent implements OnInit {

    active: boolean;
    userName$: String;
    userActiveBranch$: number;
    userHomeBranch$: number;
    environment: Environment;

    constructor(
        private authenticationService: AuthenticationService,
        private environmentService: EnvironmentService
    ) {
        super();
        this.environment = this.environmentService.fetchEnvironment();
    }

    onClick(event) {
        this.active = !this.active;
        event.preventDefault();
    }

    ngOnInit() {
        this.authenticationService.account();
        this.userName$ = "Anonymous";
        this.subscribers.accountSub = this.authenticationService.account$
            .subscribe(account => {
                this.userName$ = account.username;
                this.userActiveBranch$ = account.activeBranch;
                this.userHomeBranch$ = account.homeBranch;
            });
    }

    logout() {
        this.authenticationService.logout();
    }

    changePassword() {
        this.authenticationService.changePassword();
    }

    switchBranch() {
        this.authenticationService.switchBranch();
    }

}