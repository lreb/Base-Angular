import { Injectable } from '@angular/core';

/**
 * Servicio para manejo de almacenamiento local
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Guardar un valor en localStorage
   */
  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  /**
   * Obtener un valor de localStorage
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return null;
    }
  }

  /**
   * Eliminar un item de localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
    }
  }

  /**
   * Limpiar todo el localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }

  /**
   * Verificar si existe una key
   */
  hasKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Obtener todas las keys
   */
  getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  // SessionStorage methods
  
  /**
   * Guardar en sessionStorage
   */
  setSessionItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error al guardar en sessionStorage:', error);
    }
  }

  /**
   * Obtener de sessionStorage
   */
  getSessionItem<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error al leer de sessionStorage:', error);
      return null;
    }
  }

  /**
   * Eliminar de sessionStorage
   */
  removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error al eliminar de sessionStorage:', error);
    }
  }

  /**
   * Limpiar sessionStorage
   */
  clearSession(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error al limpiar sessionStorage:', error);
    }
  }
}
