import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';

/**
 * Guard funcional de ejemplo para proteger rutas
 * Verifica si el usuario está autenticado
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  // Verificar si existe un token o sesión
  const isAuthenticated = storageService.hasKey('authToken');

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  return true;
};

/**
 * Guard para verificar roles
 */
export const roleGuard: (allowedRoles: string[]) => CanActivateFn = 
  (allowedRoles: string[]) => {
    return (route, state) => {
      const router = inject(Router);
      const storageService = inject(StorageService);

      const user = storageService.getItem<{ role: string }>('user');

      if (!user || !allowedRoles.includes(user.role)) {
        router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    };
  };
