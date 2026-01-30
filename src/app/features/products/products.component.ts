import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ProductsActions from './store/products.actions';
import * as ProductsSelectors from './store/products.selectors';
import { Product } from './models';

/**
 * Componente principal del feature Products
 * Lista todos los productos
 */
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  categories$: Observable<string[]>;

  selectedCategory: string | null = null;

  constructor() {
    this.products$ = this.store.select(ProductsSelectors.selectAllProducts);
    this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
    this.error$ = this.store.select(ProductsSelectors.selectProductsError);
    this.categories$ = this.store.select(ProductsSelectors.selectCategories);
  }

  ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadProducts());
  }

  onCreateProduct(): void {
    this.router.navigate(['/products/new']);
  }

  onEditProduct(id: string): void {
    this.router.navigate(['/products/edit', id]);
  }

  onDeleteProduct(id: string, name: string): void {
    if (confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) {
      this.store.dispatch(ProductsActions.deleteProduct({ id }));
    }
  }

  onViewProduct(id: string): void {
    this.router.navigate(['/products', id]);
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    
    if (category) {
      this.products$ = this.store.select(ProductsSelectors.selectProductsByCategory(category));
    } else {
      this.products$ = this.store.select(ProductsSelectors.selectAllProducts);
    }
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
