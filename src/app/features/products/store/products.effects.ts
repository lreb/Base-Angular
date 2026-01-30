import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as ProductsActions from './products.actions';
import { ProductsService } from '../services/products.service';

/**
 * Effects del feature Products
 */
@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productsService = inject(ProductsService);
  private router = inject(Router);

  /**
   * Effect para cargar todos los productos
   */
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(() =>
        this.productsService.getProducts().pipe(
          map(products => ProductsActions.loadProductsSuccess({ products })),
          catchError(error => of(ProductsActions.loadProductsFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect para cargar un producto específico
   */
  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProduct),
      switchMap(({ id }) =>
        this.productsService.getProductById(id).pipe(
          map(product => ProductsActions.loadProductSuccess({ product })),
          catchError(error => of(ProductsActions.loadProductFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect para crear un producto
   */
  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.createProduct),
      switchMap(({ product }) =>
        this.productsService.createProduct(product).pipe(
          map(product => ProductsActions.createProductSuccess({ product })),
          catchError(error => of(ProductsActions.createProductFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect para redirigir después de crear
   */
  createProductSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.createProductSuccess),
      tap(() => this.router.navigate(['/products']))
    ),
    { dispatch: false }
  );

  /**
   * Effect para actualizar un producto
   */
  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updateProduct),
      switchMap(({ id, product }) =>
        this.productsService.updateProduct(id, product).pipe(
          map(product => ProductsActions.updateProductSuccess({ product })),
          catchError(error => of(ProductsActions.updateProductFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect para redirigir después de actualizar
   */
  updateProductSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updateProductSuccess),
      tap(() => this.router.navigate(['/products']))
    ),
    { dispatch: false }
  );

  /**
   * Effect para eliminar un producto
   */
  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.deleteProduct),
      switchMap(({ id }) =>
        this.productsService.deleteProduct(id).pipe(
          map(() => ProductsActions.deleteProductSuccess({ id })),
          catchError(error => of(ProductsActions.deleteProductFailure({ error })))
        )
      )
    )
  );
}
