import {Action} from '@ngrx/store';

export const LOGIN_SUCCESS = "[Security] Login";
export const LOGOUT = "[Security] Logout";
export const LOGOUT_SUCCESS = "[Security] Logout Sucess";

export interface LoginSuccessPayload{
    userName:string,
    authenticated:boolean    
}

export class LoginSuccessAction implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload: LoginSuccessPayload) { }
}

export class LogoutSuccessAction implements Action {
  readonly type = LOGOUT_SUCCESS;
  constructor() { }
}

export type Actions
  = LoginSuccessAction | LogoutSuccessAction;