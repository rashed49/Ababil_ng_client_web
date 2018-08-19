import {LoginSuccessPayload} from './security.action';
import * as security from './security.action';

export interface AuthState{   
   username:string,
   authenticated:boolean,
   token:string,
   loading:boolean,
   error:Error,
   passwordError:Error
}

const initialState:AuthState={
   username:null,
   authenticated:false,
   token:null,
   loading:false,
   error:null,
   passwordError:null 
};


export function reducer(state = initialState, action: security.Actions): AuthState {
  switch(action.type){

    case security.LOGIN_SUCCESS: {
      let payload: LoginSuccessPayload = action.payload;
      return Object.assign({}, state, {
        loading: false,
        authentication: payload.authenticated,
        username: payload.userName                
      });
    }
    case security.LOGOUT_SUCCESS: {
      return initialState;
    }
    default:
      return state;
  }
}

export const isAuthenticated = (state: AuthState) => state.authenticated;
export const getUsername = (state: AuthState) => state.username;
export const getToken = (state: AuthState) => state.token;
export const getError = (state: AuthState) => state.error;
export const getPasswordError = (state: AuthState) => state.passwordError;
export const getLoading = (state: AuthState) => state.loading;
