import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Product, CreateProductCommand, UpdateProductCommand } from '../models';

/**
 * Servicio para gestión de productos
 */
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl = `${environment.apiUrl}/Products`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los productos
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // If the API returns an object with a products array property, extract it
        // Otherwise, assume the response is already an array
        if (response && Array.isArray(response)) {
          return response;
        } else if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        } else if (response && response.items && Array.isArray(response.items)) {
          return response.items;
        } else {
          console.error('Unexpected API response format:', response);
          return [];
        }
      })
    );
  }

  /**
   * Obtener un producto por ID
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo producto
   */
  createProduct(product: CreateProductCommand): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Actualizar un producto existente
   */
  updateProduct(id: string, product: UpdateProductCommand): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Eliminar un producto
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
