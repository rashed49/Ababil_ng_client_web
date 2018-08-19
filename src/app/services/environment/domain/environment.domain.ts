export class Environment {
    production: boolean;
    serviceapiurl: string;
    adminserviceapiurl: string;
    realm: string;
    clientId: string;
    auth: string;
    reportServiceUrl: string;

    ngSsoConfiguration: NgSsoConfiguration;

    constructor() {
        this.ngSsoConfiguration = new NgSsoConfiguration();
    }
};

export class NgSsoConfiguration {
    authUrl: string;
    clientId: string;
    clientSecret: string;
}