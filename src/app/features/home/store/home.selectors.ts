import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HomeState } from './home.reducer';

/**
 * Selectores del feature Home
 */

// Selector del feature
export const selectHomeState = createFeatureSelector<HomeState>('home');

// Selectores derivados
export const selectHomeData = createSelector(
  selectHomeState,
  (state: HomeState) => state.data
);

export const selectHomeLoading = createSelector(
  selectHomeState,
  (state: HomeState) => state.loading
);

export const selectHomeError = createSelector(
  selectHomeState,
  (state: HomeState) => state.error
);
