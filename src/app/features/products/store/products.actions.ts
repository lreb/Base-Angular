import { createAction, props } from '@ngrx/store';
import { Product, CreateProductCommand, UpdateProductCommand } from '../models';

/**
 * Acciones para cargar productos
 */
export const loadProducts = createAction('[Products Page] Load Products');

export const loadProductsSuccess = createAction(
  '[Products API] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Products API] Load Products Failure',
  props<{ error: any }>()
);

/**
 * Actions to load a single product
 */
export const loadProduct = createAction(
  '[Product Detail Page] Load Product',
  props<{ id: string }>()
);

export const loadProductSuccess = createAction(
  '[Products API] Load Product Success',
  props<{ product: Product }>()
);

export const loadProductFailure = createAction(
  '[Products API] Load Product Failure',
  props<{ error: any }>()
);

/**
 * Actions to create a product
 */
export const createProduct = createAction(
  '[Product Form] Create Product',
  props<{ product: CreateProductCommand }>()
);

export const createProductSuccess = createAction(
  '[Products API] Create Product Success',
  props<{ product: Product }>()
);

export const createProductFailure = createAction(
  '[Products API] Create Product Failure',
  props<{ error: any }>()
);

/**
 * Actions to update a product
 */
export const updateProduct = createAction(
  '[Product Form] Update Product',
  props<{ id: string; product: UpdateProductCommand }>()
);

export const updateProductSuccess = createAction(
  '[Products API] Update Product Success',
  props<{ product: Product }>()
);

export const updateProductFailure = createAction(
  '[Products API] Update Product Failure',
  props<{ error: any }>()
);

/**
 * Actions to delete a product
 */
export const deleteProduct = createAction(
  '[Product List] Delete Product',
  props<{ id: string }>()
);

export const deleteProductSuccess = createAction(
  '[Products API] Delete Product Success',
  props<{ id: string }>()
);

export const deleteProductFailure = createAction(
  '[Products API] Delete Product Failure',
  props<{ error: any }>()
);

/**
 * Action to clear the selected product
 */
export const clearSelectedProduct = createAction(
  '[Product Detail] Clear Selected Product'
);
