import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de botón reutilizable de ejemplo
 * Uso: <app-button [text]="'Click Me'" [disabled]="false" (click)="handleClick()"></app-button>
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="'btn btn-' + type"
      [disabled]="disabled || loading"
      (click)="handleClick()">
      <span *ngIf="loading" class="spinner"></span>
      <span [class.loading]="loading">{{ text }}</span>
    </button>
  `,
  styles: [`
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1565c0;
    }

    .btn-secondary {
      background-color: #757575;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #616161;
    }

    .btn-danger {
      background-color: #d32f2f;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c62828;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading {
      opacity: 0.7;
    }
  `]
})
export class ButtonComponent {
  @Input() text = 'Button';
  @Input() type: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<void>();

  handleClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
