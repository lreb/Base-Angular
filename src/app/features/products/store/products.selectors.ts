import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

/**
 * Selectores del feature Products
 */

// Selector del feature
export const selectProductsState = createFeatureSelector<ProductsState>('products');

// Selectores de productos
export const selectAllProducts = createSelector(
  selectProductsState,
  (state: ProductsState) => state.products
);

export const selectSelectedProduct = createSelector(
  selectProductsState,
  (state: ProductsState) => state.selectedProduct
);

export const selectProductById = (id: string) => createSelector(
  selectAllProducts,
  (products) => products.find(p => p.id === id)
);

// Selectores de estado
export const selectProductsLoading = createSelector(
  selectProductsState,
  (state: ProductsState) => state.loading
);

export const selectProductsActionLoading = createSelector(
  selectProductsState,
  (state: ProductsState) => state.actionLoading
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state: ProductsState) => state.error
);

// Selectores derivados
export const selectProductsCount = createSelector(
  selectAllProducts,
  (products) => products.length
);

export const selectProductsByCategory = (category: string) => createSelector(
  selectAllProducts,
  (products) => products.filter(p => p.category === category)
);

export const selectCategories = createSelector(
  selectAllProducts,
  (products) => {
    const categories = products.map(p => p.category);
    return [...new Set(categories)].sort();
  }
);
