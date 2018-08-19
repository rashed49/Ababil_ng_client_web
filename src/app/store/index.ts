// import {AuthState} from './security/authentication.reducer';
// import * as fromAuthentication from  './security/authentication.reducer';
// import {ActionReducer, combineReducers} from '@ngrx/store';
// import {compose} from '@ngrx/core/compose';
// import {localStorageSync} from 'ngrx-store-localstorage';
// import * as securityAction from './security/security.action';
// import {createSelector} from 'reselect';
// import { storeFreeze } from 'ngrx-store-freeze';
// import { environment } from '../../environments/environment';

// export interface AppState{
//     authentication:AuthState
// }

// export const reducers={
//     authentication: fromAuthentication.reducer
// };

// const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
// const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

// export function reducer(state: any, action: any) {
//   if(environment.production){
//      return productionReducer(state, action);
//   }else{
//      return developmentReducer(state, action);
//   }  
// }

// export const getAuthenticationState = (state: AppState) => state.authentication;

// export const getAuthentication = createSelector(getAuthenticationState, fromAuthentication.isAuthenticated);
// export const getAuthenticationError = createSelector(getAuthenticationState, fromAuthentication.getError);
// export const getAuthenticationLoading = createSelector(getAuthenticationState, fromAuthentication.getLoading);
// export const getUsername = createSelector(getAuthenticationState, fromAuthentication.getUsername);
// export const getPasswordError = createSelector(getAuthenticationState, fromAuthentication.getPasswordError);






