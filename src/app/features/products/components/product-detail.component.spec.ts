import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ProductDetailComponent } from './product-detail.component';
import * as ProductsActions from '../store/products.actions';
import * as ProductsSelectors from '../store/products.selectors';
import { Product } from '../models';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let store: MockStore;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockProduct: Product = {
    id: '123',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 50,
    category: 'Electronics'
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
      snapshot: {
        paramMap: {
          get: (key: string) => key === 'id' ? '123' : null
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
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

    store.overrideSelector(ProductsSelectors.selectSelectedProduct, mockProduct);
    store.overrideSelector(ProductsSelectors.selectProductsLoading, false);
    store.overrideSelector(ProductsSelectors.selectProductsError, null);

    const fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadProduct action on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductsActions.loadProduct({ id: '123' })
    );
  });

  it('should not dispatch loadProduct if no id in route', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    activatedRoute.snapshot.paramMap.get = () => null;

    component.ngOnInit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should select product from store', async () => {
    const product = await new Promise<Product | null>(resolve => {
      component.product$.subscribe(product => resolve(product));
    });
    expect(product).toEqual(mockProduct);
  });

  it('should select loading state from store', async () => {
    const loading = await new Promise<boolean>(resolve => {
      component.loading$.subscribe(loading => resolve(loading));
    });
    expect(loading).toBe(false);
  });

  it('should select error state from store', async () => {
    const error = await new Promise<any>(resolve => {
      component.error$.subscribe(error => resolve(error));
    });
    expect(error).toBeNull();
  });

  it('should navigate to edit page', () => {
    component.onEdit('123');

    expect(router.navigate).toHaveBeenCalledWith(['/products/edit', '123']);
  });

  it('should navigate back to products list', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should dispatch deleteProduct and navigate back when confirmed', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.onDelete('123', 'Test Product');

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductsActions.deleteProduct({ id: '123' })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should not delete product when cancelled', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.onDelete('123', 'Test Product');

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      ProductsActions.deleteProduct({ id: '123' })
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should show confirmation dialog with product name', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.onDelete('123', 'Test Product');

    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete the product "Test Product"?'
    );
  });

  it('should handle null product gracefully', async () => {
    store.overrideSelector(ProductsSelectors.selectSelectedProduct, null);
    store.refreshState();

    const product = await new Promise<Product | null>(resolve => {
      component.product$.subscribe(product => resolve(product));
    });
    expect(product).toBeNull();
  });

  it('should handle loading state', async () => {
    store.overrideSelector(ProductsSelectors.selectProductsLoading, true);
    store.refreshState();

    const loading = await new Promise<boolean>(resolve => {
      component.loading$.subscribe(loading => resolve(loading));
    });
    expect(loading).toBe(true);
  });

  it('should handle error state', async () => {
    const error = { message: 'Product not found' };
    store.overrideSelector(ProductsSelectors.selectProductsError, error);
    store.refreshState();

    const err = await new Promise<any>(resolve => {
      component.error$.subscribe(err => resolve(err));
    });
    expect(err).toEqual(error);
  });
});
