import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'products/new',
    loadComponent: () => import('./features/products/components/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./features/products/components/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/components/product-detail.component').then(m => m.ProductDetailComponent)
  }
  // Agregar aquí más rutas de features
  // Ejemplo de lazy loading:
  // {
  //   path: 'users',
  //   loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
  // }
];
