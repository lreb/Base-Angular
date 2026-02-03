import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ProductsComponent } from './products.component';
import * as ProductsActions from './store/products.actions';
import * as ProductsSelectors from './store/products.selectors';
import { Product } from './models';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let store: MockStore;
  let router: Router;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 10,
      category: 'Category A'
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      price: 200,
      stock: 20,
      category: 'Category B'
    }
  ];

  const initialState = {
    products: {
      entities: {},
      ids: [],
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: Router,
          useValue: {
            navigate: vi.fn()
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    store.overrideSelector(ProductsSelectors.selectAllProducts, mockProducts);
    store.overrideSelector(ProductsSelectors.selectProductsLoading, false);
    store.overrideSelector(ProductsSelectors.selectProductsError, null);
    store.overrideSelector(ProductsSelectors.selectCategories, ['Category A', 'Category B']);

    const fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadProducts on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(ProductsActions.loadProducts());
  });

  it('should select products from store', async () => {
    const products = await new Promise<Product[]>(resolve => {
      component.products$.subscribe(products => resolve(products));
    });
    expect(products).toEqual(mockProducts);
  });

  it('should select loading state from store', async () => {
    const loading = await new Promise<boolean>(resolve => {
      component.loading$.subscribe(loading => resolve(loading));
    });
    expect(loading).toBe(false);
  });

  it('should select categories from store', async () => {
    const categories = await new Promise<string[]>(resolve => {
      component.categories$.subscribe(categories => resolve(categories));
    });
    expect(categories).toEqual(['Category A', 'Category B']);
  });

  it('should navigate to new product form', () => {
    component.onCreateProduct();

    expect(router.navigate).toHaveBeenCalledWith(['/products/new']);
  });

  it('should navigate to edit product form', () => {
    const productId = '123';

    component.onEditProduct(productId);

    expect(router.navigate).toHaveBeenCalledWith(['/products/edit', productId]);
  });

  it('should navigate to product detail', () => {
    const productId = '123';

    component.onViewProduct(productId);

    expect(router.navigate).toHaveBeenCalledWith(['/products', productId]);
  });

  it('should dispatch deleteProduct action when confirmed', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.onDeleteProduct('1', 'Product 1');

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductsActions.deleteProduct({ id: '1' })
    );
  });

  it('should not dispatch deleteProduct action when cancelled', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.onDeleteProduct('1', 'Product 1');

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      ProductsActions.deleteProduct({ id: '1' })
    );
  });

  it('should filter products by category', () => {
    const filteredProducts = [mockProducts[0]];
    store.overrideSelector(
      ProductsSelectors.selectProductsByCategory('Category A'),
      filteredProducts
    );

    component.filterByCategory('Category A');

    expect(component.selectedCategory).toBe('Category A');
  });

  it('should show all products when category is null', () => {
    component.filterByCategory(null);

    expect(component.selectedCategory).toBeNull();
  });

  it('should track products by id', () => {
    const product = mockProducts[0];
    const trackId = component.trackByProductId(0, product);

    expect(trackId).toBe('1');
  });
});
