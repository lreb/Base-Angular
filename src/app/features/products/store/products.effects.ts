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
   * Effect to load all products
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
   * Effect to load a single product
   */
  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProduct),
      switchMap(({ id }) =>
        this.productsService.getProductById(id).pipe(
          tap(product => console.log('Fetched product:', product)),
          tap(() => console.log('Loaded product with id:', id)),
          map(product => ProductsActions.loadProductSuccess({ product })),
          catchError(error => of(ProductsActions.loadProductFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect to create a product
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
   * Effect to redirect after creating
   */
  createProductSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.createProductSuccess),
      tap(() => this.router.navigate(['/products']))
    ),
    { dispatch: false }
  );

  /**
   * Effect to update a product
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
   * Effect to redirect after updating
   */
  updateProductSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updateProductSuccess),
      tap(() => this.router.navigate(['/products']))
    ),
    { dispatch: false }
  );

  /**
   * Effect to delete a product
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
