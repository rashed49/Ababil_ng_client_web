// // common resource reducer

// import {Action, ActionReducer} from '@ngrx/store';
// import {createSelector} from 'reselect';
// import {RoutePayload} from './route.payload';

// export interface Resource {
//   identifier: string;
// }

// export interface LoadResourcePayload {
//   resource: any
// }

// export interface SelectResourcePayload {
//   selectedId: string;
// }

// export interface CreateResourceSuccessPayload extends RoutePayload {
//   resource: any
// }

// export interface UpdateResourceSuccessPayload extends RoutePayload {
//   resource: any
// }

// export interface DeleteResourceSuccessPayload extends RoutePayload {
//   resource: any
// }

// export interface ResourceState {
//   ids: number[];
//   entities: { [id: number]: any };
//   selectedId: number | null;
//   loadedAt: { [id: number]: number }
// }

// const initialState: ResourceState = {
//   ids: [],
//   entities: {},
//   loadedAt: {},
//   selectedId: null
// };

// export const createResourceReducer = (resource: string, reducer?: ActionReducer<ResourceState>, identifierName: string = 'id') => {

//   const identifier = (resource: any) => resource[identifierName];

//   return function(state: ResourceState = initialState, action: Action): ResourceState {

//     switch (action.type) {

//       case `[${resource}] Load`: {
//         const resource = action.payload.resource;

//         const newIds = state.ids.filter(id => id !== identifier(resource));

//         return {
//           ids: [ ...newIds, identifier(resource) ],
//           entities: Object.assign({}, state.entities, {
//             [identifier(resource)]: resource
//           }),
//           selectedId: state.selectedId,
//           loadedAt: Object.assign({}, state.entities, {
//             [identifier(resource)]: Date.now()
//           })
//         };
//       }

//       case `[${resource}] Select`: {
//         return Object.assign({}, state, {
//           selectedId: action.payload
//         });
//       }

//       case `[${resource}] Create Success`: {
//         const resource = action.payload.resource;

//         return {
//           ids: [ ...state.ids, identifier(resource) ],
//           entities: Object.assign({}, state.entities, {
//             [identifier(resource)]: resource
//           }),
//           selectedId: state.selectedId,
//           loadedAt: state.loadedAt
//         }
//       }

//       case `[${resource}] Update Success`: {
//         const resource = action.payload.resource;

//         return {
//           ids: state.ids,
//           entities: Object.assign({}, state.entities, {
//             [identifier(resource)]: resource
//           }),
//           selectedId: state.selectedId,
//           loadedAt: state.loadedAt
//         }
//       }

//       case `[${resource}] Delete Success`: {
//         const resource = action.payload.resource;

//         const newIds = state.ids.filter(id => id !== identifier(resource));

//         const newEntities = newIds.reduce((entities: { [id: number]: any }, id: number) => {
//           let entity = state.entities[id];
//           return Object.assign(entities, {
//             [identifier(entity)]: entity
//           });
//         }, {});

//         const newLoadedAt = newIds.reduce((entities: { [id: number]: any }, id: number) => {
//           let loadedAt = state.loadedAt[id];
//           return Object.assign(entities, {
//             [id]: loadedAt
//           });
//         }, {});

//         return {
//           ids: [ ...newIds ],
//           entities: newEntities,
//           loadedAt: newLoadedAt,
//           selectedId: state.selectedId,
//         }
//       }

//       default: {
//         if(reducer) {
//           return reducer(state, action);
//         }
//         return state;
//       }
//     }
//   }
// };