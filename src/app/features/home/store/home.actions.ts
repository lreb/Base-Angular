import { createAction, props } from '@ngrx/store';

/**
 * Acciones del feature Home
 * Sigue el patrón [Source] Event
 */

// Ejemplo de acciones
export const loadHomeData = createAction(
  '[Home Page] Load Home Data'
);

export const loadHomeDataSuccess = createAction(
  '[Home API] Load Home Data Success',
  props<{ data: any }>()
);

export const loadHomeDataFailure = createAction(
  '[Home API] Load Home Data Failure',
  props<{ error: any }>()
);
