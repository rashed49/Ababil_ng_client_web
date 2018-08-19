export as namespace NgSso;
export = NgSso;

declare function NgSso(config?: NgSso.Config) : NgSso.Instance;

declare namespace NgSso {

    const enum FlowType {
        STANDARD = 'standard',
        IMPLICIT = 'implicit',
        HYBRID = 'hybrid'
    }

    const enum ResponseMode {
        FRAGMENT = 'fragment',
        QUERY = 'query'
    }

    interface Config {
        authUrl : string;
        clientId : string;
        clientSecret : string;
        realm? : string;
    }

    interface InitConfig {
        flow?: FlowType;
        responseMode?: ResponseMode;
    }

    interface Error {
        error: string;
        error_description: string;
    }

    type PromiseCallback<T> = (result: T) => void;

    interface Promise<TSuccess, TError> {
        success(callback: PromiseCallback<TSuccess>): Promise<TSuccess, TError>;
        error(callback: PromiseCallback<TError>): Promise<TSuccess, TError>;
    }

    interface InitResult {
        authenticated? : boolean;
        token? : string;
    }

    interface Account {
        username: string;
        activeBranch: number;
        homeBranch: number;
    }

    interface Instance {
        authenticated? : boolean;
        token? : any;
        init(initConfig?: InitConfig) : Promise<InitResult,Error>;
        login( prompt? : boolean);
        logout() : void;
        changePassword() : void;
        switchBranch() : void;
        account() : Promise<Account, Error>;
    }
}