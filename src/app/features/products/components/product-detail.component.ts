import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ProductsActions from '../store/products.actions';
import * as ProductsSelectors from '../store/products.selectors';
import { Product } from '../models';
import { LoadingComponent } from '../../../shared/components/loading.component';
import { ErrorComponent } from '../../../shared/components/error.component';

/**
 * Product Detail Component
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, ErrorComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  // Injected services
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  product$: Observable<Product | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor() {
    this.product$ = this.store.select(ProductsSelectors.selectSelectedProduct);
    this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
    this.error$ = this.store.select(ProductsSelectors.selectProductsError);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ProductDetailComponent initialized with id:', id);
    if (id) {
      this.store.dispatch(ProductsActions.loadProduct({ id }));
    }
  }

  onEdit(id: string): void {
    this.router.navigate(['/products/edit', id]);
  }

  /**
   * Go back to the products list
   */
  onBack(): void {
    this.router.navigate(['/products']);
  }

  /**
   * Delete the product after confirmation
   * @param id The ID of the product to delete
   * @param name The name of the product to delete
   */
  onDelete(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete the product "${name}"?`)) {
      this.store.dispatch(ProductsActions.deleteProduct({ id }));
      this.router.navigate(['/products']);
    }
  }
}
