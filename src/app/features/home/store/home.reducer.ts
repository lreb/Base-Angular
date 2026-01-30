import { createReducer, on } from '@ngrx/store';
import * as HomeActions from './home.actions';

/**
 * Estado del feature Home
 */
export interface HomeState {
  data: any | null;
  loading: boolean;
  error: any | null;
}

/**
 * Estado inicial
 */
export const initialState: HomeState = {
  data: null,
  loading: false,
  error: null
};

/**
 * Reducer del feature Home
 */
export const homeReducer = createReducer(
  initialState,
  
  on(HomeActions.loadHomeData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(HomeActions.loadHomeDataSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
    error: null
  })),
  
  on(HomeActions.loadHomeDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
