import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import * as ProductsActions from '../store/products.actions';
import * as ProductsSelectors from '../store/products.selectors';
import { Product } from '../models';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let store: MockStore;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    stock: 10,
    category: 'Test Category'
  };

  const initialState = {
    products: {
      entities: {},
      ids: [],
      loading: false,
      error: null,
      selectedProduct: null
    }
  };

  beforeEach(async () => {
    const activatedRouteStub = {
      paramMap: of({ get: () => null }),
      snapshot: { paramMap: { get: () => null } }
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: Router,
          useValue: {
            navigate: vi.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    store.overrideSelector(ProductsSelectors.selectProductsActionLoading, false);
    store.overrideSelector(ProductsSelectors.selectProductsError, null);
    store.overrideSelector(ProductsSelectors.selectSelectedProduct, null);

    const fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    component.ngOnInit();

    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('name')?.value).toBe('');
    expect(component.productForm.get('description')?.value).toBe('');
    expect(component.productForm.get('price')?.value).toBe(0);
    expect(component.productForm.get('stock')?.value).toBe(0);
    expect(component.productForm.get('category')?.value).toBe('');
  });

  it('should be in create mode by default', () => {
    component.ngOnInit();

    expect(component.isEditMode).toBe(false);
    expect(component.productId).toBeNull();
  });

  it('should validate required fields', () => {
    component.ngOnInit();

    const nameControl = component.productForm.get('name');
    const descriptionControl = component.productForm.get('description');

    nameControl?.setValue('');
    descriptionControl?.setValue('');

    expect(nameControl?.hasError('required')).toBe(true);
    expect(descriptionControl?.hasError('required')).toBe(true);
  });

  it('should validate name minlength', () => {
    component.ngOnInit();

    const nameControl = component.productForm.get('name');
    nameControl?.setValue('ab');

    expect(nameControl?.hasError('minlength')).toBe(true);
  });

  it('should validate price minimum value', () => {
    component.ngOnInit();

    const priceControl = component.productForm.get('price');
    priceControl?.setValue(0);

    expect(priceControl?.hasError('min')).toBe(true);
  });

  it('should validate stock minimum value', () => {
    component.ngOnInit();

    const stockControl = component.productForm.get('stock');
    stockControl?.setValue(-1);

    expect(stockControl?.hasError('min')).toBe(true);
  });

  it('should accept valid form values', () => {
    component.ngOnInit();

    component.productForm.patchValue({
      name: 'Valid Product Name',
      description: 'This is a valid description with enough characters',
      price: 99.99,
      stock: 50,
      category: 'Electronics'
    });

    expect(component.productForm.valid).toBe(true);
  });

  it('should dispatch createProduct action on submit for new product', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();

    const formValue = {
      name: 'New Product',
      description: 'New product description with enough text',
      price: 50,
      stock: 100,
      category: 'Category'
    };

    component.productForm.patchValue(formValue);
    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductsActions.createProduct({ product: formValue })
    );
  });

  it('should not submit invalid form', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();

    component.productForm.patchValue({
      name: 'ab', // Too short
      description: 'short', // Too short
      price: 0, // Below minimum
      stock: -1, // Below minimum
      category: ''
    });

    component.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should navigate back to products list on cancel', () => {
    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should detect invalid field', () => {
    component.ngOnInit();

    const nameControl = component.productForm.get('name');
    nameControl?.setValue('');
    nameControl?.markAsTouched();

    expect(component.isFieldInvalid('name')).toBe(true);
  });

  it('should return correct error message for required field', () => {
    component.ngOnInit();

    const nameControl = component.productForm.get('name');
    nameControl?.setValue('');
    nameControl?.markAsTouched();

    expect(component.getFieldError('name')).toBe('Este campo es requerido');
  });

  it('should return correct error message for minlength', () => {
    component.ngOnInit();

    const nameControl = component.productForm.get('name');
    nameControl?.setValue('ab');
    nameControl?.markAsTouched();

    expect(component.getFieldError('name')).toContain('Mínimo');
  });

  it('should return correct error message for min value', () => {
    component.ngOnInit();

    const priceControl = component.productForm.get('price');
    priceControl?.setValue(0);
    priceControl?.markAsTouched();

    expect(component.getFieldError('price')).toContain('El valor mínimo es');
  });

  it('should load product in edit mode', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    store.overrideSelector(ProductsSelectors.selectSelectedProduct, mockProduct);

    // Create new mock with mutable paramMap
    const mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => key === 'id' ? '1' : null
      } as any),
      snapshot: { paramMap: { get: () => null } }
    };
    Object.assign(activatedRoute, mockActivatedRoute);

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductsActions.loadProduct({ id: '1' })
    );
    expect(component.isEditMode).toBe(true);
    expect(component.productId).toBe('1');
  });

  it('should patch form values in edit mode', async () => {
    store.overrideSelector(ProductsSelectors.selectSelectedProduct, mockProduct);

    const mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => key === 'id' ? '1' : null
      } as any),
      snapshot: { paramMap: { get: () => null } }
    };
    Object.assign(activatedRoute, mockActivatedRoute);

    component.ngOnInit();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(component.productForm.get('name')?.value).toBe('Test Product');
    expect(component.productForm.get('price')?.value).toBe(100);
  });

  it('should dispatch updateProduct action in edit mode', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.ngOnInit();

    // Set component in edit mode
    component.isEditMode = true;
    component.productId = '1';

    const updatedProduct = {
      name: 'Updated Product',
      description: 'Updated description with enough characters',
      price: 150,
      stock: 20,
      category: 'Updated Category'
    };

    component.productForm.patchValue(updatedProduct);
    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductsActions.updateProduct({
        id: '1',
        product: {
          id: '1',
          ...updatedProduct
        }
      })
    );
  });
});
