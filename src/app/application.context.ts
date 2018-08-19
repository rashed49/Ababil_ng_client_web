import { Injectable } from '@angular/core';

@Injectable()
export class ApplicationContext {

    applicationContext: UserData;
    authToken: any = null;
    tokenData: any;

    keyCloakUser: any;

    constructor() { 
        this.applicationContext =  new UserData();
     }

    public setApplicationContext(applicationContext: any) {
        this.applicationContext = applicationContext;
    }

    public getApplicationContext(): any {
        return this.applicationContext;
    }

    public setAuthToken(token: string) {
        this.authToken = token;
    }

    public getAuthToken() {
        return this.authToken;
    }

    public setTokenData(tokenData: any) {
        this.tokenData = tokenData;
    }

    public getTokenData() {
        return this.tokenData;
    }

    public setKeyCloakUser(keyCloakUser: any) {
        this.keyCloakUser = keyCloakUser;
    }

    public getKeyCloakUser() {
        return this.keyCloakUser;
    }

    cp
}


export class UserData {
    branchId: number;
    userId: string;
}

