import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Módulo compartido que contiene componentes, directivas y pipes
 * reutilizables en toda la aplicación
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    // Agregar aquí componentes, directivas y pipes compartidos
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
    // Exportar componentes, directivas y pipes compartidos
  ]
})
export class SharedModule { }
