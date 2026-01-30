import { createReducer, on } from '@ngrx/store';
import { Product } from '../models';
import * as ProductsActions from './products.actions';

/**
 * Estado del feature Products
 */
export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: any | null;
  actionLoading: boolean; // Para create, update, delete
}

/**
 * Estado inicial
 */
export const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  actionLoading: false
};

/**
 * Reducer del feature Products
 */
export const productsReducer = createReducer(
  initialState,

  // Load Products
  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductsActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
    error: null
  })),

  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Product
  on(ProductsActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductsActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    loading: false,
    error: null
  })),

  on(ProductsActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Product
  on(ProductsActions.createProduct, (state) => ({
    ...state,
    actionLoading: true,
    error: null
  })),

  on(ProductsActions.createProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    actionLoading: false,
    error: null
  })),

  on(ProductsActions.createProductFailure, (state, { error }) => ({
    ...state,
    actionLoading: false,
    error
  })),

  // Update Product
  on(ProductsActions.updateProduct, (state) => ({
    ...state,
    actionLoading: true,
    error: null
  })),

  on(ProductsActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map(p => p.id === product.id ? product : p),
    selectedProduct: product,
    actionLoading: false,
    error: null
  })),

  on(ProductsActions.updateProductFailure, (state, { error }) => ({
    ...state,
    actionLoading: false,
    error
  })),

  // Delete Product
  on(ProductsActions.deleteProduct, (state) => ({
    ...state,
    actionLoading: true,
    error: null
  })),

  on(ProductsActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter(p => p.id !== id),
    selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
    actionLoading: false,
    error: null
  })),

  on(ProductsActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    actionLoading: false,
    error
  })),

  // Clear Selected Product
  on(ProductsActions.clearSelectedProduct, (state) => ({
    ...state,
    selectedProduct: null
  }))
);
