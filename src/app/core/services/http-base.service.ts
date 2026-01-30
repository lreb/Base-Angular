import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Servicio base HTTP con funcionalidades comunes
 * Extender este servicio para crear servicios específicos
 */
@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {
  protected apiUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  /**
   * GET request
   */
  protected get<T>(
    endpoint: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, {
      params,
      headers
    }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * POST request
   */
  protected post<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, {
      headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * PUT request
   */
  protected put<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, {
      headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * DELETE request
   */
  protected delete<T>(
    endpoint: string,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, {
      headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: any): Observable<never> {
    console.error('Error en petición HTTP:', error);
    
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
