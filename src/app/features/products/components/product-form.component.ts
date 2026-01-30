import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ProductsActions from '../store/products.actions';
import * as ProductsSelectors from '../store/products.selectors';
import { Product } from '../models';

/**
 * Componente para crear o editar un producto
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor() {
    this.loading$ = this.store.select(ProductsSelectors.selectProductsActionLoading);
    this.error$ = this.store.select(ProductsSelectors.selectProductsError);
  }

  ngOnInit(): void {
    this.initForm();
    
    // Verificar si estamos en modo edición
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      this.isEditMode = !!this.productId;

      if (this.isEditMode && this.productId) {
        this.loadProduct(this.productId);
      }
    });
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  private loadProduct(id: string): void {
    this.store.dispatch(ProductsActions.loadProduct({ id }));
    
    this.store.select(ProductsSelectors.selectSelectedProduct).subscribe(product => {
      if (product) {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category
        });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    const formValue = this.productForm.value;

    if (this.isEditMode && this.productId) {
      // Actualizar producto existente
      this.store.dispatch(ProductsActions.updateProduct({
        id: this.productId,
        product: {
          id: this.productId,
          ...formValue
        }
      }));
    } else {
      // Crear nuevo producto
      this.store.dispatch(ProductsActions.createProduct({
        product: formValue
      }));
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  // Helpers para validación
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['maxlength']) {
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    if (field.errors['min']) {
      return `El valor mínimo es ${field.errors['min'].min}`;
    }

    return 'Campo inválido';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
