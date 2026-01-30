/**
 * Barrel file para exportar todos los modelos
 * Facilita las importaciones: import { User, Product } from '@core/models';
 */

// Ejemplo de modelo básico
export interface BaseEntity {
  id: string | number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Agregar aquí las exportaciones de otros modelos
// export * from './user.model';
// export * from './product.model';
