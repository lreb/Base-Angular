import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Interceptor funcional para agregar el token de autenticación
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener token del localStorage
  const token = localStorage.getItem('authToken');

  // Clonar la request y agregar el header si existe el token
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

/**
 * Interceptor para manejo de errores HTTP
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del servidor
        errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;

        // Manejar errores específicos
        switch (error.status) {
          case 401:
            // No autorizado - redirigir al login
            router.navigate(['/login']);
            break;
          case 403:
            // Prohibido
            router.navigate(['/forbidden']);
            break;
          case 404:
            // No encontrado
            console.error('Recurso no encontrado');
            break;
          case 500:
            // Error del servidor
            console.error('Error interno del servidor');
            break;
        }
      }

      console.error('Error HTTP:', errorMessage);
      return throwError(() => error);
    })
  );
};

/**
 * Interceptor para logging de peticiones
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  
  console.log(`Request: ${req.method} ${req.url}`);

  return next(req).pipe(
    catchError((error) => {
      const elapsedTime = Date.now() - startTime;
      console.error(`Request failed: ${req.method} ${req.url} - ${elapsedTime}ms`, error);
      return throwError(() => error);
    })
  );
};
