import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as HomeActions from './home.actions';

/**
 * Effects del feature Home
 * Maneja los side effects como llamadas HTTP
 */
@Injectable()
export class HomeEffects {
  private actions$ = inject(Actions);

  // Ejemplo de effect
  loadHomeData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomeActions.loadHomeData),
      switchMap(() =>
        // Aquí iría la llamada al servicio
        of({ message: 'Datos de ejemplo' }).pipe(
          map(data => HomeActions.loadHomeDataSuccess({ data })),
          catchError(error => of(HomeActions.loadHomeDataFailure({ error })))
        )
      )
    )
  );
}
