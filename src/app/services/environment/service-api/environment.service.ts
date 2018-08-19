import { Injectable } from "@angular/core";
import * as env from './../../../../environments/environment';

@Injectable()
export class EnvironmentService{
    constructor(){}

    fetchEnvironment(){
        return env.environment;
    }
}