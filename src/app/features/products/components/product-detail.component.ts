import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ProductsActions from '../store/products.actions';
import * as ProductsSelectors from '../store/products.selectors';
import { Product } from '../models';

/**
 * Componente para ver detalles de un producto (solo lectura)
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
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
    if (id) {
      this.store.dispatch(ProductsActions.loadProduct({ id }));
    }
  }

  onEdit(id: string): void {
    this.router.navigate(['/products/edit', id]);
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }

  onDelete(id: string, name: string): void {
    if (confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) {
      this.store.dispatch(ProductsActions.deleteProduct({ id }));
      this.router.navigate(['/products']);
    }
  }
}
