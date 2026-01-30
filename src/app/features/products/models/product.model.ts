/**
 * Modelo de Producto basado en la API
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

/**
 * Comando para crear un producto
 */
export interface CreateProductCommand {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

/**
 * Comando para actualizar un producto
 */
export interface UpdateProductCommand {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

/**
 * Response de error de la API
 */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}
